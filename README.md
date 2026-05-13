# 🔐 OIDC Application – MS Identity Hub

A comprehensive **Microsoft Entra External ID** demo application built with Node.js, Express, and MSAL. This app demonstrates authentication, authorization, step-up MFA, and Microsoft Graph API integration using **OpenID Connect (OIDC)** and **OAuth 2.0**.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔑 **Sign-In / Sign-Up** | PKCE-secured Authorization Code flow with Entra External ID |
| 👤 **User Profile** | View identity claims and profile information |
| 🔍 **Token Inspector** | Decode and inspect ID tokens and access tokens |
| 🛡️ **Authorization** | App roles, group claims, role-gated UI demo |
| 🔐 **Step-Up Auth** | Re-trigger MFA on demand using `claims` parameter |
| 📡 **Graph Profile Editor** | Edit profile via PATCH /me, view group memberships |
| 🔄 **Auth Flows** | Visual guide to OAuth 2.0 grant types |
| 🔑 **Permissions** | Delegated vs application permissions explained |
| ⚡ **Conditional Access** | CA policies, MFA enforcement patterns |
| 🏰 **Security Practices** | Zero Trust, PKCE, secure token storage |

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/ujjwalsinha2002-create/OIDC-Application-code-2.git
cd OIDC-Application-code-2

# 2. Install dependencies
npm install

# 3. Configure credentials
cp .env.example .env
# Edit .env with your Entra External ID credentials

# 4. Start the app
npm start
# Open http://localhost:3005
```

## ⚙️ Configuration

Copy `.env.example` to `.env` and fill in your values:

```env
CLIENT_ID=your-application-client-id
CLIENT_SECRET=your-client-secret
TENANT_ID=your-directory-tenant-id
TENANT_NAME=your-tenant-subdomain
USE_CIAM=true
PORT=3005
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [CODE_EXPLANATION.md](./CODE_EXPLANATION.md) | Detailed code walkthrough – how MSAL, sessions, PKCE, Graph API, and step-up auth work |
| [ENTRA_SETUP_GUIDE.md](./ENTRA_SETUP_GUIDE.md) | Step-by-step Entra External ID configuration (app registration, permissions, roles, MFA) |

## 🏗️ Architecture

```
├── app.js                  # Express server, routes, MSAL auth, Graph API calls
├── pages.js                # HTML page renderers (10 identity concept pages)
├── styles.js               # CSS theme (glassmorphism, sidebar, responsive)
├── pipedream-group-assign.js # Pipedream custom auth extension workflow
├── package.json            # Dependencies
├── .env.example            # Environment template
├── CODE_EXPLANATION.md     # Code documentation
└── ENTRA_SETUP_GUIDE.md    # Entra portal setup guide
```

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Auth Library**: @azure/msal-node (Microsoft Authentication Library)
- **Identity Provider**: Microsoft Entra External ID
- **API**: Microsoft Graph API v1.0
- **Protocol**: OpenID Connect + OAuth 2.0 with PKCE

## 📝 License

MIT
