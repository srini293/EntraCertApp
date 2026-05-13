// Page renderers for MS-Identity App – Premium Glassmorphism Theme
const CSS = require("./styles");

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function sidebarNav(account, activePage) {
  const links = [
    {
      section: "Overview", items: [
        { icon: "🏠", label: "Home", path: "/", id: "home" },
      ]
    },
    {
      section: "Identity", items: [
        { icon: "👤", label: "User Profile", path: "/profile", id: "profile", auth: true },
        { icon: "🔍", label: "Token Inspector", path: "/tokens", id: "tokens", auth: true },
        { icon: "📡", label: "Graph Profile Editor", path: "/graph-explorer", id: "graph-explorer", auth: true },
      ]
    },
    {
      section: "Authorization", items: [
        { icon: "🛡️", label: "Roles & Groups", path: "/authorization", id: "authorization", isNew: true },
        { icon: "🔐", label: "Step-Up Auth", path: "/step-up-auth", id: "step-up-auth", isNew: true },
      ]
    },
    {
      section: "Learn", items: [
        { icon: "🔄", label: "Auth Flows", path: "/auth-flows", id: "auth-flows" },
        { icon: "🔑", label: "Permissions", path: "/permissions", id: "permissions" },
        { icon: "⚡", label: "Conditional Access", path: "/conditional-access", id: "conditional-access" },
        { icon: "📋", label: "App Registrations", path: "/app-registrations", id: "app-registrations" },
        { icon: "🏰", label: "Security", path: "/security", id: "security" },
      ]
    },
  ];

  let html = `<button class="sidebar-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open')">☰</button>`;
  html += `<nav class="sidebar">`;
  html += `<a href="/" class="sidebar-brand"><div><span class="brand-icon">◆</span> <span class="brand-text">MS Identity Hub</span><div class="brand-sub">Entra ID Demo</div></div></a>`;

  for (const sec of links) {
    html += `<div class="sidebar-section"><span class="sidebar-section-label">${sec.section}</span>`;
    for (const l of sec.items) {
      const active = activePage === l.id ? " active" : "";
      const badge = l.auth ? `<span class="link-badge badge-auth">Auth</span>` : l.isNew ? `<span class="link-badge badge-new">New</span>` : "";
      html += `<a href="${l.path}" class="sidebar-link${active}"><span class="link-icon">${l.icon}</span>${l.label}${badge}</a>`;
    }
    html += `</div>`;
  }

  if (account) {
    const initials = (account.name || account.username || "U").substring(0, 2).toUpperCase();
    html += `<div class="sidebar-footer"><div class="sidebar-user"><div class="sidebar-avatar">${initials}</div><div class="sidebar-user-info"><div class="sidebar-user-name">${escapeHtml(account.name || account.username)}</div><div class="sidebar-user-email">${escapeHtml(account.username)}</div></div></div><a class="btn btn-danger btn-sm" href="/logout" style="width:100%;justify-content:center;margin-top:8px;">Sign Out</a></div>`;
  } else {
    html += `<div class="sidebar-footer"><a class="btn btn-primary btn-sm" href="/login" style="width:100%;justify-content:center;margin-bottom:6px;">🔑 Sign In</a><a class="btn btn-signup btn-sm" href="/signup" style="width:100%;justify-content:center;">✨ Sign Up</a></div>`;
  }
  html += `</nav>`;
  return html;
}

function layout(title, content, account, activePage) {
  const nav = sidebarNav(account, activePage || "");
  return `<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} — MS Identity Hub</title>${CSS}
  </head><body>${nav}<div class="app-wrapper"><div class="main-content">${content}</div></div></body></html>`;
}

function backBtn() {
  return '<a class="btn btn-secondary btn-sm btn-back" href="/">← Back to Hub</a>';
}

// ====== LANDING PAGE ======
function renderLanding(account, needsSetup) {
  const setupBanner = needsSetup ? `
    <div class="setup-card">
      <h3>⚠️ Entra App Registration Required</h3>
      <p style="color:var(--text-secondary);margin-bottom:12px;">To enable authentication, create a new app registration:</p>
      <ol>
        <li>Go to <a href="https://entra.microsoft.com" target="_blank" style="color:#60a5fa;">entra.microsoft.com</a> → App registrations → <b>New registration</b></li>
        <li>Name: <code>ms-identity-demo-app</code></li>
        <li>Redirect URI → Web: <code>http://localhost:3001/auth/redirect</code></li>
        <li>Go to <b>Certificates & secrets</b> → New client secret → Copy the value</li>
        <li>Copy the <b>Application (client) ID</b> and <b>Directory (tenant) ID</b> from Overview</li>
        <li>Update the <code>.env</code> file with your CLIENT_ID, CLIENT_SECRET, and TENANT_ID</li>
        <li>Restart the server</li>
      </ol>
    </div>` : "";

  const greeting = account
    ? `<div class="status-bar"><span class="status-dot"></span>Signed in as <b>${escapeHtml(account.name || account.username)}</b></div>`
    : "";

  const cards = [
    { icon: "👤", title: "User Profile", desc: "View your identity claims and profile information from Entra ID.", path: "/profile", tag: "auth", accent: "linear-gradient(135deg,#ff6b6b,#fbbf24)" },
    { icon: "🔍", title: "Token Inspector", desc: "Decode and inspect your ID tokens and access tokens live.", path: "/tokens", tag: "auth", accent: "linear-gradient(135deg,#a78bfa,#fb7185)" },
    { icon: "📡", title: "Graph Profile Editor", desc: "Edit your profile via Microsoft Graph API and view group memberships.", path: "/graph-explorer", tag: "auth", accent: "linear-gradient(135deg,#34d399,#2dd4bf)" },
    { icon: "🛡️", title: "Authorization", desc: "Learn about app roles, group claims, and how to gate access using ID vs Access tokens.", path: "/authorization", tag: "info", accent: "linear-gradient(135deg,#fbbf24,#ff6b6b)" },
    { icon: "🔐", title: "Step-Up Auth", desc: "Re-trigger MFA on demand. Understand step-up authentication patterns.", path: "/step-up-auth", tag: "info", accent: "linear-gradient(135deg,#fb7185,#a78bfa)" },
    { icon: "🔄", title: "Authentication Flows", desc: "Visual guide to OAuth 2.0 and OpenID Connect grant types.", path: "/auth-flows", tag: "info", accent: "linear-gradient(135deg,#2dd4bf,#34d399)" },
    { icon: "🔑", title: "Permissions & Scopes", desc: "Delegated vs application permissions, consent types, and common scopes.", path: "/permissions", tag: "info", accent: "linear-gradient(135deg,#34d399,#fbbf24)" },
    { icon: "⚡", title: "Conditional Access", desc: "CA policies, MFA enforcement, location-based access, and device compliance.", path: "/conditional-access", tag: "info", accent: "linear-gradient(135deg,#fbbf24,#fb923c)" },
    { icon: "📋", title: "App Registrations", desc: "Redirect URIs, secrets vs certificates, API permissions, and multi-tenant setup.", path: "/app-registrations", tag: "info", accent: "linear-gradient(135deg,#fb7185,#ff6b6b)" },
    { icon: "🏰", title: "Security Practices", desc: "Zero Trust, token lifetimes, PKCE, secure storage, and identity security patterns.", path: "/security", tag: "info", accent: "linear-gradient(135deg,#a78bfa,#2dd4bf)" },
  ];

  const cardsHtml = cards.map(c => `
    <a href="${c.path}" class="feature-card" style="--accent:${c.accent}">
      <span class="card-icon">${c.icon}</span>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <span class="card-tag ${c.tag === 'auth' ? 'tag-auth' : 'tag-info'}">${c.tag === 'auth' ? '🔒 Requires Sign-In' : '📖 Informational'}</span>
    </a>`).join("");

  const ctaSection = !account ? `
    <div class="cta-section">
      <p class="cta-text">Get started with Microsoft Identity — sign in to explore live demos or create a new account</p>
      <div class="cta-buttons">
        <a class="btn btn-primary btn-lg" href="/login">🔑 Sign In</a>
        <a class="btn btn-signup btn-lg" href="/signup">✨ Sign Up</a>
      </div>
    </div>` : "";

  return layout("Home", `
    <div class="header">
      <div class="logo">◆</div>
      <h1>Microsoft Identity Platform</h1>
      <p class="subtitle">Explore authentication, authorization, tokens, and security concepts with hands-on demos</p>
    </div>
    ${setupBanner}${greeting}${ctaSection}
    <div class="cards-grid">${cardsHtml}</div>
  `, account, "home");
}

// ====== 1. USER PROFILE ======
function renderProfile(account, claims) {
  if (!account) return layout("User Profile", `${backBtn()}<div class="card"><div class="card-title"><span class="icon">👤</span>User Profile</div><p style="color:var(--text-secondary)">Please <a href="/login" style="color:#60a5fa">sign in</a> to view your profile.</p></div>`, null, "profile");
  const fields = [
    ["Display Name", account.name], ["Email / Username", account.username],
    ["Tenant ID", account.tenantId || claims?.tid], ["Object ID (OID)", claims?.oid || account.localAccountId],
    ["Issuer", claims?.iss], ["Token Version", claims?.ver],
    ["Auth Time", claims?.iat ? new Date(claims.iat * 1000).toLocaleString() : null],
    ["Expiry", claims?.exp ? new Date(claims.exp * 1000).toLocaleString() : null],
  ];
  const grid = fields.map(([l, v]) => `<div class="user-item"><div class="label">${l}</div><div class="value">${escapeHtml(v || "N/A")}</div></div>`).join("");
  let claimsHtml = "";
  if (claims) {
    for (const [k, v] of Object.entries(claims)) {
      const dv = typeof v === "object" ? JSON.stringify(v) : String(v);
      claimsHtml += `<span class="claim-badge"><span class="key">${escapeHtml(k)}:</span> ${escapeHtml(dv)}</span>`;
    }
  }
  return layout("User Profile", `${backBtn()}
    <div class="card"><div class="card-title"><span class="icon">👤</span>User Profile</div><div class="user-grid">${grid}</div></div>
    <div class="card" style="animation-delay:0.1s"><div class="card-title"><span class="icon">🏷️</span>All Claims</div><div class="claims-grid">${claimsHtml || '<span style="color:var(--text-muted)">No claims available</span>'}</div></div>
  `, account, "profile");
}

// ====== 2. TOKEN INSPECTOR ======
function renderTokens(account, claims, accessToken) {
  if (!account) return layout("Token Inspector", `${backBtn()}<div class="card"><div class="card-title"><span class="icon">🔍</span>Token Inspector</div><p style="color:var(--text-secondary)">Please <a href="/login" style="color:#60a5fa">sign in</a> to inspect tokens.</p></div>`, null, "tokens");
  function decodeJwt(token) {
    if (!token) return null;
    try { const p = token.split("."); if (p.length !== 3) return null; return { header: JSON.parse(Buffer.from(p[0], "base64url").toString()), payload: JSON.parse(Buffer.from(p[1], "base64url").toString()), signature: p[2] }; } catch { return null; }
  }
  const decoded = decodeJwt(accessToken);
  const idClaimsHtml = claims ? Object.entries(claims).map(([k, v]) => `<span class="claim-badge"><span class="key">${escapeHtml(k)}:</span> ${escapeHtml(typeof v === "object" ? JSON.stringify(v) : String(v))}</span>`).join("") : "";
  const accessClaimsHtml = decoded ? Object.entries(decoded.payload).map(([k, v]) => `<span class="claim-badge" style="background:rgba(168,85,247,0.06);border-color:rgba(168,85,247,0.2);color:#d8b4fe;"><span class="key">${escapeHtml(k)}:</span> ${escapeHtml(typeof v === "object" ? JSON.stringify(v) : String(v))}</span>`).join("") : "";
  return layout("Token Inspector", `${backBtn()}
    <div class="card"><div class="card-title"><span class="icon">🔍</span>Token Inspector</div>
      <div class="highlight-box highlight-blue" style="margin-bottom:20px">Tokens are JWTs (JSON Web Tokens) — Base64-encoded JSON with a digital signature. They contain claims about the user and the authentication event.</div>
      <h3 style="color:#60a5fa;margin:16px 0 10px;">📘 ID Token Claims</h3>
      <div class="claims-grid">${idClaimsHtml || '<span style="color:var(--text-muted)">N/A</span>'}</div>
      <div class="token-block" style="margin-top:12px;"><pre>${escapeHtml(JSON.stringify(claims, null, 2))}</pre></div>
      <h3 style="color:#c084fc;margin:24px 0 10px;">🟣 Access Token ${decoded ? '' : '(Not Available)'}</h3>
      ${decoded ? `
        <div class="claims-grid">${accessClaimsHtml}</div>
        <h4 style="color:var(--text-muted);margin:16px 0 8px;font-size:13px;">JWT Header</h4>
        <div class="token-block"><pre>${escapeHtml(JSON.stringify(decoded.header, null, 2))}</pre></div>
        <h4 style="color:var(--text-muted);margin:16px 0 8px;font-size:13px;">Raw Access Token</h4>
        <div class="token-block"><pre style="word-break:break-all;white-space:pre-wrap;">${escapeHtml(accessToken)}</pre></div>
      ` : '<p style="color:#f59e0b;font-size:14px;">⚠️ No access token — configure API_SCOPE in .env to request one.</p>'}
    </div>
  `, account, "tokens");
}

// ====== 3. AUTH FLOWS ======
function renderAuthFlows(account) {
  const flows = [
    { name: "Authorization Code + PKCE", icon: "🔑", desc: "The most secure flow for web and mobile apps.", steps: ["User clicks Login", "Redirect to /authorize", "User authenticates", "Auth code returned", "App exchanges code + PKCE", "Tokens received"], recommended: true },
    { name: "Client Credentials", icon: "🤖", desc: "For server-to-server (daemon) apps with no user interaction.", steps: ["App sends client_id + secret", "Token endpoint validates", "Access token returned", "App calls API"], recommended: false },
    { name: "On-Behalf-Of (OBO)", icon: "🔗", desc: "A middle-tier API uses the user's token to call downstream APIs.", steps: ["User authenticates to front-end", "Front-end calls middle-tier", "Middle-tier sends token to /token", "New downstream token"], recommended: false },
    { name: "Device Code", icon: "📱", desc: "For devices with limited input (IoT, CLI tools).", steps: ["App requests device code", "User visits URL on another device", "User enters code", "App polls for tokens", "Tokens received"], recommended: false },
  ];
  const flowsHtml = flows.map(f => `
    <div class="card" style="animation-delay:0.1s">
      <div class="card-title"><span class="icon">${f.icon}</span>${f.name} ${f.recommended ? '<span class="badge badge-id" style="margin-left:8px">RECOMMENDED</span>' : ''}</div>
      <p style="color:var(--text-secondary);font-size:14px;line-height:1.7;margin-bottom:16px;">${f.desc}</p>
      <div class="flow">${f.steps.map((s, i) => `${i > 0 ? '<span class="flow-arrow">→</span>' : ''}<span class="flow-step">${s}</span>`).join("")}</div>
    </div>`).join("");
  return layout("Authentication Flows", `${backBtn()}
    <div class="header" style="margin-bottom:24px"><div class="logo">🔄</div><h1>Authentication Flows</h1><p class="subtitle">OAuth 2.0 and OpenID Connect grant types explained</p></div>
    ${flowsHtml}
  `, account, "auth-flows");
}

// ====== 4. PERMISSIONS & SCOPES ======
function renderPermissions(account) {
  return layout("Permissions & Scopes", `${backBtn()}
    <div class="header" style="margin-bottom:24px"><div class="logo">🔑</div><h1>Permissions & Scopes</h1><p class="subtitle">Understanding delegated and application permissions in Microsoft Identity</p></div>
    <div class="card">
      <div class="card-title"><span class="icon">⚖️</span>Delegated vs Application Permissions</div>
      <table class="compare-table">
        <thead><tr><th>Aspect</th><th>Delegated</th><th>Application</th></tr></thead>
        <tbody>
          <tr><td>Context</td><td>Acts on behalf of a signed-in user</td><td>Acts as the app itself (no user)</td></tr>
          <tr><td>Consent</td><td>User or admin consent</td><td>Admin consent only</td></tr>
          <tr><td>Use case</td><td>Web apps, SPAs, mobile apps</td><td>Background services, daemons</td></tr>
          <tr><td>Example</td><td><code>User.Read</code></td><td><code>User.Read.All</code></td></tr>
          <tr><td>Token type</td><td>User + App token</td><td>App-only token</td></tr>
        </tbody>
      </table>
    </div>
    <div class="card" style="animation-delay:0.1s">
      <div class="card-title"><span class="icon">📋</span>Common Microsoft Graph Scopes</div>
      <div class="claims-grid">
        ${["openid", "profile", "email", "User.Read", "User.ReadWrite", "Mail.Read", "Mail.Send", "Files.Read", "Calendars.Read", "Directory.Read.All", "offline_access", "Groups.Read.All", "GroupMember.Read.All"].map(s => `<span class="claim-badge"><span class="key">scope:</span> ${s}</span>`).join("")}
      </div>
    </div>
    <div class="card" style="animation-delay:0.2s">
      <div class="card-title"><span class="icon">✅</span>Consent Types</div>
      <div class="info-section"><h3>👤 User Consent</h3><p>Individual users grant permissions to an app. Works for low-privilege scopes like <code>User.Read</code>.</p></div>
      <div class="info-section"><h3>🏢 Admin Consent</h3><p>A tenant admin grants permissions for all users. Required for high-privilege scopes like <code>Directory.Read.All</code>.</p></div>
      <div class="info-section"><h3>🔒 Pre-Authorized</h3><p>An API owner pre-authorizes a client app. Users don't see a consent prompt for pre-authorized scopes.</p></div>
    </div>
  `, account, "permissions");
}

// ====== 5. CONDITIONAL ACCESS ======
function renderConditionalAccess(account) {
  const policies = [
    { icon: "🔑", title: "Multi-Factor Authentication", desc: "Require MFA for sensitive apps, risky sign-ins, or all users." },
    { icon: "📍", title: "Location-Based Access", desc: "Define named locations and block or require verification from untrusted locations." },
    { icon: "💻", title: "Device Compliance", desc: "Require managed or compliant devices. Block access from unmanaged personal devices." },
    { icon: "⚡", title: "Risk-Based Policies", desc: "Automatically block or challenge sign-ins flagged as medium/high risk." },
    { icon: "📱", title: "App Protection", desc: "Require approved client apps or app protection policies." },
    { icon: "⏰", title: "Session Controls", desc: "Limit session lifetime, require re-authentication, use CAAC for monitoring." },
  ];
  return layout("Conditional Access", `${backBtn()}
    <div class="header" style="margin-bottom:24px"><div class="logo">⚡</div><h1>Conditional Access</h1><p class="subtitle">Zero Trust access policies for Microsoft Entra ID</p></div>
    <div class="highlight-box highlight-amber" style="margin-bottom:24px">Conditional Access policies are the <b>if-then</b> engine of Zero Trust: <em>If</em> a user wants to access a resource, <em>then</em> they must complete an action (MFA, device compliance, etc.).</div>
    <div class="cards-grid">${policies.map(p => `
      <div class="card" style="margin-bottom:0">
        <div class="card-title"><span class="icon">${p.icon}</span>${p.title}</div>
        <p style="color:var(--text-secondary);font-size:14px;line-height:1.7;">${p.desc}</p>
      </div>`).join("")}</div>
    <div class="card" style="margin-top:20px;animation-delay:0.3s">
      <div class="card-title"><span class="icon">🔄</span>How CA Evaluation Works</div>
      <div class="flow">
        <span class="flow-step">👤 User Sign-In</span><span class="flow-arrow">→</span>
        <span class="flow-step">📊 Signal Collection</span><span class="flow-arrow">→</span>
        <span class="flow-step">🧮 Policy Evaluation</span><span class="flow-arrow">→</span>
        <span class="flow-step">✅ Grant / 🚫 Block</span>
      </div>
    </div>
  `, account, "conditional-access");
}

// ====== 6. APP REGISTRATIONS ======
function renderAppRegistrations(account) {
  return layout("App Registrations", `${backBtn()}
    <div class="header" style="margin-bottom:24px"><div class="logo">📋</div><h1>App Registrations</h1><p class="subtitle">Everything about registering apps in Microsoft Entra ID</p></div>
    <div class="card">
      <div class="card-title"><span class="icon">🏗️</span>App Registration Anatomy</div>
      <table class="compare-table">
        <thead><tr><th>Component</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><b>Application (client) ID</b></td><td>Unique identifier for your app.</td></tr>
          <tr><td><b>Directory (tenant) ID</b></td><td>Identifies the Entra ID tenant.</td></tr>
          <tr><td><b>Redirect URIs</b></td><td>Where tokens are sent after authentication. Must match exactly.</td></tr>
          <tr><td><b>Client Secret / Certificate</b></td><td>Credential the app uses to prove its identity.</td></tr>
          <tr><td><b>API Permissions</b></td><td>Microsoft Graph or custom API scopes.</td></tr>
          <tr><td><b>Expose an API</b></td><td>Define scopes that other apps can request.</td></tr>
          <tr><td><b>Token configuration</b></td><td>Optional claims, group membership claims, token version.</td></tr>
        </tbody>
      </table>
    </div>
    <div class="card" style="animation-delay:0.1s">
      <div class="card-title"><span class="icon">🌐</span>Supported Account Types</div>
      <div class="info-section"><h3>🏢 Single Tenant</h3><p>Only users in your organization can sign in.</p></div>
      <div class="info-section"><h3>🌍 Multi-Tenant</h3><p>Users from any Entra ID tenant can sign in.</p></div>
      <div class="info-section"><h3>👥 Multi-Tenant + Personal</h3><p>Entra ID users + personal Microsoft accounts.</p></div>
      <div class="info-section"><h3>🆔 External ID</h3><p>Consumer/customer-facing (CIAM). Self-service sign-up.</p></div>
    </div>
    <div class="card" style="animation-delay:0.2s">
      <div class="card-title"><span class="icon">🔒</span>Secrets vs Certificates</div>
      <table class="compare-table">
        <thead><tr><th>Aspect</th><th>Client Secret</th><th>Certificate</th></tr></thead>
        <tbody>
          <tr><td>Security</td><td>Lower — string that can be leaked</td><td>Higher — asymmetric cryptography</td></tr>
          <tr><td>Rotation</td><td>Manual, max 2 years</td><td>Automated via Key Vault</td></tr>
          <tr><td>Best For</td><td>Development, simple apps</td><td>Production, high-security</td></tr>
        </tbody>
      </table>
    </div>
  `, account, "app-registrations");
}

// ====== 7. GRAPH API PROFILE EDITOR ======
function renderGraphExplorer(account, graphResult, graphProfile, graphGroups, editSuccess, editError) {
  if (!account) return layout("Graph Profile Editor", `${backBtn()}<div class="card"><div class="card-title"><span class="icon">📡</span>Graph Profile Editor</div><p style="color:var(--text-secondary)">Please <a href="/login" style="color:#60a5fa">sign in</a> to use the Graph Profile Editor.</p></div>`, null, "graph-explorer");

  const feedback = editSuccess ? `<div class="toast toast-success">✅ ${escapeHtml(editSuccess)}</div>` : editError ? `<div class="toast toast-error">❌ ${escapeHtml(editError)}</div>` : "";
  const p = graphProfile || {};
  const profileForm = `
    <form method="POST" action="/graph-edit">
      <div class="form-row">
        <div class="form-group"><label>Display Name</label><input class="form-input" name="displayName" value="${escapeHtml(p.displayName || "")}" placeholder="Display Name"></div>
        <div class="form-group"><label>Job Title</label><input class="form-input" name="jobTitle" value="${escapeHtml(p.jobTitle || "")}" placeholder="Job Title"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Given Name</label><input class="form-input" name="givenName" value="${escapeHtml(p.givenName || "")}" placeholder="Given Name"></div>
        <div class="form-group"><label>Surname</label><input class="form-input" name="surname" value="${escapeHtml(p.surname || "")}" placeholder="Surname"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Mobile Phone</label><input class="form-input" name="mobilePhone" value="${escapeHtml(p.mobilePhone || "")}" placeholder="+1 234 567 8900"></div>
        <div class="form-group"><label>Office Location</label><input class="form-input" name="officeLocation" value="${escapeHtml(p.officeLocation || "")}" placeholder="Office Location"></div>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">💾 Save Changes to Entra</button>
        <a class="btn btn-secondary" href="/graph-refresh">🔄 Refresh Profile</a>
      </div>
    </form>`;

  let groupsHtml = '<p style="color:var(--text-muted);font-size:14px;">No groups loaded. <a href="/graph-groups" style="color:#67e8f9;">Load group memberships →</a></p>';
  if (graphGroups && Array.isArray(graphGroups)) {
    if (graphGroups.length === 0) {
      groupsHtml = '<p style="color:var(--text-muted);">No group memberships found.</p>';
    } else {
      groupsHtml = `<ul class="group-list">${graphGroups.map(g => `
        <li class="group-list-item">
          <div class="group-list-icon">👥</div>
          <div><div class="group-list-name">${escapeHtml(g.displayName || "Unnamed Group")}</div><div class="group-list-id">${escapeHtml(g.id || "")}</div></div>
        </li>`).join("")}</ul>`;
    }
  }

  const resultHtml = graphResult ? `
    <div style="margin-top:16px;padding:16px;background:${graphResult._error ? 'rgba(239,68,68,0.04)' : 'rgba(16,185,129,0.04)'};border:1px solid ${graphResult._error ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)'};border-radius:var(--radius-md);">
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1.2px;font-weight:700;">API Response</div>
      <div class="token-block"><pre>${escapeHtml(JSON.stringify(graphResult, null, 2))}</pre></div>
    </div>` : "";

  return layout("Graph Profile Editor", `${backBtn()}${feedback}
    <div class="card">
      <div class="card-title"><span class="icon">✏️</span>Edit Your Profile</div>
      <p style="color:var(--text-secondary);font-size:14px;margin-bottom:20px;line-height:1.7;">Edit your profile fields below. Changes are saved directly to Entra ID via <code style="color:#c084fc;background:rgba(139,92,246,0.1);padding:2px 8px;border-radius:6px;font-size:12px;">PATCH /me</code> on Microsoft Graph API.</p>
      ${profileForm}
    </div>
    <div class="card" style="animation-delay:0.1s">
      <div class="card-title"><span class="icon">👥</span>Group Memberships <a href="/graph-groups" class="btn btn-secondary btn-sm" style="margin-left:auto;">🔄 Load Groups</a></div>
      ${groupsHtml}
    </div>
    <div class="card" style="animation-delay:0.2s">
      <div class="card-title"><span class="icon">📡</span>Raw API Calls</div>
      <p style="color:var(--text-secondary);font-size:14px;margin-bottom:16px;">Test Graph endpoints directly:</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <a class="btn btn-primary btn-sm" href="/graph-call?endpoint=me">📧 GET /me</a>
        <a class="btn btn-secondary btn-sm" href="/graph-call?endpoint=organization">🏢 GET /organization</a>
      </div>
      ${resultHtml}
    </div>
    <div class="card" style="animation-delay:0.3s">
      <div class="card-title"><span class="icon">💡</span>How It Works</div>
      <div class="flow">
        <span class="flow-step">🔑 Access Token</span><span class="flow-arrow">→</span>
        <span class="flow-step">Authorization: Bearer &lt;token&gt;</span><span class="flow-arrow">→</span>
        <span class="flow-step">graph.microsoft.com</span><span class="flow-arrow">→</span>
        <span class="flow-step">📊 JSON Response</span>
      </div>
      <div class="highlight-box highlight-purple" style="margin-top:16px;">
        <b>Required Scopes:</b> <code>User.ReadWrite</code> for profile edits, <code>GroupMember.Read.All</code> for group memberships. Grant admin consent in Entra Portal.
      </div>
    </div>
  `, account, "graph-explorer");
}

// ====== 8. SECURITY BEST PRACTICES ======
function renderSecurity(account) {
  const practices = [
    { icon: "🏛️", title: "Zero Trust Architecture", items: ["Never trust, always verify", "Use least privilege access", "Assume breach"] },
    { icon: "🔑", title: "PKCE", items: ["Always use PKCE with Authorization Code flow", "Prevents code interception attacks", "Required by MSAL libraries"] },
    { icon: "⏱️", title: "Token Lifetimes", items: ["ID tokens: ~1 hour", "Access tokens: 60-90 min default", "Refresh tokens: up to 90 days"] },
    { icon: "🔒", title: "Secure Token Storage", items: ["Never store in localStorage (XSS)", "Use httpOnly secure cookies or sessions", "For SPAs, use MSAL.js in-memory cache"] },
    { icon: "🔄", title: "Token Refresh", items: ["Use refresh tokens for silent renewal", "Implement acquireTokenSilent() before API calls", "Handle expiration gracefully"] },
    { icon: "🛡️", title: "Additional Measures", items: ["Validate token signatures and aud claim", "Use CA for MFA and device compliance", "Enable Continuous Access Evaluation (CAE)", "Monitor sign-in logs"] },
  ];
  return layout("Security Best Practices", `${backBtn()}
    <div class="header" style="margin-bottom:24px"><div class="logo">🏰</div><h1>Security Best Practices</h1><p class="subtitle">Identity security patterns following Zero Trust principles</p></div>
    ${practices.map((p, i) => `
      <div class="card" style="animation-delay:${i * 0.08}s">
        <div class="card-title"><span class="icon">${p.icon}</span>${p.title}</div>
        <ul style="color:var(--text-secondary);font-size:14px;line-height:2;padding-left:20px;">${p.items.map(item => `<li>${item}</li>`).join("")}</ul>
      </div>`).join("")}
  `, account, "security");
}

// ====== 9. AUTHORIZATION (NEW) ======
function renderAuthorization(account, claims) {
  const rolesHtml = claims?.roles ? claims.roles.map(r => `<span class="role-badge">🛡️ ${escapeHtml(r)}</span>`).join("") : '<span style="color:var(--text-muted);font-size:13px;">No app roles assigned. Configure roles in Entra Portal → App registrations → App roles.</span>';
  const groupsHtml = claims?.groups ? claims.groups.map(g => `<span class="group-badge">👥 ${escapeHtml(g)}</span>`).join("") : '<span style="color:var(--text-muted);font-size:13px;">No group claims in token. Enable in Entra → Token configuration → Add groups claim.</span>';

  const userSection = account ? `
    <div class="card" style="animation-delay:0.15s">
      <div class="card-title"><span class="icon">👤</span>Your Authorization Claims</div>
      <div class="status-bar"><span class="status-dot"></span>Signed in as <b>${escapeHtml(account.name || account.username)}</b></div>
      <h3 style="color:#c4b5fd;margin:16px 0 10px;font-size:15px;">🛡️ App Roles (from ID Token)</h3>
      <div style="margin-bottom:16px;">${rolesHtml}</div>
      <h3 style="color:#67e8f9;margin:16px 0 10px;font-size:15px;">👥 Group Memberships (from ID Token)</h3>
      <div>${groupsHtml}</div>
    </div>
    <div class="card" style="animation-delay:0.2s">
      <div class="card-title"><span class="icon">🔒</span>Role-Gated Content Demo</div>
      <p style="color:var(--text-secondary);font-size:14px;margin-bottom:16px;">Below shows how UI sections can be gated based on roles. ${claims?.roles?.includes('Admin') ? '<span style="color:#6ee7b7;">✅ You have Admin role — full access!</span>' : '<span style="color:#f59e0b;">⚠️ You don\'t have "Admin" role — restricted view.</span>'}</p>
      <div style="padding:18px;border-radius:var(--radius-md);background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.12);margin-bottom:12px;">
        <div style="font-weight:700;color:#6ee7b7;margin-bottom:4px;">🟢 Public Section</div>
        <p style="color:var(--text-secondary);font-size:13px;">Visible to all authenticated users.</p>
      </div>
      <div style="padding:18px;border-radius:var(--radius-md);background:${claims?.roles?.includes('Admin') ? 'rgba(139,92,246,0.04)' : 'rgba(100,116,139,0.04)'};border:1px solid ${claims?.roles?.includes('Admin') ? 'rgba(139,92,246,0.12)' : 'rgba(100,116,139,0.1)'};opacity:${claims?.roles?.includes('Admin') ? '1' : '0.5'};">
        <div style="font-weight:700;color:${claims?.roles?.includes('Admin') ? '#c4b5fd' : 'var(--text-muted)'};margin-bottom:4px;">${claims?.roles?.includes('Admin') ? '🟣 Admin Section — Access Granted' : '🔒 Admin Section — Requires Admin Role'}</div>
        <p style="color:var(--text-secondary);font-size:13px;">${claims?.roles?.includes('Admin') ? 'You can manage users, view audit logs, and configure settings.' : 'This content is only visible to users with the "Admin" app role.'}</p>
      </div>
    </div>` : `<div class="card" style="animation-delay:0.15s"><div class="card-title"><span class="icon">👤</span>Your Claims</div><p style="color:var(--text-secondary)"><a href="/login" style="color:#60a5fa">Sign in</a> to see your app roles and group claims.</p></div>`;

  return layout("Authorization", `${backBtn()}
    <div class="header" style="margin-bottom:24px"><div class="logo">🛡️</div><h1>Authorization</h1><p class="subtitle">App Roles, Group Claims, and access control in Microsoft Entra ID</p></div>
    <div class="card">
      <div class="card-title"><span class="icon">🔑</span>ID Token vs Access Token for Authorization</div>
      <table class="compare-table">
        <thead><tr><th>Aspect</th><th>ID Token</th><th>Access Token</th></tr></thead>
        <tbody>
          <tr><td><b>Purpose</b></td><td>Prove who the user is to <em>your app</em></td><td>Grant access to a <em>protected API</em></td></tr>
          <tr><td><b>Audience</b></td><td>Your application (client_id)</td><td>The API (e.g. Microsoft Graph)</td></tr>
          <tr><td><b>Roles claim</b></td><td>✅ App roles assigned to the user</td><td>✅ API-level roles for the resource</td></tr>
          <tr><td><b>Groups claim</b></td><td>✅ Security group IDs</td><td>✅ If configured on the API</td></tr>
          <tr><td><b>Use for</b></td><td>UI authorization, page gating</td><td>API call authorization</td></tr>
          <tr><td><b>Best practice</b></td><td>Gate app features</td><td>Never send to a 3rd party API</td></tr>
        </tbody>
      </table>
    </div>
    <div class="card" style="animation-delay:0.1s">
      <div class="card-title"><span class="icon">⚙️</span>How to Configure</div>
      <div class="flow" style="margin-bottom:20px;">
        <span class="flow-step">1. Define App Roles</span><span class="flow-arrow">→</span>
        <span class="flow-step">2. Assign Users/Groups</span><span class="flow-arrow">→</span>
        <span class="flow-step">3. Enable Group Claims</span><span class="flow-arrow">→</span>
        <span class="flow-step">4. Read Token Claims</span>
      </div>
      <div class="info-section"><h3>🛡️ App Roles</h3><p>Go to <b>Entra Portal → App registrations → App roles → Create app role</b>. Define roles like <code>Admin</code>, <code>Reader</code>, <code>Editor</code>. Assign users/groups in <b>Enterprise applications → Users and groups</b>.</p></div>
      <div class="info-section"><h3>👥 Group Claims</h3><p>Go to <b>Token configuration → Add groups claim</b>. Select "Security groups". Group Object IDs will appear in the <code>groups</code> claim of the ID token.</p></div>
    </div>
    ${userSection}
  `, account, "authorization");
}

// ====== 10. STEP-UP AUTH (NEW) ======
function renderStepUpAuth(account, claims, stepUpResult) {
  const amr = claims?.amr || [];
  const hasMfa = amr.includes("mfa") || claims?.acr === "possessionorinherence" || claims?.acrs?.includes("c2");
  const authLevel = hasMfa ? "high" : account ? "medium" : "low";
  const authLevelLabel = hasMfa ? "🟢 Multi-Factor Authenticated" : account ? "🟡 Single-Factor (Password only)" : "🔴 Not Authenticated";

  const userSection = account ? `
    <div class="card" style="animation-delay:0.15s">
      <div class="card-title"><span class="icon">📊</span>Your Current Auth Status</div>
      <div class="auth-level-indicator">
        <div class="auth-level-dot ${authLevel}"></div>
        <div><div class="auth-level-text">${authLevelLabel}</div><div class="auth-level-sub">Authentication method references: ${amr.length > 0 ? amr.map(a => `<code style="color:#a5b4fc;background:rgba(99,102,241,0.1);padding:1px 6px;border-radius:4px;font-size:11px;">${escapeHtml(a)}</code>`).join(" ") : '<span style="color:var(--text-muted)">none reported</span>'}</div></div>
      </div>
      <div class="claims-grid" style="margin-top:12px;">
        ${claims?.acr ? `<span class="claim-badge"><span class="key">acr:</span> ${escapeHtml(claims.acr)}</span>` : ''}
        ${claims?.amr ? `<span class="claim-badge"><span class="key">amr:</span> ${escapeHtml(JSON.stringify(claims.amr))}</span>` : ''}
        ${claims?.auth_time ? `<span class="claim-badge"><span class="key">auth_time:</span> ${new Date(claims.auth_time * 1000).toLocaleString()}</span>` : ''}
      </div>
      <div style="margin-top:20px;">
        <a class="btn btn-warning btn-lg" href="/critical-report-auth">📋 View Critical Report</a>
        <p style="color:var(--text-muted);font-size:12px;margin-top:8px;">You will be asked to verify your identity with MFA before accessing the critical report.</p>
      </div>
    </div>` : `
    <div class="card" style="animation-delay:0.15s">
      <div class="card-title"><span class="icon">👤</span>Try It Out</div>
      <p style="color:var(--text-secondary)"><a href="/login" style="color:#60a5fa">Sign in</a> first, then trigger step-up MFA to see the difference.</p>
    </div>`;

  const resultSection = stepUpResult ? `
    <div class="card" style="animation-delay:0.2s">
      <div class="card-title"><span class="icon">✅</span>Step-Up Result</div>
      <div class="toast toast-${stepUpResult.success ? 'success' : 'info'}">${escapeHtml(stepUpResult.message || "Step-up auth completed.")}</div>
      <div class="token-block"><pre>${escapeHtml(JSON.stringify(stepUpResult.claims || {}, null, 2))}</pre></div>
    </div>` : "";

  return layout("Step-Up Auth", `${backBtn()}
    <div class="header" style="margin-bottom:24px"><div class="logo">🔐</div><h1>Step-Up Authentication</h1><p class="subtitle">Re-trigger MFA on demand for sensitive operations</p></div>
    <div class="card">
      <div class="card-title"><span class="icon">📖</span>What is Step-Up Auth?</div>
      <p style="color:var(--text-secondary);font-size:14px;line-height:1.8;margin-bottom:16px;">Step-up authentication is when your app requires a <b>higher level of assurance</b> before granting access to a sensitive operation — even if the user is already signed in. For example, viewing account settings may be fine with a password, but transferring funds might require MFA.</p>
      <div class="flow" style="margin-top:16px;">
        <span class="flow-step">👤 User signed in</span><span class="flow-arrow">→</span>
        <span class="flow-step">🔒 Sensitive action</span><span class="flow-arrow">→</span>
        <span class="flow-step">🔐 Re-trigger MFA</span><span class="flow-arrow">→</span>
        <span class="flow-step">✅ Elevated access</span>
      </div>
    </div>
    <div class="card" style="animation-delay:0.1s">
      <div class="card-title"><span class="icon">⚙️</span>How It Works Technically</div>
      <div class="info-section"><h3>🔑 Using claims Parameter</h3><p>Pass the <code>claims</code> parameter in your auth request to demand specific auth context (e.g., MFA). Entra ID will force re-authentication at the requested level.</p></div>
      <div class="info-section"><h3>🏷️ Authentication Context (acrs)</h3><p>Define authentication contexts (c1, c2, c3) in Conditional Access and reference them in your auth requests. Map them to policies that require MFA, compliant devices, etc.</p></div>
      <div class="info-section"><h3>📋 Check amr Claim</h3><p>After auth, check the <code>amr</code> (authentication methods references) claim in the ID token. Look for <code>"mfa"</code> to confirm multi-factor was used.</p></div>
      <div class="highlight-box highlight-purple">
        <b>Implementation:</b> <code>prompt: "login"</code> forces re-authentication. Combine with <code>claims</code> request for MFA to achieve step-up auth.
      </div>
    </div>
    ${userSection}
    ${resultSection}
  `, account, "step-up-auth");
}

// ====== 11. CRITICAL REPORT (MFA-GATED) ======
function renderCriticalReport(account, claims) {
  if (!account) {
    return layout("Critical Report", `
      <div class="card"><div class="card-title"><span class="icon">🔒</span>Access Denied</div>
      <p style="color:var(--text-secondary)">Please <a href="/login" style="color:#ff6b6b">sign in</a> to access the Critical Report.</p></div>
    `, null, "critical-report");
  }

  const amr = claims?.amr || [];
  const hasMfa = amr.includes("mfa") || claims?.acr === "possessionorinherence" || claims?.acrs?.includes("c2");
  const authMethods = amr.length > 0 ? amr.join(", ") : "unknown";
  const authTime = claims?.auth_time ? new Date(claims.auth_time * 1000).toLocaleString() : "N/A";

  return layout("Critical Report", `${backBtn()}
    <div class="header" style="margin-bottom:24px">
      <div class="logo">📋</div>
      <h1>Critical Report</h1>
      <p class="subtitle">MFA-Protected Sensitive Information</p>
    </div>

    <div class="card">
      <div class="card-title"><span class="icon">✅</span>Identity Verified</div>
      <div class="auth-level-indicator">
        <div class="auth-level-dot high"></div>
        <div><div class="auth-level-text">🟢 Multi-Factor Authentication Confirmed</div>
        <div class="auth-level-sub">Methods used: <code style="color:#fde68a;background:rgba(251,191,36,0.1);padding:1px 6px;border-radius:4px;font-size:11px;">${escapeHtml(authMethods)}</code> &nbsp;|&nbsp; Auth time: ${authTime}</div></div>
      </div>
    </div>

    <div class="card" style="animation-delay:0.1s">
      <div class="card-title"><span class="icon">🏢</span>Microsoft Entra External ID – Security Overview</div>
      <div class="info-section">
        <h3>🔐 Tenant Security Status</h3>
        <p>Your organisation uses <b>Microsoft Entra External ID</b> (formerly Azure AD B2C / CIAM) to manage customer and partner identities. This report summarises the key security configurations active in your tenant.</p>
      </div>
      <div class="compare-table" style="margin-top:16px;">
        <table><thead><tr><th>Security Control</th><th>Status</th><th>Details</th></tr></thead><tbody>
          <tr><td>Multi-Factor Auth (MFA)</td><td><span class="role-badge" style="background:rgba(52,211,153,0.15);color:#34d399;">Active</span></td><td>Enforced via Conditional Access policy for sensitive operations</td></tr>
          <tr><td>PKCE Auth Flow</td><td><span class="role-badge" style="background:rgba(52,211,153,0.15);color:#34d399;">Active</span></td><td>Authorization Code + PKCE (SHA-256) prevents code interception</td></tr>
          <tr><td>Token Encryption</td><td><span class="role-badge" style="background:rgba(52,211,153,0.15);color:#34d399;">Active</span></td><td>All tokens signed by Entra with RSA-256 keys</td></tr>
          <tr><td>Session Management</td><td><span class="role-badge" style="background:rgba(52,211,153,0.15);color:#34d399;">Active</span></td><td>Server-side sessions, tokens never exposed to client JavaScript</td></tr>
          <tr><td>App Roles</td><td><span class="role-badge" style="background:rgba(251,191,36,0.15);color:#fbbf24;">${claims?.roles ? 'Configured' : 'Not Configured'}</span></td><td>${claims?.roles ? 'Roles: ' + claims.roles.join(', ') : 'No app roles defined in Entra portal'}</td></tr>
          <tr><td>Group Claims</td><td><span class="role-badge" style="background:rgba(251,191,36,0.15);color:#fbbf24;">${claims?.groups ? 'Configured' : 'Not Configured'}</span></td><td>${claims?.groups ? claims.groups.length + ' group(s) in token' : 'Enable group claims in Token Configuration'}</td></tr>
        </tbody></table>
      </div>
    </div>

    <div class="card" style="animation-delay:0.15s">
      <div class="card-title"><span class="icon">⚠️</span>Critical Recommendations</div>
      <div class="info-section">
        <h3>1. Rotate Client Secrets Regularly</h3>
        <p>Client secrets should be rotated every <b>90 days</b>. Consider migrating to <b>certificate-based credentials</b> for production workloads — they are more secure and cannot be accidentally leaked in logs.</p>
      </div>
      <div class="info-section">
        <h3>2. Enforce Conditional Access Policies</h3>
        <p>Create CA policies targeting your app registration to enforce MFA for all sign-ins, block legacy authentication protocols, and require compliant devices for admin access.</p>
      </div>
      <div class="info-section">
        <h3>3. Monitor Sign-In Logs</h3>
        <p>Entra provides detailed sign-in logs under <b>Monitoring → Sign-in logs</b>. Enable alerts for failed sign-in attempts, risky sign-ins, and unusual locations. Integrate with <b>Microsoft Sentinel</b> for SIEM capabilities.</p>
      </div>
      <div class="info-section">
        <h3>4. Principle of Least Privilege</h3>
        <p>Only request the scopes your app truly needs. Regularly audit API permissions under <b>App registrations → API permissions</b>. Remove any unused or excessive permissions.</p>
      </div>
      <div class="info-section">
        <h3>5. Token Lifetime & Refresh</h3>
        <p>ID tokens typically last <b>1 hour</b>. Use refresh tokens with sliding expiration for long sessions. Configure <b>Token lifetime policies</b> in Entra to control these values.</p>
      </div>
    </div>

    <div class="card" style="animation-delay:0.2s">
      <div class="card-title"><span class="icon">👤</span>Your Identity Summary</div>
      <div class="user-grid">
        <div class="user-item"><div class="label">Name</div><div class="value">${escapeHtml(account.name || 'N/A')}</div></div>
        <div class="user-item"><div class="label">Email</div><div class="value">${escapeHtml(account.username || 'N/A')}</div></div>
        <div class="user-item"><div class="label">Tenant ID</div><div class="value">${escapeHtml(claims?.tid || 'N/A')}</div></div>
        <div class="user-item"><div class="label">Object ID</div><div class="value">${escapeHtml(claims?.oid || claims?.sub || 'N/A')}</div></div>
        <div class="user-item"><div class="label">Auth Methods</div><div class="value">${escapeHtml(authMethods)}</div></div>
        <div class="user-item"><div class="label">MFA Verified</div><div class="value">${hasMfa ? '✅ Yes' : '❌ No'}</div></div>
      </div>
    </div>

    <div class="cta-section" style="animation-delay:0.25s;">
      <p style="color:var(--text-secondary);margin-bottom:16px;">You have reviewed the critical report. Sign out to end your session securely.</p>
      <a class="btn btn-primary btn-lg" href="/logout" style="background:linear-gradient(135deg,#ff6b6b,#fb7185);">🚪 Sign Out & End Session</a>
      <p style="color:var(--text-muted);font-size:11px;margin-top:10px;">This will destroy your session and clear all tokens from the server.</p>
    </div>
  `, account, "critical-report");
}

// ====== ROLE SELECTOR ======
function renderRoleSelector(account) {
  if (!account) return layout("Select Role", `<div class="header"><div class="logo">🔐</div><h1>Please Sign In</h1><p class="subtitle">You need to sign in before selecting a role.</p></div><a class="btn btn-primary" href="/login">Sign In / Sign Up</a>`, null);
  const roles = [
    { id: "doctor", icon: "🩺", title: "Doctor", desc: "Access patient records, appointments, prescriptions.", accent: "linear-gradient(135deg, #059669, #10b981)" },
    { id: "consultant", icon: "💼", title: "Consultant", desc: "Manage projects, client meetings, and reports.", accent: "linear-gradient(135deg, #2563eb, #3b82f6)" },
    { id: "student", icon: "🎓", title: "Student", desc: "Track courses, assignments, grades.", accent: "linear-gradient(135deg, #d97706, #f59e0b)" },
    { id: "medical-student", icon: "🔬", title: "Medical Student", desc: "Clinical rotations, case studies, exams.", accent: "linear-gradient(135deg, #7c3aed, #8b5cf6)" },
  ];
  const cardsHtml = roles.map(r => `
    <form action="/set-role" method="POST" class="role-card" style="--role-accent:${r.accent}">
      <input type="hidden" name="role" value="${r.id}">
      <span class="role-icon">${r.icon}</span><h3>${r.title}</h3><p>${r.desc}</p>
      <input type="submit" value="Select ${r.title}">
    </form>`).join("");
  return layout("Select Your Role", `<div class="header"><div class="logo">👤</div><h1>Welcome, ${escapeHtml(account.name || account.username)}!</h1><p class="subtitle">Select your role to access your personalized dashboard</p></div><div class="role-grid">${cardsHtml}</div>`, account);
}

// ====== DASHBOARD HELPERS ======
function dashboardLayout(account, config) {
  const { roleLabel, roleIcon, cssClass, stats, actions, activities } = config;
  const statsHtml = stats.map((s, i) => `<div class="stat-card" style="animation-delay:${i * 0.08}s"><span class="stat-icon">${s.icon}</span><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`).join("");
  const actionsHtml = actions.map(a => `<a class="action-btn" href="#"><span class="action-icon">${a.icon}</span>${a.label}</a>`).join("");
  const activitiesHtml = activities.map(a => `<li class="activity-item"><span class="activity-icon">${a.icon}</span><span>${a.text}</span><span class="activity-time">${a.time}</span></li>`).join("");
  return layout(`${roleLabel} Dashboard`, `
    <div class="dash-nav"><a class="btn btn-secondary btn-sm" href="/">← Hub</a><a class="change-role-link" href="/select-role">🔄 Change Role</a></div>
    <div class="dash-welcome ${cssClass}"><h1>${roleIcon} Welcome back, ${escapeHtml(account.name || account.username)}</h1><p>Your ${roleLabel.toLowerCase()} dashboard</p><span class="dash-role-badge">${roleIcon} ${roleLabel}</span></div>
    <div class="stats-row">${statsHtml}</div>
    <div class="card"><div class="card-title"><span class="icon">⚡</span>Quick Actions</div><div class="actions-grid">${actionsHtml}</div></div>
    <div class="card" style="animation-delay:0.1s"><div class="card-title"><span class="icon">📋</span>Recent Activity</div><ul class="activity-list">${activitiesHtml}</ul></div>
  `, account);
}

function renderDoctorDashboard(account, claims) {
  if (!account) return layout("Doctor Dashboard", `${backBtn()}<div class="card"><p style="color:var(--text-secondary)">Please <a href="/login" style="color:#60a5fa">sign in</a>.</p></div>`, null);
  return dashboardLayout(account, { role: "doctor", roleLabel: "Doctor", roleIcon: "🩺", cssClass: "dash-doctor", stats: [{ icon: "👥", value: "12", label: "Patient Queue" }, { icon: "📅", value: "8", label: "Appointments" }, { icon: "🧪", value: "5", label: "Lab Reports" }, { icon: "💊", value: "15", label: "Prescriptions" }], actions: [{ icon: "📅", label: "View Schedule" }, { icon: "📁", label: "Patient Records" }, { icon: "📝", label: "Write Prescription" }, { icon: "🧪", label: "Lab Results" }], activities: [{ icon: "✅", text: "Completed consultation with Patient #1042", time: "10 min ago" }, { icon: "🧪", text: "Lab report ready for Patient #0987", time: "25 min ago" }, { icon: "💊", text: "Prescription sent to pharmacy", time: "1 hr ago" }] });
}
function renderConsultantDashboard(account, claims) {
  if (!account) return layout("Consultant Dashboard", `${backBtn()}<div class="card"><p style="color:var(--text-secondary)">Please <a href="/login" style="color:#60a5fa">sign in</a>.</p></div>`, null);
  return dashboardLayout(account, { role: "consultant", roleLabel: "Consultant", roleIcon: "💼", cssClass: "dash-consultant", stats: [{ icon: "📊", value: "6", label: "Active Projects" }, { icon: "🤝", value: "4", label: "Client Meetings" }, { icon: "📝", value: "9", label: "Pending Reviews" }, { icon: "📄", value: "3", label: "Reports Due" }], actions: [{ icon: "📊", label: "View Projects" }, { icon: "👥", label: "Client Portal" }, { icon: "📝", label: "Submit Review" }, { icon: "📄", label: "Generate Report" }], activities: [{ icon: "📊", text: "Project Alpha milestone completed", time: "15 min ago" }, { icon: "🤝", text: "Client meeting scheduled with Acme Corp", time: "30 min ago" }, { icon: "📝", text: "Review submitted for Q4 proposal", time: "1 hr ago" }] });
}
function renderStudentDashboard(account, claims) {
  if (!account) return layout("Student Dashboard", `${backBtn()}<div class="card"><p style="color:var(--text-secondary)">Please <a href="/login" style="color:#60a5fa">sign in</a>.</p></div>`, null);
  return dashboardLayout(account, { role: "student", roleLabel: "Student", roleIcon: "🎓", cssClass: "dash-student", stats: [{ icon: "📚", value: "5", label: "Courses" }, { icon: "📝", value: "3", label: "Assignments Due" }, { icon: "⭐", value: "3.8", label: "GPA" }, { icon: "⏰", value: "24", label: "Study Hours" }], actions: [{ icon: "📚", label: "My Courses" }, { icon: "📝", label: "Submit Assignment" }, { icon: "📖", label: "Library" }, { icon: "👥", label: "Study Groups" }], activities: [{ icon: "📝", text: "Assignment submitted — Data Structures Lab 5", time: "20 min ago" }, { icon: "📚", text: "New lecture uploaded — Algorithms Week 8", time: "1 hr ago" }, { icon: "⭐", text: "Grade posted — OS: A-", time: "3 hrs ago" }] });
}
function renderMedicalStudentDashboard(account, claims) {
  if (!account) return layout("Medical Student Dashboard", `${backBtn()}<div class="card"><p style="color:var(--text-secondary)">Please <a href="/login" style="color:#60a5fa">sign in</a>.</p></div>`, null);
  return dashboardLayout(account, { role: "medical-student", roleLabel: "Medical Student", roleIcon: "🔬", cssClass: "dash-medstudent", stats: [{ icon: "🏥", value: "3", label: "Rotations" }, { icon: "📋", value: "12", label: "Case Studies" }, { icon: "📝", value: "2", label: "Exams" }, { icon: "🔬", value: "4", label: "Research Papers" }], actions: [{ icon: "🏥", label: "Rotation Schedule" }, { icon: "📋", label: "Case Library" }, { icon: "📝", label: "Exam Prep" }, { icon: "🔬", label: "Research Portal" }], activities: [{ icon: "🏥", text: "Clinical rotation — Cardiology Ward 3B", time: "30 min ago" }, { icon: "📋", text: "New case study — Acute MI", time: "1 hr ago" }, { icon: "📝", text: "Practice exam — Pathology: 87%", time: "2 hrs ago" }] });
}

// ====== ERROR PAGE ======
function renderError(title, err) {
  return layout("Error", `
    <div class="header"><div class="logo">⚠️</div><h1>Authentication Error</h1></div>
    <div class="error-card">
      <h2 style="margin-bottom:10px;">${escapeHtml(title)}</h2>
      <p style="color:#fca5a5;">${escapeHtml(err?.message || String(err))}</p>
      <div class="token-block" style="text-align:left;margin-top:12px;"><pre>${escapeHtml(err?.stack || "")}</pre></div>
      <a class="btn btn-primary" href="/" style="margin-top:20px;">← Back to Home</a>
    </div>
  `, null);
}

module.exports = {
  renderLanding, renderProfile, renderTokens, renderAuthFlows,
  renderPermissions, renderConditionalAccess, renderAppRegistrations,
  renderGraphExplorer, renderSecurity, renderError, escapeHtml,
  renderRoleSelector, renderDoctorDashboard, renderConsultantDashboard,
  renderStudentDashboard, renderMedicalStudentDashboard,
  renderAuthorization, renderStepUpAuth, renderCriticalReport,
};
