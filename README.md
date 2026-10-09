# AMX-WF-007 — Customer Service Operations Dashboard

An internal customer service request review and escalation application built with **React, JavaScript, and Vite**. This nonproduction training application uses invented customer data and deterministic AI assessments; it is not an official American Express application.

## Repository and submitted version

Private repository: [piratescoolfall/amex-wf007-prototype-v1](https://github.com/piratescoolfall/amex-wf007-prototype-v1).

Submitted Prototype V1 baseline: **`d933b0c0fe6cf640f76346e0dad0d69c93660c82`** (`Complete Prototype V1 testing and evidence`). Verified against Git history and the original test evidence. Later approved enhancements are included in the current handoff; this historical baseline does not identify the enhanced version. Run `git rev-parse HEAD` to identify your checked-out version.

## Setup and run

Use Node.js **24** and npm (validated with Node.js 24.21.0). Repository access requires GitHub permission.

```sh
git clone https://github.com/piratescoolfall/amex-wf007-prototype-v1.git
cd amex-wf007-prototype-v1
npm ci
npm run dev -- --port 5173 --strictPort
```

Open **http://localhost:5173**. In GitHub Codespaces, open port **5173** through **Ports → Open in Browser** and keep its visibility **Private**. Stop the server with Ctrl+C.

**Required environment variables: none.** No API keys, credentials, or secrets are needed. Codespaces optionally supplies `CODESPACE_NAME` and `GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN` for host configuration.

## Operating the dashboard

- Open a case with **View case**, or use **Create New Case** to select preset customer/request information.
- As **CSR**, complete the assigned **Required Verification Method** and select **Confirm Verification**. Never enter actual security answers, verification codes, or identity documents.
- Select **Run AI Assessment**, review the detailed report, and record human review. AI completion does not grant approval or process a transaction. **Complete Assessment Without AI** appears only when AI output fails or is unavailable/unusable.
- Routine statement explanations and transaction inquiries show **Supervisor Approval: Not Required**. The CSR explicitly completes the request and separately confirms case closure.
- A $500 reversal requires a request for Supervisor review. Switch the header **Role** to **Supervisor**, confirm the decision, and approve or reject. Switch back to **CSR** to **Process Reversal**, then explicitly **Confirm Case Closure**. Requesting review, approval, processing, and closure are separate actions.
- **Close / Cancel Case** requires a reason and CSR confirmation before reversal processing. Unsuccessful identity verification has a separate reason/confirmation closure path. A processed reversal cannot be automatically undone through cancellation.
- Open **Audit History** and select **Download JSON audit** to export the session before refreshing.

The $500 approval requirement is an application-defined, Product Owner-approved rule, not official American Express policy. Exceptions and unsupported requests remain on hold for human review without processing authority.

## Environment limitations

The visible notice is **Training environment · No live account access**. Financial outcomes are explicitly non-live. There are no live banking integrations, external AI services, or production authentication; role switching is a training control. Cases and audit records are held in memory and reset on reload. Exported records retain their original evidence terminology and are not durable or tamper-resistant. Verification, authorization, human review, and closure guards remain enforced.

## Validation and production preview

```sh
npm test
npm run lint
npm run check
npm run build
npm run preview -- --port 4173 --strictPort
```

Open **http://localhost:4173** for the built application. Browser suites require the development server on port 5173, Playwright and its Chromium installation; Playwright is not installed by `npm ci`:

```sh
npm install --prefix /tmp/amx-browser --no-save playwright
/tmp/amx-browser/node_modules/.bin/playwright install chromium
npm run test:browser
npm run test:browser:create-case
```

Optional browser-test environment variable names: `PLAYWRIGHT_MODULE`, `PLAYWRIGHT_BROWSERS_PATH`, `TEST_ARTIFACT_DIR`. Test results and limitations are recorded in [test evidence](docs/test-evidence.md); workflow documentation is in [design-to-build mapping](docs/design-to-build-map.md).
