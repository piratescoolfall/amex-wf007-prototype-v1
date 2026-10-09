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
