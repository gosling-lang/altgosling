import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
    },
  },
  resolve: {
    alias: {
      '@alt-gosling': path.resolve(__dirname, './src'),
      '@alt-gosling/alt-gosling-schema': path.resolve(__dirname, './src/schema/modules/alt-gosling-schema.ts'),
    },
  },
  plugins: [react()],
  base: '/altgosling',
  server: {
    open: 'index.html'
  }
})
