require("dotenv").config();
const express = require("express");
const https = require("https");
const querystring = require("querystring");
const session = require("express-session");
const msal = require("@azure/msal-node");
const pages = require("./pages");
const crypto = require("crypto"); 

const fs = require("fs");
const { SignJWT, importPKCS8 } = require("jose");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
 

const app = express();
const PORT = process.env.PORT || 3001;

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

const privateKeyPem = fs.readFileSync("./private.key", "utf8"); // PEM private key
const tokenEndpoint = `https://mduext.ciamlogin.com/aae3822e-f98c-4aad-a474-2257bb4b840f/oauth2/v2.0/token`;
const cer = fs.readFileSync("cert.pem", "utf8"); // PEM certificate for thumbprint calculation
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

 

//let cca = null;
//let cryptoProvider = null;

 

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
async function generateClientAssertion(tokenHost) {
    const privateKey = await importPKCS8(privateKeyPem, "PS256");
    const now = Math.floor(Date.now() / 1000);

    return await new SignJWT({})
        .setProtectedHeader({
            alg: "PS256",
            typ: "JWT",
            "x5t#S256": thumbprint
        })
        .setIssuer(CLIENT_ID)
        .setSubject(CLIENT_ID)
        .setAudience(tokenEndpoint)
        .setJti(uuidv4())
        .setIssuedAt(now)
        .setNotBefore(now)
        .setExpirationTime(now + 600)
        .sign(privateKey);
}

/*
const payload = {
    iss: CLIENT_ID,
    sub: CLIENT_ID,
    aud: tokenEndpoint,
    jti: uuidv4(),
    iat: now,
    nbf: now,
    exp: now + 600, // 10 minutes
};
const assertion = jwt.sign(payload, privateKeyPem, options);
console.log("New Client Assertion JWT:\n", assertion);
*/
// Example usage

    // For CIAM, explicitly set system endpoints
    if (USE_CIAM) {
        msalConfig.system = {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    if (!containsPii) console.log(`[MSAL] ${message}`);
                },
                piiLoggingEnabled: false,
                logLevel: "Info",
            },
        };
    }

 

   // cca = new msal.ConfidentialClientApplication(msalConfig);
  //  cryptoProvider = new msal.CryptoProvider();

 

/* ================= MIDDLEWARE ================= */
app.use(session({
    secret: "ms-identity-demo-secret-2025",
    resave: false,
    saveUninitialized: false,
}));

 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

 

/* ================= SCOPES ================= */

 

const BASE_SCOPES = ["openid", "profile", "email"];
const GRAPH_SCOPES = ["User.ReadWrite", "GroupMember.Read.All"];
const ALL_SCOPES = [...BASE_SCOPES, ...GRAPH_SCOPES];

 

/* ================= HELPER: Manual Token Exchange for CIAM ================= */

 

async function exchangeCodeForToken(code, codeVerifier) {
    return new Promise(async (resolve, reject) => {
        const tokenHost = USE_CIAM
            ? `${TENANT_NAME}.ciamlogin.com`
            : `login.microsoftonline.com`;
        const tokenPath = USE_CIAM
            ? `/${TENANT_ID}/oauth2/v2.0/token`
            : `/${TENANT_ID}/oauth2/v2.0/token`;

const jwtassertion = await generateClientAssertion(tokenHost);

        const body = querystring.stringify({
            client_id: CLIENT_ID,
            client_assertion: jwtassertion,
            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            code: code,
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
            rejectUnauthorized: false, // Disable SSL cert verification for development
        };

 

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    if (res.statusCode >= 400) {
                        reject(new Error(`Token exchange failed: ${response.error_description || response.error}`));
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

 

function decodeJwt(token) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error("Invalid JWT format");

    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
}

 

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

    if (params.loginHint) {
        queryParams.set("login_hint", params.loginHint);
    }

    if (params.claims) {
        queryParams.set("claims", params.claims);
    }

    return `${baseUrl}?${queryParams.toString()}`;
}

 

/* ================= ROUTES ================= */

 

// Landing page
app.get("/", (req, res) => {
    res.send(pages.renderLanding(req.session.account, needsSetup));
});

 

// ---- Auth-required pages ----
app.get("/profile", (req, res) => {
    res.send(pages.renderProfile(req.session.account, req.session.claims));
});

 

app.get("/tokens", (req, res) => {
    res.send(pages.renderTokens(req.session.account, req.session.claims, req.session.accessToken));
});

 

app.get("/graph-explorer", (req, res) => {
    res.send(pages.renderGraphExplorer(
        req.session.account, req.session.graphResult,
        req.session.graphProfile, req.session.graphGroups,
        req.session.editSuccess, req.session.editError
    ));
    // Clear flash messages after showing
    delete req.session.editSuccess;
    delete req.session.editError;
});

 

// ---- NEW: Authorization page ----
app.get("/authorization", (req, res) => {
    res.send(pages.renderAuthorization(req.session.account, req.session.claims));
});

 

// ---- NEW: Step-Up Auth page ----
app.get("/step-up-auth", (req, res) => {
    res.send(pages.renderStepUpAuth(req.session.account, req.session.claims, req.session.stepUpResult));
    delete req.session.stepUpResult;
});

 

// ---- NEW: Critical Report (MFA-gated) ----
app.get("/critical-report", (req, res) => {
    res.send(pages.renderCriticalReport(req.session.account, req.session.claims));
});

 

// ---- Informational pages ----
app.get("/auth-flows", (req, res) => {
    res.send(pages.renderAuthFlows(req.session.account));
});

 

app.get("/permissions", (req, res) => {
    res.send(pages.renderPermissions(req.session.account));
});

 

app.get("/conditional-access", (req, res) => {
    res.send(pages.renderConditionalAccess(req.session.account));
});

 

app.get("/app-registrations", (req, res) => {
    res.send(pages.renderAppRegistrations(req.session.account));
});

 

app.get("/security", (req, res) => {
    res.send(pages.renderSecurity(req.session.account));
});

 

// ---- Graph API calls ----
app.get("/graph-call", async (req, res) => {
    if (!req.session.account || !req.session.accessToken) {
        req.session.graphResult = { _error: "Not signed in or no access token available" };
        return res.redirect("/graph-explorer");
    }

 

    const endpoint = req.query.endpoint || "me";
    const graphUrl = `https://graph.microsoft.com/v1.0/${endpoint}`;

 

    try {
        const response = await fetch(graphUrl, {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
        });
        if (response.ok) {
            req.session.graphResult = await response.json();
        } else {
            const errText = await response.text();
            req.session.graphResult = { _error: `Graph API returned ${response.status}`, details: errText };
        }
    } catch (err) {
        req.session.graphResult = { _error: err.message };
    }
    res.redirect("/graph-explorer");
});

 

// ---- NEW: Graph Profile Refresh ----
app.get("/graph-refresh", async (req, res) => {
    if (!req.session.account || !req.session.accessToken) {
        return res.redirect("/graph-explorer");
    }
    try {
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
        });
        if (response.ok) {
            req.session.graphProfile = await response.json();
        } else {
            req.session.editError = `Failed to load profile: ${response.status}`;
        }
    } catch (err) {
        req.session.editError = `Error loading profile: ${err.message}`;
    }
    res.redirect("/graph-explorer");
});

 

// ---- NEW: Graph Profile Edit (PATCH /me) ----
app.post("/graph-edit", async (req, res) => {
    if (!req.session.account || !req.session.accessToken) {
        req.session.editError = "Not signed in or no access token";
        return res.redirect("/graph-explorer");
    }

 

    const { displayName, givenName, surname, jobTitle, mobilePhone, officeLocation } = req.body;
    const updateData = {};
    if (displayName !== undefined && displayName !== "") updateData.displayName = displayName;
    if (givenName !== undefined) updateData.givenName = givenName || null;
    if (surname !== undefined) updateData.surname = surname || null;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle || null;
    if (mobilePhone !== undefined) updateData.mobilePhone = mobilePhone || null;
    if (officeLocation !== undefined) updateData.officeLocation = officeLocation || null;

 

    try {
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });

 

        if (response.ok || response.status === 204) {
            req.session.editSuccess = "Profile updated successfully in Entra ID! Changes may take a moment to propagate.";
            // Refresh the profile data
            try {
                const refreshRes = await fetch("https://graph.microsoft.com/v1.0/me", {
                    headers: { Authorization: `Bearer ${req.session.accessToken}` },
                });
                if (refreshRes.ok) req.session.graphProfile = await refreshRes.json();
            } catch { }
        } else {
            const errText = await response.text();
            req.session.editError = `Graph API error (${response.status}): ${errText}`;
        }
    } catch (err) {
        req.session.editError = `Error updating profile: ${err.message}`;
    }
    res.redirect("/graph-explorer");
});

 

// ---- NEW: Graph Groups (GET /me/memberOf) ----
app.get("/graph-groups", async (req, res) => {
    if (!req.session.account || !req.session.accessToken) {
        return res.redirect("/graph-explorer");
    }

 

    try {
        const response = await fetch("https://graph.microsoft.com/v1.0/me/memberOf", {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
        });
        if (response.ok) {
            const data = await response.json();
            req.session.graphGroups = (data.value || []).filter(v => v["@odata.type"] === "#microsoft.graph.group").map(g => ({
                id: g.id,
                displayName: g.displayName,
                description: g.description,
            }));
        } else {
            const errText = await response.text();
            req.session.editError = `Failed to load groups (${response.status}): ${errText}`;
        }
    } catch (err) {
        req.session.editError = `Error loading groups: ${err.message}`;
    }
    res.redirect("/graph-explorer");
});

 

// ---- Authentication ----
app.get("/login", async (req, res) => {

    if (needsSetup) {
        return res.send(pages.renderError("App Not Configured", {
            message: "Please update .env with your CLIENT_ID and TENANT_ID."
        }));
    }

    try {
        const { verifier, challenge } = generatePkceCodes();

        req.session.pkceCodes = { verifier, challenge };
        req.session.authType = "login";

        const authCodeUrl = buildManualAuthUrl({
            clientId: CLIENT_ID,
            redirectUri: REDIRECT_URI,
            scopes: ALL_SCOPES,
            codeChallenge: challenge,
            prompt: "select_account",
        });

        console.log("Auth URL:", authCodeUrl);

        res.redirect(authCodeUrl);

    } catch (err) {
        console.error("Login error:", err);
        res.send(pages.renderError("Login Failed", err));
    }
});

app.get("/signup", async (req, res) => {
    if (needsSetup) {
        return res.send(pages.renderError("App Not Configured", {
            message: "Please update .env with your CLIENT_ID, CLIENT_SECRET, and TENANT_ID. See the setup guide on the home page."
        }));
    }

 

    try {
        const { verifier, challenge } = generatePkceCodes();
        req.session.pkceCodes = { verifier, challenge };
        req.session.authType = "signup";

 

        let authCodeUrl;
        try {
 authCodeUrl = buildManualAuthUrl({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: ALL_SCOPES,
    codeChallenge: challenge,
    prompt: "create",
});
        } catch (msalErr) {
            console.warn("MSAL getAuthCodeUrl failed, using manual URL construction:", msalErr.message);
            authCodeUrl = buildManualAuthUrl({
                clientId: CLIENT_ID,
                redirectUri: REDIRECT_URI,
                scopes: ALL_SCOPES,
                codeChallenge: challenge,
                prompt: "create",
            });
        }
        res.redirect(authCodeUrl);
    } catch (err) {
        console.error("Signup error:", err);
        res.send(pages.renderError("Sign Up Failed", err));
    }
});

 

// ---- NEW: Critical Report Auth (triggers MFA then redirects to critical report) ----
app.get("/critical-report-auth", async (req, res) => {
    if (needsSetup || !req.session.account) {
        return res.redirect("/step-up-auth");
    }

 

    try {
        const { verifier, challenge } = generatePkceCodes();
        req.session.pkceCodes = { verifier, challenge };
        req.session.authType = "critical-report";

 

        let authCodeUrl;
        try {
 authCodeUrl = buildManualAuthUrl({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: ALL_SCOPES,
    codeChallenge: challenge,
    prompt: "login",
    loginHint: req.session.account.username,
    claims: JSON.stringify({
        id_token: {
            acrs: { essential: true, values: ["c2"] }
        }
    })
});
        } catch (msalErr) {
            console.warn("MSAL getAuthCodeUrl failed, using manual URL construction:", msalErr.message);
            authCodeUrl = buildManualAuthUrl({
                clientId: CLIENT_ID,
                redirectUri: REDIRECT_URI,
                scopes: ALL_SCOPES,
                codeChallenge: challenge,
                prompt: "login",
                loginHint: req.session.account.username,
                claims: JSON.stringify({
                    id_token: {
                        acrs: { essential: true, values: ["c2"] }
                    }
                }),
            });
        }
        res.redirect(authCodeUrl);
    } catch (err) {
        console.error("Critical report auth error:", err);
        req.session.stepUpResult = { success: false, message: `MFA verification failed: ${err.message}` };
        res.redirect("/step-up-auth");
    }
});

app.get("/auth/redirect", async (req, res) => {

    if (req.query.error) {
        return res.send(pages.renderError(req.query.error, {
            message: req.query.error_description || "Unknown error from Entra"
        }));
    }

    try {

        const tokens = await exchangeCodeForToken(
            req.query.code,
            req.session.pkceCodes?.verifier
        );

        console.log("TOKEN RESPONSE:", tokens);

        let tokenResponse = null;
        let idTokenClaims = {};

        if (tokens && tokens.access_token) {
            tokenResponse = {
                accessToken: tokens.access_token
            };
        } else {
            throw new Error("No access_token returned");
        }

        if (tokens.id_token) {
            try {
                idTokenClaims = decodeJwt(tokens.id_token);
            } catch (err) {
                console.error("Failed to decode id_token:", err);
            }
        }

        req.session.account = {
            username: idTokenClaims?.preferred_username || idTokenClaims?.email || "User",
            homeAccountId: idTokenClaims?.sub,
            localAccountId: idTokenClaims?.oid,
            name: idTokenClaims?.name,
        };

        req.session.claims = idTokenClaims;

        console.log("Login successful:", req.session.account.username);

        // ✅ Store access token
        if (tokenResponse && tokenResponse.accessToken) {
            req.session.accessToken = tokenResponse.accessToken;

            // ✅ FETCH GRAPH PROFILE (INSIDE async)
            try {
                const response = await fetch("https://graph.microsoft.com/v1.0/me", {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.accessToken}`
                    }
                });

                if (response.ok) {
                    req.session.graphProfile = await response.json();
                } else {
                    console.warn("Graph call failed:", response.status);
                }

            } catch (err) {
                console.error("Graph fetch error:", err.message);
            }
        }

        // ✅ redirect once (important)
        res.redirect("/");

    } catch (err) {
        console.error("Token acquisition error:", err);
        res.send(pages.renderError("Token Acquisition Failed", err));
    }

});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect(`http://localhost:${PORT}`);
    });
});

 

/* ================= START ================= */

 

app.listen(PORT, () => {
    console.log("");
    console.log("╔══════════════════════════════════════════════════════╗");
    console.log("║  ◆  MS Identity Platform Demo (Premium)             ║");
    console.log(`║  🌐 http://localhost:${PORT}                            ║`);
    console.log("║  🔐 Authority: " + (USE_CIAM ? "CIAM" : "Standard") + "                              ║");
    console.log("║  📄 Pages: 10 identity concept pages                ║");
    console.log("║  🛡️  New: Authorization + Step-Up Auth + Profile Ed  ║");
    console.log("║  ⚙️  Setup: " + (needsSetup ? "REQUIRED ⚠️ " : "Configured ✅") + "                        ║");
    console.log("╚══════════════════════════════════════════════════════╝");
    console.log("");
});}