// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://haloy.dev',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  redirects: {
    '/docs': '/docs/quickstart',
  },
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), mdx()],
  markdown: {
    shikiConfig: {
      transformers: [],
    },
  },
});
