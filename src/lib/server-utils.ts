import serialize from 'serialize-javascript';

/**
 * Safely stringifies JSON for inclusion in a <script> tag.
 * Uses serialize-javascript for comprehensive escaping.
 * This is server-only because serialize-javascript is a server-side dependency.
 */
export function sanitizeJsonForScript(json: unknown): string {
  return serialize(json, { isJSON: true });
}
