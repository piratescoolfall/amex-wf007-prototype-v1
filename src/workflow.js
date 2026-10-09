import { evaluateApprovalRouting, hasCurrentRoutingApproval } from './approvalRouting.js'
import { cases } from './data/cases.js'
import { verificationMethods, assignedVerificationMethod, incompleteReasons, hasValidVerification } from './verification.js'
import { buildCaseReport, refreshReportStatus } from './caseReport.js'

export const cancellationReasons = ['Customer no longer wishes to proceed', 'Duplicate case opened in error', 'Request no longer required']
export const cancellationBlockedMessage = 'A reversal has already been processed (simulated). Cancellation is blocked. Supervisor review is required to determine whether a separate corrective action is appropriate. No reversal has been undone.'

export const supervisorMessage = 'Supervisor assistance is needed for this action. No approval or account change has been performed.'
export const createCases = () => cases.map((item) => ({
  ...item, requestType: item.category === 'Reversal request' ? 'Reversal request' : item.subject, requiresAccountChange: false, evidenceConflict: false, resolution: null, revision: 1, evidence: true, materialNote: 'Original synthetic request',
  verified: false, verificationMethod: assignedVerificationMethod(item.id), verificationRevision: null, incompleteReason: null, cancellationReason: null, closureOutcome: null, assessment: null, ai: null, approval: null,
  escalated: false, disposition: 'active', actionResult: null, status: 'open', audit: [],
}))

export function caseStatus(item) {
  if (item.status === 'closed' && item.closureOutcome === 'cancelled') return 'Closed — Cancelled'
  if (item.status === 'closed') return item.closureOutcome === 'incomplete-verification' ? 'Closed — Incomplete Verification' : 'Closed — Successfully Resolved'
  if (item.disposition !== 'active') return `Open for review · ${item.disposition}`
  return `Open · ${hasValidVerification(item) ? 'Verified' : 'Unverified'}`
}

// All case mutations pass through this guard. Roles are classroom selections,
// not production authentication. No verification secrets are collected.
function guard(item, role, action, payload) {
  const routing = evaluateApprovalRouting(item)
  if (!['CSR', 'Supervisor'].includes(role)) return 'Select the CSR or Supervisor role to continue.'
  if (action === 'role') return null
  if (item.status === 'closed') return action === 'cancel' && item.actionResult !== null ? cancellationBlockedMessage : 'This simulated case is closed; further workflow actions are blocked.'
  if (role !== (['approve', 'reject'].includes(action) ? 'Supervisor' : 'CSR')) return ['approve', 'reject'].includes(action) ? 'Supervisor Access Required. Only a Supervisor can review and approve this request.' : 'CSR Access Required. Only a CSR can perform this action.'
  if (action === 'cancel') {
    if (item.actionResult !== null) return cancellationBlockedMessage
    if (item.status !== 'open') return 'Only an open case may be cancelled.'
    if (!hasValidVerification(item)) return 'Current CSR verification is required before cancelling a case.'
    if (!item.evidence) return 'Required evidence is unavailable. Cancellation cannot proceed.'
    if (!cancellationReasons.includes(payload.reason)) return 'Select a cancellation reason from the available options.'
    return payload.confirmed === true ? null : 'Explicit human CSR confirmation is required to cancel and close the case.'
  }
  if (item.disposition !== 'active') return 'This case must remain open for review. Further resolution actions are blocked.'
  if (action === 'material') {
    if (item.actionResult || item.resolution) return 'Material edits are blocked after simulated execution.'
    if (typeof payload.evidence !== 'boolean' || !['Original synthetic request', 'Fictional duplicate-charge context added'].includes(payload.note)) return 'Select valid synthetic material information.'
    if (Object.keys(payload).some(key => !['evidence', 'note', 'requiresAccountChange', 'evidenceConflict'].includes(key))) return 'Use only approved material fields.'
    if (['requiresAccountChange', 'evidenceConflict'].some(key => payload[key] !== undefined && typeof payload[key] !== 'boolean')) return 'Select valid case exception attributes.'
    return null
  }
  if (action === 'verify') {
    if (!item.evidence) return 'Required synthetic evidence is unavailable. Verification cannot be attested.'
    if (payload.attested !== true) return 'A human CSR must explicitly attest that approved verification steps were completed in the simulation.'
    if (item.verified) return 'Verification is already recorded.'
    if (!verificationMethods.includes(item.verificationMethod)) return 'A valid assigned fictional verification method is required.'
    if (payload.method !== undefined && payload.method !== item.verificationMethod) return 'The assigned fictional verification method cannot be changed.'
    return null
  }
  // Approved narrow exception: CSR may close an active unverified case only.
  // This branch grants no processing, approval, or execution authority.
  if (action === 'close_incomplete') {
    if (item.status !== 'open' || item.verified || item.assessment || item.ai || item.approval || item.escalated || item.actionResult) return 'Incomplete-verification closure requires an active unverified case without current downstream processing or action.'
    if (!incompleteReasons.includes(payload.reason)) return 'Select an approved incomplete-verification reason.'
    return payload.confirmed === true ? null : 'Explicit human CSR confirmation is required for incomplete-verification closure.'
  }
  if (action === 'reverse' && routing.route !== 'supervisor') return 'No financial processing is authorized for this routing decision.'
  if (action === 'reverse' && !hasCurrentRoutingApproval(item)) return supervisorMessage
  if (!hasValidVerification(item)) return 'CSR verification is mandatory before assessment or AI processing and subsequent workflow actions.'
  if (!item.evidence) return 'Required synthetic evidence is unavailable. The workflow cannot proceed.'
  if ((item.actionResult || item.resolution) && action !== 'close') return 'The mock action has already completed; only explicit CSR closure remains.'
  if (action === 'ai') return ['usable', 'uncertain', 'unusable', 'failed', 'unavailable'].includes(payload.mode) ? null : 'Select a valid simulated AI scenario.'
  if (action === 'assess') {
    if (!['ai', 'manual'].includes(payload.method)) return 'Choose AI review or manual assessment.'
    if (!payload.reviewed) return 'Explicit human review of the synthetic evidence is required.'
    if (payload.method === 'ai' && (!item.ai || !['usable', 'uncertain'].includes(item.ai.mode) || item.ai.revision !== item.revision)) return 'Use manual fallback for failed, missing, or unusable AI output.'
    if (payload.method === 'ai' && item.ai.mode === 'uncertain' && !payload.uncertaintyAcknowledged) return 'Acknowledge the uncertainty warning before recording human review.'
    return null
  }
  if (!item.assessment || item.assessment.revision !== item.revision) return 'A current human-reviewed assessment is required.'
  if (action === 'complete_request') {
    if (routing.route !== 'csr') return 'This request is outside the approved routine CSR completion path.'
    return payload.confirmed === true ? null : 'Explicit human CSR confirmation is required to complete this request.'
  }
  if (action === 'close' && routing.route === 'csr') {
    if (!item.resolution || item.resolution.revision !== item.revision || item.resolution.policyVersion !== routing.policyVersion || item.resolution.ruleId !== routing.ruleId) return 'A current CSR-completed request is required before case closure.'
    return payload.confirmed === true ? null : 'Explicit human CSR confirmation is required to close the case.'
  }
  if (['approve', 'reject', 'reverse', 'close'].includes(action) && routing.route !== 'supervisor') return 'No financial processing or approval is authorized for this routing decision.'
  if (action === 'escalate' && routing.route === 'csr') return 'Supervisor approval is not required for this routine request. Complete the request as CSR.'
  if (action === 'escalate') return item.escalated ? 'This revision is already escalated.' : null
  if (['approve', 'reject'].includes(action)) {
    if (!item.escalated) return 'CSR escalation of the current case revision is required before Supervisor review.'
    if (item.approval) return 'A Supervisor decision is already recorded for this revision.'
    return payload.confirmed ? null : 'The human Supervisor must explicitly confirm the decision.'
  }
  if (['reverse', 'close'].includes(action)) {
    if (!hasCurrentRoutingApproval(item)) return supervisorMessage
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
    timestamp, actor: role, revision: next.revision, type, routing: evaluateApprovalRouting(next), details,
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
    if (item.evidence === payload.evidence && item.materialNote === payload.note && ['requiresAccountChange', 'evidenceConflict'].every(key => payload[key] === undefined || payload[key] === item[key])) return { item, message: 'No material change to save.', blocked: false }
    next = { ...next, requiresAccountChange: payload.requiresAccountChange ?? item.requiresAccountChange, evidenceConflict: payload.evidenceConflict ?? item.evidenceConflict, resolution: null, evidence: payload.evidence, materialNote: payload.note, revision: item.revision + 1, verified: false, verificationRevision: null, incompleteReason: null, cancellationReason: null, closureOutcome: null, assessment: null, ai: null, approval: null, escalated: false }
    log('material_information_changed', { evidenceAvailable: next.evidence, syntheticNote: next.materialNote, requiresAccountChange: next.requiresAccountChange, evidenceConflict: next.evidenceConflict, previousRevision: item.revision })
    log('prior_authority_invalidated', { approvalInvalidated: Boolean(item.approval), verificationReset: true, verificationMethod: item.verificationMethod, verificationOutcome: 'Not completed', assessmentReset: true })
    message = 'Material information changed. Verification, assessment, escalation, and approval must be completed again.'
  }
  if (action === 'verify') {
    next.verified = true
    next.verificationRevision = item.revision
    next.incompleteReason = null
    log('verification_attestation', { completed: true, method: item.verificationMethod, outcome: 'Completed', attestedBy: 'Human CSR', revision: item.revision, simulationOnly: true })
    message = 'Human CSR verification attestation recorded. Assessment is now available.'
  }
  if (action === 'ai') {
    next.resolution = null
    const usable = ['usable', 'uncertain'].includes(payload.mode)
    // Generate from the resulting context, after prior recommendations/authority reset.
    next.assessment = null; next.approval = null; next.escalated = false
    const report = usable ? buildCaseReport(next, payload.mode) : null
    next.ai = {
      label: 'Simulated AI', mode: payload.mode, revision: item.revision,
      summary: report?.customerRequestSummary ?? null,
      classification: report?.requestClassification.category ?? null,
      uncertainty: report?.uncertainty ?? null,
      recommendation: report?.recommendedNextSteps[0] ?? null,
      report,
    }
    log('simulated_ai_output', next.ai)
    if (item.approval) log('approval_invalidated', { reason: 'New AI output requires fresh human review.' })
    message = usable ? 'Simulated AI output is ready for human review. It grants no authority.' : 'Simulated AI failed or produced unusable output. Use manual fallback.'
  }
  if (action === 'assess') {
    next.assessment = { method: payload.method, revision: item.revision, reviewedBy: 'Human CSR', uncertaintyAcknowledged: Boolean(payload.uncertaintyAcknowledged), recommendation: evaluateApprovalRouting(item).route === 'csr' ? 'Complete the routine information request as CSR, then explicitly close the case' : evaluateApprovalRouting(item).route === 'supervisor' ? 'Request Supervisor review of fictional $500 reversal' : 'Request human review; no processing path is authorized' }
    next.approval = null; next.escalated = false
    log('human_assessment', next.assessment)
    if (item.approval) log('approval_invalidated', { reason: 'Human assessment changed.' })
    message = 'Human assessment recorded. This is a recommendation, not approval.'
  }
  if (action === 'escalate') { next.escalated = true; log('supervisor_review_requested', { approvalGranted: false }); message = 'Escalated for human Supervisor review. No approval or account change has been performed.' }
  if (action === 'approve') { next.approval = { revision: item.revision, approvedBy: 'Human Supervisor', amount: '$500.00', policyVersion: evaluateApprovalRouting(item).policyVersion, ruleId: evaluateApprovalRouting(item).ruleId }; log('supervisor_approval', next.approval); message = 'Supervisor approval recorded. A separate CSR-triggered mock reversal is required.' }
  if (action === 'reject') {
    next.disposition = 'rejected'; next.approval = null
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
  if (action === 'complete_request') {
    const routing = evaluateApprovalRouting(item)
    next.resolution = { revision: item.revision, policyVersion: routing.policyVersion, ruleId: routing.ruleId, completedBy: 'Human CSR', requestType: item.requestType, financialAction: false }
    log('csr_request_completed', { ...next.resolution, simulationOnly: true })
    message = 'CSR completed the information request. The case remains open until explicit human closure. No account change was performed.'
  }
  if (action === 'close') { next.status = 'closed'; next.closureOutcome = 'successfully-resolved'; log('human_closure_confirmation', { confirmedBy: 'Human CSR', outcome: next.closureOutcome, simulationOnly: true }); log('case_transition', { from: 'open', to: 'closed', outcome: next.closureOutcome, simulationOnly: true }); message = 'Human CSR confirmed simulated case closure.' }
  if (action === 'cancel') {
    next.status = 'closed'; next.disposition = 'cancelled'; next.closureOutcome = 'cancelled'
    next.cancellationReason = payload.reason
    next.approval = null; next.escalated = false
    log('human_decision', { decision: 'cancel-case', reason: payload.reason, decidedBy: 'Human CSR', simulationOnly: true })
    log('human_closure_confirmation', { confirmedBy: 'Human CSR', outcome: 'cancelled', reason: payload.reason, simulationOnly: true })
    log('case_transition', { from: 'open', to: 'closed', outcome: 'cancelled', reason: payload.reason, simulationOnly: true })
    message = 'Human CSR confirmed closure: Closed — Cancelled. No account action was performed.'
  }
  if (action === 'close_incomplete') {
    next.status = 'closed'; next.closureOutcome = 'incomplete-verification'; next.incompleteReason = payload.reason
    next.verificationRevision = null
    log('verification_incomplete', { completed: false, method: item.verificationMethod, outcome: 'Incomplete', reason: payload.reason, recordedBy: 'Human CSR', simulationOnly: true })
    log('human_decision', { decision: 'close-incomplete-verification', reason: payload.reason, decidedBy: 'Human CSR' })
    log('human_closure_confirmation', { confirmedBy: 'Human CSR', outcome: next.closureOutcome, simulationOnly: true })
    log('case_transition', { from: 'open', to: 'closed', outcome: next.closureOutcome, simulationOnly: true })
    message = 'Human CSR confirmed closure: Closed — Incomplete Verification. No account action is authorized.'
  }
  if (next.ai?.report && ['assess', 'escalate', 'approve', 'reject', 'cancel', 'reverse', 'complete_request', 'close'].includes(action)) {
    const report = refreshReportStatus(next.ai.report, next)
    next.ai = { ...next.ai, report }
    log('report_human_status_updated', { caseId: next.id, revision: next.revision, source: 'Recorded human workflow; no new AI processing', humanDecisions: report.humanDecisions, draftCustomerCommunication: report.draftCustomerCommunication })
  }
  return { item: { ...next, audit: [...item.audit, ...events] }, message, blocked: false }
}
