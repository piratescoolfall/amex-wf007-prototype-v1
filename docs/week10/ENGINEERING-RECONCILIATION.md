# WP-06A / WP-06B — implementation reconciliation

Product V1.0 Candidate — Week 10 Demo 2. Source SHA: e16b9967aaa2bf2ab6f595a76c3ac07b21638041. Branch: week10-product-v1-candidate. npm version: 0.1.0. Documentation date: October 23, 2026 (America/New_York). Packaging Git commit: none created.

## 6A.1 ENGAUTH

The user identified themselves as Product Owner, approved Week 10 guard corrections, explicitly stated Week 9 Engineering Readiness Gate approval, and approved documentation/evidence/packaging in this task conversation. Scope: exact source/dependencies preserved; package and validate, then stop for final review. Original formal approval record, workbook entry and additional gate conditions were not supplied. No unspecified condition or formal record invented. OneDrive workbook remains authoritative and was not accessed/updated/duplicated. No final freeze, release, main merge or Canvas submission.

## 6A.2 COMP — provisional VIS-07 text

Original conceptual production VIS-07 source/export unavailable. This is an actual-implementation description, not a reconstruction or replacement.

React App owns navigation, selected role and useReducer state. caseCreation.caseStore calls workflow.transition. Guards call verification and versioned approvalRouting; caseReport deterministically formats advisory text. presentation formats UI, WorkflowScreen exposes controls, App exports memory audit JSON. Vite is build/dev tooling; preview serves built assets. No app backend.

Future-state only: identity provider/SSO/MFA, server authorization, persistent storage/evidence vault, live approved AI gateway, financial adapters, durable queues/recovery, enterprise monitoring/SIEM. Conceptual boxes do not prove deployment. Original VIS-07/workbook references remain outstanding.

## 6A.3 UX — provisional VIS-08 text

Original visual unavailable. Queue/preset creation -> assigned fictional verification method -> CSR attestation -> AI report -> explicit human review/uncertainty acknowledgment -> route. Exact $500: escalation -> Supervisor decision -> separate CSR mock reversal -> separate CSR closure. Routine information: separate CSR completion/closure, no financial authority. Unsupported/exception cases hold for review.

Rejected stays open unless separately eligible cancellation before processing. Failed action cannot cancel or close. Pre-action cancellation and narrow incomplete-verification closure are separate approved human decisions granting no financial authority. Refresh resets all. Export grants no authority. Protected transitions are guarded independently of disabled buttons.

Original VIS-08/export still missing; this provisional text does not claim exact visual reconciliation.

## 6A.4 FLOW — provisional VIS-09 text

Original visual unavailable. Synthetic facts -> current-revision CSR verification -> deterministic report using supplied facts/project rules -> human-reviewed assessment -> human approval where required -> separately triggered mock result -> explicit closure. Accepted/blocked commands produce case/revision/client timestamp/actor/routing metadata and outcomes. Export copies records without changing case state.

Usable uncertainty is displayed with warning and requires acknowledgment. Only current failed/unusable/unavailable AI permits manual fallback. Material changes reset verification/assessment/approval; new AI/review invalidates approval. Test interception supplies alternate outcomes. No real verification secrets/documents, model API messages, financial integrations or persistent audit stream. VIS-09/workbook reference remains missing.

## 6A.5 IAMIMPL / 6A.6 AIINT

workflow guards enforce simulated roles, verification/evidence/revision, versioned approval and strict true confirmations. Approval/action/closure are separate. AI never verifies, approves, executes or closes. Client role selections are not authenticated identity/server RBAC; client state can be manipulated. Verification is attestation and AI is local deterministic formatting, not live GenAI.

## 6A.7 design consistency

VIS-05/06 and design-to-build-map are retained context. Later-approved routing/cancellation/incomplete closure supersede earlier historical prose. Candidate now centrally enforces fallback eligibility and strict confirmations. Provisional texts separate implemented and future-state; original VIS-07/08/09 reconciliation is partial, not asserted complete.

## 6B.1 CTRLIMPL — traceability

| Control | Code | Tests/evidence |
| --- | --- | --- |
| Mandatory verification before AI/manual assessment | src/verification.js; workflow.js guard | workflow/report-verification tests; browser scenarios 2–4 |
| Bounded report/uncertainty | caseReport.js; workflow.js; WorkflowScreen.jsx | report-verification tests; browser scenarios 5–7 |
| Current failed AI before fallback | workflow.js assess guard | direct manual fallback requires a current failure result |
| Strict true/malformed payload fail-closed | workflow.js guard | four new Week 10 tests in tests/workflow.test.mjs |
| Routing/current approval | approvalRouting.js; workflow.js | approval-routing tests; browser scenarios 8, 13–15 |
| Separate CSR action/closure; failure hold | workflow.js | workflow tests; browser scenarios 9, 12, 13 |
| Cancellation/incomplete boundaries | workflow.js; verification.js | cancellation/report tests; browser scenarios 2, 10–12 |
| Safe preset creation | caseCreation.js | case-creation tests, nine creation browser scenarios |
| Audit/export/reset | workflow.js transition/log; App.jsx exportAudit | success-audit.json, scenario exports, refresh tests |

All source paths above are under src/. Tests under tests/. Evidence: docs/test-artifacts/week10-hardening/. Alternate outcome tests are explicitly fixtures, not UI features.

## 6B.2 RDEPIMPL

Lockfile fixes install versions. Registry access, external Playwright/browser, localhost and execution permissions affect reproduction. Retain original missing-tool/DNS/sandbox failures and approved elevated successes; new Windows validation is separate. No dependency manifest change.

Missing evidence blocks processing. Unsupported cases hold. Failed action/rejection never auto-close. Failure permits gated manual review; unavailable verification/approval cannot be bypassed. Durable recovery, concurrent-user consistency, retry/undo/corrective financial workflows remain unimplemented.

## 6B.3 OBS

Events cover verification_attestation, blocked_action, simulated_ai_output, human_assessment, supervisor_review_requested, supervisor_approval/human_decision, csr_mock_reversal_triggered, simulated_action_result, csr_request_completed, human_closure_confirmation, case_transition and authority invalidations. Case/revision, client timestamps and routing version/rule/reason aid traceability. No verification secrets collected.

JSON is observable classroom evidence, not durable/tamper-resistant logging. Refresh erases state; roles and timestamps are client-controlled. No enterprise monitoring/alerting.

## 6B.4 PCFG / 6B.5 BDEC / 6B.6 D2CHK / 6B.7 PKG6

See PCFG.md, D2CHK.md, PKG6-INDEX.md. Decisions: preserve existing application and later-approved workflows; correct only guard gaps; reject malformed payloads without logging submitted values; retain npm 0.1.0; preserve failures/post-test-manifest limitation; export canonical bytes; distinguish source SHA, local uncommitted packaging docs and ZIP checksum; provisional text instead of fabricated original visuals; OneDrive authoritative and unchanged.

## Week 11 and limitations

Formal V&V must still establish acceptance/intended-use coverage and independently assess applicable safeguards. Production identity, server authorization, integrity, concurrency, recovery, monitoring and security validation remain unestablished. Classroom unit/browser checks do not certify them. Original visual/workbook references and recording remain review gaps.


## New package-preparation validation — October 23, 2026

Canonical source hashes matched before execution and after browser checks. Locked installation, 150 unit tests, lint, foundation check and build passed on Windows Node 24.19.0/npm 11.17.0. All 16 workflow and 9 creation browser scenarios passed with Chromium 156.0.8078.4 and zero page errors. Built preview returned HTTP 200 and passed unverified blocking, verification, assessment, approval, separate CSR reversal, explicit closure and JSON-export smoke checks with zero page errors. These checks do not establish production readiness.

Initial npm ci failed with EPERM creating a scoped dependency directory. Creating the writable empty directory and retrying succeeded; no dependency versions changed. Initial browser checks failed because downloads were canceled, and the preview launcher initially used an incorrect browser cache. They are retained under package-validation/browser-initial-attempt. Retry used external writable TEMP/TMP/download paths and a Playwright launch adapter; no application or committed tests changed. External Playwright 1.64.1 was installed outside the package.

A current npm audit reported one high-severity advisory for development dependency zod 4.6.5, reached through eslint-plugin-react-hooks (and zod-validation-error): GHSA-mrhx-c7xc-m3w5, oversized constrained collections can exhaust memory. Runtime-only npm audit --omit=dev reported zero findings. This is a recorded dependency finding, not a claim of general security. No audit fix or dependency update was applied because the approved source/lockfile must remain exact. Product Owner should review this finding before any future freeze/release. Audit JSON/dependency tree are included.

These are preparation-extraction results. Final exact ZIP extraction results and checksum are reported alongside the archive, avoiding self-reference. Missing original VIS-07/08/09 visuals/workbook references and pending recording/submission remain explicit.


## Navigable implementation/evidence references

- Verification and transition controls: [workflow.js](../../src/workflow.js), [verification.js](../../src/verification.js), [workflow regression tests](../../tests/workflow.test.mjs), [verification/report tests](../../tests/report-verification.test.mjs).
- Routing and case creation: [routing](../../src/approvalRouting.js), [routing tests](../../tests/approval-routing.test.mjs), [creation](../../src/caseCreation.js), [creation tests](../../tests/case-creation.test.mjs).
- Human UI and audit export: [App](../../src/App.jsx), [workflow screen](../../src/WorkflowScreen.jsx), [cancellation tests](../../tests/cancellation.test.mjs).
- [Original evidence summary](../test-artifacts/week10-hardening/README.md), [unit log](../test-artifacts/week10-hardening/unit.txt), [workflow browser results](../test-artifacts/week10-hardening/regression/browser-results.json), [creation browser results](../test-artifacts/week10-hardening/create-case/browser-results.json), [original provenance manifest](../test-artifacts/week10-hardening/SHA256-MANIFEST.json).
- [New extraction validation](package-validation/VALIDATION-SUMMARY.md), [new checks](package-validation/checks.json), [new browser checks](package-validation/browser-checks.json), [dependency audit](package-validation/npm-audit.json), [runtime audit](package-validation/npm-audit-runtime.json).


## GitHub publication context

Prepared for the validated ZIP before the subsequent documentation-only GitHub publication. No-packaging-commit statements describe that unchanged archive snapshot. Application source remains e16b9967aaa2bf2ab6f595a76c3ac07b21638041; later publication commit is separate. See [PUBLICATION.md](PUBLICATION.md) for identity distinctions, current evidence links and commit discovery. ZIP is not committed or regenerated.
