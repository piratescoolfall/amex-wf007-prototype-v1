import { evaluateApprovalRouting, hasCurrentRoutingApproval } from './approvalRouting.js'
import { cancellationReasons, cancellationBlockedMessage, caseStatus } from './workflow.js'
import { displayText, auditDisplayData, supervisorApprovalStatus } from './presentation.js'
import { useState } from 'react'
import CaseAnalysisReport from './CaseAnalysisReport.jsx'
import { incompleteReasons, hasValidVerification, verificationStatus, assessmentNextStep } from './verification.js'

export default function WorkflowScreen({ screenId, item, role, act, exportAudit, supervisorMessage, navigate }) {
  const [attested, setAttested] = useState(false)
  const [incompleteOpen, setIncompleteOpen] = useState(false)
  const [incompleteReason, setIncompleteReason] = useState('')
  const [incompleteConfirmed, setIncompleteConfirmed] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const [completionConfirmed, setCompletionConfirmed] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [cancellationOpen, setCancellationOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancellationConfirmed, setCancellationConfirmed] = useState(false)
  const terminal = item.status === 'closed' || item.disposition !== 'active'
  const locked = !hasValidVerification(item) || !item.evidence
  const manualFallback = ['failed', 'unusable', 'unavailable'].includes(item.ai?.mode) && item.ai.revision === item.revision
  const assessment = item.assessment?.revision === item.revision
  const routing = evaluateApprovalRouting(item)
  const approved = hasCurrentRoutingApproval(item)
  const routine = routing.route === 'csr'
  const reviewRequired = routing.route !== 'csr'
  const financial = routing.route === 'supervisor'
  const nextStep = assessmentNextStep(item, role)

  return (
    <section className="panel workflow-panel">
      <div className="workflow-summary"><span className="tag">Case version {item.revision}</span><span className="tag">Evidence {item.evidence ? 'available' : 'unavailable'}</span><span className="tag">Supervisor Approval: {supervisorApprovalStatus(item)}</span></div>
      <p className="disabled-note"><strong>Approval routing:</strong> {displayText(routing.reason)}</p>
      {terminal && <div className="authority-note">{item.status === 'closed' ? `This case is closed: ${caseStatus(item)}.` : 'This case remains open for review. No further resolution actions are available.'}</div>}
      {screenId === 'verification' && <>
        <h2>Identity verification</h2>
        <p>Only a CSR may confirm completion of the required identity-verification steps. Do not enter security answers, verification codes, or identity documents.</p>
        <div className="verification-record"><p><strong>Verification status:</strong> {verificationStatus(item)}</p><p><strong>Required Verification Method:</strong> {item.verificationMethod}</p>{item.incompleteReason && <p><strong>Incomplete reason:</strong> {displayText(item.incompleteReason)}</p>}</div>
        <label className="check-label"><input type="checkbox" checked={attested} onChange={(event) => setAttested(event.target.checked)} disabled={terminal || item.verified} />I, the CSR, confirm that the required identity-verification steps are complete.</label>
        <button className="primary-button enabled" disabled={terminal || item.verified} onClick={() => act('verify', { attested })}>Confirm Verification</button>
        {hasValidVerification(item) && <p className="success-text">CSR verification confirmation recorded for this case version.</p>}
        {!terminal && !item.verified && <div className="incomplete-verification">
          <button className="secondary-button" disabled={role !== 'CSR'} onClick={() => { setIncompleteOpen(true); setIncompleteReason(''); setIncompleteConfirmed(false) }}>Unable to Verify Identity</button>
          {incompleteOpen && <div className="incomplete-confirmation"><h3>Close for incomplete verification</h3><p>This is a human CSR closure decision only. It does not authorize AI assessment, Supervisor approval, or an account action.</p>
            <label className="field-label">Incomplete-verification reason<select value={incompleteReason} onChange={event => { setIncompleteReason(event.target.value); setIncompleteConfirmed(false) }}><option value="">Select a reason</option>{incompleteReasons.map(value => <option key={value} value={value}>{displayText(value)}</option>)}</select></label>
            <label className="check-label"><input type="checkbox" checked={incompleteConfirmed} onChange={event => setIncompleteConfirmed(event.target.checked)} />I, the CSR, confirm closure because identity verification could not be completed.</label>
            <div className="action-group"><button className="primary-button enabled" disabled={role !== 'CSR'} onClick={() => act('close_incomplete', { reason: incompleteReason, confirmed: incompleteConfirmed })}>Confirm incomplete-verification closure</button><button className="secondary-button" onClick={() => { setIncompleteOpen(false); setIncompleteReason(''); setIncompleteConfirmed(false) }}>Cancel incomplete closure</button></div>
          </div>}
        </div>}

      </>}
      {screenId === 'assessment' && <>
        <h2>AI Assessment</h2>
        {locked ? <div className="authority-note">Assessment and AI processing are locked. Complete human CSR verification with available evidence first.</div> : <p>Review the available evidence as a CSR. AI output is a recommendation only; it cannot verify, approve, execute, or close.</p>}
        <button className="primary-button enabled" disabled={terminal || Boolean(item.actionResult || item.resolution)} onClick={() => { setReviewed(false); setAcknowledged(false); act('ai', { mode: 'usable' }) }}>Run AI Assessment</button>
        {!locked && item.ai && (item.ai.report ? <CaseAnalysisReport report={item.ai.report} mode={item.ai.mode} /> : <div className="authority-note"><h3>AI Assessment · {item.ai.mode === 'failed' ? 'Unable to complete' : item.ai.mode === 'unavailable' ? 'Unavailable' : 'Unusable output'}</h3>{item.ai.mode === 'failed' ? 'The AI assessment could not complete.' : item.ai.mode === 'unavailable' ? 'The AI assessment is unavailable.' : 'The AI assessment returned unusable output.'} No reliable report was generated. Complete the assessment without AI. Verification and authority gates still apply.</div>)}
        {!item.ai && <div className="report-empty"><h3>Case analysis is ready to begin</h3><p>Run AI Assessment after human CSR verification to generate a report for {item.id}. No analysis has been generated yet.</p></div>}
        {!locked && <div className="human-review"><h3>Human CSR review</h3><p>Case context: {displayText(item.materialNote)}. {displayText(routing.reason)}</p></div>}
        <label className="check-label"><input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} disabled={locked || terminal} />I have reviewed the evidence and take responsibility for this assessment.</label>
        {item.ai?.mode === 'uncertain' && <label className="check-label"><input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} disabled={locked || terminal} />I acknowledge the uncertain AI output and have reviewed it as a human.</label>}
        <div className="action-group"><button className="primary-button enabled" disabled={terminal || Boolean(item.actionResult || item.resolution)} onClick={() => act('assess', { method: 'ai', reviewed, uncertaintyAcknowledged: acknowledged })}>Record human AI review</button>{manualFallback && <button className="secondary-button" disabled={terminal || Boolean(item.actionResult || item.resolution)} onClick={() => act('assess', { method: 'manual', reviewed })}>Complete Assessment Without AI</button>}</div>
        {assessment && <p className="success-text">Current human assessment recorded via {item.assessment.method}. {displayText(item.assessment.recommendation)}. Recommendation only.</p>}
        <div className="assessment-navigation">{reviewRequired && <button className="secondary-button" disabled={terminal || Boolean(item.actionResult || item.resolution)} onClick={() => act('escalate')}>Request Supervisor review</button>}<button className="primary-button enabled" disabled={!nextStep} onClick={() => { if (nextStep) navigate(nextStep) }}>Next Step → {nextStep === 'action' ? 'Action & Closure' : 'Supervisor Review'}</button></div>
        {!nextStep && <p className="disabled-note">{routine ? 'Next step requires current verification and recorded human assessment. Supervisor approval is not required.' : 'Next step requires current verification, human assessment, and recorded escalation. Review alone grants no processing authority.'}</p>}
      </>}
      {screenId === 'supervisor' && <>
        {!reviewRequired && <div className="authority-note">Supervisor Approval: Not Required. Complete this routine request as CSR in Action &amp; Closure.</div>}
        {reviewRequired && <>
        <h2>Supervisor review</h2>
        {role !== 'Supervisor' && <div className="authority-note"><strong>Supervisor Access Required</strong><p>Only a Supervisor can review and approve this request.</p></div>}{financial ? <div className="authority-note"><strong>Supervisor Approval Required</strong><p>This $500 transaction reversal requires Supervisor approval before processing. Submitting a request for review does not authorize the reversal.</p></div> : <p>{displayText(routing.reason)} Submitting a request for review does not grant processing authority.</p>}
        {financial && !approved && <div className="authority-note">{supervisorMessage}</div>}
        <div className="review-details"><p>Current role: <strong>{role}</strong></p><p>CSR verification: {hasValidVerification(item) ? `Recorded via ${item.verificationMethod}` : 'Not recorded'}</p><p>Human assessment: {assessment ? displayText(item.assessment.recommendation) : 'Not recorded'}</p><p>CSR escalation: {item.escalated ? 'Requested for current revision' : 'Not requested'}</p><p>Supervisor Approval: {supervisorApprovalStatus(item)}</p></div>
        {financial && <><label className="check-label"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} disabled={terminal || approved || role !== 'Supervisor'} />I, the human Supervisor, have reviewed this case and explicitly confirm my selected decision.</label>
        <div className="action-group"><button className="primary-button enabled" disabled={terminal || approved || role !== 'Supervisor'} onClick={() => act('approve', { confirmed })}>Approve Reversal</button><button className="secondary-button" disabled={terminal || approved || role !== 'Supervisor'} onClick={() => act('reject', { confirmed })}>Reject request</button></div></>}
        <p className="disabled-note">{financial ? 'Select the Supervisor role in the header to record a decision. Rejected cases remain open for review.' : 'This request remains on hold for human review. No completion, financial approval, or processing path is authorized.'}</p></>}
      </>}
      {screenId === 'action' && <>
        <h2>{routine ? 'Request Completion' : financial ? 'Transaction Reversal' : 'Case Review'}</h2>
        {financial && <><p>Only a CSR may process a reversal after Supervisor approval. Training action · No live transaction will be processed.</p>
        {financial && !approved && <div className="authority-note">{supervisorMessage}</div>}
        <button className="primary-button enabled" disabled={terminal || Boolean(item.actionResult || item.resolution)} onClick={() => act('reverse', { outcome: 'success' })}>Process Reversal</button>
        {item.actionResult && <p className={item.actionResult === 'success' ? 'success-text' : 'authority-note'}>Transaction Reversal: {item.actionResult === 'success' ? 'Completed' : 'Failed'}. Training result · No live transaction processed.</p>}</>}
        {routine && <div className="human-review"><h3>Complete Information Request</h3><p>Supervisor Approval: Not Required. Complete the reviewed request, then confirm case closure. No account change is authorized.</p>
          <label className="check-label"><input type="checkbox" checked={completionConfirmed} disabled={locked || terminal || role !== 'CSR' || Boolean(item.resolution)} onChange={event => setCompletionConfirmed(event.target.checked)} />I, the CSR, confirm that I have completed the reviewed information request.</label>
          <button className="primary-button enabled" disabled={terminal || Boolean(item.resolution)} onClick={() => { setConfirmed(false); act('complete_request', { confirmed: completionConfirmed }) }}>Complete Request</button>
          {item.resolution && <p className="success-text">Request completed by CSR. Explicit case closure is still required.</p>}
        </div>}
        {routing.route === 'hold' && <div className="authority-note">{displayText(routing.reason)} Complete human assessment and request review. No processing path is authorized.</div>}
        <hr /><h3>CSR confirmation</h3><label className="check-label"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} disabled={terminal} />I, the human CSR, explicitly confirm the case closure.</label>
        <div className="action-group"><button className="primary-button enabled" disabled={terminal} onClick={() => act('close', { confirmed })}>Confirm Case Closure</button></div>
        {item.cancellationReason && <p><strong>Cancellation reason:</strong> {item.cancellationReason}</p>}
        <div className="incomplete-verification">
          <button className="secondary-button" disabled={item.status === 'closed' || role !== 'CSR'} onClick={() => { if (item.actionResult) { act('cancel'); return } setCancellationOpen(true); setCancellationReason(''); setCancellationConfirmed(false) }}>Close / Cancel Case</button>
          {item.actionResult && <p className="authority-note">{displayText(cancellationBlockedMessage)}</p>}
          {cancellationOpen && item.status !== 'closed' && !item.actionResult && <div className="incomplete-confirmation"><h3>Cancel and close case</h3><p>Cancellation closes this case without processing a reversal. Current CSR verification and available evidence are required.</p>
            <label className="field-label">Cancellation reason<select value={cancellationReason} onChange={event => { setCancellationReason(event.target.value); setCancellationConfirmed(false) }}><option value="">Select a cancellation reason</option>{cancellationReasons.map(reason => <option key={reason}>{reason}</option>)}</select></label>
            <label className="check-label"><input type="checkbox" checked={cancellationConfirmed} onChange={event => setCancellationConfirmed(event.target.checked)} disabled={role !== 'CSR'} />I, the CSR, explicitly confirm cancellation and closure of this case.</label>
            <div className="action-group"><button className="primary-button enabled" disabled={role !== 'CSR'} onClick={() => act('cancel', { reason: cancellationReason, confirmed: cancellationConfirmed })}>Confirm Cancellation</button><button className="secondary-button" onClick={() => { setCancellationOpen(false); setCancellationReason(''); setCancellationConfirmed(false) }}>Keep Case Open</button></div>
          </div>}
        </div>
        <p className="disabled-note">{routine ? 'Closure requires a current CSR-completed request.' : financial ? 'Closure requires a successful approved reversal. Rejected and failed-action cases stay open for review.' : 'This case is held for review; successful-resolution closure is unavailable.'} Eligible cases may be cancelled before reversal processing.</p>
      </>}
      {screenId === 'audit' && <>
        <div className="panel-heading audit-heading"><div><h2>Audit history</h2><p>Selected case: {item.id}. Export includes all cases in this session.</p></div><button className="primary-button enabled" onClick={exportAudit}>Download JSON audit</button></div>
        {item.audit.length === 0 ? <p>No workflow events recorded for this case.</p> : <ol className="audit-list">{item.audit.map((event) => <li key={event.id}><div><strong>{displayText(event.type.replaceAll('_', ' '))}</strong><span className="tag">{event.actor} · revision {event.revision}</span></div>{['csr_mock_reversal_triggered', 'simulated_action_result'].includes(event.type) && <p>Training result · No live transaction processed.</p>}<time dateTime={event.timestamp}>{new Date(event.timestamp).toLocaleString()}</time><pre>{JSON.stringify(auditDisplayData({ ...event.details, routing: event.routing }), null, 2)}</pre></li>)}</ol>}
        <p className="disabled-note">Audit records are held for this session only. They are not persistent or tamper-resistant. Export before reloading.</p>
      </>}
      {screenId !== 'audit' && <p className="disabled-note">Every action is checked against verification, evidence, and role requirements. Unavailable actions are explained and recorded in the audit history.</p>}
    </section>
  )
}
