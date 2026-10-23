# 6B.4 PCFG — configuration and reproduction

Product V1.0 Candidate — Week 10 Demo 2. Source SHA: e16b9967aaa2bf2ab6f595a76c3ac07b21638041. Branch: week10-product-v1-candidate. npm version: 0.1.0. Documentation date: October 23, 2026 (America/New_York). Packaging Git commit: none created.

No dependency or business logic changes. Canonical source/test/configuration exported from Git objects, avoiding Windows checkout line-ending differences. Root manifest lists exact source paths/hashes; all 28 original input and 57 original evidence hashes were compared with exported bytes before packaging.

Runtime declarations: react ^19.3.0, react-dom ^19.3.0. Dev declarations: @eslint/js ^10.0.1, @vitejs/plugin-react ^6.1.2, eslint ^10.12.0, eslint-plugin-react-hooks ^7.1.1, eslint-plugin-react-refresh ^0.5.7, globals ^17.13.0, vite ^8.3.4. package-lock.json fixes exact transitive versions and integrities. Use npm ci; no audit-fix or version updates during reproduction.

No required app variables or secrets. Optional CODESPACE_NAME and GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN form Vite's allowed host for port 5173. Browser-test variables: PLAYWRIGHT_MODULE, PLAYWRIGHT_BROWSERS_PATH, TEST_ARTIFACT_DIR. State is memory-only.

## Commands

From clean extraction: npm ci; npm test; npm run lint; npm run check; npm run build. Dev server: npm run dev -- --port 5173 --strictPort. Built preview: npm run preview -- --port 4173 --strictPort. npm.cmd may be needed on Windows.

New validation environment: Windows, Node 24.19.0, npm 11.17.0. Historical Codespaces evidence retains its own environment. Exact external browser versions, commands, timestamps and outcomes are in validation logs.

With dev server running in another terminal, external PowerShell browser setup:

~~~powershell
$wf007Tools = Join-Path $env:TEMP 'wf007-browser-tools'
npm.cmd install --prefix $wf007Tools --no-save playwright
$env:PLAYWRIGHT_MODULE = Join-Path $wf007Tools 'node_modules/playwright'
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $wf007Tools 'browsers'
node (Join-Path $wf007Tools 'node_modules/playwright/cli.js') install chromium
$env:TEST_ARTIFACT_DIR = Join-Path $env:TEMP 'wf007-workflow-evidence'
npm.cmd run test:browser
$env:TEST_ARTIFACT_DIR = Join-Path $env:TEMP 'wf007-creation-evidence'
npm.cmd run test:browser:create-case
~~~

Record installed Playwright version. Fixture suites intercept dev modules, not production assets. Separate built-preview startup/workflow smoke results do not establish complete production-asset coverage.

## Git-free identification

PACKAGE-MANIFEST.json lists every included payload hash except itself, fixed source SHA, branch, version, date and designation. New documentation is uncommitted; any future packaging commit must be separately reported. Final ZIP checksum is adjacent, never embedded into the ZIP it hashes. Included preparation-extraction evidence is distinguished from adjacent exact final-ZIP validation. No source version change: Product V1.0 Candidate is a designation, npm remains 0.1.0.


## New package-preparation validation — October 23, 2026

Canonical source hashes matched before execution and after browser checks. Locked installation, 150 unit tests, lint, foundation check and build passed on Windows Node 24.19.0/npm 11.17.0. All 16 workflow and 9 creation browser scenarios passed with Chromium 156.0.8078.4 and zero page errors. Built preview returned HTTP 200 and passed unverified blocking, verification, assessment, approval, separate CSR reversal, explicit closure and JSON-export smoke checks with zero page errors. These checks do not establish production readiness.

Initial npm ci failed with EPERM creating a scoped dependency directory. Creating the writable empty directory and retrying succeeded; no dependency versions changed. Initial browser checks failed because downloads were canceled, and the preview launcher initially used an incorrect browser cache. They are retained under package-validation/browser-initial-attempt. Retry used external writable TEMP/TMP/download paths and a Playwright launch adapter; no application or committed tests changed. External Playwright 1.64.1 was installed outside the package.

A current npm audit reported one high-severity advisory for development dependency zod 4.6.5, reached through eslint-plugin-react-hooks (and zod-validation-error): GHSA-mrhx-c7xc-m3w5, oversized constrained collections can exhaust memory. Runtime-only npm audit --omit=dev reported zero findings. This is a recorded dependency finding, not a claim of general security. No audit fix or dependency update was applied because the approved source/lockfile must remain exact. Product Owner should review this finding before any future freeze/release. Audit JSON/dependency tree are included.

These are preparation-extraction results. Final exact ZIP extraction results and checksum are reported alongside the archive, avoiding self-reference. Missing original VIS-07/08/09 visuals/workbook references and pending recording/submission remain explicit.


### Windows browser-download workaround used in validation

The included package-validation/launch-overrides.cjs is an external test-launch adapter, not application logic. It preserves headless launch and only sets a writable downloadsPath. If the default sandbox temp path cancels downloads, use these settings after the external browser install above:

~~~powershell
$env:TEMP = Join-Path $env:USERPROFILE "Documents/Codex/wf007-browser-temp"
$env:TMP = $env:TEMP
New-Item -ItemType Directory -Force -Path $env:TEMP | Out-Null
$env:WF007_REAL_PLAYWRIGHT = Join-Path $wf007Tools "node_modules/playwright"
$env:WF007_DOWNLOAD_DIR = Join-Path $env:TEMP "downloads"
$env:PLAYWRIGHT_MODULE = (Resolve-Path "docs/week10/package-validation/launch-overrides.cjs").Path
~~~

The actual preparation runner/launcher copies are retained as text evidence. No elevated execution was used for the successful Windows retry. Historical Codespaces successes required approved elevation.


## GitHub publication context

Prepared for the validated ZIP before the subsequent documentation-only GitHub publication. No-packaging-commit statements describe that unchanged archive snapshot. Application source remains e16b9967aaa2bf2ab6f595a76c3ac07b21638041; later publication commit is separate. See [PUBLICATION.md](PUBLICATION.md) for identity distinctions, current evidence links and commit discovery. ZIP is not committed or regenerated.
