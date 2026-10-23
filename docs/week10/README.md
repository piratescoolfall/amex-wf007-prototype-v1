# AMEX WF-007 — Week 10 Demo 2

Product V1.0 Candidate — Week 10 Demo 2. Source SHA: e16b9967aaa2bf2ab6f595a76c3ac07b21638041. Branch: week10-product-v1-candidate. npm version: 0.1.0. Documentation date: October 23, 2026 (America/New_York). Packaging Git commit: none created.

React/JavaScript/Vite customer service training application. Uses invented data, local deterministic AI and mock financial actions. Not affiliated with or authorized by American Express; application rules are not real American Express policies.

## Identity and setup

This ZIP combines exact candidate source with local handoff documentation, not an unchanged Git checkout. PACKAGE-MANIFEST.json identifies included bytes without Git metadata. The adjacent .sha256 file identifies the archive; a ZIP hash is distinct from the source SHA or a later packaging commit. No merge, freeze, release or submission performed.

Extract to an empty directory. Use Node.js 24 and npm; new Windows validation uses Node 24.19.0/npm 11.17.0. Network required for fresh locked installation. No required application environment variables, API keys or credentials.

~~~sh
npm ci
npm run dev -- --port 5173 --strictPort
~~~

Open http://localhost:5173 (private forwarded port in Codespaces). Stop with Ctrl+C. Opening index.html directly does not launch Vite. On Windows use npm.cmd if npm.ps1 is blocked.

~~~sh
npm test
npm run lint
npm run check
npm run build
npm run preview -- --port 4173 --strictPort
~~~

Built preview: http://localhost:4173. Local preview is not production deployment/security approval. Runtime dependencies: React/React DOM. Dev tools: Vite, React plugin, ESLint packages. package-lock.json contains exact resolutions; no dependency changes.

## Reviewer scenario

1. CSR: view SYN-007-001. Try Run AI Assessment before verification; show blocked notice.
2. Identity Verification: attest assigned simulated method and Confirm Verification. Never enter actual security answers, codes or documents.
3. Run AI Assessment, review report, check human review, Record human AI review, Request Supervisor review.
4. Supervisor Review: switch Role to Supervisor, explicitly confirm and Approve Reversal. Approval performs no reversal.
5. Switch CSR. Action & Closure: Process Reversal. Simulated result leaves case open.
6. Check explicit CSR closure and Confirm Case Closure. Audit History: inspect events and Download JSON audit.
7. Create second synthetic $500 case; verify/assess/escalate, then reject as Supervisor. It stays open for review; do not cancel while demonstrating rejection.

Routine requests require separate CSR completion and closure, without financial authority. Approved pre-action cancellation and incomplete-verification closure remain separate human dispositions. Failed reversals remain open and cannot be cancelled; no undo/corrective financial workflow.

## Browser reproduction

Dev server must run on localhost:5173. Playwright/Chromium are external tooling, not package dependencies. Install outside the extracted source; set PLAYWRIGHT_MODULE (absolute module directory), PLAYWRIGHT_BROWSERS_PATH and separate TEST_ARTIFACT_DIR values per suite. See docs/week10/PCFG.md for exact commands.

Run npm run test:browser and npm run test:browser:create-case. Alternative AI/action outcomes use browser-test interception in tests/browser-fixtures.mjs, not ordinary UI selectors. Normal UI requests usable AI/successful mock reversal. Live Supervisor rejection is the recording exception scenario.

## Evidence and limitations

See docs/week10/ENGINEERING-RECONCILIATION.md, D2CHK.md, PKG6-INDEX.md and DEMO-2.md. All 59 original Week 10 evidence files are retained, including initial failures. Historical manifest was created after testing, not contemporaneous proof of test inputs. New extraction checks capture hashes before execution and record actual outcomes separately.

Roles are selections, not SSO/MFA/server RBAC. Identity verification is attestation only. AI is deterministic, reversals never change real accounts. Cases/audits reset on refresh; exports are neither durable nor tamper-resistant. Unsupported requests hold. Production monitoring, concurrency, recovery, security validation and Week 11 formal V&V are unestablished.

Original VIS-07/08/09 exports are unavailable: provisional text is labeled accordingly. OneDrive workbook remains authoritative, was not accessed/updated and is not duplicated. No video recorded or submitted.

Original Week 8 README is retained at docs/week10/WEEK8-README-HISTORICAL.md. Repository Week 8 release/submission artifacts remain unchanged and are excluded from this separate ZIP.


## New package-preparation validation — October 23, 2026

Canonical source hashes matched before execution and after browser checks. Locked installation, 150 unit tests, lint, foundation check and build passed on Windows Node 24.19.0/npm 11.17.0. All 16 workflow and 9 creation browser scenarios passed with Chromium 156.0.8078.4 and zero page errors. Built preview returned HTTP 200 and passed unverified blocking, verification, assessment, approval, separate CSR reversal, explicit closure and JSON-export smoke checks with zero page errors. These checks do not establish production readiness.

Initial npm ci failed with EPERM creating a scoped dependency directory. Creating the writable empty directory and retrying succeeded; no dependency versions changed. Initial browser checks failed because downloads were canceled, and the preview launcher initially used an incorrect browser cache. They are retained under package-validation/browser-initial-attempt. Retry used external writable TEMP/TMP/download paths and a Playwright launch adapter; no application or committed tests changed. External Playwright 1.64.1 was installed outside the package.

A current npm audit reported one high-severity advisory for development dependency zod 4.6.5, reached through eslint-plugin-react-hooks (and zod-validation-error): GHSA-mrhx-c7xc-m3w5, oversized constrained collections can exhaust memory. Runtime-only npm audit --omit=dev reported zero findings. This is a recorded dependency finding, not a claim of general security. No audit fix or dependency update was applied because the approved source/lockfile must remain exact. Product Owner should review this finding before any future freeze/release. Audit JSON/dependency tree are included.

These are preparation-extraction results. Final exact ZIP extraction results and checksum are reported alongside the archive, avoiding self-reference. Missing original VIS-07/08/09 visuals/workbook references and pending recording/submission remain explicit.


## GitHub publication context

Prepared for the validated ZIP before the subsequent documentation-only GitHub publication. No-packaging-commit statements describe that unchanged archive snapshot. Application source remains e16b9967aaa2bf2ab6f595a76c3ac07b21638041; later publication commit is separate. See [PUBLICATION.md](PUBLICATION.md) for identity distinctions, current evidence links and commit discovery. ZIP is not committed or regenerated.
