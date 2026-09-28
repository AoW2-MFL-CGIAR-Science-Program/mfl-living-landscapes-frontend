import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  site: 'https://mosaic-mfl.github.io',
  base: '/website',
  output: 'static',
  integrations: [react()],
})
