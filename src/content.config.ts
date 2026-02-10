import { defineCollection, reference, z } from 'astro:content';

import { file, glob } from 'astro/loaders';
import { docsLoader } from './lib/docs-loader';

const docSections = defineCollection({
  loader: file('./src/data/docs/sections.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
  }),
});

const docPages = defineCollection({
  loader: docsLoader({ pattern: '**/*.{md,mdx}', base: './src/data/docs' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    section: reference('docSections'),
  }),
});

const blogPosts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Anonymous'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
  }),
});

export const collections = { docSections, docPages, blogPosts };
