import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  site: 'https://aow2-mfl-cgiar-science-program.github.io',
  base: '/mfl-living-landscapes-frontend',
  output: 'static',
  integrations: [react()],
})
