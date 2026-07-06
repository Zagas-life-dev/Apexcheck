// Server-only environment access. Never import this from a Client Component.
// Values fall back to safe placeholders so the app boots without every service
// configured; helpers below report whether a given integration is actually live.

export const env = {
  mongodbUri: process.env.MONGODB_URI ?? "",
  mongodbDb: process.env.MONGODB_DB || "apexcheck",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "apexcheck",
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET ?? "dev-insecure-secret-change-me-in-production",
    adminEmail: process.env.ADMIN_EMAIL ?? "admin@apexcheck.local",
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH ?? "",
    // Dev-only plaintext fallback so the admin is reachable without setup.
    // In production, an unset password means login is disabled (secure default).
    adminPassword:
      process.env.ADMIN_PASSWORD ??
      (process.env.NODE_ENV === "production" ? "" : "admin1234"),
  },

  email: {
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    from: process.env.EMAIL_FROM || "Apexcheck <onboarding@resend.dev>",
    adminNotify:
      process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "",
  },

  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY ?? "",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
  },
};

export const isCloudinaryConfigured = (): boolean =>
  Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);

export const isEmailConfigured = (): boolean =>
  Boolean(env.email.resendApiKey && env.email.adminNotify);

export const isPaystackConfigured = (): boolean =>
  Boolean(env.paystack.secretKey && env.paystack.publicKey);
