# amex-wf007-prototype-v1
Secure AI-assisted customer service workflow prototype

This React + JavaScript + Vite classroom simulation supports human CSR verification, guarded assessment, deterministic simulated AI, human Supervisor review, a separate CSR mock reversal, explicit closure, and JSON audit export. All cases are fictional and held in memory. It is not an official American Express application.

Use Node.js 24 (validated with 24.21.0) and npm:

```sh
npm ci
npm run dev
```

Validation and production preview:

```sh
npm test
npm run lint
npm run check
npm run build
npm run preview
```

The default screen is the synthetic case queue. Select **View case** on the $500 reversal request. As **CSR**, attest simulation verification, then run simulated AI and record human review (or record manual assessment). Request Supervisor review. Switch the header role to **Supervisor**, explicitly confirm and approve the fictional reversal. Switch back to **CSR** and trigger the simulated reversal in **Action & Closure**. The case stays open until you explicitly confirm closure. **Audit Timeline** displays events and downloads a JSON export covering all cases in the session.

The role selector is a simulation control, not authentication. Unverified processing attempts and wrong-role actions are blocked and audited by centralized workflow guards. Usable but uncertain AI output displays a warning requiring acknowledgment; failed or unusable output requires manual fallback. Material information edits in **Verification** invalidate verification, assessment, escalation, and approval. Rejected, withdrawn, and failed-action cases remain open for review. The other two information cases can be verified and assessed, but have no approved reversal/closure path.

No live AI, real authentication, real financial action, or banking integration exists. Reloading resets cases and audit events; export before reload. Audit data is not durable or tamper-resistant. The approved design documents are in `docs/`. The [Phase 1 validation record](docs/phase-1-validation.md) describes the earlier foundation only. Formal Step 4 testing is complete; results and limitations are recorded in [test evidence](docs/test-evidence.md). Step 5 awaits Product Owner review.

For this preview, run only `npm run build` and start `npm run dev -- --port 5173 --strictPort`. In GitHub Codespaces, open the **Ports** tab and use **Open in Browser** for port **5173**. Keep the forwarded port **Private**. If the server stops, rerun that command. Use the workflow screens to explore the synthetic simulation; navigation does not process a case.
