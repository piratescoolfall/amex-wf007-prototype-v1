import test from 'node:test'
import assert from 'node:assert/strict'
import { approvalRoutingPolicy, evaluateApprovalRouting, supervisorApprovalStatus } from '../src/approvalRouting.js'
import { createCases, transition, caseStatus } from '../src/workflow.js'
import { assessmentNextStep } from '../src/verification.js'
import { createCase, syntheticCustomers, descriptions } from '../src/caseCreation.js'
const fresh=()=>createCases()[1]
const ok=(s,a,p={},r='CSR')=>{const result=transition(s,r,a,p);assert.equal(result.blocked,false,result.message);return result.item}
const deny=(s,a,p={},r='CSR')=>{const result=transition(s,r,a,p);assert.equal(result.blocked,true,result.message);const {audit:before,...old}=s;const {audit:after,...next}=result.item;assert.deepEqual(next,old);assert.equal(after.length,before.length+1);assert.deepEqual(after.at(-1).routing,evaluateApprovalRouting(s));return result}
const verified=s=>ok(s,'verify',{attested:true})
const assessed=s=>ok(verified(s),'assess',{method:'manual',reviewed:true})
const completed=s=>ok(assessed(s),'complete_request',{confirmed:true})

test('rules distinguish routine requests, exact $500 reversal and unsupported cases',()=>{
 assert.equal(evaluateApprovalRouting(createCases()[0]).route,'supervisor')
 for(const s of createCases().slice(1))assert.equal(evaluateApprovalRouting(s).route,'csr')
 for(const s of [{...fresh(),requestType:'Account change'}, {...createCases()[0],amount:'$499.00'}, {...createCases()[0],requestType:'Transaction inquiry'}, {...fresh(),requiresAccountChange:true}, {...fresh(),evidenceConflict:true}, {...fresh(),evidenceConflict:undefined}])assert.equal(evaluateApprovalRouting(s).route,'hold')
 const config={...approvalRoutingPolicy,version:'project-test',routineRequestTypes:[]}
 assert.equal(evaluateApprovalRouting(fresh(),config).route,'hold');assert.equal(evaluateApprovalRouting(fresh(),config).policyVersion,'project-test')
 assert.equal(evaluateApprovalRouting(fresh(),{version:'invalid'}).route,'hold')
})
for(const i of [1,2])test(`routine case ${i} independently completes and closes through distinct CSR decisions`,()=>{
 let s=assessed(createCases()[i]);assert.equal(supervisorApprovalStatus(s),'Not Required');assert.equal(assessmentNextStep(s,'CSR'),'action');deny(s,'close',{confirmed:true});deny(s,'complete_request',{confirmed:false});deny(s,'complete_request',{confirmed:'yes'});deny(s,'complete_request',{confirmed:true},'Supervisor')
 s=ok(s,'complete_request',{confirmed:true});assert.equal(s.status,'open');assert.equal(s.approval,null);assert.equal(s.actionResult,null);assert.equal(s.audit.at(-1).type,'csr_request_completed');assert.deepEqual(s.audit.at(-1).routing,evaluateApprovalRouting(s));deny(s,'complete_request',{confirmed:true});deny(s,'ai',{mode:'usable'});deny(s,'close',{confirmed:'yes'});deny(s,'close',{confirmed:true},'Supervisor')
 s=ok(s,'close',{confirmed:true});assert.equal(caseStatus(s),'Closed — Successfully Resolved');for(const a of ['ai','complete_request','close','reverse','approve','cancel'])deny(s,a,{confirmed:true,mode:'usable'},a==='approve'?'Supervisor':'CSR');assert.deepEqual(JSON.parse(JSON.stringify(s)),s)
})
test('routine completion requires verification, evidence and reviewed assessment; no financial authority',()=>{
 for(const s of [fresh(),verified(fresh()),{...assessed(fresh()),evidence:false},{...assessed(fresh()),verificationRevision:0},{...assessed(fresh()),assessment:{revision:0}}])deny(s,'complete_request',{confirmed:true})
 const s=assessed(fresh());deny(s,'approve',{confirmed:true},'Supervisor');deny(s,'reverse',{outcome:'success'});deny(s,'escalate');assert.equal(s.approval,null)
})
test('exceptions can request human review but cannot approve, execute, complete or close',()=>{
 for(const patch of [{evidenceConflict:true},{requiresAccountChange:true},{requestType:'Unsupported'}]){
 let s=assessed({...fresh(),...patch});assert.equal(supervisorApprovalStatus(s),'More Information Required');assert.equal(assessmentNextStep(s,'CSR'),null);s=ok(s,'escalate');assert.equal(assessmentNextStep(s,'CSR'),'supervisor');assert.equal(s.approval,null)
 for(const a of ['complete_request','approve','reverse','close'])deny(s,a,{confirmed:true,outcome:'success'},a==='approve'?'Supervisor':'CSR')
 }
})
test('material exception changes reevaluate routing and invalidate authority with revision metadata',()=>{
 let s=assessed(createCases()[0]);s=ok(s,'escalate');s=ok(s,'approve',{confirmed:true},'Supervisor')
 s=ok(s,'material',{evidence:true,note:'Original synthetic request',evidenceConflict:true});assert.equal(s.revision,2);assert.equal(s.verified,false);assert.equal(s.approval,null);assert.equal(s.assessment,null);assert.equal(evaluateApprovalRouting(s).route,'hold');assert.equal(s.audit.at(-1).routing.caseRevision,2);deny(s,'reverse',{outcome:'success'})
 s=ok(s,'material',{evidence:true,note:'Original synthetic request',evidenceConflict:false});assert.equal(evaluateApprovalRouting(s).route,'supervisor');deny(s,'reverse',{outcome:'success'})
})
test('current rule version and matched rule must bind Supervisor authority',()=>{
 let s=ok(assessed(createCases()[0]),'escalate');s=ok(s,'approve',{confirmed:true},'Supervisor');assert.equal(supervisorApprovalStatus(s),'Approved');deny(s,'complete_request',{confirmed:true})
 for(const patch of [{policyVersion:'old'},{ruleId:'routine-information'},{revision:0}]){const stale={...s,approval:{...s.approval,...patch}};assert.equal(supervisorApprovalStatus(stale),'Pending');deny(stale,'reverse',{outcome:'success'})}
 assert.equal(ok(s,'reverse',{outcome:'success'}).actionResult,'success')
})
test('routine report and draft reflect no approval requirement and explicit completion without fabricated reversal',()=>{
 let s=ok(verified(fresh()),'ai',{mode:'usable'});const original=JSON.stringify(s.audit.find(e=>e.type==='simulated_ai_output'));assert.ok(s.ai.report.humanDecisions.approval.includes('Not Required'));assert.equal(s.ai.report.routing.route,'csr')
 s=ok(s,'assess',{method:'ai',reviewed:true});s=ok(s,'complete_request',{confirmed:true});assert.ok(s.ai.report.draftCustomerCommunication.text.includes('remains open'));s=ok(s,'close',{confirmed:true});assert.ok(s.ai.report.draftCustomerCommunication.text.includes('Supervisor approval was not required'));assert.ok(!s.ai.report.draftCustomerCommunication.text.includes('successful mock reversal'));assert.equal(JSON.stringify(s.audit.find(e=>e.type==='simulated_ai_output')),original)
})
test('new routine cases retain specific type and creation routing evidence',()=>{
 for(const requestType of approvalRoutingPolicy.routineRequestTypes){const s=createCase(createCases(),'CSR',{customer:syntheticCustomers[0],requestType,amount:'500.00',description:descriptions[requestType][0]}).item;assert.equal(s.requestType,requestType);assert.equal(s.audit[0].routing.ruleId,'routine-information');assert.equal(ok(completed(s),'close',{confirmed:true}).status,'closed')}
})
