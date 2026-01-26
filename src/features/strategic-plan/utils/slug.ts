/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string, suffix?: string): string {
  const baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 70);

  return suffix ? `${baseSlug}-${suffix}` : baseSlug;
}
