/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' makes the build portable: dist/ works from any folder or host path.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { globals: true, environment: 'node' },
});
