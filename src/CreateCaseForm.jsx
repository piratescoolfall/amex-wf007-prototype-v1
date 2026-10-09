import { useState } from 'react'
import { syntheticCustomers, requestTypes, descriptions, fictionalAmounts, nextSyntheticId, transactionReference } from './caseCreation.js'

export default function CreateCaseForm({ cases, role, onCreate, onCancel }) {
  const [customer, setCustomer] = useState('')
  const [requestType, setRequestType] = useState('Reversal request')
  const [amount, setAmount] = useState('500.00')
  const [description, setDescription] = useState('')
  const id = nextSyntheticId(cases)
  return <section className="panel create-case-panel" aria-labelledby="create-case-title">
    <div className="panel-heading"><div><p className="eyebrow">SYNTHETIC CASE INTAKE</p><h2 id="create-case-title">Create a fictional case</h2><p>Choose demonstration presets only. Real customer information cannot be entered.</p></div><span className="queue-count">Starts open · Unverified</span></div>
    <form onSubmit={event => { event.preventDefault(); onCreate({ customer, requestType, amount, description }) }}>
      <div className="create-case-grid">
        <label className="field-label">Synthetic customer name<select autoFocus required value={customer} onChange={event => setCustomer(event.target.value)}><option value="">Select a fictional customer</option>{syntheticCustomers.map(name => <option key={name}>{name}</option>)}</select></label>
        <label className="field-label">Request type<select value={requestType} onChange={event => { setRequestType(event.target.value); setDescription(''); setAmount('500.00') }}>{requestTypes.map(type => <option key={type}>{type}</option>)}</select></label>
        <label className="field-label">Fictional transaction amount<select value={amount} disabled={requestType === 'Reversal request'} onChange={event => setAmount(event.target.value)}>{(requestType === 'Reversal request' ? ['500.00'] : fictionalAmounts).map(value => <option key={value} value={value}>${value}</option>)}</select><small>{requestType === 'Reversal request' ? 'Fixed at $500.00 for the approved reversal simulation.' : 'Information cases remain open for human review.'}</small></label>
        <label className="field-label">Synthetic transaction reference<input value={transactionReference(id)} readOnly /><small>Generated automatically with the unique case ID.</small></label>
        <label className="field-label description-field">Short request description<select required value={description} onChange={event => setDescription(event.target.value)}><option value="">Select a synthetic description</option>{descriptions[requestType].map(text => <option key={text}>{text}</option>)}</select>{description && <small className="description-preview">{description}</small>}</label>
      </div>
      <div className="action-group"><button className="primary-button enabled" type="submit" disabled={role !== 'CSR'}>Create fictional case</button><button className="secondary-button" type="button" onClick={onCancel}>Cancel</button></div>
      {role !== 'CSR' && <p className="authority-note">Only a simulated human CSR may create a fictional case. Switch back to CSR to continue.</p>}
      <p className="disabled-note">Creation does not verify identity or grant approval. Cases and audit events reset on refresh.</p>
    </form>
  </section>
}
