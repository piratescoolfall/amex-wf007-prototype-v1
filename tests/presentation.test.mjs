import test from 'node:test'
import assert from 'node:assert/strict'
import { displayData, displayText, customerDisplayName, supervisorApprovalStatus, auditDisplayData } from '../src/presentation.js'
import { createCases, transition } from '../src/workflow.js'

test('presentation formatting does not mutate cases, reports or audit records', () => {
  let item = createCases()[0]
  item = transition(item, 'CSR', 'verify', {attested:true}).item
  item = transition(item, 'CSR', 'ai', {mode:'usable'}).item
  const snapshot = JSON.stringify(item)
  const shown = displayData(item.ai.report)
  assert.equal(JSON.stringify(item), snapshot)
  assert.notEqual(shown.customerRequestSummary, item.ai.report.customerRequestSummary)
  assert.ok(shown.customerRequestSummary.includes(customerDisplayName(item.customer)))
  assert.ok(!/\b(fictional|synthetic|classroom|simulation|prototype|fixture|mock)\b/i.test(JSON.stringify(shown)))
  assert.equal(shown.caseId, item.id)
  assert.equal(shown.verificationStatus.method, item.verificationMethod)
  assert.equal(item.audit.at(-1).details.label, 'Simulated AI')
})
test('approval and action wording retains simulated context', () => {
  assert.ok(displayText('Supervisor approval recorded.').includes('Supervisor approval recorded'))
  assert.ok(displayText('Mock reversal succeeded.').toLowerCase().includes('mock') === false)
  assert.ok(displayText('The mock reversal attempt failed.').includes('No live transaction processed'))
})


test('Supervisor Approval reflects existing authority and evidence without creating decisions',()=>{
 const item=createCases()[0]
 assert.equal(supervisorApprovalStatus(item),'Pending')
 assert.equal(supervisorApprovalStatus({...item,evidence:false}),'More Information Required')
 assert.equal(supervisorApprovalStatus({...item,disposition:'rejected'}),'Rejected')
 assert.equal(supervisorApprovalStatus({...item,approval:{revision:item.revision,policyVersion:'AMX-routing-1',ruleId:'reversal-500'}}),'Approved')
 assert.equal(supervisorApprovalStatus({...item,approval:{revision:0}}),'Pending')
 for(const s of [createCases()[1],{...item,closureOutcome:'cancelled'},{...item,closureOutcome:'incomplete-verification'}])assert.equal(supervisorApprovalStatus(s),'Not Required')
 assert.equal(item.approval,null)
})
test('audit presentation preserves raw metadata and removes technical environment labels',()=>{
 const raw={simulationOnly:true,realAccountChange:false,syntheticNote:'Original synthetic request',label:'Simulated AI'}
 const snapshot=JSON.stringify(raw);const shown=auditDisplayData(raw)
 assert.equal(JSON.stringify(raw),snapshot)
 assert.equal(shown.Environment,'Training');assert.equal(shown['Live account change'],false)
 assert.ok(!/\b(simulated|simulation|synthetic|fictional|mock|prototype|demo)\b/i.test(JSON.stringify(shown)))
})
