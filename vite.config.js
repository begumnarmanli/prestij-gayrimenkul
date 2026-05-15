import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-router': ['react-router-dom'],
          'leaflet':      ['leaflet', 'react-leaflet'],
          'chart':        ['chart.js'],
          'firebase':     ['firebase/app', 'firebase/firestore/lite', 'firebase/auth'],
          'redux':        ['@reduxjs/toolkit', 'react-redux'],
          'toastify':     ['react-toastify'],
        }
      }
    }
  }
})