/** Simple HTML sanitizer — strips dangerous tags/attributes while keeping safe ones */
export function sanitizeHTML(html: string): string {
  // Remove script, iframe, object, embed tags and their content
  let out = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  out = out.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  out = out.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  out = out.replace(/<embed\b[^>]*>/gi, '');

  // Remove event handlers (onclick, onload, onerror, etc.)
  out = out.replace(/\s+on\w+\s*=\s*"[^"]*"/gi, '');
  out = out.replace(/\s+on\w+\s*=\s*'[^']*'/gi, '');
  out = out.replace(/\s+on\w+\s*=\s*\S+/gi, '');

  // Remove javascript: URLs
  out = out.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"');
  out = out.replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'");
  out = out.replace(/src\s*=\s*"javascript:[^"]*"/gi, '');
  out = out.replace(/src\s*=\s*'javascript:[^']*'/gi, '');

  return out;
}

/** Escape HTML entities to prevent XSS when inserting user text */
export function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
