import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'

const alias = {
  '@altgosling': path.resolve(__dirname, './src'),
  '@altgosling/alt-gosling-schema': path.resolve(__dirname, './src/schema/modules/alt-gosling-schema.ts'),
};

const demo = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
    },
  },
  resolve: { alias },
  plugins: [react()],
  base: '/altgosling',
  server: {
    open: 'index.html'
  }
});

const lib = defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'lib',
    minify: false,
    target: 'es2018',
    sourcemap: true,
    lib: {
      entry: {
        altgosling: path.resolve(__dirname, 'src/index.ts'),
        utils: path.resolve(__dirname, 'src/utils.ts')
      },
      formats: ['es'],
    },
  },
  resolve: { alias },

});

// https://vitejs.dev/config/
export default ({ mode }) => mode === 'lib' ? lib : demo;
