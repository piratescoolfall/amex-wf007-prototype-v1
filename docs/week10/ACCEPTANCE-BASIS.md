# Product Owner-supplied acceptance basis

Verbatim supplied attachment, not independently accessed Canvas/workbook. Later explicit authorization permits packaging/validation; final review/freeze/submission remain pending.

# WF-007 — Week 10 Demo 2, D2CHK, and PKG6 Requirements

I am providing the actual Week 10 Canvas assignment criteria. Use these requirements as the acceptance basis for the remaining handoff work.

**Project:** AMEX WF-007 Customer Service Operations Dashboard

**Candidate branch:** `week10-product-v1-candidate`

**Current candidate commit:** `e16b9967aaa2bf2ab6f595a76c3ac07b21638041`

**Week 9 gate:** Approved by the Product Owner.

**Current status:** Approved coding corrections are complete. Reported validation passed: 150 unit tests, 25 browser scenarios, lint, foundation checks, and build. Verify the supporting evidence rather than assuming these results.

The Week 8 baseline must remain unchanged. Do not merge into `main`.

## 1. Demo 2 — Required Demonstration

Create a reproducible Product V1.0 candidate suitable for a professional 2–3 minute recorded demonstration.

The demonstration must show:

1. The intended user and actual operating workflow.
2. Human authority and the boundary between CSR and Supervisor decisions.
3. At least one implemented safeguard, including mandatory verification.
4. Observable audit or operational evidence.
5. A realistic failure, exception, or manual fallback.
6. AI assistance and uncertainty boundaries, where applicable.
7. At least one unresolved limitation.
8. What formal Week 11 verification and validation must still establish.

The application must demonstrate actual behavior, not screenshots presented as functioning software.

Do not claim production release approval, enterprise security certification, completed formal V&V, or capabilities that remain simulated.

## 2. WP-06A — Production Engineering Requirements

Reconcile the candidate against these sections:

- **6A.1 ENGAUTH:** Document the Product Owner's authorization and Week 9 readiness-gate status, including any applicable conditions.
- **6A.2 COMP:** Document the actual candidate architecture and reconcile it with VIS-07.
- **6A.3 UX:** Document the implemented user flow and reconcile it with VIS-08.
- **6A.4 FLOW:** Document information and knowledge flow and reconcile it with VIS-09 where applicable.
- **6A.5 IAMIMPL:** Describe implemented access restrictions, role boundaries, and human decision authority. Clearly distinguish simulated role selection from real authentication and server-side authorization.
- **6A.6 AIINT:** Describe the approved, bounded simulated AI implementation, uncertainty handling, human review, and manual fallback. Do not claim a live GenAI integration.
- **6A.7:** Reconcile all diagrams and design descriptions with actual implemented behavior. Label proposed production components as future-state rather than implemented.

## 3. WP-06B — Engineering Evidence Requirements

Address the following:

- **6B.1 CTRLIMPL:** Identify implemented safeguards, workflow guards, verification controls, and human authority boundaries. Link each to code and tests.
- **6B.2 RDEPIMPL:** Document dependencies, AI failure/unavailability, manual fallback, exceptions, and recovery limitations.
- **6B.3 OBS:** Identify audit events, timestamps, routing metadata, JSON export, and observability limitations. The in-memory audit is not durable or tamper-resistant.
- **6B.4 PCFG:** Identify the exact candidate SHA, version, date, dependencies, runtime configuration, and reproduction commands.
- **6B.5 BDEC:** Record material engineering decisions, including the two approved guard corrections and the decision to preserve the existing application.
- **6B.6 D2CHK:** Produce an honest engineering pre-check showing each relevant requirement, implementation, test evidence, status, and remaining limitation.
- **6B.7 PKG6:** Produce a coherent, reproducible engineering evidence package for the exact candidate.

D2CHK is an engineering pre-check, not formal Week 11 verification and validation.

Do not invent approvals, test results, compliance status, or implementation evidence.

## 4. Required Private Canvas ZIP Submission

The private Canvas assignment is worth 85 points, including 70 points for the candidate package and 15 points for the recorded demonstration.

Submit one ZIP containing:

- Actual React/Vite application source and required configuration.
- Exact version, date, branch, and GitHub commit SHA.
- README with purpose, prerequisites, dependencies, installation and launch commands, reviewer scenario, and known limitations.
- Safe synthetic sample data.
- Applicable engineering evidence or references to the authoritative workbook.
- Relevant VIS-07, VIS-08, and VIS-09 visuals, clearly distinguishing implemented architecture from future-state design.
- Implemented control and human-authority evidence.
- Resilience, exception, manual-fallback, and audit evidence.
- D2CHK pre-check findings.
- PKG6 evidence index or manifest.
- Test results and instructions to reproduce the demonstrated workflow.
- Reference to the Demo 2 recording, if available.

The ZIP must contain the real application, not merely screenshots, documentation, or a URL.

For a local application, document the actual launch commands and setup requirements. Do not imply that opening an HTML file directly launches the complete Vite application.

Exclude passwords, tokens, API keys, confidential data, real customer information, `.git`, and unnecessary dependencies.

The ZIP, README, PCFG, D2CHK, PKG6, and recorded demonstration must identify the same candidate.

## 5. Grading Criteria

The 85-point private submission is graded as follows:

- Implemented workflow and approved Product V1 scope: **25 points**.
- Implemented safeguards, human authority, and applicable AI boundaries: **20 points**.
- Resilience, observability, exceptions, and supporting evidence: **15 points**.
- Identifiable/reproducible candidate, traceability, and candid limitations: **10 points**.
- Professional recorded Demo 2 showing actual behavior and evidence: **15 points**.

An additional 15 points are awarded for completing two assigned Vendor Peer Reviews in the Canvas discussion.

The Demo 2 recording must be posted to the discussion board, and the candidate ZIP submitted to the private assignment.

**Deadline:** Friday, October 23, 2026, at 11:59 p.m.

WP-06A, WP-06B, and Portfolio Journey remain in the authoritative shared OneDrive workbook. Do not upload a duplicate workbook to Canvas.

## 6. Current Known Limitations

Disclose the following accurately:

- CSR/Supervisor roles are simulated selections, not enterprise SSO, MFA, or server-enforced RBAC.
- Verification is a human attestation simulation.
- AI is deterministic and local, not a live approved AI service.
- Financial reversals are simulated; no real account changes occur.
- Cases and audit records are held in memory and reset on refresh.
- Audit exports are not durable or tamper-resistant enterprise records.
- Unsupported requests and exceptions are held for human review.
- Production monitoring, concurrency, recovery, security validation, and formal V&V have not been established.

## 7. What I Want You to Do Next

Using the exact candidate commit `e16b9967aaa2bf2ab6f595a76c3ac07b21638041`:

1. Inspect the candidate and its existing test evidence.
2. Map each Demo 2, D2CHK, and PKG6 requirement to actual implementation and supporting evidence.
3. Identify only genuine remaining gaps.
4. Prepare the minimal Week 10 packaging plan, including the exact files and evidence to include.
5. Identify any required Product Owner decisions or unavailable evidence.

Do not change application business logic or introduce new features.

Do not claim that the candidate is frozen, formally verified, or released.

**Stop after presenting the evidence mapping and packaging plan. Wait for my approval before creating the final ZIP or freezing Product V1.0.**