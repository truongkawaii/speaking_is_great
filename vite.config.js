import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base tương đối để chạy được cả khi host ở thư mục con (GitHub Pages: /<repo>/).
  base: './',
  plugins: [react()],
})
