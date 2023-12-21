import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@alt-gosling': path.resolve(__dirname, './src'),
      '@alt-gosling/alt-gosling-schema': path.resolve(__dirname, './src/schema/modules/alt-gosling-schema.ts'),
    },
  },
  plugins: [react()],
  server: {
    open: '/demo/index.html'
  }
})
