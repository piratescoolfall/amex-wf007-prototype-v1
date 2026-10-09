import { useState } from 'react'

export default function WorkflowScreen({ screenId, item, role, act, exportAudit, supervisorMessage }) {
  const [attested, setAttested] = useState(false)
  const [evidence, setEvidence] = useState(item.evidence)
  const [note, setNote] = useState(item.materialNote)
  const [mode, setMode] = useState('usable')
  const [reviewed, setReviewed] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [outcome, setOutcome] = useState('success')
  const terminal = item.status === 'closed' || item.disposition !== 'active'
  const locked = !item.verified || !item.evidence
  const assessment = item.assessment?.revision === item.revision
  const approved = item.approval?.revision === item.revision

  return (
    <section className="panel workflow-panel">
      <div className="workflow-summary"><span className="tag">Case version {item.revision}</span><span className="tag">Evidence {item.evidence ? 'available' : 'unavailable'}</span><span className="tag">Authorization {approved ? 'approved' : 'pending'}</span></div>
      {terminal && <div className="authority-note">{item.status === 'closed' ? 'This simulated case is closed.' : 'This case remains open for review. No further resolution actions are available.'}</div>}
      {screenId === 'verification' && <>
        <h2>Identity verification</h2>
        <p>Only the simulated CSR may attest that approved identity-verification steps were completed. No verification secrets or credentials are collected.</p>
        <label className="check-label"><input type="checkbox" checked={attested} onChange={(event) => setAttested(event.target.checked)} disabled={terminal || item.verified} />I, the human CSR, attest that the approved verification steps were completed in this demonstration environment.</label>
        <button className="primary-button enabled" disabled={terminal || item.verified} onClick={() => act('verify', { attested })}>Record CSR attestation</button>
        {item.verified && <p className="success-text">Human CSR attestation recorded for this case revision.</p>}
        <hr />
        <h3>Case information & evidence</h3>
        <p>Saving a changed value invalidates verification, assessment, escalation, and Supervisor approval. All inputs below are fictional presets.</p>
        <label className="check-label"><input type="checkbox" checked={evidence} onChange={(event) => setEvidence(event.target.checked)} disabled={terminal || Boolean(item.actionResult)} />Required synthetic identity and transaction evidence is available</label>
        <label className="field-label">Case context<select value={note} onChange={(event) => setNote(event.target.value)} disabled={terminal || Boolean(item.actionResult)}><option>Original synthetic request</option><option>Fictional duplicate-charge context added</option></select></label>
        <button className="secondary-button" disabled={terminal || Boolean(item.actionResult)} onClick={() => act('material', { evidence, note })}>Save case information</button>
      </>}
      {screenId === 'assessment' && <>
        <h2>AI-assisted assessment</h2>
        {locked ? <div className="authority-note">Assessment and AI processing are locked. Complete human CSR verification with available evidence first.</div> : <p>Review synthetic evidence as a human CSR. AI output is a recommendation only; it cannot verify, approve, execute, or close.</p>}
        <label className="field-label">Simulated AI response<select value={mode} onChange={(event) => { setMode(event.target.value); setReviewed(false); setAcknowledged(false) }}><option value="usable">Usable output</option><option value="uncertain">Usable but uncertain output</option><option value="unusable">Unusable output</option><option value="failed">Simulated system failure</option></select></label>
        <button className="primary-button enabled" disabled={terminal || Boolean(item.actionResult)} onClick={() => { setReviewed(false); setAcknowledged(false); act('ai', { mode }) }}>Run simulated AI</button>
        {!locked && item.ai && <article className="ai-output"><h3>Simulated AI · {item.ai.mode}</h3>{['usable', 'uncertain'].includes(item.ai.mode) ? <><p><strong>Summary:</strong> {item.ai.summary}</p><p><strong>Classification:</strong> {item.ai.classification}</p><p><strong>Draft recommendation:</strong> {item.ai.recommendation}</p>{item.ai.uncertainty && <div className="authority-note" role="alert"><strong>Uncertainty warning:</strong> {item.ai.uncertainty}</div>}</> : <div className="authority-note">{item.ai.mode === 'failed' ? 'Simulated AI system failure.' : 'Simulated AI output is unusable.'} Use manual fallback. Verification and authority gates still apply.</div>}</article>}
        {!locked && <div className="human-review"><h3>CSR review & manual assessment</h3><p>Synthetic context: {item.materialNote}. {item.category === 'Reversal request' ? 'The fictional $500 reversal requires Supervisor approval.' : 'This fictional inquiry stays open for human review.'}</p></div>}
        <label className="check-label"><input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} disabled={locked || terminal} />I have reviewed the synthetic evidence and take responsibility for this assessment.</label>
        {item.ai?.mode === 'uncertain' && <label className="check-label"><input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} disabled={locked || terminal} />I acknowledge the uncertain simulated AI output and have reviewed it as a human.</label>}
        <div className="action-group"><button className="primary-button enabled" disabled={terminal || Boolean(item.actionResult)} onClick={() => act('assess', { method: 'ai', reviewed, uncertaintyAcknowledged: acknowledged })}>Record human AI review</button><button className="secondary-button" disabled={terminal || Boolean(item.actionResult)} onClick={() => act('assess', { method: 'manual', reviewed })}>Record manual assessment</button></div>
        {assessment && <p className="success-text">Current human assessment recorded via {item.assessment.method}. {item.assessment.recommendation}. Recommendation only.</p>}
        <button className="secondary-button" disabled={terminal || Boolean(item.actionResult)} onClick={() => act('escalate')}>Request Supervisor review</button>
      </>}
      {screenId === 'supervisor' && <>
        <h2>Supervisor authorization</h2><p>The fictional $500 reversal requires a human Supervisor decision. Escalation grants no approval; approval executes no reversal.</p>
        {!approved && <div className="authority-note">{supervisorMessage}</div>}
        <div className="review-details"><p>Current simulated role: <strong>{role}</strong></p><p>CSR verification: {item.verified ? 'Recorded' : 'Not recorded'}</p><p>Human assessment: {assessment ? item.assessment.recommendation : 'Not recorded'}</p><p>CSR escalation: {item.escalated ? 'Requested for current revision' : 'Not requested'}</p><p>Supervisor authorization: {approved ? `Approved for revision ${item.approval.revision}` : 'Not approved'}</p></div>
        <label className="check-label"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} disabled={terminal || approved} />I, the human Supervisor, have reviewed this synthetic case and explicitly confirm my selected decision.</label>
        <div className="action-group"><button className="primary-button enabled" disabled={terminal || approved} onClick={() => act('approve', { confirmed })}>Authorize simulated $500 reversal</button><button className="secondary-button" disabled={terminal || approved} onClick={() => act('reject', { confirmed })}>Reject request</button></div>
        <p className="disabled-note">Switch the simulated role to Supervisor in the header to record a decision. Rejected cases remain open for review.</p>
      </>}
      {screenId === 'action' && <>
        <h2>Resolution & case closure</h2><p>Only a human CSR may trigger the separate mock reversal after Supervisor approval. No real account change is made.</p>
        {!approved && <div className="authority-note">{supervisorMessage}</div>}
        <label className="field-label">Simulated reversal outcome<select value={outcome} onChange={(event) => setOutcome(event.target.value)} disabled={terminal || Boolean(item.actionResult)}><option value="success">Simulated success</option><option value="failed">Simulated failure — case stays open</option></select></label>
        <button className="primary-button enabled" disabled={terminal || Boolean(item.actionResult)} onClick={() => act('reverse', { outcome })}>Perform simulated $500 reversal</button>
        {item.actionResult && <p className={item.actionResult === 'success' ? 'success-text' : 'authority-note'}>Simulated reversal result: {item.actionResult}. No real financial action occurred.</p>}
        <hr /><h3>CSR confirmation</h3><label className="check-label"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} disabled={terminal} />I, the human CSR, explicitly confirm the selected closure or withdrawal action.</label>
        <div className="action-group"><button className="primary-button enabled" disabled={terminal} onClick={() => act('close', { confirmed })}>Confirm simulated closure</button><button className="secondary-button" disabled={terminal || Boolean(item.actionResult)} onClick={() => act('withdraw', { confirmed })}>Withdraw reversal request</button></div>
        <p className="disabled-note">Closure requires a successful approved mock reversal. Rejected, withdrawn, and failed-action cases stay open for review.</p>
      </>}
      {screenId === 'audit' && <>
        <div className="panel-heading audit-heading"><div><h2>Audit history</h2><p>Selected case: {item.id}. Export includes all synthetic cases in this session.</p></div><button className="primary-button enabled" onClick={exportAudit}>Download JSON audit</button></div>
        {item.audit.length === 0 ? <p>No workflow events recorded for this case.</p> : <ol className="audit-list">{item.audit.map((event) => <li key={event.id}><div><strong>{event.type.replaceAll('_', ' ')}</strong><span className="tag">{event.actor} · revision {event.revision}</span></div><time dateTime={event.timestamp}>{new Date(event.timestamp).toLocaleString()}</time><pre>{JSON.stringify(event.details, null, 2)}</pre></li>)}</ol>}
        <p className="disabled-note">Audit data is synthetic and held in memory. It is not a durable or tamper-resistant production audit log. Export before reloading.</p>
      </>}
      {screenId !== 'audit' && <p className="disabled-note">Every action is checked against verification, evidence, and role requirements. Unavailable actions are explained and recorded in the audit history.</p>}
    </section>
  )
}
