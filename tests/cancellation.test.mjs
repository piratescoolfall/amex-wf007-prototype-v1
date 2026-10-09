import test from 'node:test'
import assert from 'node:assert/strict'
import { createCases, transition, caseStatus, cancellationReasons, cancellationBlockedMessage } from '../src/workflow.js'
import { createCase, syntheticCustomers, descriptions } from '../src/caseCreation.js'
import { draftCustomerCommunication } from '../src/caseReport.js'
const timestamp='2026-10-09T19:00:00.000Z'
const payload={reason:cancellationReasons[0],confirmed:true}
const ok=(s,a,p={},role='CSR')=>{const r=transition(s,role,a,p,timestamp);assert.equal(r.blocked,false,r.message);return r.item}
const deny=(s,a,p={},role='CSR')=>{const r=transition(s,role,a,p,timestamp);assert.equal(r.blocked,true,r.message);const {audit:before,...old}=s;const {audit:after,...current}=r.item;assert.deepEqual(current,old);assert.equal(after.length,before.length+1);assert.equal(after.at(-1).type,'blocked_action');return r}
const verified=(s=createCases()[0])=>ok(s,'verify',{attested:true})
const report=()=>ok(verified(),'ai',{mode:'usable'})
const assessed=()=>ok(report(),'assess',{method:'ai',reviewed:true})
const escalated=()=>ok(assessed(),'escalate')
const approved=()=>ok(escalated(),'approve',{confirmed:true},'Supervisor')
for(const reason of cancellationReasons)test(`cancellation reason ${reason} records CSR decision, closure, timestamp and transition`,()=>{
 const s=ok(verified(),'cancel',{reason,confirmed:true})
 assert.equal(caseStatus(s),'Closed — Cancelled');assert.equal(s.status,'closed');assert.equal(s.disposition,'cancelled');assert.equal(s.closureOutcome,'cancelled');assert.equal(s.cancellationReason,reason);assert.equal(s.actionResult,null);assert.equal(s.approval,null)
 const events=s.audit.slice(-3);assert.deepEqual(events.map(e=>e.type),['human_decision','human_closure_confirmation','case_transition'])
 for(const event of events){assert.equal(event.caseId,s.id);assert.equal(event.actor,'CSR');assert.equal(event.timestamp,timestamp);assert.equal(event.details.reason,reason);assert.equal(event.details.simulationOnly,true)}
 assert.deepEqual(JSON.parse(JSON.stringify(s)),s)
})
test('all case types and newly created case can cancel after verification without assessment',()=>{
 const added=createCase(createCases(),'CSR',{customer:syntheticCustomers[0],requestType:'Reversal request',amount:'500.00',description:descriptions['Reversal request'][0]}).item
 for(const item of [...createCases(),added])assert.equal(ok(verified(item),'cancel',payload).closureOutcome,'cancelled')
})
test('verified, assessed, escalated, approved and rejected cases can cancel before reversal',()=>{
 for(const item of [verified(),report(),assessed(),escalated(),approved(),ok(escalated(),'reject',{confirmed:true},'Supervisor')]){
 const s=ok(item,'cancel',payload);assert.equal(s.status,'closed');assert.equal(s.approval,null);assert.equal(s.escalated,false)
 if(s.ai?.report){assert.ok(s.ai.report.draftCustomerCommunication.text.includes('cancelled and closed'));assert.ok(s.ai.report.humanDecisions.cancellation.includes(payload.reason));assert.equal(s.audit.filter(e=>e.type==='simulated_ai_output').length,1);assert.deepEqual(s.audit.find(e=>e.type==='simulated_ai_output'),item.audit.find(e=>e.type==='simulated_ai_output'))}
 }
})
test('cancellation preserves verification and evidence gates',()=>{
 deny(createCases()[0],'cancel',payload)
 deny({...verified(),verificationRevision:0},'cancel',payload)
 deny({...verified(),verificationMethod:'invalid'},'cancel',payload)
 deny({...verified(),evidence:false},'cancel',payload)
 deny({...verified(),status:'invalid'},'cancel',payload)
})
for(const role of ['Supervisor','AI','Administrator',''])test(`${role || 'missing'} role cannot cancel`,()=>deny(verified(),'cancel',payload,role))
test('preset reason and strict explicit human confirmation required; arbitrary input never logged',()=>{
 for(const p of [{confirmed:true},{reason:'DO_NOT_STORE',confirmed:true},{reason:0,confirmed:true},{reason:cancellationReasons[0]},{reason:cancellationReasons[0],confirmed:false},{reason:cancellationReasons[0],confirmed:'yes'}]){const r=deny(verified(),'cancel',p);assert.ok(!JSON.stringify(r.item).includes('DO_NOT_STORE'))}
})
for(const outcome of ['success','failed'])test(`processed ${outcome} reversal blocks cancellation and requires separate Supervisor review`,()=>{
 const s=ok(approved(),'reverse',{outcome});const result=deny(s,'cancel',payload);assert.equal(result.message,cancellationBlockedMessage);assert.equal(result.item.actionResult,outcome);assert.ok(!result.item.audit.some(e=>e.type==='case_transition'&&e.details.outcome==='cancelled'))
})
test('cancelled cases block all subsequent processing and duplicate closure with no state mutation',()=>{
 const s=ok(approved(),'cancel',payload)
 for(const a of ['ai','assess','approve','reject','reverse','cancel','close','close_incomplete','verify','material','escalate','withdraw'])deny(s,a,{...payload,mode:'usable',method:'manual',reviewed:true,outcome:'success',attested:true,evidence:true,note:'Original synthetic request'},['approve','reject'].includes(a)?'Supervisor':'CSR')
 assert.ok(draftCustomerCommunication(s).includes('No reversal or account change was performed'))
})
test('legacy withdraw action is no longer available; incomplete and resolved closure stay distinct',()=>{
 deny(escalated(),'withdraw',{confirmed:true})
 const incomplete=ok(createCases()[0],'close_incomplete',{reason:'Required synthetic evidence unavailable',confirmed:true});deny(incomplete,'cancel',payload)
 const resolved=ok(ok(approved(),'reverse',{outcome:'success'}),'close',{confirmed:true});deny(resolved,'cancel',payload)
 assert.equal(caseStatus(resolved),'Closed — Successfully Resolved');assert.equal(caseStatus(incomplete),'Closed — Incomplete Verification')
})
