import test from 'node:test'
import assert from 'node:assert/strict'
import { createCases, transition, supervisorMessage } from '../src/workflow.js'
const fresh = () => createCases()[0]
const run = (s, a, p = {}, r = 'CSR') => transition(s, r, a, p, '2026-10-09T19:00:00.000Z')
const ok = (s, a, p, r) => { const result = run(s,a,p,r); assert.equal(result.blocked,false,result.message); return result.item }
const blocked = (s,a,p,r,message) => { const result=run(s,a,p,r); assert.equal(result.blocked,true); const {audit: before,...state}=s; const {audit: after,...next}=result.item; assert.deepEqual(next,state); assert.equal(after.length,before.length+1); assert.equal(after.at(-1).type,'blocked_action'); if(message) assert.equal(result.message,message); return result.item }
const verified = () => ok(fresh(),'verify',{attested:true})
const assessed = () => ok(ok(verified(),'ai',{mode:'failed'}),'assess',{method:'manual',reviewed:true})
const escalated = () => ok(assessed(),'escalate')
const approved = () => ok(escalated(),'approve',{confirmed:true},'Supervisor')
for(const action of ['ai','assess','escalate','approve','reject','close']) test(`unverified ${action} blocked`,()=>blocked(fresh(),action,{mode:'usable',method:'manual',reviewed:true,confirmed:true},['approve','reject'].includes(action)?'Supervisor':'CSR'))
for(const role of ['Supervisor','AI','Administrator','']) test(`${role || 'empty'} cannot attest`,()=>blocked(fresh(),'verify',{attested:true},role))
for(const action of ['ai','assess','material','escalate','reverse','close','withdraw']) test(`Supervisor cannot ${action}`,()=>blocked(approved(),action,{mode:'usable',method:'manual',reviewed:true,confirmed:true,outcome:'success',evidence:true,note:'Original synthetic request'},'Supervisor'))
for(const action of ['approve','reject']) test(`CSR cannot ${action}`,()=>blocked(escalated(),action,{confirmed:true}))
test('explicit attestation required and duplicate blocked',()=>{blocked(fresh(),'verify',{attested:false}); blocked(verified(),'verify',{attested:true})})
test('missing evidence invalidates authority and blocks all processing',()=>{const s=ok(approved(),'material',{evidence:false,note:'Original synthetic request'}); assert.equal(s.verified,false); assert.equal(s.approval,null); blocked(s,'verify',{attested:true}); blocked(s,'ai',{mode:'usable'}); blocked(s,'assess',{method:'manual',reviewed:true})})
test('changed/conflicting context requires fresh verification and approval',()=>{const s=ok(approved(),'material',{evidence:true,note:'Fictional duplicate-charge context added'}); assert.equal(s.revision,2); assert.equal(s.approval,null); assert.equal(s.assessment,null); assert.equal(s.escalated,false); blocked(s,'reverse',{outcome:'success'},'CSR',supervisorMessage); assert.ok(s.audit.some(e=>e.type==='prior_authority_invalidated'))})
for(const mode of ['usable','uncertain','unusable','failed','unavailable']) test(`AI ${mode} deterministic, advisory, reviewed or manual fallback`,()=>{const s=verified(); const a=ok(s,'ai',{mode}); assert.deepEqual(a.ai,ok(s,'ai',{mode}).ai); assert.equal(a.ai.label,'Simulated AI'); assert.equal(a.approval,null); assert.equal(a.actionResult,null); assert.equal(a.status,'open'); if(['failed','unusable','unavailable'].includes(mode)){blocked(a,'assess',{method:'ai',reviewed:true}); assert.equal(ok(a,'assess',{method:'manual',reviewed:true}).assessment.method,'manual')}else{if(mode==='uncertain') blocked(a,'assess',{method:'ai',reviewed:true}); assert.equal(ok(a,'assess',{method:'ai',reviewed:true,uncertaintyAcknowledged:true}).assessment.method,'ai')} })
test('AI cannot perform privileged transitions',()=>{for(const a of ['approve','reverse','close']) blocked(approved(),a,{confirmed:true,outcome:'success'},'AI')})
test('invalid modes and absent human review blocked',()=>{blocked(verified(),'ai',{mode:'invalid'}); blocked(verified(),'assess',{method:'manual',reviewed:false}); blocked(verified(),'assess',{method:'ai',reviewed:true})})
test('approval needs escalation and explicit human decision',()=>{blocked(assessed(),'approve',{confirmed:true},'Supervisor'); blocked(escalated(),'approve',{confirmed:false},'Supervisor'); const s=approved(); assert.equal(s.actionResult,null); assert.equal(s.status,'open'); blocked(s,'approve',{confirmed:true},'Supervisor')})
for(const action of ['ai','assess']) test(`${action} invalidates prior approval`,()=>{const s=ok(approved(),action,action==='ai'?{mode:'usable'}:{method:'manual',reviewed:true}); assert.equal(s.approval,null); assert.equal(s.escalated,false); blocked(s,'reverse',{outcome:'success'},'CSR',supervisorMessage)})
test('stale approval and stale assessment blocked at execution',()=>{const s=approved(); blocked({...s,approval:{...s.approval,revision:0}},'reverse',{outcome:'success'},'CSR',supervisorMessage); blocked({...s,assessment:{...s.assessment,revision:0}},'reverse',{outcome:'success'})})
for(const s of [fresh,verified,assessed,escalated]) test(`reversal without authorization (${s.name}) uses exact message`,()=>blocked(s(),'reverse',{outcome:'success'},'CSR',supervisorMessage))
test('failed reversal stays open, cannot retry or close',()=>{const s=ok(approved(),'reverse',{outcome:'failed'}); assert.equal(s.status,'open'); assert.equal(s.disposition,'failed-action'); blocked(s,'reverse',{outcome:'success'}); blocked(s,'close',{confirmed:true})})
for(const action of ['reject']) test(`${action} remains unresolved`,()=>{const s=ok(escalated(),action,{confirmed:true},action==='reject'?'Supervisor':'CSR'); assert.equal(s.status,'open'); assert.equal(s.actionResult,null); blocked(s,'close',{confirmed:true}); blocked(s,'reverse',{outcome:'success'})})
test('successful $500 path separates recommendation approval action and human closure',()=>{let s=verified(); s=ok(s,'ai',{mode:'usable'}); s=ok(s,'assess',{method:'ai',reviewed:true}); s=ok(s,'escalate'); s=ok(s,'approve',{confirmed:true},'Supervisor'); blocked(s,'close',{confirmed:true}); s=ok(s,'reverse',{outcome:'success'}); assert.equal(s.status,'open'); blocked(s,'reverse',{outcome:'success'}); blocked(s,'material',{evidence:false,note:'Original synthetic request'}); blocked(s,'close',{confirmed:false}); s=ok(s,'close',{confirmed:true}); assert.equal(s.status,'closed'); blocked(s,'close',{confirmed:true}); const types=s.audit.map(e=>e.type); for(const t of ['verification_attestation','simulated_ai_output','human_assessment','supervisor_review_requested','supervisor_approval','csr_mock_reversal_triggered','simulated_action_result','human_closure_confirmation','case_transition']) assert.ok(types.includes(t)); assert.equal(s.approval.amount,'$500.00'); assert.equal(new Set(s.audit.map(e=>e.id)).size,s.audit.length); for(const e of s.audit) assert.equal(e.caseId,s.id); assert.deepEqual(JSON.parse(JSON.stringify(s.audit)),s.audit)})
for(const index of [1,2]) test(`information case ${index} has no reversal or closure before explicit CSR completion`,()=>{let s=ok(createCases()[index],'verify',{attested:true}); s=ok(ok(s,'ai',{mode:'failed'}),'assess',{method:'manual',reviewed:true}); blocked(s,'escalate'); blocked(s,'close',{confirmed:true}); assert.equal(s.status,'open')})
test('fresh session resets all cases and audit',()=>{approved(); for(const s of createCases()){assert.equal(s.verified,false); assert.equal(s.status,'open'); assert.deepEqual(s.audit,[])}})

test('role-specific denials preserve authority and record blocked attempts',()=>{
 const supervisorMessage='Supervisor Access Required. Only a Supervisor can review and approve this request.'
 for(const action of ['approve','reject'])blocked(escalated(),action,{confirmed:true},'CSR',supervisorMessage)
 for(const action of ['verify','ai','assess','reverse','close','cancel','complete_request'])blocked(approved(),action,{confirmed:true,attested:true,mode:'usable',method:'manual',reviewed:true,outcome:'success'},'Supervisor','CSR Access Required. Only a CSR can perform this action.')
})

test('direct manual fallback requires a current failure result',()=>{
 for(const ai of [null, {mode:'usable',revision:1}, {mode:'uncertain',revision:1}, {mode:'failed',revision:0}, {mode:'unavailable'}, {mode:'invalid',revision:1}]) blocked({...verified(),ai},'assess',{method:'manual',reviewed:true})
 for(const mode of ['failed','unusable','unavailable']) {
  const s=ok(verified(),'ai',{mode})
  assert.equal(ok(s,'assess',{method:'manual',reviewed:true}).assessment.method,'manual')
  const changed=ok(s,'material',{evidence:true,note:'Fictional duplicate-charge context added'})
  blocked(ok(changed,'verify',{attested:true}),'assess',{method:'manual',reviewed:true})
 }
})

const nonTrue = [undefined,null,false,0,1,'true','false','',[],{},[true]]
test('assessment review and required uncertainty acknowledgment accept only boolean true',()=>{
 for(const mode of ['usable','uncertain','failed','unusable','unavailable']) {
  const s=ok(verified(),'ai',{mode});const method=['usable','uncertain'].includes(mode)?'ai':'manual'
  for(const reviewed of nonTrue) blocked(s,'assess',{method,reviewed,uncertaintyAcknowledged:true})
 }
 const s=ok(verified(),'ai',{mode:'uncertain'})
 for(const uncertaintyAcknowledged of nonTrue) blocked(s,'assess',{method:'ai',reviewed:true,uncertaintyAcknowledged})
 assert.equal(ok(s,'assess',{method:'ai',reviewed:true,uncertaintyAcknowledged:true}).assessment.uncertaintyAcknowledged,true)
 const usable=ok(verified(),'ai',{mode:'usable'})
 assert.equal(ok(usable,'assess',{method:'ai',reviewed:true,uncertaintyAcknowledged:'true'}).assessment.uncertaintyAcknowledged,false)
})

test('Supervisor decisions and all completion/closure paths require boolean true',()=>{
 const routine=ok(ok(ok(createCases()[1],'verify',{attested:true}),'ai',{mode:'usable'}),'assess',{method:'ai',reviewed:true})
 const complete=ok(routine,'complete_request',{confirmed:true})
 const reversed=ok(approved(),'reverse',{outcome:'success'})
 for(const confirmed of nonTrue) {
  for(const action of ['approve','reject']) blocked(escalated(),action,{confirmed},'Supervisor')
  blocked(reversed,'close',{confirmed})
  blocked(routine,'complete_request',{confirmed})
  blocked(complete,'close',{confirmed})
  blocked(verified(),'cancel',{confirmed,reason:'Request no longer required'})
  blocked(fresh(),'close_incomplete',{confirmed,reason:'Simulated verification interrupted'})
 }
 assert.equal(ok(reversed,'close',{confirmed:true}).status,'closed')
 assert.equal(ok(complete,'close',{confirmed:true}).status,'closed')
})

test('malformed direct-call payloads fail closed and log only the blocked action',()=>{
 for(const payload of [null,false,true,0,1,'true',[],[{}]]) {
  for(const [s,action,role] of [[fresh(),'verify','CSR'],[verified(),'ai','CSR'],[assessed(),'assess','CSR'],[escalated(),'approve','Supervisor'],[escalated(),'reject','Supervisor'],[ok(approved(),'reverse',{outcome:'success'}),'close','CSR'],[verified(),'cancel','CSR'],[fresh(),'close_incomplete','CSR'],[verified(),'material','CSR']]) blocked(s,action,payload,role)
 }
})
