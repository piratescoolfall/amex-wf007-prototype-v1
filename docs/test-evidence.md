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
