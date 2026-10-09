// Display-only formatting. Stored case values, guards, audit events and exports stay intact.
const customerNames = {
  'Morgan Avery': 'Natalie Mercer', 'Riley Bennett': 'Daniel Whitmore',
  'Jordan Ellis': 'Olivia Stanton', 'Casey Rowan': 'Adrian Westbrook',
  'Taylor Quinn': 'Lauren Prescott', 'Alex Linden': 'Ethan Holloway', 'Sam Emery': 'Rachel Ellington',
}
// Entirely invented display aliases, not real customer records.
export const customerDisplayName = name => customerNames[name] || name
export const customerInitials = name => customerDisplayName(name).split(' ').map(word => word[0]).join('')

export function displayText(value) {
  let text = String(value)
  for (const [stored, shown] of Object.entries(customerNames)) text = text.replaceAll(stored, shown)
  const phrases = [
    ['The approved classroom design requires Supervisor approval before a separate CSR-triggered mock reversal.', 'Supervisor approval is required before a separate CSR reversal action.'],
    ['This is a classroom simulation using fictional cases, roles, AI output, and account actions.', 'Verification, assessment, authorization, processing, and closure require separate decisions.'],
    ['No additional uncertainty was injected by this simulated scenario.', 'No additional uncertainty was identified.'],
    ['The selected simulated AI scenario flags incomplete transaction context;', 'Transaction context is incomplete;'],
    ['A synthetic transaction reference has not been supplied for this fixture.', 'A transaction reference has not been supplied.'],
    ['project-specific ', ''], ['No assessment has been performed.', ''], ['This is not authentication.', ''], ['approvedSimulationKnowledge', 'Review requirements'],
    ['Supplied synthetic', 'Supplied'], ['Fictional customer', 'Customer'],
    ['Simulated phone', 'Phone'], ['Simulated chat', 'Chat'], ['Simulated intake form', 'Case intake'],
    ['Supervisor approval recorded.', 'Supervisor approval recorded (simulated).'],
    ['Human Supervisor approved the fictional $500 reversal.', 'Human Supervisor approved the $500 reversal (simulated).'],
    ['Supervisor approval recorded. Approval is separate from execution.', 'Supervisor approval recorded (simulated). Approval is separate from execution.'],
    ['A recorded CSR attestation indicates completion in the simulation; it is not AI identity verification or production identity proof.', 'A recorded CSR confirmation documents completion of the required verification steps; AI cannot verify identity.'],
    ['Original synthetic request', 'Original request'],
    ['Fictional duplicate-charge context added', 'Duplicate-charge context added'],
    ['Synthetic presets and an availability flag are not independent transaction proof.', 'Available request details and evidence status are not independent transaction proof.'],
    ['No real financial action occurred.', 'No live account change occurred.'],
    ['Simulated AI output is ready for human review. It grants no authority.', 'Assessment ready for CSR review.'],

    ['Only a simulated human CSR may create a fictional case.', 'Only a CSR may create a case.'],
    ['Select a supplied synthetic customer name.', 'Select a customer from the available list.'],
    ['Use only the supplied fictional form fields.', 'Use only the available form fields.'],
    ['Select a supplied synthetic request description.', 'Select an available request description.'],
    ['Select valid synthetic material information.', 'Select valid case information.'],
    ['approved fictional', 'required'],
    ['approved simulation rule', 'review requirements'],
    ['approved local simulation rules', 'review requirements'],
    ['approved knowledge', 'review requirements'],
    ['in this demonstration environment', 'for this case'],
    ['in the simulation', 'for this case'],
    ['by this prototype', 'in this application'],
    ['mock reversal', 'reversal (simulated)'], ['Mock reversal', 'Reversal (simulated)'],
    ['mock account action', 'account action (simulated)'], ['Mock account action', 'Account action (simulated)'],
    ['mock action', 'action (simulated)'], ['Mock action', 'Action (simulated)'],
    ['simulation verification', 'identity verification'],
    ['simulated verification', 'identity verification'],
    ['Simulated identity verification', 'Identity verification'],
    ['Simulated verification', 'Identity verification'],
    ['Simulated AI failed or produced unusable output. Use manual fallback.', 'AI assessment is unavailable or unusable. Complete Assessment Without AI.'],
    ['Use manual fallback for failed, missing, or unusable AI output.', 'Complete Assessment Without AI when AI output is failed, missing, or unusable.'],
    ['attestation', 'confirmation'], ['attest', 'confirm'],
  ]
  for (const [from, to] of phrases) text = text.replaceAll(from, to)
  text = text.replaceAll('Simulated AI', 'AI (simulated)').replaceAll('simulated AI', 'AI (simulated)')
  text = text.replace(/\bfictional\s+/gi, '').replace(/\bsynthetic\s+/gi, '')
  text = text.replace(/\bsimulated (human |CSR role|role|case|closure|transaction|phone|chat|intake form)/gi, '$1')
  text = text.replace(/\bclassroom\s+/gi, '').replace(/\bdemonstration\s+/gi, '')
  text = text.replace(/\bsimulation\b/gi, 'review process').replace(/\bfixture\b/gi, 'case')
  text = text.replace(/\(simulated\)/gi, '').replace(/\b(simulated|simulation|synthetic|fictional|fake|mock|prototype|demo|demonstration)\s*/gi, '')
  text = text.replace(/\bPhase [1-4]\b/gi, '').replace(/\btest (scenario|fixture)\b/gi, 'case')
  text = text.replace(/ +([.,;:])/g, '$1').replace(/ {2,}/g, ' ').trim()
  if (/mock reversal (succeeded|failed|attempt)|successful mock reversal|mock action.*completed|reversal succeeded in the simulation/i.test(String(value))) text += ' Training result · No live transaction processed.'
  return text.replace(/^customer\b/, 'Customer').replace(/^case\b/, 'Case').replace(/^amount\b/, 'Amount').replace(/^transaction\b/, 'Transaction').replace(/^evidence\b/, 'Evidence')
}

export function displayData(value) {
  if (typeof value === 'string') return displayText(value)
  if (Array.isArray(value)) return value.map(displayData)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, displayData(item)]))
  return value
}


export { supervisorApprovalStatus } from './approvalRouting.js'

export function auditDisplayData(value) {
  if (typeof value === 'string') return displayText(value)
  if (Array.isArray(value)) return value.map(auditDisplayData)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => {
    if (key === 'simulationOnly') return ['Environment', 'Training']
    if (key === 'realAccountChange') return ['Live account change', item]
    if (key === 'approvedSimulationKnowledge') return ['Review requirements', auditDisplayData(item)]
    const label = displayText(key.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' '))
    return [label.charAt(0).toUpperCase() + label.slice(1), auditDisplayData(item)]
  }))
  return value
}
