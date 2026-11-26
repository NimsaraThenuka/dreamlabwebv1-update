import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://dreamlabltd.jp',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory'
  }
});
