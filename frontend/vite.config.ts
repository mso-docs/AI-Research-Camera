import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: If deploying to https://<USER>.github.io/<REPO>/, set base to '/<REPO>/'
  // If deploying to a custom domain root, keep it '/'
  base: './', 
})