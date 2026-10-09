import { cases } from './data/cases.js'

export const supervisorMessage = 'Supervisor assistance is needed for this action. No approval or account change has been performed.'
export const createCases = () => cases.map((item) => ({
  ...item, revision: 1, evidence: true, materialNote: 'Original synthetic request',
  verified: false, assessment: null, ai: null, approval: null,
  escalated: false, disposition: 'active', actionResult: null, status: 'open', audit: [],
}))

export function caseStatus(item) {
  if (item.status === 'closed') return 'Closed · Simulated'
  if (item.disposition !== 'active') return `Open for review · ${item.disposition}`
  return `Open · ${item.verified ? 'Verified' : 'Unverified'}`
}

// All case mutations pass through this guard. Roles are classroom selections,
// not production authentication. No verification secrets are collected.
function guard(item, role, action, payload) {
  if (!['CSR', 'Supervisor'].includes(role)) return 'Select a valid simulated human role.'
  if (action === 'role') return null
  if (item.status === 'closed') return 'This simulated case is closed; further workflow actions are blocked.'
  if (role !== (['approve', 'reject'].includes(action) ? 'Supervisor' : 'CSR')) return 'This action is restricted to the required simulated human role.'
  if (item.disposition !== 'active') return 'This case must remain open for review. Further resolution actions are blocked.'
  if (action === 'material') {
    if (item.actionResult) return 'Material edits are blocked after simulated execution.'
    if (typeof payload.evidence !== 'boolean' || !['Original synthetic request', 'Fictional duplicate-charge context added'].includes(payload.note)) return 'Select valid synthetic material information.'
    return null
  }
  if (action === 'verify') {
    if (!item.evidence) return 'Required synthetic evidence is unavailable. Verification cannot be attested.'
    if (!payload.attested) return 'A human CSR must explicitly attest that approved verification steps were completed in the simulation.'
    if (item.verified) return 'Verification is already recorded.'
    return null
  }
  if (action === 'reverse' && (!item.approval || item.approval.revision !== item.revision)) return supervisorMessage
  if (!item.verified) return 'CSR verification is mandatory before assessment or AI processing and subsequent workflow actions.'
  if (!item.evidence) return 'Required synthetic evidence is unavailable. The workflow cannot proceed.'
  if (item.actionResult && action !== 'close') return 'The mock action has already completed; only explicit CSR closure remains.'
  if (action === 'ai') return ['usable', 'uncertain', 'unusable', 'failed'].includes(payload.mode) ? null : 'Select a valid simulated AI scenario.'
  if (action === 'assess') {
    if (!['ai', 'manual'].includes(payload.method)) return 'Choose AI review or manual assessment.'
    if (!payload.reviewed) return 'Explicit human review of the synthetic evidence is required.'
    if (payload.method === 'ai' && (!item.ai || !['usable', 'uncertain'].includes(item.ai.mode) || item.ai.revision !== item.revision)) return 'Use manual fallback for failed, missing, or unusable AI output.'
    if (payload.method === 'ai' && item.ai.mode === 'uncertain' && !payload.uncertaintyAcknowledged) return 'Acknowledge the uncertainty warning before recording human review.'
    return null
  }
  if (!item.assessment || item.assessment.revision !== item.revision) return 'A current human-reviewed assessment is required.'
  if (['escalate', 'approve', 'reject', 'reverse', 'withdraw', 'close'].includes(action) && item.category !== 'Reversal request') return 'This action is only defined for the fictional $500 reversal scenario. This information case remains open for review.'
  if (action === 'escalate') return item.escalated ? 'This revision is already escalated.' : null
  if (['approve', 'reject'].includes(action)) {
    if (!item.escalated) return 'CSR escalation of the current case revision is required before Supervisor review.'
    if (item.approval) return 'A Supervisor decision is already recorded for this revision.'
    return payload.confirmed ? null : 'The human Supervisor must explicitly confirm the decision.'
  }
  if (action === 'withdraw') return payload.confirmed ? null : 'Explicit human CSR withdrawal confirmation is required.'
  if (['reverse', 'close'].includes(action)) {
    if (!item.approval || item.approval.revision !== item.revision) return supervisorMessage
    if (action === 'reverse') return ['success', 'failed'].includes(payload.outcome) ? null : 'Select a valid mock action scenario.'
    if (item.actionResult !== 'success') return 'Only a successfully resolved simulated case is eligible for closure.'
    return payload.confirmed ? null : 'Explicit human CSR confirmation is required to close the simulated case.'
  }
  return 'Unknown workflow action is blocked.'
}

export function transition(item, role, action, payload = {}, timestamp = new Date().toISOString()) {
  let next = { ...item }
  const events = []
  const log = (type, details) => events.push({
    id: `${item.id}-${item.audit.length + events.length + 1}`, caseId: item.id,
    timestamp, actor: role, revision: next.revision, type, details,
  })
  const blocked = guard(item, role, action, payload)
  if (blocked) {
    log('blocked_action', { action, reason: blocked })
    return { item: { ...item, audit: [...item.audit, ...events] }, message: blocked, blocked: true }
  }
  let message = 'Human decision recorded in the classroom simulation.'
  if (action === 'role') {
    log('simulated_role_selected', { role })
    message = `Simulated ${role} role selected. This is not authentication.`
  }
  if (action === 'material') {
    if (item.evidence === payload.evidence && item.materialNote === payload.note) return { item, message: 'No material change to save.', blocked: false }
    next = { ...next, evidence: payload.evidence, materialNote: payload.note, revision: item.revision + 1, verified: false, assessment: null, ai: null, approval: null, escalated: false }
    log('material_information_changed', { evidenceAvailable: next.evidence, syntheticNote: next.materialNote, previousRevision: item.revision })
    log('prior_authority_invalidated', { approvalInvalidated: Boolean(item.approval), verificationReset: true, assessmentReset: true })
    message = 'Material information changed. Verification, assessment, escalation, and approval must be completed again.'
  }
  if (action === 'verify') {
    next.verified = true
    log('verification_attestation', { completed: true, attestedBy: 'Human CSR', simulationOnly: true })
    message = 'Human CSR verification attestation recorded. Assessment is now available.'
  }
  if (action === 'ai') {
    const usable = ['usable', 'uncertain'].includes(payload.mode)
    next.ai = {
      label: 'Simulated AI', mode: payload.mode, revision: item.revision,
      summary: usable ? `${item.customer} requests ${item.category.toLowerCase()}. Synthetic evidence is available. Context: ${item.materialNote}.` : null,
      classification: usable ? item.category : null,
      uncertainty: payload.mode === 'uncertain' ? 'Synthetic transaction context is incomplete. Human review is required; this recommendation may be unreliable.' : null,
      recommendation: usable ? (item.category === 'Reversal request' ? 'Recommend human Supervisor review of the fictional $500 reversal. No approval or account change has been performed.' : 'Recommend manual review of the fictional inquiry. No approval or account change has been performed.') : null,
    }
    // A newly generated output requires fresh human review and authorization.
    next.assessment = null; next.approval = null; next.escalated = false
    log('simulated_ai_output', next.ai)
    if (item.approval) log('approval_invalidated', { reason: 'New AI output requires fresh human review.' })
    message = usable ? 'Simulated AI output is ready for human review. It grants no authority.' : 'Simulated AI failed or produced unusable output. Use manual fallback.'
  }
  if (action === 'assess') {
    next.assessment = { method: payload.method, revision: item.revision, reviewedBy: 'Human CSR', uncertaintyAcknowledged: Boolean(payload.uncertaintyAcknowledged), recommendation: item.category === 'Reversal request' ? 'Request Supervisor review of fictional $500 reversal' : 'Manual review of synthetic inquiry' }
    next.approval = null; next.escalated = false
    log('human_assessment', next.assessment)
    if (item.approval) log('approval_invalidated', { reason: 'Human assessment changed.' })
    message = 'Human assessment recorded. This is a recommendation, not approval.'
  }
  if (action === 'escalate') { next.escalated = true; log('supervisor_review_requested', { approvalGranted: false }); message = 'Escalated for human Supervisor review. No approval or account change has been performed.' }
  if (action === 'approve') { next.approval = { revision: item.revision, approvedBy: 'Human Supervisor', amount: '$500.00' }; log('supervisor_approval', next.approval); message = 'Supervisor approval recorded. A separate CSR-triggered mock reversal is required.' }
  if (action === 'reject' || action === 'withdraw') {
    next.disposition = action === 'reject' ? 'rejected' : 'withdrawn'; next.approval = null
    log('human_decision', { decision: next.disposition }); log('case_transition', { from: 'open', to: 'open for review', outcome: next.disposition })
    message = 'Case remains open for review. No action or closure has been performed.'
  }
  if (action === 'reverse') {
    next.actionResult = payload.outcome
    log('csr_mock_reversal_triggered', { amount: '$500.00', approvalRevision: item.approval.revision, simulationOnly: true })
    log('simulated_action_result', { outcome: payload.outcome, realAccountChange: false })
    if (payload.outcome === 'failed') { next.disposition = 'failed-action'; log('case_transition', { from: 'open', to: 'open for review', outcome: 'failed-action' }) }
    message = payload.outcome === 'success' ? 'Mock reversal succeeded. Case is still open until explicit CSR closure.' : 'Mock reversal failed. Case remains open for review.'
  }
  if (action === 'close') { next.status = 'closed'; log('human_closure_confirmation', { confirmedBy: 'Human CSR', simulationOnly: true }); log('case_transition', { from: 'open', to: 'closed', simulationOnly: true }); message = 'Human CSR confirmed simulated case closure.' }
  return { item: { ...next, audit: [...item.audit, ...events] }, message, blocked: false }
}
