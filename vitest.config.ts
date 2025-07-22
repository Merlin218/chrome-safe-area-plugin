import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', 'build'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        'build/',
        '*.config.{js,ts}',
        'types/',
        'scripts/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@types': resolve(__dirname, 'types')
    }
  }
}); 