import "server-only";
import sanitizeHtml from "sanitize-html";

/** Keep merchant copy and measurements; discard scripts, embeds and theme styling. */
export function productContent(html: string) {
  const safe = sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "a", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption"],
    allowedAttributes: { a: ["href", "title"], th: ["scope", "colspan", "rowspan"], td: ["colspan", "rowspan"] },
    allowedSchemes: ["https", "http", "mailto"],
    allowProtocolRelative: false,
    exclusiveFilter: (frame) => frame.tag === "p" && !frame.text.trim(),
  });
  // Operates only on sanitized, normalized markup; tables retain their full contents.
  const tables = safe.match(/<table>[\s\S]*?<\/table>/g) ?? [];
  return { description: safe.replace(/<table>[\s\S]*?<\/table>/g, ""), measurements: tables.join("") };
}
