# Microsoft Entra External ID – Complete Setup Guide

> [!IMPORTANT]
> Follow **all steps** below to enable every feature of the MS Identity Hub demo app running on `http://localhost:3005`.

---

## Step 1: Create an Entra External ID Tenant (if not already done)

1. Go to [**Azure Portal**](https://portal.azure.com) → search **Microsoft Entra External ID**
2. Click **Get started** → **Create a new external tenant**
3. Set **Tenant name** (e.g. `mydemotenant`) and **Domain** (e.g. `mydemotenant.onmicrosoft.com`)
4. Note down your **Tenant Name** (e.g. `mydemotenant`) and **Tenant ID** from the Overview page

---

## Step 2: Register the Application

1. Go to [**entra.microsoft.com**](https://entra.microsoft.com) → switch to your External ID tenant
2. Navigate to **Applications → App registrations → + New registration**
3. Fill in:
   - **Name**: `ms-identity-hub-demo`
   - **Supported account types**: *Accounts in this organizational directory only*
   - **Redirect URI**: Platform = **Web**, URI = `http://localhost:3005/auth/redirect`
4. Click **Register**
5. From the **Overview** page, copy:
   - ✅ **Application (client) ID** → this is your `CLIENT_ID`
   - ✅ **Directory (tenant) ID** → this is your `TENANT_ID`

---

## Step 3: Create a Client Secret

1. In your app registration, go to **Certificates & secrets**
2. Click **+ New client secret**
   - **Description**: `demo-secret`
   - **Expires**: 6 months (or your preference)
3. Click **Add**
4. ⚠️ **Immediately copy the Value** (not the Secret ID) → this is your `CLIENT_SECRET`
   > You cannot see this value again after leaving this page!

---

## Step 4: Configure API Permissions

This enables Sign-in, Profile Editing, and Group Memberships.

1. Go to **API permissions → + Add a permission**
2. Select **Microsoft Graph → Delegated permissions**
3. Add these permissions (search one by one):

| Permission | Purpose in App |
|---|---|
| `openid` | Sign-in (OpenID Connect) |
| `profile` | Read user profile claims |
| `email` | Read user email |
| `User.Read` | Read user profile via Graph API |
| `User.ReadWrite` | **Edit profile** via Graph API (PATCH /me) |
| `GroupMember.Read.All` | **View group memberships** via Graph API |

4. Click **✅ Grant admin consent for [your tenant]** → Confirm
   > All permissions should show a green checkmark ✅

---

## Step 5: Create App Roles (for Authorization Page)

This enables the **Roles & Groups** (Authorization) page to show role-gated content.

1. Go to **App roles → + Create app role**
2. Create the **Admin** role:
   - **Display name**: `Admin`
   - **Allowed member types**: *Users/Groups*
   - **Value**: `Admin`
   - **Description**: `Full access to all features`
   - ✅ Enable this app role: checked
3. Click **Apply**
4. Create the **Reader** role:
   - **Display name**: `Reader`
   - **Allowed member types**: *Users/Groups*
   - **Value**: `Reader`
   - **Description**: `Read-only access`
   - ✅ Enable this app role: checked
5. Click **Apply**

### Assign Roles to Users

1. Go to **Enterprise applications** (in the left nav, not App registrations)
2. Find and click your app: `ms-identity-hub-demo`
3. Go to **Users and groups → + Add user/group**
4. Select a **User** → Select a **Role** (e.g. `Admin`) → **Assign**
5. Repeat for other users as needed

---

## Step 6: Enable Group Claims in Token (for Authorization Page)

This makes group IDs appear in the ID token.

1. Go back to **App registrations → your app → Token configuration**
2. Click **+ Add groups claim**
3. Select:
   - ✅ **Security groups**
   - Under **ID** token section: select **Group ID**
4. Click **Add**

---

## Step 7: Create a Security Group (for Group Memberships)

1. In Entra portal, go to **Groups → + New group**
2. Fill in:
   - **Group type**: Security
   - **Group name**: `Demo Users`
   - **Group description**: `Users of the MS Identity Hub demo`
   - **Membership type**: Assigned
3. Click **Create**
4. Open the group → **Members → + Add members** → add your test users
5. Copy the **Object ID** of the group (useful for Pipedream integration)

---

## Step 8: Configure User Flows (Sign-Up / Sign-In)

1. Go to **External Identities → User flows**
2. Click **+ New user flow**
3. Select **Sign up and sign in**
4. Configure:
   - **Name**: `signupsignin1`
   - **Identity providers**: ✅ Email + password (and optionally Google, etc.)
   - **User attributes**: Select `Display Name`, `Email Address`, `Given Name`, `Surname`
5. Click **Create**
6. Open the flow → **Applications → + Add application** → select your app `ms-identity-hub-demo`

---

## Step 9: Enable MFA (for Step-Up Auth Page)

### Option A: Via Conditional Access (Recommended)

1. Go to **Protection → Conditional Access → + Create new policy**
2. Configure:
   - **Name**: `Require MFA for Demo App`
   - **Users**: Select specific users or All users
   - **Target resources → Cloud apps**: Select `ms-identity-hub-demo`
   - **Grant → ✅ Require multifactor authentication**
3. Set policy to **On** → **Create**

### Option B: Via Authentication Methods

1. Go to **Protection → Authentication methods**
2. Enable **Microsoft Authenticator** or **SMS** (or both)
3. Ensure your test users have registered MFA methods at [mysignins.microsoft.com](https://mysignins.microsoft.com)

### Set Up Authentication Contexts (for Step-Up Auth)

1. Go to **Protection → Conditional Access → Authentication contexts**
2. Click **+ New authentication context**
   - **Name**: `Step-Up MFA`
   - **ID**: `c2`
   - **Description**: `Require MFA for sensitive operations`
3. Click **Save**

### Create a CA Policy for the Authentication Context

1. Go to **Protection → Conditional Access → Policies → + New policy**
2. **Name**: `Step-Up MFA Policy`
3. **Target resources**:
   - Click **What does this policy apply to?** → select **Authentication contexts**
   - ✅ Check **Step-Up MFA (c2)**
4. **Grant**:
   - Click **Grant access**
   - ✅ Check **Require multifactor authentication**
5. Set **Enable policy** → **On**
6. Click **Create**

> When the app requests `acrs: ["c2"]`, Entra matches it to this CA policy and forces MFA.

---

## Step 10: Configure the `.env` File

Update `c:\demo\.env` with your values:

```env
# Microsoft Entra External ID Configuration
CLIENT_ID=<your-application-client-id>
CLIENT_SECRET=<your-client-secret-value>
TENANT_ID=<your-directory-tenant-id>
TENANT_NAME=<your-tenant-name>
USE_CIAM=true
PORT=3005
```

| Variable | Where to Find |
|---|---|
| `CLIENT_ID` | App registrations → Overview → Application (client) ID |
| `CLIENT_SECRET` | App registrations → Certificates & secrets → Value |
| `TENANT_ID` | App registrations → Overview → Directory (tenant) ID |
| `TENANT_NAME` | Just the subdomain part, e.g. `mydemotenant` (without `.onmicrosoft.com`) |
| `USE_CIAM` | Set to `true` for External ID tenants |
| `PORT` | `3005` (must match your redirect URI) |

---

## Step 11: Restart & Test

```bash
cd c:\demo
npm start
```

Open `http://localhost:3005` and verify each feature:

| Feature | How to Test |
|---|---|
| **Sign In / Sign Up** | Click Sign In or Sign Up on the landing page |
| **User Profile** | After login → click User Profile in sidebar |
| **Token Inspector** | After login → click Token Inspector → see ID + Access token claims |
| **Authorization (Roles)** | After login → Roles & Groups → see your assigned app roles |
| **Authorization (Groups)** | After login → Roles & Groups → see group IDs from token |
| **Step-Up Auth** | After login → Step-Up Auth → click "Trigger Step-Up MFA" button |
| **Graph Profile Editor** | After login → Graph Profile Editor → edit fields → Save Changes |
| **Group Memberships** | After login → Graph Profile Editor → click "Load Groups" |

---

## Quick Reference: Entra Portal Locations

| Setting | Path in Entra Portal |
|---|---|
| App Registration | Applications → App registrations |
| Client Secret | App registrations → Certificates & secrets |
| API Permissions | App registrations → API permissions |
| App Roles | App registrations → App roles |
| Group Claims | App registrations → Token configuration |
| Role Assignment | Enterprise applications → Users and groups |
| Security Groups | Groups |
| User Flows | External Identities → User flows |
| MFA / CA Policies | Protection → Conditional Access |
| Auth Methods | Protection → Authentication methods |
