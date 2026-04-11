/**
 * Same-origin URL that rewrites to Supabase Storage (see next.config.js rewrites).
 * Avoids exposing https://*.supabase.co/... in the page HTML.
 */
export function mediaUrlFromStoragePath(storagePath: string): string {
  const trimmed = storagePath.replace(/^\/+/, "");
  const segments = trimmed.split("/").filter(Boolean).map(encodeURIComponent);
  return `/media/portfolio/${segments.join("/")}`;
}
