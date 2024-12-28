import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [preact()],
  assetsInclude: ['**/*.md'],
  server: {
    port: 3333,
  },
})
