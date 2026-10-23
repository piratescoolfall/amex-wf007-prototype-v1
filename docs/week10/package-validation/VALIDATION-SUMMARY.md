# Preparation-extraction validation

Source e16b9967aaa2bf2ab6f595a76c3ac07b21638041. No source/config/test modifications. All 28 inputs match canonical SHA-256 before/after tests. All 85 historical manifest entries matched before packaging.


## New package-preparation validation — October 23, 2026

Canonical source hashes matched before execution and after browser checks. Locked installation, 150 unit tests, lint, foundation check and build passed on Windows Node 24.19.0/npm 11.17.0. All 16 workflow and 9 creation browser scenarios passed with Chromium 156.0.8078.4 and zero page errors. Built preview returned HTTP 200 and passed unverified blocking, verification, assessment, approval, separate CSR reversal, explicit closure and JSON-export smoke checks with zero page errors. These checks do not establish production readiness.

Initial npm ci failed with EPERM creating a scoped dependency directory. Creating the writable empty directory and retrying succeeded; no dependency versions changed. Initial browser checks failed because downloads were canceled, and the preview launcher initially used an incorrect browser cache. They are retained under package-validation/browser-initial-attempt. Retry used external writable TEMP/TMP/download paths and a Playwright launch adapter; no application or committed tests changed. External Playwright 1.64.1 was installed outside the package.

A current npm audit reported one high-severity advisory for development dependency zod 4.6.5, reached through eslint-plugin-react-hooks (and zod-validation-error): GHSA-mrhx-c7xc-m3w5, oversized constrained collections can exhaust memory. Runtime-only npm audit --omit=dev reported zero findings. This is a recorded dependency finding, not a claim of general security. No audit fix or dependency update was applied because the approved source/lockfile must remain exact. Product Owner should review this finding before any future freeze/release. Audit JSON/dependency tree are included.

These are preparation-extraction results. Final exact ZIP extraction results and checksum are reported alongside the archive, avoiding self-reference. Missing original VIS-07/08/09 visuals/workbook references and pending recording/submission remain explicit.

