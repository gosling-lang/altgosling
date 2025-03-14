import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, UserConfigFnObject } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    return {
      build: {
        rollupOptions: {
          input: {
            'index.html': 'index.html',
            'demo/index.tsx': 'demo/index.tsx',
            'index.ts': 'src/index.ts',
            'favicon.ico': 'favicon.ico',
          },
        },
      },
      base: '/altgosling/',
      plugins: [react()],
      resolve: {
        alias: {
          '@altgosling': path.resolve(__dirname, './src'),
          '@altgosling/alt-gosling-schema': path.resolve(__dirname, './src/schema/modules/alt-gosling-schema.ts'),
        },
      },
      server: {
        open: 'index.html'
      }
    };
  }
  if (mode === 'test') {
    return {
      resolve: {
        alias: {
          '@altgosling': path.resolve(__dirname, './src'),
          '@altgosling/alt-gosling-schema': path.resolve(__dirname, './src/schema/modules/alt-gosling-schema.ts'),
        },
      },
      test: {
        include: ['tests/**'],
        globals: true,
        environment: 'jsdom',
      },
      plugins: []
    };
  }
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
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    base: '/altgosling/',
    resolve: {
      alias: {
        '@altgosling': path.resolve(__dirname, './src'),
        '@altgosling/alt-gosling-schema': path.resolve(__dirname, './src/schema/modules/alt-gosling-schema.ts'),
      },
    },
    server: {
      open: 'index.html'
    }
  };
}) satisfies UserConfigFnObject;
