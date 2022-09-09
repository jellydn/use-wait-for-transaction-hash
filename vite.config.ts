// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
