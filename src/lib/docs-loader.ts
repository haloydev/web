import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob as globFn } from 'tinyglobby';
import type { Loader } from 'astro/loaders';
import matter from 'gray-matter';
import { mdxToMarkdown } from './mdx-to-markdown';

type DocsLoaderOptions = {
  pattern: string;
  base: string;
};

/**
 * Custom loader that reads MDX/MD files and writes plain markdown to static files.
 * Markdown files are written to public/markdown/docs/[slug].md for on-demand fetching.
 */
export function docsLoader({ pattern, base }: DocsLoaderOptions): Loader {
  return {
    name: 'docs-loader',
    load: async (context) => {
      const { logger, parseData, store, generateDigest } = context;

      // Clear any existing entries from previous builds
      store.clear();

      // Resolve the base directory relative to the project root
      const baseDir = fileURLToPath(new URL(base, context.config.root));
      const rootDir = fileURLToPath(context.config.root);

      // Directory for static markdown files
      const markdownDir = join(rootDir, 'public', 'markdown', 'docs');
      await mkdir(markdownDir, { recursive: true });

      // Find all matching files
      const files = await globFn(pattern, { cwd: baseDir, absolute: true });

      logger.info(`Found ${files.length} docs files`);

      for (const absolutePath of files) {
        const content = await readFile(absolutePath, 'utf-8');
        const { data: frontmatter, content: body } = matter(content);

        // Generate a unique ID from the relative path to base
        const id = relative(baseDir, absolutePath);

        // File path relative to project root (required by Astro)
        const filePath = relative(rootDir, absolutePath);

        // Compute the plain markdown and write to static file
        const plainMarkdown = mdxToMarkdown(content);
        const slug = frontmatter.slug as string;
        if (slug) {
          const markdownPath = join(markdownDir, `${slug}.md`);
          await writeFile(markdownPath, plainMarkdown, 'utf-8');
        }

        // Parse and validate the data against the schema
        const data = await parseData({
          id,
          data: frontmatter,
          filePath,
        });

        // Generate a digest for change detection
        const digest = generateDigest(content);

        // Store the entry with deferredRender so Astro compiles the MDX
        store.set({
          id,
          data,
          body,
          filePath,
          digest,
          deferredRender: true,
        });
      }

      logger.info(`Wrote ${files.length} markdown files to public/markdown/docs/`);
    },
  };
}
