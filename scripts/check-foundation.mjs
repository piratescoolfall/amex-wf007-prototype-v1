import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

// Initial-render smoke check; does not substitute for browser interaction tests.
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})

try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const html = renderToStaticMarkup(createElement(App))
  for (const label of [
    'Demonstration environment', 'Synthetic data', 'Simulated actions',
    'Not affiliated with or authorized by American Express',
    '$500 reversal request', 'Identity Verification', 'AI-Assisted Assessment',
    'Supervisor Authorization', 'Action &amp; Closure', 'Audit History',
  ]) {
    assert.ok(html.includes(label), `Initial screen must include: ${label}`)
  }
  assert.equal((html.match(/Open · Unverified/g) || []).length, 3)
  assert.equal((html.match(/aria-label="View case SYN-/g) || []).length, 3)
  console.log('PASS: simulation banner, fictional $500 case, five navigation screens, three open/unverified cases.')
} finally {
  await server.close()
}
