import { defineCollection, reference, z } from 'astro:content';

import { glob, file } from 'astro/loaders';

const docCategories = defineCollection({
  loader: file('./src/data/docs/categories.json'),
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
    category: reference('docCategories'),
  }),
});

export const collections = { docCategories, docPages };
