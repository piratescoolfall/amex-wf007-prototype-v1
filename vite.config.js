import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const codespaceHost = process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
  ? `${process.env.CODESPACE_NAME}-5173.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
  : null

export default defineConfig({
  plugins: [react()],
  server: { allowedHosts: codespaceHost ? [codespaceHost] : [] },
})
