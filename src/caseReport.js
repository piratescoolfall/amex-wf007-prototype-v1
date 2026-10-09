import { evaluateApprovalRouting, supervisorApprovalStatus } from './approvalRouting.js'
import { hasValidVerification } from './verification.js'

export function draftCustomerCommunication(item) {
  const greeting = `Hello ${item.customer}. Regarding your fictional request (${item.id}): `
  let status = 'Simulated identity verification has not been recorded. Your case remains open. No approval or mock account action is recorded.'
  if (item.closureOutcome === 'cancelled') status = `A human CSR cancelled and closed this case: ${item.cancellationReason}. No reversal or account change was performed.`
  else if (item.closureOutcome === 'incomplete-verification') status = `A human CSR closed this synthetic case because verification could not be completed: ${item.incompleteReason}. This closure does not authorize any account change.`
  else if (item.status === 'closed' && item.resolution) status = 'A human CSR completed this information request and explicitly confirmed case closure. Supervisor approval was not required. No account change was performed.'
  else if (item.status === 'closed') status = 'A human CSR confirmed simulated closure after human Supervisor approval and a successful mock reversal. No real financial action occurred.'
  else if (item.disposition === 'rejected') status = 'A human Supervisor rejected this request. The case remains open for review; no reversal or closure was performed.'
  else if (item.disposition === 'withdrawn') status = 'A human CSR recorded withdrawal of this request. The case remains open for review; no reversal or closure was performed.'
  else if (item.resolution) status = 'A human CSR completed this information request. The case remains open until explicit human closure. No account change was performed.'
  else if (item.actionResult === 'failed') status = 'The mock reversal attempt failed. The case remains open for human review. No real financial action occurred.'
  else if (item.actionResult === 'success') status = 'The Supervisor-approved mock reversal succeeded in the simulation. The case remains open until explicit human CSR closure. No real financial action occurred.'
  else if (item.approval?.revision === item.revision) status = 'A human Supervisor approved the fictional $500 reversal. A separate CSR-triggered mock reversal is still required; no reversal has been performed.'
  else if (item.escalated) status = 'A human CSR requested Supervisor review. No approval, reversal, or closure has been performed.'
  else if (item.assessment?.revision === item.revision) status = 'A human CSR recorded an assessment. This is a recommendation only; no approval, reversal, or closure has been performed.'
  else if (hasValidVerification(item)) status = `A human CSR recorded simulated verification using ${item.verificationMethod}. Your request awaits human assessment; no approval, reversal, or closure has been performed.`
  return greeting + status
}

export function recordedHumanDecisions(item) {
  return {
    verification: hasValidVerification(item) ? `Human CSR attestation recorded using ${item.verificationMethod}.` : 'No current human CSR verification recorded.',
    assessment: item.assessment?.revision === item.revision ? `Human CSR assessment recorded via ${item.assessment.method}. Recommendation only.` : 'No current human assessment recorded.',
    escalation: item.escalated ? 'Human CSR requested Supervisor review.' : 'No escalation recorded.',
    approval: `Supervisor Approval: ${supervisorApprovalStatus(item)}. ${evaluateApprovalRouting(item).reason}`,
    action: item.actionResult ? `Mock reversal ${item.actionResult}. No real account change.` : 'No mock account action recorded.',
    requestCompletion: item.resolution ? 'Routine information request completed by human CSR. No financial action.' : 'No CSR request completion recorded.',
    cancellation: item.closureOutcome === 'cancelled' ? `Human CSR cancellation recorded: ${item.cancellationReason}. No reversal performed.` : 'No cancellation recorded.',
    closure: item.status === 'closed' ? `Human CSR closure recorded: ${item.closureOutcome}.` : 'Case remains open.',
  }
}

// Pure formatting of supplied synthetic facts and approved local simulation rules.
// This function neither verifies identity nor performs workflow actions.
export function buildCaseReport(item, mode) {
  const routing = evaluateApprovalRouting(item)
  const reversal = routing.route === 'supervisor'
  const routine = routing.route === 'csr'
  const missing = [
    'Underlying identity-verification records and secret responses are not collected by this prototype.',
    'Transaction date, merchant, account history, and supporting transaction documents are not supplied.',
    'A request description and evidence-availability flag do not establish that a duplicate charge occurred.',
  ]
  if (!item.transactionReference) missing.push('A synthetic transaction reference has not been supplied for this fixture.')
  if (mode === 'uncertain') missing.push('The selected simulated AI scenario flags incomplete transaction context; a human must assess the uncertainty.')
  const knowledge = [
    'This is a classroom simulation using fictional cases, roles, AI output, and account actions.',
    'Only a human CSR can attest verification. AI processing and manual assessment require current verification and available synthetic evidence.',
    reversal ? 'The approved fictional $500 reversal requires human Supervisor approval, a separate CSR mock action, and explicit CSR closure.' : routing.reason,
    'Incomplete-verification closure is a separate explicit CSR decision for an active unverified case, with no downstream processing or action.',
  ]
  const uncertainty = mode === 'uncertain' ? 'Uncertainty warning: simulated transaction context is incomplete. This report may be unreliable; explicit human acknowledgment is required.' : 'No additional uncertainty was injected by this simulated scenario. The documented evidence gaps still require human judgment.'
  return {
    label: 'Simulated AI case-analysis report', routing, caseId: item.id, revision: item.revision,
    customerRequestSummary: `${item.customer} — ${item.subject}. ${item.description}`,
    evidenceAndKnownFacts: {
      providedFacts: [`Synthetic case: ${item.id}`, `Fictional customer: ${item.customer}`, `Provided request type: ${item.category}`, `Fictional amount: ${item.amount}`, `Channel: ${item.channel}`, `Description: ${item.description}`, `Synthetic transaction reference: ${item.transactionReference || 'Not supplied'}`, `Synthetic evidence availability: ${item.evidence ? 'Available' : 'Unavailable'}`, `Provided context: ${item.materialNote}`],
      approvedSimulationKnowledge: knowledge,
      supportedConclusions: [reversal ? 'The supplied reversal request requires human Supervisor review under the approved simulation rule; the request is not approved by this report.' : 'The supplied request type supports an information-request classification for human review.', 'A recorded CSR attestation indicates completion in the simulation; it is not AI identity verification or production identity proof.'],
      assumptions: ['No additional facts are assumed. The customer request is not treated as proof of a valid reversal or confirmed duplicate charge.'],
      unknowns: missing,
    },
    missingInformation: missing,
    verificationStatus: { recorded: hasValidVerification(item), method: item.verificationMethod, revision: item.verificationRevision, actor: 'Human CSR', statement: 'Verification is recorded only by human CSR attestation; AI cannot perform or attest verification.' },
    requestClassification: { category: item.category, basis: 'Provided synthetic request type and description; classification is advisory, not approval.' },
    riskAndReviewIndicators: [uncertainty, 'Synthetic presets and an availability flag are not independent transaction proof.', reversal ? 'Reversal approval and execution require separate authorized human decisions.' : 'This information case requires human review; no financial action is authorized.'],
    recommendedNextSteps: [reversal ? 'Recommend current human CSR assessment, then human Supervisor review of the fictional $500 reversal. A recommendation does not record an escalation or grant approval.' : routine ? 'Recommend human CSR review, explicit completion of the routine information request, then separate human closure. Supervisor approval is not required; no account change is authorized.' : 'Request human review of this exception or unsupported request. No financial processing or routine completion is authorized.', 'The supplied facts and approved knowledge do not justify Fraud, Legal, IT, or Operations referral. No specialist escalation is recorded or implemented.'],
    humanDecisions: recordedHumanDecisions(item),
    draftCustomerCommunication: { label: 'Draft — Human Review Required', text: draftCustomerCommunication(item) },
    humanAuthorityRequired: ['AI cannot verify identity or attest completion of verification.', 'AI cannot approve requests, execute account changes, or close cases.', routine ? 'Only a human CSR may confirm completion of a reviewed routine information request and separately confirm case closure. No account change is authorized.' : reversal ? 'Only a human Supervisor may approve the fictional $500 reversal; only a human CSR may trigger its separate mock action or explicitly confirm eligible closure.' : 'Human review of exceptions grants no financial processing or routine-completion authority.'],
    uncertainty: mode === 'uncertain' ? uncertainty : null,
  }
}

// Refresh only recorded status and its communication template after human actions.
// This is not a new AI invocation; the original AI report remains in audit history.
export function refreshReportStatus(report, item) {
  return { ...report, routing: evaluateApprovalRouting(item), humanDecisions: recordedHumanDecisions(item), draftCustomerCommunication: { label: 'Draft — Human Review Required', text: draftCustomerCommunication(item) } }
}
