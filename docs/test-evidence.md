# Step 4 — Formal Prototype V1 Testing

Executed October 9, 2026 against approved baseline `8bf38157` (`8bf3815` in short Git output). Starting checkout was clean. Read `AGENTS.md`, `docs/design-to-build-map.md`, `docs/VIS-05.md`, `docs/VIS-06.md`, README, and the earlier Phase 1 validation before testing. The Product Owner authorized Step 4 testing and fixes without changing approved rules. WP-04A itself is not present; the three approved local design documents supplied the acceptance oracle.

All customers, cases, inputs, AI outputs, decisions, and exported artifacts are fictional classroom data. No real customer data, credentials, paid services, live AI, banking, or payment integration was used.

## Results

Final total: **53 checks/scenarios passed, 0 failed**: 43 automated workflow tests, 9 automated Chromium interaction scenario groups, and 1 initial-render smoke check. Scenario groups contain multiple assertions; these counts are not individual assertion counts. Build, lint, and whitespace checks passed separately. No application business-rule failures were found. One outdated smoke-test failure was corrected and retested. Browser setup failures were environmental and resolved before interaction testing.

Environment: Node.js 24.21.0, npm 11.19.0, Vite 8.3.4, headless Chromium 156.0.8078.4 via Playwright. Browser exercised the real React app at `http://localhost:5173` with a 1280×720 viewport. Test results are saved in [test-artifacts](test-artifacts/).

| Requested area | Actual checks and result | Evidence |
| --- | --- | --- |
| 1. Mandatory verification and bypasses | PASS: direct AI, assessment, escalation, Supervisor decisions, and closure attempts without verification blocked. Missing explicit attestation and repeat attestation blocked. Browser AI/manual/AI-review attempts blocked before verification and audited; unauthorized attestation blocked. | `workflow.txt`; browser scenario 1; `scenario-1-audit.json` |
| 2. Unauthorized CSR/Supervisor actions | PASS: Supervisor cannot attest, assess, change evidence, escalate, reverse, withdraw, or close; CSR cannot approve/reject. AI, invalid, and absent roles cannot attest. AI cannot approve, reverse, or close. Browser wrong-role attestation, approval, reversal, and closure blocked. | `workflow.txt`; browser scenarios 1 and 5; scenario audit exports |
| 3. Missing/conflicting evidence | PASS within available presets: removing evidence invalidates verification, assessment, escalation, and approval; attestation and processing blocked. Changed duplicate-charge context increments revision and invalidates prior authority. Reversal with old authority blocked. | Workflow evidence/context tests; browser scenario 2; `scenario-2-audit.json` |
| 4. AI success, uncertainty, failure, fallback | PASS: all four outcomes deterministic and labeled Simulated AI. Usable output requires explicit review. Uncertain output remains visible with alert and requires acknowledgment for AI review. Failed/unusable output cannot support AI assessment; manual fallback succeeds only after verification and human review. No outcome executes or grants approval. | Workflow four-mode tests; browser scenarios 3–4; `scenario-3-audit.json`, `scenario-4-audit.json` |
| 5. Approval and stale approval | PASS: current assessment, escalation, Supervisor role, and explicit decision required; approval alone leaves action unset and case open. Context/evidence changes, new AI output, and new assessment invalidate approval. Direct injected stale approval/assessment revisions block execution. | `workflow.txt`; browser scenarios 2 and 5 |
| 6. Blocked, failed, duplicate reversals | PASS: missing approval before and after escalation uses exact approved message. Failed action stays open for review, with no retry or closure. Successful duplicate execution blocked directly and browser control disabled. Material editing blocked after execution. | Workflow reversal tests; browser scenarios 1, 6, 8; `scenario-6-audit.json` |
| 7. Human closure and unresolved cases | PASS: only CSR explicit confirmation after successful approved action closes. Successful action alone remains open. Rejected, withdrawn, failed-action, and information cases remain open; closure blocked. Closed case cannot be processed again. | `workflow.txt`; browser scenarios 5–8; `scenario-7-audit.json` |
| 8. Timeline, JSON, refresh | PASS: chronological insertion order shows separate attestation, recommendation/review, approval, trigger, result, closure, and transition events with case IDs and actors. Actual downloaded JSON parsed, all three cases included, export leaves displayed timeline unchanged. Browser reload resets three cases to open/unverified and empty audit. Workflow IDs unique on successful path. Reviewed synthetic exports contain no verification secrets. | `success-audit.json`, `success-audit.png`, nine scenario exports, browser scenarios 8–9 |
| 9. Complete fictional $500 workflow | PASS: CSR attests → simulated usable AI → explicit CSR review → escalation → Supervisor confirms approval → CSR performs distinct successful mock reversal → case remains open → CSR explicitly confirms closure. Approval and mock action each record $500.00; mock result reports no real account change. | Workflow successful-path test; browser scenario 8; `success-audit.json` and screenshot |

Exact missing-authorization message verified:

> Supervisor assistance is needed for this action. No approval or account change has been performed.

## Failures, corrections, and retests

1. Initial `npm run check` exited 1 with `AssertionError: Initial screen must include: Classroom simulation`. The approved baseline dashboard replaced the earlier labels, so the smoke test also expected obsolete case/navigation labels. Updated `scripts/check-foundation.mjs` to assert the baseline demonstration/synthetic/action banner, affiliation disclaimer, case label, and five workflow navigation labels. No application UI or workflow rule was changed. Retest passed; output saved as `test-artifacts/render.txt`.
2. Browser preparation initially failed creating the default cache outside writable roots. Set the supported `PLAYWRIGHT_BROWSERS_PATH` to `/tmp/amx-browser/browsers`. Download then failed with `EAI_AGAIN cdn.playwright.dev`; the authorized network retry succeeded.
3. Initial Chromium launch failed because `libatk-1.0.so.0` was missing. Authorized `playwright install-deps chromium` installed required system libraries. Subsequent sandbox launch failed with `sandbox_host_linux.cc:41 ... shutdown: Operation not permitted`. That launch output is preserved as `browser-launch-failure.txt`. Authorized execution outside the sandbox succeeded: **9/9 groups passed**, zero page errors; see `browser.txt` and `browser-results.json`. These launch failures did not execute interaction tests and are not application test failures.
4. The first `node --test tests/workflow.test.mjs` invocation reported one file-level result in this environment. Executing the suite directly exposed all named tests and confirmed **43/43**. Added `npm test` using that direct runner and saved its named results in `workflow.txt`.

## Changes and reproduction

Added `tests/workflow.test.mjs`, `tests/browser.mjs`, npm test scripts, and evidence artifacts. Updated outdated render assertions and README validation status. No `src/` files, dependencies in package.json, lockfile, or business rules were changed. Playwright was installed only in temporary test tooling, outside application dependencies.

Workflow and smoke checks:

```sh
npm test
npm run check
npm run lint
npm run build
```

Browser tooling used:

```sh
npm install --prefix /tmp/amx-browser playwright --no-save
PLAYWRIGHT_BROWSERS_PATH=/tmp/amx-browser/browsers /tmp/amx-browser/node_modules/.bin/playwright install chromium
/tmp/amx-browser/node_modules/.bin/playwright install-deps chromium
npm run dev -- --port 5173 --strictPort
# In a second terminal:
PLAYWRIGHT_BROWSERS_PATH=/tmp/amx-browser/browsers npm run test:browser
```

`PLAYWRIGHT_MODULE` can specify an alternative installed Playwright module path. The temporary tooling may disappear with the environment; reinstall it for reproduction. This environment required approval for browser download, system dependency installation, and running Chromium outside the sandbox. Application dependencies were unchanged. Browser tests intentionally create synthetic JSON downloads and a screenshot under `docs/test-artifacts`.

Final checks: `npm test` 43 pass; `npm run test:browser` 9 pass; `npm run check` pass; `npm run lint` exit 0; `npm run build` exit 0; `git diff --check` exit 0. Build and lint output saved in artifacts. An additional export review parsed all 10 saved audit JSON files, confirmed schema/simulation flags and synthetic case association, and checked detail keys for forbidden secret fields; all passed (`export-review.txt`). This supplementary artifact review is separate from the 53 named checks/scenarios.

## Limitations and Product Owner review boundary

- WP-04A source traceability remains unavailable. No additional rules were inferred beyond approved local designs.
- The application has no dedicated conflicting-evidence fixture or evidence reconciliation workflow. Testing covers unavailable evidence and changed duplicate-charge context, plus injected stale authority revisions. It does **not** prove handling of arbitrary conflicting documents or establish a new conflict-resolution rule; that requires Product Owner design guidance.
- Role selection is a classroom control, not authentication. Direct workflow tests challenge role strings and state revisions; they do not establish production identity or tamper resistance. Identity verification is a human simulation attestation, not actual identity proof.
- AI and reversals are deterministic mocks. Failure modes are selected presets; no real service outage, financial action, or live AI is tested.
- Audit is in memory and resets on reload. Export is synthetic evidence, not a durable or tamper-resistant log. Export validation includes successful-path content, parsing, all-case inclusion, and nonmutation; no filesystem/network failure injection for downloads was performed.
- Nine browser groups run only on desktop headless Chromium against Vite development serving. Firefox/Safari, mobile/responsive behavior, accessibility compliance, production-served interactions, concurrency, and load testing were not covered. Production bundling passed.
- Browser group exports preserve the final case state of each group; groups that reload between subcases do not retain every earlier subcase's audit. Named workflow assertions and browser results cover those subcases.

No unresolved failure was found in the tested approved workflow. The limitations above remain for review. No commit or push performed. Step 4 stops for Product Owner review; Step 5 has not begun.

## Approved Create New Case feature — validation addendum

The Product Owner approved the implementation plan after the Step 4 commit `d933b0c0fe6cf640f76346e0dad0d69c93660c82`. This addendum records additional feature work; the original 53-pass Step 4 record and its artifacts above remain historical evidence. At implementation time, no commit or push was authorized. The Product Owner subsequently authorized committing and pushing this feature, subject to successful personal review. Step 5 remains unauthorized.

### Implementation

- Added a blue **Create New Case** queue button and responsive form. Only CSR can create; both the button/submit controls and creation logic enforce the role, including a role change while the form is open.
- Customer names and descriptions are allowlisted fictional presets. Request types are the existing reversal, statement explanation, and transaction inquiry types. No free-text customer data is accepted. Submitted IDs, references, approvals, verification flags, and extra fields are rejected; rejected values are not copied into audit records.
- Reversals are fixed at **$500.00**. Information cases offer fictional $25/$100/$500 presets and keep their existing open-for-review behavior. No authority limit or resolution rule changed.
- Collision-checked `SYN-007-…` IDs and `SYN-TXN-007-…` references are allocated against the latest queue by a reducer. Back-to-back accepted submissions create distinct cases. IDs and references cannot be edited through the form.
- Every created case starts open and unverified at revision 1, with the same synthetic evidence availability default as existing fixtures, no assessment/AI/approval/action result, and no escalation. Evidence availability never substitutes for human verification.
- A `case_created` event records the synthetic case ID, human CSR actor, presets, reference, initial status, and simulation flag. Subsequent actions use the existing unchanged `transition` guards. JSON export includes new cases and their events. Failed creation records only the action/reason against the currently selected existing case, because no new case exists for that attempt.
- All state stays in React memory. Refresh discards added cases and events. No services, dependencies, storage, live AI, banking connections, or real customer records were added.

### Final results

**95 checks/scenario groups passed, 0 failed in final runs:** 43 existing workflow tests + 34 new creation/security tests + 9 existing browser scenario groups + 8 new browser scenario groups + 1 render smoke check. Counts refer to named tests/groups, not individual assertions. Lint, build, and whitespace checks passed separately.

| Command / evidence | Actual final result |
| --- | --- |
| `npm test` | 43/43 existing tests and 34/34 new tests passed. Saved as `test-artifacts/create-case/automated.txt`. |
| `npm run check` | Initial render smoke check passed; original three fixtures and navigation remain available. Saved as `create-case/render.txt`. |
| `TEST_ARTIFACT_DIR=docs/test-artifacts/create-case/regression PLAYWRIGHT_BROWSERS_PATH=/tmp/amx-browser/browsers npm run test:browser` | 9/9 original browser groups passed; no page errors. All regression outputs/downloads saved separately under `create-case/regression/` to preserve original Step 4 artifacts. |
| `PLAYWRIGHT_BROWSERS_PATH=/tmp/amx-browser/browsers npm run test:browser:create-case` | 8/8 new browser groups passed; no page errors. Saved as `create-case/browser.txt` and `create-case/browser-results.json`. |
| `npm run lint` | Exit 0; saved as `create-case/lint.txt`. |
| `npm run build` | Exit 0; saved as `create-case/build.txt`. |
| `git diff --check` and new text-file whitespace review | Passed. |

Browser runs used the same temporary Playwright tooling and Chromium 156.0.8078.4 as Step 4, with authorized execution outside the process-restricted sandbox. Existing port 5173 preview was used; an attempted second server start correctly failed because the port was already occupied. That setup message is not an application test failure.

New automated tests cover initial state, synthetic creation audit, unauthorized roles, empty/null/invalid input, unsupported request types, non-preset names/descriptions, invalid/negative/nonfinite/non-string amounts, non-$500 reversals, injected IDs/references/verification/approvals, collision skipping, 30 consecutive allocations, reducer submissions, rejected-value audit omission, both information-case types, mandatory verification, unavailable evidence, all four AI outcomes and manual fallback, stale authority, rejection/withdrawal/failed reversals, duplicate execution, explicit human closure, and refresh initialization.

New browser groups cover:

1. Required presets, fixed $500 field, read-only generated reference, cancel without creating, initial open/unverified state, and downloaded creation audit.
2. Supervisor cannot open creation; switching to Supervisor during entry disables submission. A programmatic form submission still hits the CSR-only guard and produces a blocked audit event.
3. A forged dropdown option is rejected by creation logic; the submitted arbitrary value is not stored or exported.
4. Repeated creation produces unique IDs/references; information cases retain assessment and resolution gates.
5. A new case blocks AI, both assessment methods, and reversal before verification; Supervisor attestation and attestation without evidence remain blocked.
6. Material context edits invalidate a new case's existing approval and block reversal.
7. A new $500 case follows verification → simulated AI → human review → escalation → human Supervisor approval → separate CSR mock action → explicit CSR closure. Wrong-role reversal/closure and missing closure confirmation are blocked. Export includes all four cases and leaves the timeline unchanged.
8. The form fits a 390×844 viewport, shows a readable selected-description preview, and refresh removes the new case and all session audit events.

Representative synthetic downloads are saved under `test-artifacts/create-case/`: `created-audit.json`, `blocked-creation-audit.json`, `invalid-creation-audit.json`, `multiple-cases-audit.json`, `stale-approval-audit.json`, `successful-new-case-audit.json`, and `refresh-audit.json`. Desktop/mobile form screenshots and a successful new-case audit screenshot are also saved there and were visually reviewed. Supplementary export/schema/secret-pattern review is recorded in `create-case/export-review.txt`.

### Failure and retest record

The first new browser run reported **0 passed, 8 failed**: each group stopped at the same `getByLabel('Request type', { exact: true })` timeout. The wrapped label includes dropdown option text, so the exact-text test locator did not match. Corrected the test locator to use the form's label consistently with the existing browser suite. The initial log and result JSON are preserved as `create-case/browser-initial-failure.txt` and `create-case/browser-initial-failure-results.json`. The corrected suite passed **8/8**. No application gate was relaxed. Desktop/mobile screenshots then prompted a small display improvement: show the full selected description below the dropdown on narrow screens. The suite was rerun after that change and again passed **8/8**; lint, smoke, and build also passed afterward.

### Limitations and review boundary

- All previously documented prototype limits still apply: simulated roles do not authenticate humans, AI/actions are mocks, and audit/state are neither persistent nor tamper-resistant. No WP-04A source or arbitrary conflicting-evidence handling was introduced.
- This version intentionally accepts only supplied synthetic presets, not typed names/descriptions or real transaction references. References and IDs are unique within the in-memory session; refresh restarts allocation and may reuse prior session IDs. Separate browser tabs have independent sessions.
- Identical preset submissions may create separate cases with distinct IDs. No duplicate-request business rule was approved; duplicate IDs are prevented.
- Information-case transaction amounts are fictional context only; those cases still have no approved reversal/closure path. Reversal amounts other than $500 require a later approved design change.
- New-case failures without an allocated ID are audited on the selected existing case with a `create_case` reason. No failed input values are retained.
- New browser checks cover desktop Chromium and one 390px mobile viewport. They do not certify accessibility, all devices/browsers, production hosting, load, or malicious modification of the whole client runtime. The existing queue remains horizontally scrollable on narrow screens.
- No application workflow failures remain in the tested scope. The Product Owner subsequently authorized committing and pushing the feature, subject to successful personal review. Step 5 has not begun.

### Try the feature

Open the running prototype on port 5173, choose the **CSR** role, and open **Case Management**. Click **Create New Case**, select a synthetic customer and request type, select a preset description, and click **Create fictional case**. For reversals the amount stays $500; the reference is generated automatically. The new row starts **Open · Unverified**. Click its **View case** button to follow the existing verification, assessment, Supervisor approval, CSR mock reversal, and explicit closure flow. **Audit History → Download JSON audit** exports new-case events. Export before refresh; reloading removes added cases.

### Pre-commit verification after Product Owner authorization

Before the authorized feature commit, reran `npm test` (43 existing + 34 new, all passed), `npm run check` (passed), both Chromium browser suites (9 existing + 8 new, all passed, zero page errors), `npm run lint` (exit 0), and `npm run build` (exit 0). Total remains **95 passed, 0 failed**. Saved outputs and synthetic browser downloads under `test-artifacts/create-case/` were refreshed; original Step 4 artifacts and the initial locator-failure record were preserved.

Reviewed feature source, tests, exported synthetic cases, and screenshots; only fictional presets and generated synthetic references are used. Secret-pattern scanning of all changed/new text files found no matches. Reviewed 17 downloaded audit exports for synthetic schema, case associations, unique event IDs, approved creation presets, generated references, and absence of secret detail keys. Details are saved in `create-case/export-review.txt`. Known limitations above remain applicable. The commit/push authorization is subject to successful Product Owner personal review; it does not authorize Step 5.

## Case Information & Evidence usability refinement

The Product Owner approved a plan to remove the confusing Case Context dropdown while preserving evidence and verification controls and all material-change safeguards. Baseline: `6e281e252cb6c4595e63d50c94af4658c9946e75`. This refinement is uncommitted and unpushed pending review; Step 5 has not begun.

Removed the dropdown and its local form state from `src/WorkflowScreen.jsx`. Saving evidence passes the case's existing `materialNote` internally, rather than collecting a new context choice. Updated explanatory copy to describe evidence-change invalidation. Mandatory human CSR attestation, evidence availability, role restrictions, post-execution edit restrictions, Supervisor approval, separate reversal, and explicit human closure remain intact. `src/workflow.js`, `tests/workflow.test.mjs`, and `tests/case-creation.test.mjs` are unchanged, including direct duplicate-charge context, material-change invalidation, and stale-authority tests.

Updated the two browser suites to change evidence availability through the retained checkbox instead of selecting the removed dropdown. They explicitly assert that the Case Context dropdown is absent, exercise approval invalidation on both existing and newly created cases, and preserve the existing gate and completion scenarios. The regression suite also confirms an unchanged save reports no material change and retains CSR verification. The new-case suite now accepts `TEST_ARTIFACT_DIR` so this refinement does not overwrite the previous feature's evidence.

### Actual results

**95 passed, 0 failed:** 43 existing workflow tests + 34 creation/security tests + 9 regression browser groups + 8 creation browser groups + 1 render smoke check. Lint, production build, and whitespace checks passed separately. No test failures or business-rule changes occurred in this refinement.

| Check | Result / saved evidence |
| --- | --- |
| `npm test` | 77/77 passed; `test-artifacts/evidence-interface/automated.txt`. Includes unchanged duplicate-charge context scenarios. |
| `npm run check` | Passed; `evidence-interface/render.txt`. |
| `npm run lint` | Exit 0, including final updated browser assertions; `evidence-interface/lint.txt`. |
| `npm run build` | Exit 0; `evidence-interface/build.txt`. |
| Regression Chromium suite | 9/9 passed, zero page errors; `evidence-interface/regression/browser.txt` and `browser-results.json`. |
| New-case Chromium suite | 8/8 passed, zero page errors; `evidence-interface/create-case/browser.txt` and `browser-results.json`. |
| Guard/test preservation | `git diff --exit-code -- src/workflow.js tests/workflow.test.mjs tests/case-creation.test.mjs` returned 0. |
| Whitespace and synthetic export review | Passed; `evidence-interface/export-review.txt`. |

Browser commands (with the existing local preview on port 5173):

```sh
TEST_ARTIFACT_DIR=docs/test-artifacts/evidence-interface/regression PLAYWRIGHT_BROWSERS_PATH=/tmp/amx-browser/browsers npm run test:browser
TEST_ARTIFACT_DIR=docs/test-artifacts/evidence-interface/create-case PLAYWRIGHT_BROWSERS_PATH=/tmp/amx-browser/browsers npm run test:browser:create-case
```

Chromium used the same temporary tooling and authorized execution outside the restricted sandbox as prior testing. Synthetic audit exports were saved in these separate artifact directories. The updated screen was captured and visually inspected in `test-artifacts/evidence-interface/regression/verification-screen.png`.

### Limitations and review

The dropdown is removed from the normal interface; duplicate-charge context remains an internal automated-test scenario. Users can change evidence availability but cannot edit context through this screen. Direct tests continue to prove context changes invalidate authority; browser tests prove the retained evidence control invalidates authority. Arbitrary material changes, conflicting-document reconciliation, real authentication, persistent audit, and real financial integrations remain outside the prototype's approved scope. Prior browser and simulation limitations still apply. No new business rules were added.

For personal review, open the prototype, choose any **View case** button, and inspect **Identity Verification → Case information & evidence**. It now contains the evidence checkbox and **Save case information**, with no Case Context dropdown. Changes remain uncommitted/unpushed until Product Owner review.

## CSR workflow interface — remove the entire case-information editor

The Product Owner approved removal of the complete **Case information & evidence** section following the earlier dropdown-only refinement. This entry describes the current interface and supersedes the earlier refinement's visible evidence checkbox/save controls. Earlier screenshots and results remain historical evidence. The checkout baseline is still `6e281e252cb6c4595e63d50c94af4658c9946e75`; both refinements remain uncommitted and unpushed for Product Owner review.

### Changes and preserved safeguards

Removed the section heading, explanatory copy, evidence checkbox, Save case information button, separating rule, and unused local evidence state from `src/WorkflowScreen.jsx`. Identity verification remains an explicit human CSR attestation. Existing synthetic evidence values continue to supply the workflow guards internally. No automatic verification, evidence override, alternative role authority, or approval bypass was added. The interface retains verification, assessment, Supervisor review, simulated action, explicit human closure, and audit.

`src/workflow.js`, `src/caseCreation.js`, `tests/workflow.test.mjs`, and `tests/case-creation.test.mjs` are unchanged. Their material-change transitions still increment the revision and reset verification, assessment, escalation, AI output, and approval. Direct tests still exercise unavailable evidence, duplicate-charge context changes, stale approvals, wrong roles, and post-execution edit restrictions. README now explains internal evidence instead of referring to a removed editor.

Affected browser tests no longer attempt to click removed controls. They assert absence of the heading, checkbox, dropdown, and save button, and retain human verification and full workflow interactions. A new test-only helper, `tests/browser-fixtures.mjs`, builds fictional cases using the actual `caseStore` creation/workflow reducer: verified → assessed → escalated → Supervisor-approved → material change. It asserts authority invalidation, then uses Playwright response interception to supply that resulting fixture as initial App state in the test browser. Missing-evidence fixtures block attestation/processing; a changed duplicate-charge-context fixture with available evidence permits fresh CSR verification but still blocks reversal without fresh approval. Audit export preserves the invalidation records. No fixture route, state setter, or test bypass hook was added to application source or production bundle.

### Final results

**95 checks/scenario groups passed, 0 failed in final runs:** 43 existing workflow tests + 34 creation/security tests + 9 regression browser groups + 8 new-case browser groups + 1 render smoke check. Lint and production build passed separately. Counts represent named tests/groups, not individual assertions.

| Check | Actual result / evidence |
| --- | --- |
| `npm test` | 77/77 passed; `test-artifacts/csr-workflow-interface/automated.txt`. |
| `npm run check` | Passed; `csr-workflow-interface/render.txt`. |
| `npm run lint` | Exit 0 after fixture correction; `csr-workflow-interface/lint.txt`. |
| `npm run build` | Exit 0; `csr-workflow-interface/build.txt`. |
| Regression Chromium suite | 9/9 passed; no page errors. `csr-workflow-interface/regression/browser.txt`, `browser-results.json`, and synthetic audit downloads. |
| New-case Chromium suite | 8/8 passed; no page errors. `csr-workflow-interface/create-case/browser.txt`, `browser-results.json`, and synthetic audit downloads. |
| Guard/test preservation | `git diff --exit-code -- src/workflow.js src/caseCreation.js tests/workflow.test.mjs tests/case-creation.test.mjs` returned 0. |
| Whitespace and synthetic artifact review | Passed; `csr-workflow-interface/export-review.txt`. |

Reproduction uses the existing temporary Chromium/Playwright installation, with the prototype running on port 5173:

```sh
npm test
npm run check
npm run lint
npm run build
TEST_ARTIFACT_DIR=docs/test-artifacts/csr-workflow-interface/regression PLAYWRIGHT_BROWSERS_PATH=/tmp/amx-browser/browsers npm run test:browser
TEST_ARTIFACT_DIR=docs/test-artifacts/csr-workflow-interface/create-case PLAYWRIGHT_BROWSERS_PATH=/tmp/amx-browser/browsers npm run test:browser:create-case
```

Browser execution required the same authorized sandbox exception as previous testing. Evidence was saved to new directories to preserve earlier results. The current verification screen was captured and visually reviewed in `test-artifacts/csr-workflow-interface/regression/verification-screen.png`. It shows an open, unverified case, available internal synthetic evidence, mandatory CSR attestation, and no case-information editor.

### Failure and retest record

The first regression browser run reported **6 passed, 3 failed**. The new-case suite passed **8/8**. A test-only intercepted App response containing the missing-evidence fixture was cached and reused by later regression scenarios. AI success/fallback assertions failed and human review stayed disabled; these observations show that evidence/verification gates remained effective on the unintended fixture. Initial output/results are preserved in `csr-workflow-interface/regression/browser-initial-failure.txt` and `browser-initial-failure-results.json`.

Corrected fixture interception to return `Cache-Control: no-store`, preventing fixture state from leaking into later scenarios. Reran both browser suites: regression **9/9**, new-case **8/8**, zero page errors. No application guard, evidence default, or verification rule changed to resolve these test failures. Lint passed after the test-helper correction; the production application was unchanged after its successful build.

### Limitations and review boundary

- Evidence and material context can no longer be edited in the visible application. Existing fixture defaults remain internal. Material-change and invalidation logic remains supported and tested directly through the reducer/transition APIs.
- Missing-evidence and material-change browser scenarios use isolated synthetic initial-state fixtures; they do not claim a visible editing path exists. Normal-browser scenarios continue to exercise actual UI verification, roles, AI review/fallback, approval, action, closure, creation, export, and refresh reset.
- The test helper targets the App initialization expression in Vite-transformed development source and asserts that insertion point exists. Changes to initialization may require updating this test helper. Production-served fixture interactions were not tested; the production build passed and contains no test helper.
- All previously documented simulation, session-only storage, role/authentication, audit durability, WP-04A source, and browser-coverage limits remain. No real customer information, credentials, banking/payment integrations, or paid services were introduced.
- Review the prototype using **View case → Identity Verification**. No commits or pushes performed for either usability refinement. Step 5 has not begun.


## Assigned fictional verification methods — 2026-10-09

Implemented after Product Owner approval of the brief plan. Each seeded case has one of Security questions, One-time verification code, or Identity document review; generated case numbers cycle through the same methods automatically. The method is read-only in the queue, selected-case summary, and Identity Verification screen, and remains assigned after material changes and incomplete closure. Status uses Not completed, Completed, or Incomplete. Completion and incomplete events include the assigned method and explicit outcome; new-case audit records include the initial method and outcome. JSON export includes current method/status and audit events.

Validation: 117 unit tests passed, including automatic assignment, attempted method substitution, revision invalidation, role/attestation gates, incomplete closure, and exclusion of supplied secret-like payload fields. Lint, foundation check, build, and whitespace checks passed. Browser regression: 10 scenarios passed, including all three read-only seeded methods, completed/incomplete status, incomplete JSON export, verification/evidence gates, AI fallback, separate Supervisor approval and CSR action, human closure, and export immutability. Case-creation browser suite: 8 scenarios passed, including generated IDs, authority gates, material changes, successful closure, and mobile form layout. Existing browser material fixtures initially failed because they supplied the previous method label; fixtures were corrected to attest the assigned method and suites rerun. Chromium required execution outside the filesystem sandbox. Existing port 5173 preview was reused.

Evidence: [unit results](test-artifacts/assigned-verification/unit.txt), [lint](test-artifacts/assigned-verification/lint.txt), [foundation check](test-artifacts/assigned-verification/check.txt), [build](test-artifacts/assigned-verification/build.txt), [browser regression](test-artifacts/assigned-verification/browser.txt), [case-creation browser results](test-artifacts/assigned-verification/create-case-browser.txt), [verification screenshot](test-artifacts/assigned-verification/regression/verification-screen.png), and [incomplete audit export](test-artifacts/assigned-verification/regression/incomplete-audit.json).

Visual review confirmed the existing blue dashboard design and human attestation/incomplete controls. No actual security-answer, code, or document input or storage was introduced. These are classroom labels, not actual American Express verification policies. The WP-04A source remains absent from the repository; existing local design mapping and authorized workflow boundaries were preserved. Roles remain simulated, data and audit are in memory, and exports are not durable or tamper-resistant. No commit or push performed.


## Simplified AI-Assisted Assessment — 2026-10-09

Implemented following Product Owner approval of the concise plan. Removed the visible AI response dropdown and retained one Run AI Simulation button, which requests the existing deterministic usable report for the selected case. All nine report sections remain unchanged. Complete Assessment Without AI replaces the old manual label and appears only for a current failed, unusable, or unavailable AI outcome; it is hidden before generation and for usable or uncertain reports. Human evidence review and uncertainty acknowledgment remain required, with centralized verification, role, escalation, approval, action, and closure guards unchanged. Unavailable is now a supported deterministic failure fixture outcome, producing no report and requiring guarded fallback. There are no production fixture routes or state setters.

Validation: 120 unit tests passed (44 workflow, 35 case creation, 41 report/verification), including unavailable AI fallback. Lint, foundation smoke check, production build, and git diff whitespace check passed. All 11 regression browser scenarios and 8 case-creation browser scenarios passed. Browser fixtures intercept the existing workflow module for uncertainty, failed, unusable, and unavailable AI; outcomes still pass through normal guards and audit recording. Checks cover absence of response selectors, hidden fallback before/after usable generation, structured report display, blocked escalation before recorded human review, uncertainty acknowledgment, fallback human confirmation and role restrictions, verification/evidence gates, separate Supervisor authorization and CSR mock action, explicit closure, JSON export, and export immutability. Shared browser helpers initially confirmed review before AI generation, which correctly reset confirmation; corrected helpers generate AI first, then explicitly confirm and record review. Browser suites passed after that correction.

Evidence: [unit tests](test-artifacts/assessment-simplification/unit.txt), [lint](test-artifacts/assessment-simplification/lint.txt), [foundation check](test-artifacts/assessment-simplification/check.txt), [production build](test-artifacts/assessment-simplification/build.txt), [browser regression](test-artifacts/assessment-simplification/browser.txt), [case-creation browser tests](test-artifacts/assessment-simplification/create-case-browser.txt), [assessment screenshot](test-artifacts/assessment-simplification/regression/assessment-screen.png), and [successful audit JSON](test-artifacts/assessment-simplification/regression/success-audit.json). Visual inspection confirmed the blue design, prominent simulation button, and all nine structured report sections.

Limits: AI remains deterministic and simulated; normal dashboard operation selects usable output, while alternate outcomes are tested through automation. Simulated roles are not authentication; session data/audit reset on reload and exports are not tamper-resistant. The repository still lacks the original WP-04A source, so existing local design mapping and approved boundaries were preserved. Browser execution required permission outside the sandbox for Chromium. Existing uncommitted workspace work was preserved. No commit or push performed.


## Professional dashboard language — 2026-10-09

Implemented after Product Owner approval of the concise plan. Reviewed Case Management, Create New Case, Identity Verification, AI-Assisted Assessment, Supervisor Review, Action & Closure, and Audit History. Updated routine labels, descriptions, instructions, notifications, report descriptions, and displayed audit text. Key labels are Required Verification Method, Confirm Verification, Unable to Verify Identity, Run AI Assessment, Approve Reversal, Process Reversal, and Confirm Case Closure. Invented customer display aliases and matching initials appear consistently in the queue, intake options, case headings, reports, communication drafts, and displayed audit details.

A display-only formatter preserves stored case values and validates existing preset values unchanged. It creates presentation copies of report/audit text without mutating source data. No changes were made in this refinement to workflow guards, case identifiers, role permissions, verification methods, case creation validation, approval/action transitions, audit schema/content, or JSON export generation. Original record labels and customer values remain in exports. The exact disclosure remains visible: Demonstration environment · Synthetic data · Simulated actions · No live account access. Explicit simulated context remains on AI recommendations, authorization status, reversal choices, processing instructions, action results, and relevant notifications. No live financial action is implied.

Validation: 122 automated unit tests passed, including two presentation tests checking original record preservation and simulated approval/action wording. Lint, foundation check, production build, and git diff whitespace check passed. Browser regression: 12 scenarios passed, including a new comprehensive language check across every screen and populated report/audit flow, all nine report sections, invented customer names, exact disclosure, verification/evidence gates, uncertainty acknowledgment, unavailable/unusable/failed fallback, Supervisor authorization, separate reversal/closure, and export immutability. Case-creation browser suite: all 8 scenarios passed, including preset validation, role restrictions, generated identifiers, material-change invalidation, full closure, and mobile intake layout. Initial interface test failures were stale notification expectations and a customer-name selector that included avatar initials; expectations/selectors were updated and final suites passed.

Evidence: [unit tests](test-artifacts/language-refinement/unit.txt), [lint](test-artifacts/language-refinement/lint.txt), [foundation check](test-artifacts/language-refinement/check.txt), [build](test-artifacts/language-refinement/build.txt), [browser regression](test-artifacts/language-refinement/browser.txt), [case-creation browser checks](test-artifacts/language-refinement/create-case-browser.txt), [assessment screenshot](test-artifacts/language-refinement/regression/professional-assessment.png), [audit screenshot](test-artifacts/language-refinement/regression/professional-audit.png), and [audit JSON](test-artifacts/language-refinement/regression/success-audit.json). Visual review confirmed the existing blue dashboard and full structured report.

Limits: display aliases are entirely invented and deliberately differ from original stored fixture names in JSON exports. Audit text is professionally formatted for display; JSON preserves original records. Roles remain simulation selections, not production authentication. Records remain in memory and are not persistent or tamper-resistant. The original WP-04A source is absent; existing local mapping and approved boundaries were preserved. Chromium checks required execution outside the sandbox. Existing uncommitted work was preserved. No commit or push performed.


## Approved Close / Cancel Case disposition — 2026-10-09

Implemented following Product Owner approval of the concise cancellation plan. Close / Cancel Case replaces withdrawal in Action & Closure. Any open case type may be cancelled before reversal processing by a CSR with current verification and available evidence, including an assessed, escalated, approved, or rejected request. No assessment or Supervisor approval is required for cancellation. Three preset reasons are available: Customer no longer wishes to proceed; Duplicate case opened in error; Request no longer required. A separate, strictly boolean human CSR confirmation is required; changing reason resets that confirmation. Keep Case Open dismisses the form without a workflow transition.

Cancellation records status closed, disposition/closureOutcome cancelled, and cancellationReason. Current approval and escalation are revoked. Audit events record the CSR decision, reason, case ID, revision, timestamp, explicit closure confirmation, and transition to closed. JSON adds cancellationReason and retains events/current status Closed — Cancelled. Current report human status and draft communication refresh without invoking AI or mutating the original AI audit snapshot. Cancelled cases block further AI/manual assessment, Supervisor decisions, reversal processing, edits, and duplicate closure. The legacy withdraw action is unavailable. Existing incomplete-verification and successful-resolution closure remain separate.

A successful or failed processed reversal blocks cancellation, records a blocked action when attempted, and displays the requirement for Supervisor review to determine whether a separate corrective action is appropriate. Action results are unchanged. No reversal is undone and no corrective action is implemented. The corrective-review message also remains visible on a successfully resolved case.

Validation: 134 unit tests passed, including 15 dedicated cancellation tests covering all case types/stages, preset reason and strict confirmation, role restrictions, missing/stale verification and unavailable evidence, approval revocation, report refresh and audit snapshot preservation, successful/failed reversal blocks, duplicate closure and later processing, legacy withdrawal rejection, and distinct closure outcomes. Lint, foundation check, production build, and git diff whitespace checks passed. All 14 workflow browser scenarios and 9 case-creation browser scenarios passed, including rejected-case cancellation, pre-verification block, missing reason/confirmation, dismissing cancellation, wrong-role disabled confirmation, Closed — Cancelled display, JSON reason/actor/timestamp, export immutability, disabled downstream controls, successful/failed processing blocks, and newly created information-case cancellation without AI or approval. Initial browser cancellation tests used an overly exact reason-label selector; corrected selectors passed final runs.

Evidence: [unit results](test-artifacts/case-cancellation/unit.txt), [lint](test-artifacts/case-cancellation/lint.txt), [foundation check](test-artifacts/case-cancellation/check.txt), [production build](test-artifacts/case-cancellation/build.txt), [final browser regression](test-artifacts/case-cancellation/browser-final.txt), [case-creation browser checks](test-artifacts/case-cancellation/create-case-browser.txt), [cancelled-case screenshot](test-artifacts/case-cancellation/regression/cancelled-case.png), [cancelled-case audit JSON](test-artifacts/case-cancellation/regression/cancelled-audit.json), and [new-case cancellation JSON](test-artifacts/case-cancellation/create-case/cancelled-new-case-audit.json). Visual review confirmed the blue design, Closed — Cancelled status, reason, and disabled closure/action controls.

Updated VIS-05 flowchart, VIS-06 sequence, design-to-build mapping, and README for the approved disposition. Diagram changes were reviewed as source; updated Mermaid diagrams were not rendered or parser-validated because no local Mermaid tool was available. The original WP-04A source remains absent. This classroom implementation uses synthetic data and simulated actions only; no real financial service is connected. Roles remain simulation selections rather than authentication; records are session-only and not tamper-resistant. Chromium ran outside the sandbox with approval. Existing uncommitted changes were preserved. No commit or push performed.


## Final operational UI language — 2026-10-09

Completed after Product Owner approval of the concise plan. Reviewed every visible screen, preset intake option, case detail, notification, status card, assessment report, approval panel, financial result, closure flow, and audit timeline. Routine text uses AI Assessment, Run AI Assessment, Required Verification Method, Confirm Verification, Supervisor Approval, Transaction Reversal, Process Reversal, Confirm Case Closure, and Close / Cancel Case. The single environment notice is Training environment · No live account access. Displayed financial results carry Training result · No live transaction processed; action instructions explicitly state that no live transaction will be processed. AI reports also retain a training assessment/non-live notice.

Supervisor Approval is display-only and reflects existing records: Pending, Approved for current approval revision, Rejected for recorded rejection, More Information Required for unavailable evidence, and Not Required for information requests or cancelled/incomplete closure. More Information Required is an evidence-status label, not a new Supervisor decision. No new workflow state or authority was introduced. Approval, verification, role, human-review, reversal and closure guards remain intact.

Removed the remaining reversal-outcome selector and its component state. Normal Process Reversal requests the existing successful training result; automated browser interception supplies failure outcomes through the same workflow guards/audit events. AI uncertainty/failure/unusable/unavailable fixtures remain outside normal controls. Audit presentation formats field labels and environment metadata professionally; original stored audit records and JSON schema/content remain unchanged. Source values, fixture names, case identifiers, financial safeguards, and invented display aliases remain unchanged. No live service or production authentication was added.

Validation: 136 unit tests passed, including approval-status projection and audit-formatting immutability checks. Lint, foundation smoke check, production build, and git diff whitespace check passed. All 14 browser regression scenarios and 9 case-creation scenarios passed. Comprehensive visible-text checks exclude all prohibited terms across every screen, populated AI report, approval/action flow, and populated audit timeline. Checks confirm exact environment notice, nine report sections, no normal assessment or reversal outcome selector, explicit non-live financial results, human review/role/verification gates, rejected and cancelled behavior, failed reversal through fixtures, blocked post-processing cancellation, separate approval/action/closure, JSON export immutability, new-case validation and mobile intake.

Evidence: [unit results](test-artifacts/final-ui-language/unit.txt), [lint](test-artifacts/final-ui-language/lint.txt), [foundation check](test-artifacts/final-ui-language/check.txt), [build](test-artifacts/final-ui-language/build.txt), [browser regression](test-artifacts/final-ui-language/browser.txt), [case-creation browser checks](test-artifacts/final-ui-language/create-case-browser.txt), [assessment screenshot](test-artifacts/final-ui-language/regression/professional-assessment.png), [audit screenshot](test-artifacts/final-ui-language/regression/professional-audit.png), and [audit export](test-artifacts/final-ui-language/regression/success-audit.json).

Limits: this remains a nonproduction classroom mock-up with synthetic data and simulated actions despite operational display wording. Original terminology is intentionally retained in exported evidence; display formatting does not rewrite records. More Information Required does not add a request-for-information workflow. Normal outcomes are deterministic; alternate outcomes are covered in fixtures. Role selection is not authentication; records reset on reload and are not tamper-resistant. WP-04A source remains unavailable; approved local workflow boundaries were preserved. Browser execution required sandbox escalation for Chromium. Existing uncommitted work was preserved. No commit or push performed.


## Conditional approval routing and independent CSR completion — 2026-10-09

Implemented following Product Owner approval of the conditional-routing plan. Shared approvalRouting.js configuration AMX-routing-1 governs workflow guards, navigation, labels, report recommendations/current decisions, and JSON export. It uses stored requestType, category, exact $500.00 reversal amount, and explicit boolean requiresAccountChange/evidenceConflict attributes. Missing/invalid attributes, unsupported types/categories/amounts, and incompatible policy configuration fail closed into a human-review hold. Exception flags precede routine matching. The exact $500 reversal approval requirement cannot be changed through the current configuration validator. No additional monetary threshold or official American Express policy is asserted.

Statement explanation requests and transaction inquiries route to CSR and display Supervisor Approval: Not Required in the queue, selected case, workflow, and report. After current verification, available evidence, and recorded human assessment, the CSR explicitly confirms Complete Request. This records completion and keeps the case open; separate explicit human closure produces Closed — Successfully Resolved without financial action or Supervisor approval. Irrelevant Supervisor decision and reversal controls are absent. Both seeded and newly created routine requests use this path. Reviewed routine requests navigate directly to Action & Closure. Completed requests block repeated assessment/completion; all closed cases block further processing.

The $500 reversal still requires current verification, human assessment, escalation, current human Supervisor approval, separate CSR training reversal, and human closure. Approval and routine completion bind rule ID, policy version and revision. Exceptions or unsupported requests may be verified/assessed/escalated for human review but cannot receive executable financial approval or routine completion. No exception-resolution/corrective-action workflow was invented. More Information Required indicates routing/evidence needs, not an approval decision. Material attribute changes re-evaluate routing and reset verification, assessment, escalation, approval and completion. Cancellation and incomplete-verification closures retain their existing guards.

Each new workflow audit event includes routing metadata: configuration version, matched rule, case revision, route, approval requirement and reason. New-case creation includes this metadata; JSON includes current routing, requestType and CSR resolution. Report status/draft refresh does not invoke AI or mutate the original AI audit snapshot. Routine closure communication explicitly states that Supervisor approval was not required and no account change occurred. Existing synthetic IDs, invented customers, training disclosures, role boundaries and non-live financial labels are preserved.

Validation: 145 unit tests passed, including 9 dedicated routing tests covering exact reversal preservation, routine types/new cases, two separate human completion/closure decisions, verification/evidence/role/assessment gates, exceptions and unsupported cases, material-change invalidation, stale approval policy/rule/revision, immutable report audit snapshots, missing attributes, malformed policy, and configuration matching. Lint, foundation check, production build, and whitespace checks passed. Browser regression: all 16 scenarios passed, including independent completion/closure of both routine types, absent Supervisor/reversal controls, three exception/unsupported fixtures held without processing authority, required $500 approval, existing cancellation/incomplete/failure paths, professional language, routing metadata/JSON, and export immutability. Case-creation suite: all 9 scenarios passed, including independent completion and closure of a new information request whose informational amount is $500, with no Supervisor approval or financial action.

Evidence: [unit results](test-artifacts/approval-routing/unit.txt), [lint](test-artifacts/approval-routing/lint.txt), [foundation check](test-artifacts/approval-routing/check.txt), [build](test-artifacts/approval-routing/build.txt), [browser regression](test-artifacts/approval-routing/browser.txt), [case-creation browser tests](test-artifacts/approval-routing/create-case-browser.txt), [routine completion screenshot](test-artifacts/approval-routing/regression/routine-completion-SYN-007-002.png), [routine audit JSON](test-artifacts/approval-routing/regression/routine-SYN-007-002-audit.json), and [new information-case resolution audit](test-artifacts/approval-routing/create-case/multiple-cases-audit.json).

Updated README, design-to-build mapping, VIS-05 and VIS-06 for the approved project rules and routine path. Diagram source was reviewed; no Mermaid rendering/parser validation was performed. The original WP-04A document is absent. Configuration is reviewed/versioned source code, with no user-facing policy editor. Exception attributes are supplied through internal fixtures and guarded material changes; the normal intake retains safe presets. Exceptions remain on hold pending a separately approved resolution workflow. This remains a nonproduction synthetic-data training system with deterministic AI, simulated roles rather than authentication, session-only records, and no live financial integrations. Chromium required execution outside the sandbox. Existing uncommitted work was preserved. No commit or push performed.


## AI Assessment completion wording — 2026-10-09

Implemented after Product Owner approval of the UI cleanup addition. The successful report heading is AI Assessment Complete; the success notification is Assessment ready for CSR review. Removed Training assessment · No live transaction processed from the report. Kept the single application-wide Training environment · No live account access notice. Financial-action result disclosures remain unchanged. No assessment completion implies approval, financial processing, or case closure.

The change is presentation-only: the original deterministic AI output, audit message/records, routing, verification, human-review requirements, uncertainty acknowledgment, Supervisor authority, financial-action/closure guards and export behavior remain unchanged. All nine detailed report sections, recommendation-only labels, and human authority boundaries remain visible. Failed/unusable/unavailable outcomes continue to show fallback instructions rather than a completion report.

Validation: all 145 unit tests passed; lint, foundation check, production build and whitespace checks passed. All 16 workflow browser scenarios passed, including exact completion heading and success text, absence of the removed notice, all nine sections, blocked escalation before human review, uncertainty acknowledgment, failed/unusable/unavailable fallback, verification and role restrictions, mandatory $500 approval, independent routine CSR completion, exception holds, cancellation, financial results, explicit closure and audit/export immutability.

Evidence: [unit results](test-artifacts/ai-completion-language/unit.txt), [lint](test-artifacts/ai-completion-language/lint.txt), [foundation check](test-artifacts/ai-completion-language/check.txt), [build](test-artifacts/ai-completion-language/build.txt), [browser regression](test-artifacts/ai-completion-language/browser.txt), and [assessment screenshot](test-artifacts/ai-completion-language/regression/professional-assessment.png).

Limits remain unchanged: deterministic training AI, invented data, simulated role selection rather than production authentication, session-only records, and no live financial services. Chromium required execution outside the sandbox. Existing uncommitted work was preserved. No commit or push performed.


## Supervisor role-restriction messaging — 2026-10-09

Implemented after Product Owner approval of the UI cleanup addition. CSR viewers of Supervisor Review see Supervisor Access Required and Only a Supervisor can review and approve this request. Approval status remains visible. The Supervisor decision confirmation checkbox and Approve Reversal/Reject request buttons are disabled unless the selected role is Supervisor, retaining existing terminal-case and recorded-approval disabling conditions. Routine requests still show Not Required with no Supervisor decision controls; exception holds still grant no processing authority.

Replaced the generic wrong-role guard message with action-specific role identification: Supervisor-only decisions use the requested Supervisor Access Required text; CSR-only actions use CSR Access Required. Only a CSR can perform this action. Invalid role selection asks for CSR or Supervisor. The allowed roles, action permissions, routing, verification, reviewed assessment, escalation, approval, reversal and closure gates are unchanged. Direct unauthorized attempts are still blocked and audited with the required role identified in the reason; audit schema, actor, timestamp and routing metadata remain intact.

Validation: all 146 unit tests passed, including direct wrong-role approval/rejection and seven CSR-only action attempts with unchanged state and blocked-action auditing. Lint, foundation smoke check, production build and whitespace checks passed. All 16 workflow browser scenarios and 9 case-creation browser scenarios passed. Browser checks verify both requested messages, visible pending approval status, disabled CSR checkbox/approval/rejection controls, enabled controls after switching to Supervisor, unchanged explicit decision confirmation, and CSR-specific restrictions on verification, assessment fallback, reversal, routine completion and closure. Existing routing, cancellation, failure, human closure and JSON export checks passed.

Evidence: [unit results](test-artifacts/supervisor-role-messaging/unit.txt), [lint](test-artifacts/supervisor-role-messaging/lint.txt), [foundation check](test-artifacts/supervisor-role-messaging/check.txt), [build](test-artifacts/supervisor-role-messaging/build.txt), [browser regression](test-artifacts/supervisor-role-messaging/browser.txt), [case-creation browser checks](test-artifacts/supervisor-role-messaging/create-case-browser.txt), and [CSR Supervisor Review screenshot](test-artifacts/supervisor-role-messaging/regression/supervisor-access-required.png).

This is a wording and UI availability change, not a change to authority. Role selection remains a training control rather than production authentication; account actions remain non-live, records remain session-only and not tamper-resistant. Chromium ran outside the sandbox. Existing uncommitted work was preserved. No commit or push performed.

## Supervisor approval requirement wording — 2026-10-09

Implemented after Product Owner approval. Supervisor Review displays “Supervisor Approval Required” and “This $500 transaction reversal requires Supervisor approval before processing. Submitting a request for review does not authorize the reversal.” Routine routing descriptions remove “project-specific” through display formatting. Stored routing reasons, audit records, JSON export and the application-defined $500 rule remain unchanged. Requesting review, granting approval and separately processing a reversal retain their existing guards.

Validation: all 146 unit tests and 16 workflow browser scenarios passed. Browser assertions cover both exact messages and scan every screen for routine developer/classroom terminology, including “project-specific.” Lint, foundation check, production build and whitespace checks passed.

Evidence: [unit results](test-artifacts/supervisor-approval-language/unit.txt), [browser results](test-artifacts/supervisor-approval-language/browser.txt), [lint](test-artifacts/supervisor-approval-language/lint.txt), [foundation check](test-artifacts/supervisor-approval-language/check.txt), [build](test-artifacts/supervisor-approval-language/build.txt), and [Supervisor Review screenshot](test-artifacts/supervisor-approval-language/regression/supervisor-access-required.png).

The $500 approval requirement is an application-defined, Product Owner-approved rule, not an official American Express policy. Original technical terminology remains in stored audit/export evidence. Limitations remain deterministic training actions, invented data, role selection rather than production authentication, session-only records and no live account access. Chromium required execution outside the sandbox. The case-creation browser suite was not rerun for this display-only change; it passed in the preceding role-messaging validation. No commit or push performed.

## Final README handoff and release validation — 2026-10-09

Product Owner authorized README review, final validation, commit and push after passing checks. README now provides the application name/framework, private repository, exact setup/run/preview commands, environment-variable names only, dashboard operation and environment limitations. No application environment variables are required. Git history verifies submitted Prototype V1 testing baseline d933b0c0fe6cf640f76346e0dad0d69c93660c82, titled Complete Prototype V1 testing and evidence; it is an ancestor of the current handoff. The earlier tested application baseline is 8bf38157b4eb65abce9a6acd492f4f9916017b16. The handoff includes subsequent approved enhancements and is a separate commit. Remote main was verified at the local parent 6e281e252cb6c4595e63d50c94af4658c9946e75 before release.

Final validation passed: 146 unit tests, all 16 workflow browser scenarios and all 9 case-creation browser scenarios, lint, foundation check, production build and whitespace checks. Browser suites reported no page errors. These checks exercise verification/role guards, human review, conditional routing, separate Supervisor approval/CSR processing/closure, cancellation, failure fixtures, interface wording and JSON export.

Evidence: [unit results](test-artifacts/final-handoff/unit.txt), [lint](test-artifacts/final-handoff/lint.txt), [foundation check](test-artifacts/final-handoff/check.txt), [production build](test-artifacts/final-handoff/build.txt), [workflow browser results](test-artifacts/final-handoff/browser.txt), and [case-creation browser results](test-artifacts/final-handoff/create-case-browser.txt).

Limitations: Node.js 24.21.0 and Chromium in this Codespaces environment were exercised; other platforms were not independently tested. Browser tests used the existing development server and externally installed Playwright; Chromium required sandbox escalation. Original WP-04A source remains unavailable. The application remains a nonproduction training system with invented records, deterministic AI, non-live account actions, role selection rather than authentication, and session-only audit state. Final release SHA and push result are reported separately after Git operations to avoid a self-referential commit identifier in this document.

## Week 8 Prototype V1 submission-readiness audit — 2026-10-09

Frozen application baseline: **0a4167d2ca56246fbbc175392820220ba76b5e1f**, Finalize approved workflow enhancements and Prototype V1 handoff, committed 2026-10-09. Application version: **0.1.0** in package.json and package-lock.json. Historical submission/testing commit d933b0c0fe6cf640f76346e0dad0d69c93660c82 is distinct and does not contain the final enhancements. No later documentation-only packaging commit exists yet. This audit modifies evidence only; it does not change the application, commit, push, or create a ZIP.

Clean installation: exported tracked files directly from the frozen commit into /tmp/wf007-readiness-clean with no dependencies/build output, then ran npm ci --offline against the available npm cache. Installation succeeded with 140 packages. This validates a clean locked install, not a fresh network download. The isolated Vite server responded successfully on port 5174. All 146 unit tests, foundation check, lint and production build passed. Both Chromium browser suites passed: 16 workflow scenarios and 9 case-creation scenarios, zero page errors. Browser tests used temporary copies with only localhost port 5173 changed to 5174 to isolate them from the existing dashboard; fixture logic and application sources were unchanged. Temporary test copies were restored after execution and all 28 core source/config/test files matched frozen hashes. Browser tooling is external, not an application dependency. Chromium and localhost HTTP verification required sandbox escalation.

Evidence: [clean install](test-artifacts/week8-readiness/install.txt), [unit suite](test-artifacts/week8-readiness/unit.txt), [foundation](test-artifacts/week8-readiness/check.txt), [lint](test-artifacts/week8-readiness/lint.txt), [build](test-artifacts/week8-readiness/build.txt), [workflow browser log](test-artifacts/week8-readiness/browser.txt), [case-creation browser log](test-artifacts/week8-readiness/create-case-browser.txt), [current assessment](test-artifacts/week8-readiness/regression/professional-assessment.png), [Supervisor review](test-artifacts/week8-readiness/regression/supervisor-access-required.png), and [closure audit](test-artifacts/week8-readiness/regression/success-audit.json). These supersede historical evidence for the current submission; historical records remain labeled by their original date/baseline.

Tracked-file pattern scan covered 581 files, detecting no private keys, common token patterns, credential-bearing URLs, assigned secrets, email addresses, secret filenames or tracked dependency/build/cache archives. Application fixtures and representative evidence use invented records. Runtime dependencies are React and React DOM; development dependencies support Vite, React compilation and ESLint. No unnecessary application dependencies were identified. See [scan findings and limits](test-artifacts/week8-readiness/scan.json). Pattern scanning is not a guarantee of absence; screenshots are not OCR-scanned. The Supervisor Review screenshot was visually checked and shows the current invented case and non-live environment notice. Historical launch-failure logs and duplicate prior screenshots are legitimate development history but excluded from the proposed submission allowlist.

[Proposed package allowlist](test-artifacts/week8-readiness/proposed-package-files.txt) identifies source, lockfile, tests, README, Mermaid visual sources, design mapping, existing evidence documentation and representative current evidence. No ZIP has been created. The allowlist excludes node_modules, .git, dist, secret files, temporary tooling and redundant historical artifacts. [Frozen core SHA-256 manifest](test-artifacts/week8-readiness/baseline-manifest.json) ties 28 application/config/test files to the full frozen commit. After approval, packaging should use that frozen source, add documentation/evidence only, verify hashes before and after archive extraction, record the ZIP SHA-256, and demonstrate from the same extracted source. A later packaging commit must be identified separately and must not be described as the same commit as the frozen baseline.

Remaining handoff conditions:

- README includes all requested setup/operation/environment/repository details and a verified historical baseline, but must explicitly identify 0a4167d2ca56246fbbc175392820220ba76b5e1f as the Week 8 application freeze before final packaging. A ZIP has no .git directory, so git rev-parse HEAD alone cannot identify the extracted submission.
- VIS-05.md and VIS-06.md contain Mermaid design sources, but no rendered standalone visuals. VIS-05 still shows a general manual-assessment choice; the final application exposes manual fallback only after failed/unusable/unavailable AI output. Both visuals retain historical interface wording; these need documentation alignment, not application changes. Mermaid rendering has not been validated.
- Product Owner clarified P1TEST as testing the exact build against relevant requirements, scenarios, authority boundaries, failure conditions and material design decisions. The full repository suite satisfies this supplied definition against the available approved local design: verification/role gates, AI limits and review, conditional routing, approval versus processing, cancellation/closure, stale authority, unavailable evidence, uncertainty/failure fixtures and export immutability. No PKG4 rubric/checklist is present, so that named package requirement cannot yet be certified. The original WP-04A source is also absent. Existing design-to-build mapping and current test logs/screenshots/audit exports are candidate PKG4 evidence, pending confirmation of its requirements.
- The supplied request does not require a separate narrative report. The existing README, design sources and test evidence support the handoff; no separate narrative report was created. Any external requirement for one remains unverified without the rubric.

Known limitations remain: session-only cases/audit reset on reload, training role selection is not production authentication, AI/account actions are deterministic/non-live, and exception holds have no separately approved corrective-resolution workflow. No features or redesign were added. Commit, push and final ZIP remain pending Product Owner approval of findings.

## Approved Week 8 documentation and submission packaging — 2026-10-09

Frozen application remains 0a4167d2ca56246fbbc175392820220ba76b5e1f, version 0.1.0. README now identifies that final freeze directly. VIS-05 removes the optional independent manual-assessment branch; failed/unusable/unavailable AI alone exposes manual fallback. VIS-06 received a minimal semicolon-to-period message correction for Mermaid parsing and its manual-fallback prose now matches the application. Both diagram sources parse/render successfully; standalone SVG and PDF exports are in docs/submission/visuals. Existing VIS-05 exports were preserved. Application source, workflow logic, configuration and test behavior are unchanged.

The earlier VIS-06 parser failure was reported and packaging stopped. Product Owner approved the syntax correction and resumption. The successful rendering record is docs/submission/visual-validation.txt. docs/submission/CONTENTS.md organizes representative P1TEST evidence and candidate PKG4 materials without asserting unavailable PKG4/WP-04A requirements. No separate narrative report was added. Historical test records remain historical; the Week 8 readiness evidence applies to the frozen application.

The submission uses an explicit allowlist, PACKAGE-MANIFEST.json and frozen core SHA-256 hashes. ZIP checksum and post-extraction verification/install/startup/build evidence are retained alongside the ZIP in the repository, outside the archive to avoid self-reference. The application baseline and later documentation commit are distinct. Final verification results and documentation commit SHA are reported after packaging operations.

### Final extracted-package startup verification

Product Owner approved retry after the preview server encountered sandbox EPERM binding port 5175. Authorized escalation resolved the environment restriction without application changes. The extracted production build served HTTP 200; Chromium verified dashboard loading, the training notice, case navigation, human verification and successful AI assessment with zero page errors. See docs/submission/extracted-package-startup.txt and extracted-package-startup.png. Earlier extracted-package installation, 146 unit tests, lint, foundation check and production build all passed; their logs are in docs/submission/extracted-package-*.txt.

The existing releases/AMX-WF-007-Prototype-V1-0a4167d.zip was reverified without regeneration: SHA-256 a8637b0fa2254c15df82beaa2d6978541e6e2899450e90306a75963ea684dc53, 59 archive entries, archive integrity and all manifest hashes passed. All 28 frozen core files match the original Git blobs, current workspace and extracted package. The frozen application remains 0a4167d2ca56246fbbc175392820220ba76b5e1f; the subsequent documentation/packaging commit adds no application or test changes. Post-extraction verification records are outside the ZIP as stated by the package contents index. PKG4 checklist/WP-04A remain unavailable; no claims against those missing requirements are made.
