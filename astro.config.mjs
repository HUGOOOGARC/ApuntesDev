import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Es obligatorio poner el https://
  site: 'https://www.apuntesdev.com', 
  integrations: [
    preact(), 
    sitemap()
  ],
});