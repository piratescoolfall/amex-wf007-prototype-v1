# Week 8 Prototype V1 submission

**Application:** AMX-WF-007 Customer Service Operations Dashboard  
**Version/date:** 0.1.0 · October 9, 2026  
**Frozen application commit:** `0a4167d2ca56246fbbc175392820220ba76b5e1f`

Application source, configuration, lockfile and tests are unchanged from the frozen commit. Documentation and rendered visuals are packaging additions; a later documentation commit is a different version of the repository, not the application baseline. `PACKAGE-MANIFEST.json` records the frozen application hashes and hashes for all other included files. The ZIP checksum and extraction-validation results are published alongside the ZIP in the repository; they cannot be embedded in the ZIP they describe.

## Included material

- Source application: `src/`, `index.html`, `package.json`, `package-lock.json`, `vite.config.js` and `eslint.config.js`.
- Reproduction: root `README.md`, `tests/` and `scripts/check-foundation.mjs`.
- Design sources: `docs/VIS-05.md`, `docs/VIS-06.md` and `docs/design-to-build-map.md`.
- Rendered design visuals: `docs/submission/visuals/VIS-05.svg`, `VIS-05.pdf`, `VIS-06.svg` and `VIS-06.pdf`. SVG supports browser zoom; PDFs support standalone review. VIS-05 exposes manual fallback only after failed, unusable or unavailable AI output, matching the frozen application.
- P1TEST: `docs/test-artifacts/week8-readiness/` includes clean-install logs, 146 unit tests, 16 workflow browser scenarios, 9 case-creation browser scenarios, lint, foundation check and production build results. Screenshots and audit JSON represent the frozen dashboard and authority boundaries. Browser suites reported zero page errors.
- PKG4 candidate evidence: the README, design mapping, visual sources/exports, test logs, representative screenshots, audit exports and baseline manifest. No external PKG4 checklist or original WP-04A source was supplied; no missing requirement IDs or compliance claims are invented.

The existing `docs/test-evidence.md` preserves dated historical records. Older artifact links describe earlier baselines and are not included in this curated ZIP; use the Week 8 section and included readiness artifacts for current evidence. No separate narrative report is required by the supplied instructions; this contents index organizes the existing handoff evidence.

## Demonstration and limitations

Extract the ZIP, follow the root README, and use the same extracted source for the demonstration. Confirm its frozen hashes against `PACKAGE-MANIFEST.json`; Git is unnecessary for package identification. Demonstrate verification, recorded human AI review, conditional approval routing, separate Supervisor approval and CSR processing, explicit human closure, and JSON audit export.

Only invented data and non-live actions are included. Roles are training controls rather than production authentication. Cases/audit reset on reload and are not durable or tamper-resistant. Exceptions remain held without a separately approved corrective-resolution workflow. The $500 approval rule is application-defined, not official American Express policy. Node.js 24.21.0 and Chromium were exercised; other platforms were not independently validated. Clean installation used a populated npm cache. Browser tooling is external and not bundled.

The package excludes `.git`, `node_modules`, generated application build output, temporary rendering/browser tooling, secret files and redundant historical artifacts. Pattern scanning supplements review but does not prove the absence of sensitive content.
