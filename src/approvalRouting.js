// Product Owner-approved project rules, not American Express policies.
// Edit and version this configuration through review; no dashboard policy editor.
export const approvalRoutingPolicy = Object.freeze({
  version: 'AMX-routing-1',
  routineRequestTypes: Object.freeze(['Statement explanation request', 'Transaction inquiry']),
  supervisorReversal: Object.freeze({ requestType: 'Reversal request', amountCents: 50000 }),
  exceptionAttributes: Object.freeze(['requiresAccountChange', 'evidenceConflict']),
})

export function evaluateApprovalRouting(item, policy = approvalRoutingPolicy) {
  const route = (ruleId, routeType, reason) => ({ policyVersion: policy.version, caseRevision: item.revision, ruleId, route: routeType, approvalRequired: routeType === 'supervisor', reason })
  if (typeof policy.version !== 'string' || !policy.version || !Array.isArray(policy.routineRequestTypes) || !Array.isArray(policy.exceptionAttributes) || policy.supervisorReversal?.requestType !== 'Reversal request' || policy.supervisorReversal?.amountCents !== 50000) return route('invalid-policy', 'hold', 'Routing configuration is unavailable. Human review is required; processing is blocked.')
  if (policy.exceptionAttributes.some(key => item[key] === true)) return route('case-exception', 'hold', 'An account-change request or evidence conflict requires human review. No processing authority is granted.')
  if (policy.exceptionAttributes.some(key => typeof item[key] !== 'boolean')) return route('missing-attributes', 'hold', 'Required case attributes are missing or invalid. Human review is required.')
  if (item.requestType === policy.supervisorReversal?.requestType && item.category === 'Reversal request' && item.amount === `$${(policy.supervisorReversal.amountCents / 100).toFixed(2)}`) return route('reversal-500', 'supervisor', 'The project-specific $500 reversal requires Supervisor approval before CSR processing.')
  if (item.requestType === 'Reversal request' || item.category === 'Reversal request') return route('unsupported-reversal', 'hold', 'Only the project-specific $500 reversal has an approved financial processing path. Human review is required.')
  if (policy.routineRequestTypes.includes(item.requestType) && item.category === 'Information request') return route('routine-information', 'csr', 'Routine information request within CSR authority. No account change is authorized.')
  return route('unsupported-request', 'hold', 'This request has no approved processing path. Human review is required.')
}

export function supervisorApprovalStatus(item) {
  if (['cancelled', 'incomplete-verification'].includes(item.closureOutcome)) return 'Not Required'
  const routing = evaluateApprovalRouting(item)
  if (routing.route === 'csr') return 'Not Required'
  if (routing.route === 'hold') return 'More Information Required'
  if (item.disposition === 'rejected') return 'Rejected'
  if (item.approval?.revision === item.revision && item.approval.policyVersion === routing.policyVersion && item.approval.ruleId === routing.ruleId) return 'Approved'
  if (!item.evidence) return 'More Information Required'
  return 'Pending'
}
export function hasCurrentRoutingApproval(item) {
  return supervisorApprovalStatus(item) === 'Approved'
}
