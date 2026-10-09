import { useReducer, useState } from 'react'
import { createCases, caseStatus, supervisorMessage } from './workflow.js'
import WorkflowScreen from './WorkflowScreen.jsx'
import CreateCaseForm from './CreateCaseForm.jsx'
import { caseStore } from './caseCreation.js'

const screens = [
  { id: 'queue', title: 'Case Management', number: '00' },
  { id: 'verification', title: 'Identity Verification', number: '01' },
  { id: 'assessment', title: 'AI-Assisted Assessment', number: '02' },
  { id: 'supervisor', title: 'Supervisor Authorization', number: '03' },
  { id: 'action', title: 'Action & Closure', number: '04' },
  { id: 'audit', title: 'Audit History', number: '05' },
]


function NavigationIcon({ id }) {
  const paths = {
    queue: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    verification: 'M12 3 4 6v6c0 4 4 7 8 9 4-2 8-5 8-9V6zM8 12l3 3 5-6',
    assessment: 'M4 5h16v12H9l-5 4zM8 9h8M8 13h5',
    supervisor: 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M5 21v-3a7 7 0 0 1 14 0v3M16 14l2 2 4-4',
    action: 'M4 12h14M13 6l6 6-6 6M4 5v14',
    audit: 'M6 3h12v18H6zM9 7h6M9 11h6M9 15h4',
  }
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[id]} /></svg>
}


export default function App() {
  const [{ cases, notice, creating }, dispatch] = useReducer(caseStore, undefined, () => ({ cases: createCases(), notice: null, creating: false }))
  const [role, setRole] = useState('CSR')
  const setNotice = notice => dispatch({ type: 'notice', notice })
  const [screenId, setScreenId] = useState('queue')
  const [selectedId, setSelectedId] = useState(cases[0].id)
  const selectedCase = cases.find((item) => item.id === selectedId)
  const screen = screens.find((item) => item.id === screenId)

  function openCase(id) {
    setSelectedId(id)
    setNotice(null)
    setScreenId('verification')
  }

  function act(action, payload = {}, actingRole = role) {
    dispatch({ type: 'workflow', caseId: selectedId, role: actingRole, action, payload })
  }

  function exportAudit() {
    const data = { schemaVersion: 1, simulationOnly: true, exportedAt: new Date().toISOString(), cases: cases.map((item) => ({ caseId: item.id, revision: item.revision, status: caseStatus(item), events: item.audit })) }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'amx-wf-007-synthetic-audit.json'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice({ message: 'Synthetic JSON audit exported. Case state is unchanged.', blocked: false })
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="simulation-banner"><span className="notice-dot" aria-hidden="true" />Demonstration environment · Synthetic data · Simulated actions · No live account access</div>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" /></svg></span><div><strong>Service Operations</strong><small>CUSTOMER CARE</small></div></div>
          <p className="nav-label">CASE WORKSPACE</p>
          <nav aria-label="Workspace navigation">
            {screens.map((item) => <button key={item.id} className={`nav-button ${screenId === item.id ? 'active' : ''}`} aria-current={screenId === item.id ? 'page' : undefined} onClick={() => setScreenId(item.id)}><NavigationIcon id={item.id} />{item.title}</button>)}
          </nav>
          <div className="sidebar-note"><span className="status-dot" aria-hidden="true" /><strong>Human oversight</strong><p>Every decision has a clear owner. Verification, authorization, action, and closure remain separate.</p></div>
        </aside>
        <div className="workspace">
          <header className="topbar"><div className="topbar-context"><span className="topbar-section">Service Operations</span><span className="topbar-divider">/</span><span>Customer Care</span></div><label className="role-badge">Simulated role: <select value={role} onChange={(event) => { setRole(event.target.value); act('role', {}, event.target.value) }}><option>CSR</option><option>Supervisor</option></select></label></header>
          <main id="main" tabIndex={-1}>
            <div className="page-heading"><div><p className="eyebrow">CUSTOMER SERVICE OPERATIONS</p><h1>{screen.title}</h1><p>{screenId === 'queue' ? 'Manage requests, review evidence, and coordinate the next step.' : `${selectedCase.id} · ${selectedCase.customer} · Synthetic case`}</p></div><span className="workspace-badge"><span className="status-dot" aria-hidden="true" />Human-led case review</span></div>
            {screenId === 'queue' ? (
              <>
                {notice && <div className={`workflow-notice ${notice.blocked ? 'warning' : ''}`} role="status">{notice.message}</div>}
                {creating && <CreateCaseForm cases={cases} role={role} onCreate={input => dispatch({ type: 'create', role, input, caseId: selectedId, timestamp: new Date().toISOString() })} onCancel={() => dispatch({ type: 'form', open: false })} />}
                {role !== 'CSR' && <p className="disabled-note">Switch the simulated role to CSR to create a fictional case.</p>}
                <div className="metrics" aria-label="Queue overview"><div><span>Open cases</span><strong>{String(cases.filter((item) => item.status === 'open').length).padStart(2, '0')}</strong></div><div><span>Identity verified</span><strong>{String(cases.filter((item) => item.verified).length).padStart(2, '0')}</strong></div><div><span>Supervisor authorizations</span><strong>{String(cases.filter((item) => item.approval).length).padStart(2, '0')}</strong></div></div>
                <section className="panel"><div className="panel-heading"><div><h2>Service request queue</h2><p>Review an assigned request and manage its progress.</p></div><div className="queue-actions"><span className="queue-count">{cases.length} requests</span><button className="primary-button enabled" disabled={role !== 'CSR'} onClick={() => dispatch({ type: 'form', open: true })}><span aria-hidden="true">＋ </span>Create New Case</button></div></div>
                  <div className="table-scroll"><table><caption className="sr-only">Fictional customer cases and current simulated status.</caption><thead><tr><th scope="col">Case / request</th><th scope="col">Customer</th><th scope="col">Amount</th><th scope="col">Status</th><th scope="col">View</th></tr></thead><tbody>{cases.map((item) => <tr key={item.id}><td><strong>{item.subject.replace('Fictional ', '')}</strong><small>{item.id} · {item.channel}</small></td><td><span className="customer"><span className="avatar" aria-hidden="true">{item.initials}</span>{item.customer}</span></td><td className="amount">{item.amount}</td><td><span className={`tag case-status ${item.status === 'closed' ? 'resolved' : item.disposition !== 'active' ? 'review' : item.verified ? 'verified' : 'pending'}`}>{caseStatus(item)}</span></td><td><button className="text-button" onClick={() => openCase(item.id)} aria-label={`View case ${item.id}`}>View case <span aria-hidden="true">→</span></button></td></tr>)}</tbody></table></div>
                </section>
                <div className="info-note"><strong>Clear accountability at every step</strong><p>Verification comes before assessment or AI processing. Authorization, simulated action, and closure each require a separate human decision.</p></div>
              </>
            ) : (
              <>
                <section className="panel case-context" aria-label="Selected synthetic case"><div><p className="eyebrow">SELECTED CASE</p><h2>{selectedCase.subject.replace('Fictional ', '')}</h2><p>{selectedCase.description}</p>{selectedCase.transactionReference && <p className="transaction-reference">Synthetic transaction reference: {selectedCase.transactionReference}</p>}</div><span className={`tag case-status ${selectedCase.status === 'closed' ? 'resolved' : selectedCase.disposition !== 'active' ? 'review' : selectedCase.verified ? 'verified' : 'pending'}`}>{caseStatus(selectedCase)}</span></section>
                {notice && <div className={`workflow-notice ${notice.blocked ? 'warning' : ''}`} role="status">{notice.message}</div>}
                <WorkflowScreen key={`${selectedId}-${screenId}-${selectedCase.revision}`} screenId={screenId} item={selectedCase} role={role} act={act} exportAudit={exportAudit} supervisorMessage={supervisorMessage} />
                <button className="text-button back-button" onClick={() => setScreenId('queue')}>← Back to case management</button>
              </>
            )}
          </main>
          <footer>Service Operations <span>Independent demonstration · Not affiliated with or authorized by American Express</span></footer>
        </div>
      </div>
    </>
  )
}
