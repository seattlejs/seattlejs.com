import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/seattlejs.com/',
  publicDir: 'public',
  plugins: [preact()],
  assetsInclude: ['**/*.md'],
})
