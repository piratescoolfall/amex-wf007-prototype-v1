# AMEX-WF007 Prototype V1 — Codex Instructions

## Project
Build a secure, internal Customer Service Request Review
and Escalation prototype using React, JavaScript, and Vite.

Use synthetic data only. This is a classroom prototype,
not an official American Express application.

## Development process
- Request and review an implementation plan before coding.
- Follow the approved WP-04A design.
- Do not introduce unapproved workflow decisions.
- Make changes in small, testable increments.
- Preserve evidence of important tests and limitations.

## Mandatory security and authority boundaries
1. Verification is mandatory before assessment or AI processing.
2. Only an authorized human CSR may attest that approved
   identity-verification steps were completed in the simulation.
3. AI may summarize, classify, identify uncertainty, and draft
   recommendations. AI must not verify identity, approve requests,
   execute account changes, or close cases.
4. Requests beyond CSR authority require supervisor or specialist
   review. No approval or account change is implied by escalation.
5. Unavailable evidence, uncertain AI output, or system failures
   must not bypass verification or approval gates.
6. Only an authorized human may confirm simulated case closure.

## Data and audit requirements
- Use fictional customers, cases, and transaction data.
- Never use actual customer records, account credentials, or secrets.
- Log synthetic case IDs, verification attestation, blocked actions,
  AI outputs, uncertainty, human decisions, and case transitions.
- Do not log verification secrets.
- Clearly distinguish recommendations, approvals, and simulated actions.

## Prototype constraints
- Do not connect to real banking or payment systems.
- Do not introduce paid services without Product Owner approval.
- Label mocked AI output as simulated.
- Favor simple, reproducible implementation choices.

## Initial Codex task
Propose an implementation plan only.
Do not create or modify application code until the Product Owner
reviews and approves the plan.
