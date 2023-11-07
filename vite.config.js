import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@/': resolve(__dirname, 'src') + '/'
    }
  },
  base: './',
  publicDir:  resolve(__dirname, 'public'),
  css:{
    preprocessorOptions:{
      scss:{
        additionalData: '@import "@/assets/style/main.scss";'
      }
    }
  },
  server:{
    proxy:{
      '/api': 'https://300report.jumpw.com'
    },
    cors: true
  }
})
