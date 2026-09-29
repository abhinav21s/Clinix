import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  test: {
    // Use jsdom to simulate a browser DOM environment
    environment: 'jsdom',
    // Run this file before each test suite (loads jest-dom matchers)
    setupFiles: ['./src/tests/setup.js'],
    // Make Vitest globals (describe, it, expect, vi) available without imports
    globals: true,
  },
});
