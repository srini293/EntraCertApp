//require("dotenv").config();
//const express = require("express");
const https = require("https");
const querystring = require("querystring");
//const session = require("express-session");
//const msal = require("@azure/msal-node");
//const pages = require("./pages");
const crypto = require("crypto"); 

//const fs = require("fs");
const { SignJWT, importPKCS8 } = require("jose");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");


//const app = express();
//const PORT = process.env.PORT || 3001;

function generatePkceCodes() {
    const verifier = crypto.randomBytes(32).toString("base64url");

    const challenge = crypto
        .createHash("sha256")
        .update(verifier)
        .digest("base64url");

    return {
        verifier,
        challenge
    };
}
 

/* ================= CONFIG ================= */

 
const CLIENT_ID = process.env.CLIENT_ID;
//const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TENANT_ID = process.env.TENANT_ID;
const TENANT_NAME = process.env.TENANT_NAME;
const USE_CIAM = process.env.USE_CIAM === "true";
const REDIRECT_URI = `https://mducertapp.netlify.app/auth/redirect`;

//const privateKeyPem = fs.readFileSync("./private.key", "utf8"); // PEM private key
const tokenEndpoint = `https://mduext.ciamlogin.com/aae3822e-f98c-4aad-a474-2257bb4b840f/oauth2/v2.0/token`;
//const cer = fs.readFileSync("cert.pem", "utf8"); // PEM certificate for thumbprint calculation

const privateKeyPem = process.env.PRIVATE_KEY;
const cer = process.env.CERT;
// EM certificate for thumbprint calculation

const der = Buffer.from(
  cer.toString()
    .replace(/-----BEGIN CERTIFICATE-----/, "")
    .replace(/-----END CERTIFICATE-----/, "")
    .replace(/\s+/g, ""),
  "base64"
);


const thumbprint = crypto
  .createHash("sha256")
  .update(der)
  .digest("base64url");

 console.log("thumbprint value:" + thumbprint);
/*const options = {
    algorithm: "PS256",
    header: {
        kid: `14d1b6b7-dcb4-4b2e-bd06-45e244ca5b01`
    }
};
*/

const needsSetup = !CLIENT_ID || CLIENT_ID === "REPLACE_WITH_YOUR_CLIENT_ID";

const AUTHORITY = USE_CIAM
    ? `https://${TENANT_NAME}.ciamlogin.com/${TENANT_ID}`
    : `https://login.microsoftonline.com/${TENANT_ID}`;


console.log("Authority URL:", AUTHORITY);
console.log("Needs setup:", needsSetup);

 

/* ================= MSAL ================= */

 

if (!needsSetup) {
    const msalConfig = {
        auth: {
            clientId: CLIENT_ID,
            authority: AUTHORITY,
            //clientSecret: CLIENT_SECRET,
            knownAuthorities: USE_CIAM ? [`${TENANT_NAME}.ciamlogin.com`] : [],
            validateAuthority: false, // Disable for CIAM
        },
    };

console.log("reached near client assertion generation");
async function generateClientAssertion(tokenEndpoint) {
  const privateKey = await importPKCS8(privateKeyPem, "PS256");
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({})
    .setProtectedHeader({ alg: "PS256", typ: "JWT", "x5t#S256": thumbprint })
    .setIssuer(CLIENT_ID)
    .setSubject(CLIENT_ID)
    .setAudience(tokenEndpoint)
    .setJti(uuidv4())
    .setIssuedAt(now)
    .setNotBefore(now)
    .setExpirationTime(now + 600)
    .sign(privateKey);
}
 }
// ================= Helpers =================
function buildManualAuthUrl(params) {
  const baseUrl = USE_CIAM
    ? `https://${TENANT_NAME}.ciamlogin.com/${TENANT_ID}/oauth2/v2.0/authorize`
    : `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`;

  const queryParams = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    response_type: "code",
    scope: params.scopes.join(" "),
    response_mode: "query",
    code_challenge: params.codeChallenge,
    code_challenge_method: "S256",
    prompt: params.prompt || "select_account",
  });

  if (params.loginHint) queryParams.set("login_hint", params.loginHint);
  if (params.claims) queryParams.set("claims", params.claims);

  return `${baseUrl}?${queryParams.toString()}`;
}

async function exchangeCodeForToken(code, codeVerifier) {
  return new Promise(async (resolve, reject) => {
    const tokenHost = USE_CIAM ? `${TENANT_NAME}.ciamlogin.com` : `login.microsoftonline.com`;
    const tokenPath = `/${TENANT_ID}/oauth2/v2.0/token`;
    const tokenEndpoint = `https://${tokenHost}${tokenPath}`;

    const jwtassertion = await generateClientAssertion(tokenEndpoint);

    const body = querystring.stringify({
      client_id: CLIENT_ID,
      client_assertion: jwtassertion,
      client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
    });

    const options = {
      hostname: tokenHost,
      path: tokenPath,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(response.error_description || response.error));
          } else {
            resolve(response);
          }
        } catch (e) {
          reject(new Error(`Failed to parse token response: ${e.message}`));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function getCookie(name, cookieHeader) {
  const match = cookieHeader?.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

// ================= Netlify Handler =================
exports.handler = async (event, context) => {
  const path = event.path;

  // LOGIN
  if (path.endsWith("/login")) {
    const { verifier, challenge } = generatePkceCodes();
    const authUrl = buildManualAuthUrl({
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email", "User.ReadWrite", "GroupMember.Read.All"],
      codeChallenge: challenge,
      prompt: "select_account",
    });
    return {
      statusCode: 302,
      headers: {
        Location: authUrl,
        "Set-Cookie": `pkce_verifier=${verifier}; Path=/; HttpOnly; Secure`,
      },
    };
  }

  // SIGNUP
  if (path.endsWith("/signup")) {
    const { verifier, challenge } = generatePkceCodes();
    const authUrl = buildManualAuthUrl({
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email", "User.ReadWrite", "GroupMember.Read.All"],
      codeChallenge: challenge,
      prompt: "create",
    });
    return {
      statusCode: 302,
      headers: {
        Location: authUrl,
        "Set-Cookie": `pkce_verifier=${verifier}; Path=/; HttpOnly; Secure`,
      },
    };
  }

  // AUTH REDIRECT
  if (path.endsWith("/auth/redirect")) {
    const code = event.queryStringParameters.code;
    const verifier = getCookie("pkce_verifier", event.headers.cookie);
    try {
      const tokens = await exchangeCodeForToken(code, verifier);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, tokens }),
      };
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: err.message }),
      };
    }
  }

  // CRITICAL REPORT AUTH (MFA)
  if (path.endsWith("/critical-report-auth")) {
    const { verifier, challenge } = generatePkceCodes();
    const authUrl = buildManualAuthUrl({
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email", "User.ReadWrite", "GroupMember.Read.All"],
      codeChallenge: challenge,
      prompt: "login",
      claims: JSON.stringify({
        id_token: { acrs: { essential: true, values: ["c2"] } }
      }),
    });
    return {
      statusCode: 302,
      headers: {
        Location: authUrl,
        "Set-Cookie": `pkce_verifier=${verifier}; Path=/; HttpOnly; Secure`,
      },
    };
  }

  // LOGOUT
  if (path.endsWith("/logout")) {
    return {
      statusCode: 302,
      headers: { Location: "https://mducertapp.netlify.app" },
    };
  }

  // PLACEHOLDER ROUTES
  if (path.endsWith("/profile")) {
    return { statusCode: 200, body: JSON.stringify({ message: "Profile placeholder" }) };
  }
  if (path.endsWith("/graph-call")) {
    return { statusCode: 200, body: JSON.stringify({ message: "Graph API call placeholder" }) };
  }
  if (path.endsWith("/graph-refresh")) {
    return { statusCode: 200, body: JSON.stringify({ message: "Graph refresh placeholder" }) };
  }
  if (path.endsWith("/graph-edit")) {
    return { statusCode: 200, body: JSON.stringify({ message: "Graph edit placeholder" }) };
  }
  if (path.endsWith("/graph-groups")) {
    return { statusCode: 200, body: JSON.stringify({ message: "Graph groups placeholder" }) };
  }

  // DEFAULT
  return { statusCode: 404, body: JSON.stringify({ error: "Route not found" }) };
  };