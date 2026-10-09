import { evaluateApprovalRouting, hasCurrentRoutingApproval } from './approvalRouting.js'
// Approved fictional labels only. No identity secrets or challenge responses.
export const verificationMethods = ['Security questions', 'One-time verification code', 'Identity document review']
// Cycle deterministically by generated synthetic case number; never collect secrets.
export const assignedVerificationMethod = id => verificationMethods[(Number(id.split('-').at(-1)) - 1) % verificationMethods.length]
export const incompleteReasons = ['Required synthetic evidence unavailable', 'Fictional details could not be confirmed', 'Simulated verification interrupted']

export function hasValidVerification(item) {
  return item.verified === true && verificationMethods.includes(item.verificationMethod) && item.verificationRevision === item.revision
}
export function verificationStatus(item) {
  if (item.closureOutcome === 'incomplete-verification') return 'Incomplete'
  return hasValidVerification(item) ? 'Completed' : 'Not completed'
}
export function canAssess(item, role) {
  return role === 'CSR' && item.status === 'open' && item.disposition === 'active' && hasValidVerification(item) && item.evidence && !item.actionResult && !item.resolution
}
export function assessmentBlockReason(item, role) {
  if (item.status === 'closed') return 'This case is closed. Assessment is unavailable.'
  if (item.disposition !== 'active') return 'This case remains open for review; further resolution is unavailable.'
  if (role !== 'CSR') return 'Select the simulated CSR role to continue to assessment.'
  if (!hasValidVerification(item)) return 'Complete an approved fictional verification method and record explicit human CSR attestation before continuing.'
  if (!item.evidence) return 'Required synthetic evidence is unavailable; assessment cannot proceed.'
  if (item.actionResult) return 'The mock action has completed; only the eligible human closure step remains.'
  return ''
}
export function assessmentNextStep(item, role) {
  if (!canAssess(item, role) || item.assessment?.revision !== item.revision) return null
  const routing = evaluateApprovalRouting(item)
  if (routing.route === 'csr') return 'action'
  if (!item.escalated) return null
  if (routing.route === 'hold') return 'supervisor'
  return hasCurrentRoutingApproval(item) ? 'action' : 'supervisor'
}
