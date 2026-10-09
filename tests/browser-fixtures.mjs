import assert from 'node:assert/strict'
import { createCases } from '../src/workflow.js'
import { caseStore, descriptions, syntheticCustomers } from '../src/caseCreation.js'

// Browser-only response interception supplies fixtures to the unchanged App.
// No fixture URL, state setter, or bypass hook is added to application source.
export async function openMaterialFixture(page, { newCase = false, evidence = false, note = 'Original synthetic request' } = {}) {
  let state = { cases: createCases(), notice: null, creating: false }
  const timestamp = '2026-10-09T20:00:00.000Z'
  if (newCase) state = caseStore(state, {
    type: 'create', role: 'CSR', caseId: state.cases[0].id, timestamp,
    input: { customer: syntheticCustomers[0], requestType: 'Reversal request', amount: '500.00', description: descriptions['Reversal request'][0] },
  })
  const caseId = newCase ? state.cases.at(-1).id : state.cases[0].id
  const act = (action, payload = {}, role = 'CSR') => {
    state = caseStore(state, { type: 'workflow', caseId, role, action, payload })
    assert.equal(state.notice.blocked, false, state.notice.message)
  }
  act('verify', { attested: true })
  act('assess', { method: 'manual', reviewed: true })
  act('escalate')
  act('approve', { confirmed: true }, 'Supervisor')
  act('material', { evidence, note })
  const item = state.cases.find(item => item.id === caseId)
  assert.equal(item.verified, false)
  assert.equal(item.assessment, null)
  assert.equal(item.escalated, false)
  assert.equal(item.approval, null)
  assert.equal(item.revision, 2)
  assert.ok(item.audit.some(event => event.type === 'prior_authority_invalidated' && event.details.approvalInvalidated))
  const pattern = '**/src/App.jsx*'
  await page.route(pattern, async route => {
    const response = await route.fetch()
    const original = await response.text()
    assert.ok(original.includes('cases: createCases()'), 'App initial-state fixture insertion point exists')
    // Prevent a fixture response from becoming the next scenario's cached App.
    await route.fulfill({ response, headers: { ...response.headers(), 'cache-control': 'no-store' }, body: original.replace('cases: createCases()', `cases: ${JSON.stringify(state.cases)}`) })
  })
  try {
    await page.goto('http://localhost:5173')
    await page.getByRole('button', { name: `View case ${caseId}`, exact: true }).click()
  } finally {
    await page.unroute(pattern)
  }
  return item
}

export async function assertEvidenceSectionAbsent(page) {
  assert.equal(await page.getByRole('heading', { name: 'Case information & evidence', exact: true }).count(), 0)
  assert.equal(await page.getByLabel('Required synthetic identity').count(), 0)
  assert.equal(await page.getByLabel('Case context').count(), 0)
  assert.equal(await page.getByRole('button', { name: 'Save case information', exact: true }).count(), 0)
}

// Intercept the existing workflow module only in automated browser tests.
// Outcomes still pass through production guards and generate normal audit events.
export async function withAIOutcome(page, mode, run) {
  assert.ok(['uncertain', 'unusable', 'failed', 'unavailable'].includes(mode))
  const pattern = '**/src/workflow.js*'
  await page.route(pattern, async route => {
    const response = await route.fetch()
    const original = await response.text()
    const marker = 'const blocked = guard(item, role, action, payload)'
    assert.ok(original.includes(marker))
    await route.fulfill({ response, headers: { ...response.headers(), 'cache-control': 'no-store' },
      body: original.replace(marker, `if (action === 'ai') payload = { ...payload, mode: ${JSON.stringify(mode)} }; ${marker}`) })
  })
  try { await run() } finally { await page.unroute(pattern) }
}

export async function withReversalOutcome(page, outcome, run) {
  assert.ok(['success', 'failed'].includes(outcome))
  const pattern = '**/src/workflow.js*'
  await page.route(pattern, async route => {
    const response = await route.fetch()
    const original = await response.text()
    const marker = 'const blocked = guard(item, role, action, payload)'
    assert.ok(original.includes(marker))
    await route.fulfill({ response, headers: { ...response.headers(), 'cache-control': 'no-store' },
      body: original.replace(marker, `if (action === 'reverse') payload = { ...payload, outcome: ${JSON.stringify(outcome)} }; ${marker}`) })
  })
  try { await run() } finally { await page.unroute(pattern) }
}

export async function openRoutingFixture(page, exception) {
  assert.ok(['evidenceConflict', 'requiresAccountChange', 'unsupported'].includes(exception))
  const cases = createCases()
  if (exception === 'unsupported') cases[1].requestType = 'Unsupported request'
  else {
    const result = caseStore({ cases, notice: null, creating: false }, { type: 'workflow', caseId: cases[1].id, role: 'CSR', action: 'material', payload: { evidence: true, note: 'Original synthetic request', [exception]: true } })
    cases[1] = result.cases[1]
    assert.equal(result.notice.blocked, false)
  }
  const pattern = '**/src/App.jsx*'
  await page.route(pattern, async route => {
    const response = await route.fetch()
    const original = await response.text()
    assert.ok(original.includes('cases: createCases()'))
    await route.fulfill({ response, headers: { ...response.headers(), 'cache-control': 'no-store' }, body: original.replace('cases: createCases()', `cases: ${JSON.stringify(cases)}`) })
  })
  try { await page.goto('http://localhost:5173'); await page.getByRole('button', { name: `View case ${cases[1].id}`, exact: true }).click() } finally { await page.unroute(pattern) }
}
