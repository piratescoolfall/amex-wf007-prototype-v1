# Week 10 Demo 2 — package and validation report

**Designation:** Product V1.0 Candidate — Week 10 Demo 2  
**Date:** October 23, 2026 (America/New_York)  
**Source candidate:** e16b9967aaa2bf2ab6f595a76c3ac07b21638041  
**Branch:** week10-product-v1-candidate  
**npm version:** 0.1.0 (unchanged)  
**Packaging Git commit:** none created. Handoff additions are local/uncommitted and distinct from the fixed source SHA.

## Deliverable

ZIP: AMEX-WF007-Week10-Demo2-Candidate-e16b9967.zip  
Absolute path: C:\Users\Kyra\Documents\Codex\2026-10-09\read-agents-md-and-propose-a\outputs\AMEX-WF007-Week10-Demo2-Candidate-e16b9967.zip  
Size: 20208596 bytes  
SHA-256: d07ae6dbe333cbd7d1662339f24100a33307097fcd0d32a3ffed1262402f69e0

Adjacent .zip.sha256 identifies final archive bytes. Week10-VALIDATION-RESULTS.json has machine-readable outcomes. Week10-PACKAGE-MANIFEST.json is also embedded as PACKAGE-MANIFEST.json.

Archive has 199 entries; all 198 payloads verified on extraction and after all tests. All 28 application/test/configuration inputs and 85 original hardening-manifest entries match canonical candidate bytes. No Git metadata needed. Source SHA, packaging commit (none) and ZIP checksum are distinct.

## Exact final ZIP extraction validation

| Check | Actual result |
| --- | --- |
| Clean extraction/inventory/hashes | PASS |
| Locked npm ci | PASS; 140 packages installed; advisory below |
| Unit tests | 150 passed, zero failed |
| Lint | PASS |
| Foundation checks | PASS |
| Build | PASS |
| Workflow browser suite | 16 passed; zero page errors |
| Creation browser suite | 9 passed; zero page errors |
| Built preview | HTTP 200; unverified block, verification, assessment, human review, Supervisor approval, separate CSR reversal, explicit closure and JSON export passed; zero page errors |
| Post-test integrity | All 198 archive payloads and 28 source inputs unchanged |

Environment: Windows, Node v24.19.0, npm 11.17.0, Playwright 1.64.1, Chromium 156.0.8078.4. Browser suites exercised development modules on localhost:5173; built smoke exercised preview assets on localhost:4173. Test-only alternate outcome interception is not a normal UI feature.

Evidence: Week10-Final-Validation-Evidence/ contains environment.json, checks.json, unit/lint/foundation/build/install logs, workflow/creation browser logs and result JSON, preview-audit.json/png, hashes before/after execution, archive-verification.json and payload-hashes-after-all-checks.json. Final runs used a fresh extraction of the exact final ZIP.

## Provenance and environment limits

ZIP includes all 59 original Week 10 evidence files plus preparation-extraction evidence. Original manifest was generated after original testing and does not prove historical inputs. New final extraction hashes were captured before execution and checked afterward. Preparation and final runs are labeled separately; final checksum/report remain outside ZIP to avoid circular hashes.

Preparation initially hit npm EPERM creating a scoped directory. An empty writable node_modules/@types directory was created and locked install retried successfully. Final extraction used the same empty-directory preparation; no dependency was injected or changed. Initial browser downloads were canceled and initial preview launcher used a wrong cache. External writable TEMP/TMP/download paths and Playwright launch adapter resolved those environment issues. Initial failure records retained inside ZIP. Successful Windows checks used no elevated execution; historical Codespaces browser success required approved elevation.

## Dependency finding for Product Owner review

Current npm audit reports **one high-severity development-only advisory** in locked zod 4.6.5 through ESLint React Hooks tooling: GHSA-mrhx-c7xc-m3w5, oversized constrained collections can exhaust memory. Runtime-only audit reported zero findings. Included preparation evidence contains audit JSON, stderr and dependency tree. No audit fix/version change applied under exact-source authorization. This remains an unresolved finding for review before any future freeze/release, not a clean-security claim.

## Handoff and remaining review

ZIP contains actual React/Vite source, synthetic fixtures, tests, lockfile/configuration, Week 10 root README and requested PCFG, ENGINEERING-RECONCILIATION, D2CHK, PKG6-INDEX and DEMO-2. Supplied criteria, source identity and manifests included. WP-06A/B mapped to implementation/tests/evidence. Week 9 approval attributed to Product Owner task statement; formal record/additional conditions not supplied.

Original VIS-07/08/09 sources/exports remain unavailable. Provisional textual architecture/UX/flow separates implemented features from future enterprise services; no original diagrams invented. OneDrive workbook remains authoritative, not accessed/updated/duplicated. Recording script included; no video, discussion post, Canvas upload or peer review performed.

Simulated roles are not authentication/SSO/MFA/server RBAC; verification is attestation, AI local deterministic, account actions mock. Cases/audit reset on refresh; export not durable/tamper-resistant; unsupported cases hold. Production monitoring/concurrency/recovery/security validation and Week 11 formal V&V remain unestablished.

## Preservation and stop point

Local candidate checkout remains at e16b9967aaa2bf2ab6f595a76c3ac07b21638041 with only new docs/week10 additions. Source/config/tests, Week 8 submission/release and main untouched. No commit, push, merge, freeze or release. Package and report stop for final Product Owner review; missing visuals/workbook references, dependency advisory and recording/submission remain explicit.
