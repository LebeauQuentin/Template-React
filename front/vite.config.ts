import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  envDir: ".", // on remonte d'un dossier pour y trouver le fichier .env
  resolve: {
    alias: {
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@data': '/src/data',
      '@pages': '/src/pages',
      '@services': '/src/services',
    }

  }
})
