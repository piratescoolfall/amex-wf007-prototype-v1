import { displayText, customerDisplayName } from './presentation.js'
import { useState } from 'react'
import { syntheticCustomers, requestTypes, descriptions, fictionalAmounts, nextSyntheticId, transactionReference } from './caseCreation.js'

export default function CreateCaseForm({ cases, role, onCreate, onCancel }) {
  const [customer, setCustomer] = useState('')
  const [requestType, setRequestType] = useState('Reversal request')
  const [amount, setAmount] = useState('500.00')
  const [description, setDescription] = useState('')
  const id = nextSyntheticId(cases)
  return <section className="panel create-case-panel" aria-labelledby="create-case-title">
    <div className="panel-heading"><div><p className="eyebrow">CASE INTAKE</p><h2 id="create-case-title">Create New Case</h2><p>Select a customer and request details from the available options.</p></div><span className="queue-count">Starts open · Unverified</span></div>
    <form onSubmit={event => { event.preventDefault(); onCreate({ customer, requestType, amount, description }) }}>
      <div className="create-case-grid">
        <label className="field-label">Customer name<select autoFocus required value={customer} onChange={event => setCustomer(event.target.value)}><option value="">Select a customer</option>{syntheticCustomers.map(name => <option key={name} value={name}>{customerDisplayName(name)}</option>)}</select></label>
        <label className="field-label">Request type<select value={requestType} onChange={event => { setRequestType(event.target.value); setDescription(''); setAmount('500.00') }}>{requestTypes.map(type => <option key={type}>{type}</option>)}</select></label>
        <label className="field-label">Transaction amount<select value={amount} disabled={requestType === 'Reversal request'} onChange={event => setAmount(event.target.value)}>{(requestType === 'Reversal request' ? ['500.00'] : fictionalAmounts).map(value => <option key={value} value={value}>${value}</option>)}</select><small>{requestType === 'Reversal request' ? 'This reversal request is fixed at $500.00.' : 'Information cases remain open for human review.'}</small></label>
        <label className="field-label">Transaction reference<input value={transactionReference(id)} readOnly /><small>Generated automatically with the unique case ID.</small></label>
        <label className="field-label description-field">Short request description<select required value={description} onChange={event => setDescription(event.target.value)}><option value="">Select a request description</option>{descriptions[requestType].map(text => <option key={text} value={text}>{displayText(text)}</option>)}</select>{description && <small className="description-preview">{displayText(description)}</small>}</label>
      </div>
      <div className="action-group"><button className="primary-button enabled" type="submit" disabled={role !== 'CSR'}>Create Case</button><button className="secondary-button" type="button" onClick={onCancel}>Cancel</button></div>
      {role !== 'CSR' && <p className="authority-note">Only a CSR may create a case. Select the CSR role to continue.</p>}
      <p className="disabled-note">Creation does not verify identity or grant approval. Cases and audit events reset on refresh.</p>
    </form>
  </section>
}
