import { OAuth2Client } from "google-auth-library";

export function getGoogleConfig() {
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  return {
    clientId,
    enabled: clientId.length > 0,
  };
}

let oauthClient = null;

function getOAuthClient() {
  const { clientId } = getGoogleConfig();
  if (!clientId) return null;

  if (!oauthClient) {
    oauthClient = new OAuth2Client(clientId);
  }

  return oauthClient;
}

export async function verifyGoogleCredential(credential) {
  const client = getOAuthClient();
  if (!client) {
    throw new Error("Google Sign-In belum dikonfigurasi");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: getGoogleConfig().clientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.email || !payload.sub) {
    throw new Error("Token Google tidak valid");
  }

  if (payload.email_verified === false) {
    throw new Error("Email Google belum terverifikasi");
  }

  return {
    googleId: payload.sub,
    email: payload.email.trim().toLowerCase(),
    name: payload.name || payload.email.split("@")[0],
    picture: payload.picture || null,
  };
}
