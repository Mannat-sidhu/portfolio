import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Live at https://mannat-sidhu.github.io/portfolio (GitHub Pages project site).
// For a custom domain later: set `site` to it and remove `base`.
export default defineConfig({
  site: 'https://mannat-sidhu.github.io',
  base: '/portfolio',
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
});
