// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'file:///home/irakli/Desktop/projects/movies_quotes/node_modules/vite/dist/node/index.js'
import vue from 'file:///home/irakli/Desktop/projects/movies_quotes/node_modules/@vitejs/plugin-vue/dist/index.mjs'
import VueDevTools from 'file:///home/irakli/Desktop/projects/movies_quotes/node_modules/vite-plugin-vue-devtools/dist/vite.mjs'
var __vite_injected_original_import_meta_url =
  'file:///home/irakli/Desktop/projects/movies_quotes/vite.config.ts'
var vite_config_default = defineConfig({
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', __vite_injected_original_import_meta_url))
    }
  }
})
export { vite_config_default as default }
