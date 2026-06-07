// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Canonical production URL — used for canonical <link>, Open Graph URLs, sitemap.
  site: 'https://riverbendhandymankc.com',
  // TEMPORARY (staging password gate): render pages on-demand so middleware runs on
  // every request. Astro middleware does NOT run on prerendered pages, so the Basic
  // Auth gate in src/middleware.ts needs this. Revert to remove `output` (back to
  // static/fast) once the password gate is no longer needed. See STACK.md.
  output: 'server',
  adapter: cloudflare({
    // Optimize images at BUILD time with sharp (static, resized files) instead of
    // the default runtime Cloudflare Images service. Guarantees small images on
    // any plan/host with no runtime dependency. See PROJECT_BRIEF.md §2 (images).
    imageService: 'compile',
  }),
});