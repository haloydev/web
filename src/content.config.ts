import { defineCollection, reference, z } from 'astro:content';

import { glob, file } from 'astro/loaders';

const docSections = defineCollection({
  loader: file('./src/data/docs/sections.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
  }),
});

const docPages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/docs' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    section: reference('docSections'),
  }),
});

export const collections = { docSections, docPages };
