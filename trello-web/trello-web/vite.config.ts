import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        exportType: 'default',
      },
    }),
    react(),
  ],
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: [
      { find: '~', replacement: path.resolve(__dirname, './src') }
    ],
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled', '@mui/material']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          react: ['react', 'react-dom'],
          // MUI + emotion
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          // Dnd-kit
          dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities']
        }
      }
    }
  },
  server: {
    host: true, // Allow access from network (for mobile testing)
    port: 5173
  },
  optimizeDeps: {
    include: [
      '@mui/material/Tooltip',
      '@mui/icons-material',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled'
    ]
  }
})
