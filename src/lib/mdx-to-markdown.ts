/**
 * Transforms MDX content to standard markdown by converting custom components
 * to their markdown equivalents.
 */

// The InstallHaloy component expands to this content
const INSTALL_HALOY_CONTENT = `**curl**
\`\`\`bash
curl -fsSL https://sh.haloy.dev/install-haloy.sh | sh
\`\`\`

**homebrew**
\`\`\`bash
brew install haloydev/tap/haloy
\`\`\`

**npm**
\`\`\`bash
npm i -g haloy
\`\`\`

**pnpm**
\`\`\`bash
pnpm add -g haloy
\`\`\`

**bun**
\`\`\`bash
bun add -g haloy
\`\`\``;

/**
 * Extract the code string from a Code component's code prop.
 * Handles both code="..." and code={`...`} formats.
 */
function extractCodeProp(codeTag: string): string {
  // Try template literal format: code={`...`}
  const templateMatch = codeTag.match(/code=\{\s*`([\s\S]*?)`\s*\}/);
  if (templateMatch) {
    return cleanCodeContent(templateMatch[1]);
  }

  // Try simple string format: code="..."
  const stringMatch = codeTag.match(/code="([^"]*)"/);
  if (stringMatch) {
    return stringMatch[1];
  }

  // Try single quotes: code='...'
  const singleQuoteMatch = codeTag.match(/code='([^']*)'/);
  if (singleQuoteMatch) {
    return singleQuoteMatch[1];
  }

  return '';
}

/**
 * Extract the lang prop from a Code component.
 */
function extractLangProp(codeTag: string): string {
  const match = codeTag.match(/lang="([^"]*)"/);
  return match ? match[1] : '';
}

/**
 * Clean up code content by removing leading/trailing whitespace
 * and normalizing indentation.
 */
function cleanCodeContent(code: string): string {
  // Split into lines
  const lines = code.split('\n');

  // Remove empty first and last lines
  while (lines.length > 0 && lines[0].trim() === '') {
    lines.shift();
  }
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  if (lines.length === 0) return '';

  // Find minimum indentation (excluding empty lines)
  const minIndent = lines
    .filter((line) => line.trim() !== '')
    .reduce((min, line) => {
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
      return Math.min(min, indent);
    }, Infinity);

  // Remove common indentation
  if (minIndent > 0 && minIndent !== Infinity) {
    return lines.map((line) => line.slice(minIndent)).join('\n');
  }

  return lines.join('\n');
}

/**
 * Convert a single <Code ... /> component to a fenced code block.
 */
function convertCodeComponent(codeTag: string): string {
  const code = extractCodeProp(codeTag);
  const lang = extractLangProp(codeTag);

  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

/**
 * Parse a CodeTabs block and convert to markdown with bold headers.
 */
function convertCodeTabs(codeTabsBlock: string): string {
  const result: string[] = [];

  // Extract tab triggers to get labels
  const triggerRegex =
    /<CodeTabTrigger\s+value="([^"]+)"[^>]*>([^<]*)<\/CodeTabTrigger>/g;
  const labels = new Map<string, string>();
  let triggerMatch;
  while ((triggerMatch = triggerRegex.exec(codeTabsBlock)) !== null) {
    labels.set(triggerMatch[1], triggerMatch[2].trim());
  }

  // Extract tab panels with their Code components
  const panelRegex =
    /<CodeTabPanel\s+value="([^"]+)"[^>]*>([\s\S]*?)<\/CodeTabPanel>/g;
  let panelMatch;
  while ((panelMatch = panelRegex.exec(codeTabsBlock)) !== null) {
    const value = panelMatch[1];
    const panelContent = panelMatch[2];

    // Find Code component within this panel
    const codeMatch = panelContent.match(/<Code[\s\S]*?\/>/);
    if (codeMatch) {
      const label = labels.get(value) || value;
      const codeBlock = convertCodeComponent(codeMatch[0]);
      result.push(`**${label}**\n${codeBlock}`);
    }
  }

  return result.join('\n\n');
}

/**
 * Remove MDX frontmatter (--- blocks at the start).
 */
function removeFrontmatter(content: string): string {
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n*/;
  return content.replace(frontmatterRegex, '');
}

/**
 * Remove import statements.
 */
function removeImports(content: string): string {
  // Remove single-line imports
  let result = content.replace(/^import\s+.*?;\s*$/gm, '');
  // Remove multi-line imports (rare but possible)
  result = result.replace(/^import\s+[\s\S]*?from\s+['"].*?['"];\s*$/gm, '');
  // Also handle imports without semicolons
  result = result.replace(/^import\s+.*?from\s+['"].*?['"]\s*$/gm, '');
  return result;
}

/**
 * Main transformation function: converts MDX to standard markdown.
 */
export function mdxToMarkdown(mdxContent: string): string {
  let content = mdxContent;

  // Step 1: Remove frontmatter
  content = removeFrontmatter(content);

  // Step 2: Remove imports
  content = removeImports(content);

  // Step 3: Replace <InstallHaloy /> with its content
  content = content.replace(/<InstallHaloy\s*\/>/g, INSTALL_HALOY_CONTENT);

  // Step 4: Convert CodeTabs blocks (must be done before individual Code components)
  const codeTabsRegex = /<CodeTabs[\s\S]*?<\/CodeTabs>/g;
  content = content.replace(codeTabsRegex, (match) => convertCodeTabs(match));

  // Step 5: Convert remaining standalone Code components
  // Match both self-closing and with closing tag
  const codeRegex = /<Code[\s\S]*?\/>/g;
  content = content.replace(codeRegex, (match) => convertCodeComponent(match));

  // Step 6: Remove any remaining JSX fragments
  content = content.replace(/<Fragment[^>]*>|<\/Fragment>/g, '');

  // Step 7: Clean up excessive newlines
  content = content.replace(/\n{3,}/g, '\n\n');

  // Step 8: Trim leading/trailing whitespace
  content = content.trim();

  return content;
}
