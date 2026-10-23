# 6B.6 D2CHK — engineering pre-check

Product V1.0 Candidate — Week 10 Demo 2. Source SHA: e16b9967aaa2bf2ab6f595a76c3ac07b21638041. Branch: week10-product-v1-candidate. npm version: 0.1.0. Documentation date: October 23, 2026 (America/New_York). Packaging Git commit: none created.

Acceptance basis: ACCEPTANCE-BASIS.md. This matrix is not formal Week 11 V&V.

| Criterion | Implementation/evidence | Status / limitation |
| --- | --- | --- |
| Intended user/workflow | CSR queue/create/verify/report/review/action/closure; README scenario | Implemented/tested; recording pending |
| Human authority | role/current-revision/strict confirmation guards | Classroom only; no enterprise IAM |
| Verification safeguard | verification.js, pre-generation guard; bypass tests | Implemented attestation, not real identity validation |
| Observable evidence | audit timestamps/routing/JSON; export/reset tests | In memory, not durable/tamper-resistant |
| Failure/exception/fallback | rejection UI; failed AI/action fixture tests | Live rejection demo possible; failure selectors test-only |
| AI/uncertainty | advisory report, acknowledgment, failure-only fallback | Implemented simulation; no live AI |
| Limitation / Week 11 statement | README/reconciliation/demo script | Documented; recording narration pending |
| 6A.1 ENGAUTH | PO authorization/Week 9 statement in task | Attributed; formal record/extra conditions not supplied |
| 6A.2 COMP / VIS-07 | provisional architecture text | Partial; original visual/export unavailable |
| 6A.3 UX / VIS-08 | provisional flow text | Partial; original visual/export unavailable |
| 6A.4 FLOW / VIS-09 | provisional information/knowledge flow | Partial; original visual/export unavailable |
| 6A.5 IAMIMPL | simulated role and human authority checks | Implemented client restrictions; no server authorization |
| 6A.6 AIINT | deterministic bounded report/fallback | Implemented/test-supported |
| 6A.7 consistent design | actual/future-state distinction, existing VIS-05/06 context | Original conceptual reconciliation remains partial |
| 6B.1 CTRLIMPL | code/test table in reconciliation | Supported by unit/browser evidence |
| 6B.2 RDEPIMPL | locked install, failure/fallback/holds, external tooling | No durable recovery/concurrency |
| 6B.3 OBS | session event/export evidence | No enterprise monitoring/log integrity |
| 6B.4 PCFG | fixed SHA/branch/version/config/commands/manifest | Identifiable without Git; actual validation recorded |
| 6B.5 BDEC | preservation/hardening decisions | Documented; no new business logic |
| 6B.6 D2CHK | this matrix and evidence | Engineering pre-check only |
| 6B.7 PKG6 | real source/config/tests/data/evidence package | See actual validation; visual/recording gaps explicit |
| Safe sample data/source | canonical Git export and presets | Included; no credentials required |
| Consistent candidate identity | source SHA in docs/manifest/script | Recording must use same ZIP; pending |
| Exclusions/content review | explicit allowlist; original CONTENT-REVIEW | Scans are not proof of every secret's absence |
| Authoritative workbook | OneDrive remains authoritative, no duplicate | Not accessed/updated; link/sections not supplied |
| Demo/post/private submission | script and final archive | No recording/submission claimed |
| Two vendor peer reviews | external Canvas activity | Not performed |

Original logs support 150 unit passes, 16+9 browser passes/zero page errors, lint/foundation/build passes. Initial failures retained. Original manifest generated after tests cannot prove historical input bytes. New extraction evidence captures hashes before testing and actual outcomes; adjacent final report identifies exact final ZIP. Failed/blocked checks must remain honestly labeled.

Supplied deadline: Friday October 23, 2026, 11:59 p.m.; exact course timezone not separately stated. No final acceptance, freeze, release, security certification or Week 11 V&V claimed.


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
