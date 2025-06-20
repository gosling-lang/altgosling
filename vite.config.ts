import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, UserConfigFnObject } from 'vite';
import dts from 'vite-plugin-dts';

// common alias
const alias = {
  '@altgosling': path.resolve(__dirname, './src'),
  '@altgosling/alt-gosling-schema': path.resolve(__dirname, './src/schema/modules/alt-gosling-schema.ts')
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      build: {
        lib: {
          entry: {
            altgosling: path.resolve(__dirname, 'src/index.ts'),
            utils: path.resolve(__dirname, 'src/utils.ts')
          },
          fileName: (format, entryName) => `${entryName == 'altgosling' ? 'index' : entryName}.${format}.js`,
        },
        formats: ['es', 'cjs'],
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
      sourcemap: true,
      plugins: [dts({ insertTypesEntry: true })],
      base: '/altgosling/',
      resolve: { alias },
    };
  }
  if (mode === 'test') {
    return {
      resolve: { alias },
      test: {
        include: ['tests/**'],
        globals: true,
        environment: 'jsdom',
      },
      plugins: []
    };
  }
  return {
    build: { outDir: 'build-demo' },
    base: '/altgosling/',
    plugins: mode === 'demo' ? [react()] : [],
    resolve: { alias },
    server: {
      open: 'index.html'
    }
  };
}) satisfies UserConfigFnObject;
