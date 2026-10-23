# 6B.7 PKG6 — evidence index

Product V1.0 Candidate — Week 10 Demo 2. Source SHA: e16b9967aaa2bf2ab6f595a76c3ac07b21638041. Branch: week10-product-v1-candidate. npm version: 0.1.0. Documentation date: October 23, 2026 (America/New_York). Packaging Git commit: none created.

| Material | Included path |
| --- | --- |
| Setup/purpose/scenario/limitations | root README.md |
| Original Week 8 README, historical | docs/week10/WEEK8-README-HISTORICAL.md |
| Actual application/sample data | src/ including data/cases.js and preset creation |
| Tests/config | tests/, scripts/check-foundation.mjs, index.html, package manifests, Vite/ESLint config, .gitignore, AGENTS.md |
| Exact identity | PCFG.md, SOURCE-IDENTITY.json, root PACKAGE-MANIFEST.json |
| WP-06A/B authorization/control/resilience/observability/decisions | ENGINEERING-RECONCILIATION.md |
| Criteria/pre-check | ACCEPTANCE-BASIS.md, D2CHK.md |
| Existing workflow context | docs/VIS-05.md, VIS-06.md, design-to-build-map.md |
| VIS-07/08/09 | provisional text in reconciliation; original exports missing, not invented |
| Original Week 10 evidence | docs/test-artifacts/week10-hardening/ — all 59 files |
| Preparation-extraction results | docs/week10/package-validation/ |
| Exact final ZIP validation | adjacent validation report/evidence directory and .sha256 |
| Recording | DEMO-2.md script, video/link pending |
| OneDrive workbook | authoritative WP-06A/B/Portfolio Journey; not duplicated/updated; link not supplied |

Original hardening README's no-commit statement describes its earlier implementation stage; source candidate subsequently committed those records. Original manifest: 28 inputs +57 original artifacts; generated after testing. Root manifest binds package payloads excluding itself and fixed source identity. Final ZIP checksum is external to avoid self-reference.

Preparation-extraction logs inside ZIP are distinguished from adjacent exact-final-ZIP checks. Source app stays 0.1.0; no Git needed for identification.

Exclusions: .git, node_modules, dist, temporary tooling, real customer/confidential data, credentials/secrets, redundant Week 8 ZIP and obsolete historical evidence. Original Week 8 repository artifacts unchanged.

Outstanding for final review/submission: original conceptual VIS-07/08/09 exports/workbook references, 2–3 minute recording/link, Canvas private upload/discussion post, two peer reviews. No automatic submission or workbook duplicate.


## New package-preparation validation — October 23, 2026

Canonical source hashes matched before execution and after browser checks. Locked installation, 150 unit tests, lint, foundation check and build passed on Windows Node 24.19.0/npm 11.17.0. All 16 workflow and 9 creation browser scenarios passed with Chromium 156.0.8078.4 and zero page errors. Built preview returned HTTP 200 and passed unverified blocking, verification, assessment, approval, separate CSR reversal, explicit closure and JSON-export smoke checks with zero page errors. These checks do not establish production readiness.

Initial npm ci failed with EPERM creating a scoped dependency directory. Creating the writable empty directory and retrying succeeded; no dependency versions changed. Initial browser checks failed because downloads were canceled, and the preview launcher initially used an incorrect browser cache. They are retained under package-validation/browser-initial-attempt. Retry used external writable TEMP/TMP/download paths and a Playwright launch adapter; no application or committed tests changed. External Playwright 1.64.1 was installed outside the package.

A current npm audit reported one high-severity advisory for development dependency zod 4.6.5, reached through eslint-plugin-react-hooks (and zod-validation-error): GHSA-mrhx-c7xc-m3w5, oversized constrained collections can exhaust memory. Runtime-only npm audit --omit=dev reported zero findings. This is a recorded dependency finding, not a claim of general security. No audit fix or dependency update was applied because the approved source/lockfile must remain exact. Product Owner should review this finding before any future freeze/release. Audit JSON/dependency tree are included.

These are preparation-extraction results. Final exact ZIP extraction results and checksum are reported alongside the archive, avoiding self-reference. Missing original VIS-07/08/09 visuals/workbook references and pending recording/submission remain explicit.


## GitHub publication context

Prepared for the validated ZIP before the subsequent documentation-only GitHub publication. No-packaging-commit statements describe that unchanged archive snapshot. Application source remains e16b9967aaa2bf2ab6f595a76c3ac07b21638041; later publication commit is separate. See [PUBLICATION.md](PUBLICATION.md) for identity distinctions, current evidence links and commit discovery. ZIP is not committed or regenerated.
