import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/',
  plugins: [react()],
  // server: {
  //   host: true,
  // },
  build: {
    chunkSizeWarningLimit: 1000,
    // outDir: '../backend/build',
  }
})
