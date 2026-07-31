/**
 * Single source of truth for the allowed admin email.
 *
 * Set ADMIN_EMAIL in the environment to lock admin access to a specific
 * address. The default below is only a development fallback — production
 * deployments should always set ADMIN_EMAIL explicitly.
 */
const DEFAULT_ADMIN_EMAIL = "sneha@gmail.com";

export function getAllowedAdminEmail(): string {
  return process.env.ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL;
}

/** Case-insensitive check that a signed-in user's email is the admin. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === getAllowedAdminEmail().toLowerCase();
}
