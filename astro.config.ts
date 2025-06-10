import preact from '@astrojs/preact'
import { defineConfig } from 'astro/config'

import icon from 'astro-icon';

function setLayout() {
  return function (_, file) {
    file.data.astro.frontmatter.layout =
      file.data.astro.frontmatter.layout || '@/layouts/MarkdownLayout.astro'
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://seattlejs.com/',
  integrations: [preact(), icon()],
  markdown: {
    remarkPlugins: [setLayout],
  },
  server: {
    port: 3333,
  },
})