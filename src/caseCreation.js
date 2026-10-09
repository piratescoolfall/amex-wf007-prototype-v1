import { createCases, transition } from './workflow.js'

export const syntheticCustomers = ['Casey Rowan', 'Taylor Quinn', 'Alex Linden', 'Sam Emery']
export const requestTypes = ['Reversal request', 'Statement explanation request', 'Transaction inquiry']
export const descriptions = {
  'Reversal request': ['Fictional customer requests a $500 synthetic transaction reversal.', 'Fictional customer reports a duplicate $500 synthetic charge.'],
  'Statement explanation request': ['Fictional customer requests an explanation of a synthetic statement entry.'],
  'Transaction inquiry': ['Fictional customer requests clarification of a synthetic transaction description.'],
}
export const fictionalAmounts = ['25.00', '100.00', '500.00']

export function nextSyntheticId(cases) {
  let number = 4
  const ids = new Set(cases.map(item => item.id))
  while (ids.has(`SYN-007-${String(number).padStart(3, '0')}`)) number += 1
  return `SYN-007-${String(number).padStart(3, '0')}`
}
export const transactionReference = id => `SYN-TXN-${id.slice(4)}`

export function createCase(cases, role, input = {}, timestamp = new Date().toISOString()) {
  const reject = message => ({ blocked: true, message })
  if (role !== 'CSR') return reject('Only a simulated human CSR may create a fictional case.')
  if (!input || typeof input !== 'object' || Object.keys(input).some(key => !['customer', 'requestType', 'amount', 'description'].includes(key))) return reject('Use only the supplied fictional form fields. Case IDs and transaction references are generated automatically.')
  if (!syntheticCustomers.includes(input.customer)) return reject('Select a supplied synthetic customer name.')
  if (!requestTypes.includes(input.requestType)) return reject('Select a supported fictional request type.')
  if (!descriptions[input.requestType].includes(input.description)) return reject('Select a supplied synthetic request description.')
  if (!fictionalAmounts.includes(input.amount) || (input.requestType === 'Reversal request' && input.amount !== '500.00')) return reject('Select a fictional amount. Reversal requests must be exactly $500.00.')
  const id = nextSyntheticId(cases)
  const reference = transactionReference(id)
  const item = {
    ...createCases()[0], id, customer: input.customer,
    initials: input.customer.split(' ').map(word => word[0]).join(''),
    subject: input.requestType === 'Reversal request' ? 'Fictional $500 reversal request' : input.requestType,
    category: input.requestType === 'Reversal request' ? 'Reversal request' : 'Information request',
    amount: `$${input.amount}`, channel: 'Simulated intake form',
    description: input.description, transactionReference: reference,
    audit: [{ id: `${id}-1`, caseId: id, timestamp, actor: 'CSR', revision: 1, type: 'case_created',
      details: { simulationOnly: true, customer: input.customer, requestType: input.requestType, amount: `$${input.amount}`, description: input.description, transactionReference: reference, status: 'open', verified: false } }],
  }
  return { blocked: false, item, message: `${id} created. Case is open and unverified; human CSR verification is required.` }
}

// Reducer allocates IDs against the latest queue, including back-to-back submissions.
export function caseStore(state, action) {
  if (action.type === 'notice') return { ...state, notice: action.notice }
  if (action.type === 'form') return { ...state, creating: action.open, notice: null }
  if (action.type === 'create') {
    const result = createCase(state.cases, action.role, action.input, action.timestamp)
    if (!result.blocked) return { cases: [...state.cases, result.item], notice: result, creating: false }
    // Invalid submitted values are never included in audit payloads.
    return { ...state, notice: result, cases: state.cases.map(item => item.id === action.caseId ? {
      ...item, audit: [...item.audit, { id: `${item.id}-${item.audit.length + 1}`, caseId: item.id,
        timestamp: action.timestamp, actor: ['CSR', 'Supervisor'].includes(action.role) ? action.role : 'Unknown simulated role',
        revision: item.revision, type: 'blocked_action', details: { action: 'create_case', reason: result.message } }],
    } : item) }
  }
  if (action.type === 'workflow') {
    const item = state.cases.find(item => item.id === action.caseId)
    const result = transition(item, action.role, action.action, action.payload)
    return { ...state, cases: state.cases.map(item => item.id === action.caseId ? result.item : item), notice: result }
  }
  return state
}
