/**
 * Client-side utilities for copying page content.
 * Fetches markdown from static files on-demand.
 */

// Cache for fetched markdown to avoid re-fetching
const markdownCache = new Map<string, string>();

/**
 * Get the page slug from the meta tag.
 */
function getPageSlug(): string | null {
  const meta = document.querySelector('meta[name="page-slug"]');
  return meta?.getAttribute('content') ?? null;
}

/**
 * Fetch the markdown content for the current page.
 * Results are cached in memory.
 */
async function fetchPageMarkdown(): Promise<string | null> {
  const slug = getPageSlug();
  if (!slug) {
    console.error('No page slug found');
    return null;
  }

  // Return cached result if available
  if (markdownCache.has(slug)) {
    return markdownCache.get(slug)!;
  }

  try {
    const response = await fetch(`/markdown/docs/${slug}.md`);
    if (!response.ok) {
      console.error(`Failed to fetch markdown: ${response.status}`);
      return null;
    }
    const markdown = await response.text();
    markdownCache.set(slug, markdown);
    return markdown;
  } catch (error) {
    console.error('Failed to fetch markdown:', error);
    return null;
  }
}

/**
 * Strip markdown syntax to get plain text.
 */
function markdownToPlainText(markdown: string): string {
  let text = markdown;

  // Remove code blocks (preserve content)
  text = text.replace(/```[\w]*\n([\s\S]*?)```/g, '$1');

  // Remove inline code
  text = text.replace(/`([^`]+)`/g, '$1');

  // Remove bold/italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');

  // Remove headers (keep text)
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');

  // Remove links (keep text)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, '');

  // Remove list markers
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');

  // Clean up excessive newlines
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

/**
 * Copy the page content as markdown to the clipboard.
 * Returns true if successful, false otherwise.
 */
export async function copyPageAsMarkdown(): Promise<boolean> {
  const markdown = await fetchPageMarkdown();
  if (!markdown) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(markdown);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Copy the page content as plain text to the clipboard.
 * Returns true if successful, false otherwise.
 */
export async function copyPageAsText(): Promise<boolean> {
  const markdown = await fetchPageMarkdown();
  if (!markdown) {
    return false;
  }

  const plainText = markdownToPlainText(markdown);

  try {
    await navigator.clipboard.writeText(plainText);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Get the page markdown content (for custom use).
 * Returns a promise that resolves to the markdown or null.
 */
export async function getPageMarkdown(): Promise<string | null> {
  return fetchPageMarkdown();
}
