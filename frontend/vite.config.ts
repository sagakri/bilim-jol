import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const siteBase = process.env.GITHUB_PAGES === 'true' ? '/bilim-jol/' : '/'

export default defineConfig({
  base: siteBase,
  define: { 'import.meta.env.BASE_URL': JSON.stringify(siteBase) },
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
  },
})
