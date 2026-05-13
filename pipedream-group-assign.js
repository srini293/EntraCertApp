// ============================================================
// PIPEDREAM WORKFLOW: Custom Authentication Extension
// Auto-Assign User to Entra External ID Group
// ============================================================
//
// This code handles the TokenIssuanceStart event from
// Entra External ID Custom Authentication Extensions.
//
// When Entra issues a token (sign-up or login), it calls this
// webhook. The code assigns the user to a security group
// and returns custom claims to the token.
//
// PIPEDREAM ENV VARS REQUIRED:
//   - GRAPH_CLIENT_ID      → App registration for Graph API calls
//   - GRAPH_CLIENT_SECRET   → Client secret for Graph API calls
//   - GRAPH_TENANT_ID       → Entra External ID Tenant ID
//   - TARGET_GROUP_ID       → Security group Object ID
//
// ENTRA API PERMISSIONS (Application, Admin Consent):
//   - GroupMember.ReadWrite.All
//   - User.Read.All
//
// ============================================================

export default defineComponent({
  async run({ steps, $ }) {
    // ─── Configuration ───
    const TENANT_ID = process.env.GRAPH_TENANT_ID;
    const CLIENT_ID = process.env.GRAPH_CLIENT_ID;
    const CLIENT_SECRET = process.env.GRAPH_CLIENT_SECRET;
    const GROUP_ID = process.env.TARGET_GROUP_ID;

    // ─── Parse the Entra Custom Auth Extension request ───
    const body = steps.trigger.event.body;

    // Entra sends user info in data.authenticationContext.user
    const eventData = body?.data;
    const user = eventData?.authenticationContext?.user;
    const userId = user?.id;                    // User's Object ID (OID)
    const userEmail = user?.mail || user?.userPrincipalName || "";
    const displayName = user?.displayName || "";

    console.log(`📥 TokenIssuanceStart event received`);
    console.log(`� User: ${displayName} (${userEmail}), OID: ${userId}`);

    // ─── Validate ───
    if (!userId) {
      console.error("❌ No user ID found in the request");
      // Return valid response even on error (Entra expects this format)
      await $.respond({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            "@odata.type": "microsoft.graph.onTokenIssuanceStartResponseData",
            actions: [
              {
                "@odata.type": "microsoft.graph.tokenIssuanceStart.provideClaimsForToken",
                claims: {
                  groupAssigned: "false",
                  groupAssignmentError: "No user ID in request",
                },
              },
            ],
          },
        }),
      });
      return;
    }

    if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET || !GROUP_ID) {
      console.error("❌ Missing environment variables");
      await $.respond({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            "@odata.type": "microsoft.graph.onTokenIssuanceStartResponseData",
            actions: [
              {
                "@odata.type": "microsoft.graph.tokenIssuanceStart.provideClaimsForToken",
                claims: {
                  groupAssigned: "false",
                  groupAssignmentError: "Server misconfigured",
                },
              },
            ],
          },
        }),
      });
      return;
    }

    try {
      // ─── Step 1: Acquire Graph API token ───
      console.log("🔑 Acquiring app-only token...");

      const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
      const tokenBody = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
      });

      const tokenRes = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: tokenBody.toString(),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error("❌ Token error:", tokenRes.status, errText);
        await $.respond({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              "@odata.type": "microsoft.graph.onTokenIssuanceStartResponseData",
              actions: [
                {
                  "@odata.type": "microsoft.graph.tokenIssuanceStart.provideClaimsForToken",
                  claims: {
                    groupAssigned: "false",
                    groupAssignmentError: "Token acquisition failed",
                  },
                },
              ],
            },
          }),
        });
        return;
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      console.log("✅ Token acquired");

      // ─── Step 2: Add user to group ───
      console.log(`👥 Adding user ${userId} to group ${GROUP_ID}...`);

      const graphUrl = `https://graph.microsoft.com/v1.0/groups/${GROUP_ID}/members/$ref`;
      const graphRes = await fetch(graphUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          "@odata.id": `https://graph.microsoft.com/v1.0/directoryObjects/${userId}`,
        }),
      });

      // ─── Build response based on result ───
      let groupAssigned = "false";
      let groupMessage = "";

      if (graphRes.status === 204) {
        groupAssigned = "true";
        groupMessage = "User added to group successfully";
        console.log(`✅ User ${userId} added to group ${GROUP_ID}`);
      } else {
        const errText = await graphRes.text();
        if (errText.includes("already exist")) {
          groupAssigned = "true";
          groupMessage = "User already a member";
          console.log(`ℹ️ User ${userId} already in group ${GROUP_ID}`);
        } else {
          groupAssigned = "false";
          groupMessage = `Graph error: ${graphRes.status}`;
          console.error(`❌ Graph error: ${graphRes.status}`, errText);
        }
      }

      // ─── Step 3: Return claims to Entra ───
      // Entra expects this exact response format for TokenIssuanceStart
      await $.respond({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            "@odata.type": "microsoft.graph.onTokenIssuanceStartResponseData",
            actions: [
              {
                "@odata.type": "microsoft.graph.tokenIssuanceStart.provideClaimsForToken",
                claims: {
                  groupAssigned: groupAssigned,
                  assignedGroupId: GROUP_ID,
                  groupAssignmentMessage: groupMessage,
                },
              },
            ],
          },
        }),
      });

      console.log("✅ Response sent to Entra with claims");

    } catch (err) {
      console.error("❌ Unexpected error:", err.message);
      await $.respond({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            "@odata.type": "microsoft.graph.onTokenIssuanceStartResponseData",
            actions: [
              {
                "@odata.type": "microsoft.graph.tokenIssuanceStart.provideClaimsForToken",
                claims: {
                  groupAssigned: "false",
                  groupAssignmentError: err.message,
                },
              },
            ],
          },
        }),
      });
    }
  },
});
