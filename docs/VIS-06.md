# VIS-06 — AI Interaction Sequence

All interactions below are classroom simulations with synthetic data and simulated CSR/Supervisor roles. AI is deterministic and labeled **Simulated AI**. These classroom controls are not actual American Express policies. No WP-04A requirement IDs are assigned.

```mermaid
sequenceDiagram
    actor CSR as Human CSR (simulated role)
    participant UI as Prototype interface
    participant Gate as Workflow gates
    participant AI as Deterministic simulated AI
    actor Supervisor as Human Supervisor (simulated role)
    participant Mock as Mock reversal
    participant Audit as Synthetic audit log

    CSR->>UI: Open synthetic case
    CSR->>UI: Attempt assessment or AI processing
    UI->>Gate: Check CSR role and verification attestation
    alt Verification missing or CSR unauthorized
        Gate-->>UI: Block assessment and AI processing
        UI->>Audit: Record blocked action and synthetic case ID
        UI-->>CSR: Case remains open. authorized CSR attestation required
    else Authorized CSR verification attested
        UI->>Audit: Record human attestation without verification secrets
        CSR->>UI: Request AI assistance
        UI->>Gate: Recheck verification and CSR role
        Gate-->>UI: Permit simulated AI processing
        UI->>AI: Provide synthetic verified case context
        alt Usable output
            AI-->>UI: Summary, classification, uncertainty, draft recommendation
            UI->>Audit: Record simulated AI output and uncertainty
            alt Usable but uncertain
                UI-->>CSR: Show Simulated AI output with uncertainty warning
            else No uncertainty flagged
                UI-->>CSR: Show Simulated AI output. recommendation only
            end
            CSR->>UI: Review output and evidence
        else Failed or unusable output
            AI-->>UI: Failure or unusable result
            UI->>Audit: Record failure or unusable result
            UI-->>CSR: Use manual fallback. gates remain in force
            CSR->>UI: Perform manual assessment
        end

        CSR->>UI: Request fictional $500 reversal
        UI->>Gate: Check Supervisor authorization
        alt Supervisor authorization missing
            Gate-->>UI: Block reversal
            UI->>Audit: Record blocked action. keep case open
            UI-->>CSR: Supervisor assistance is needed for this action. No approval or account change has been performed.
            CSR->>UI: Escalate for Supervisor review
            UI-->>Supervisor: Present synthetic case and human-reviewed assessment
            Supervisor->>UI: Record human decision
            UI->>Audit: Record Supervisor decision. escalation is not approval
        else Supervisor authorization present
            Gate-->>UI: Approval recorded. no reversal executed
        end

        alt Request rejected or withdrawn
            UI->>Audit: Record rejection or withdrawal. case stays open for review
            UI-->>CSR: Case open for review. no reversal or automatic closure
        else Supervisor approved request
            UI-->>CSR: Approval recorded. separate CSR action required
            CSR->>UI: Explicitly trigger mock reversal
            UI->>Gate: Recheck CSR role, verification, and Supervisor approval
            alt Any gate fails
                Gate-->>UI: Block action. keep case open
                UI->>Audit: Record blocked attempt and reason
                UI-->>CSR: If authorization missing, display exact Supervisor message above
            else Gates pass
                UI->>Mock: Perform fictional $500 reversal
                Mock-->>UI: Simulated action result
                UI->>Audit: Record mock action result
                alt Mock reversal fails
                    UI-->>CSR: Case remains open for review
                else Mock reversal succeeds
                    UI-->>CSR: Simulated action complete. case still open
                    CSR->>UI: Explicitly confirm simulated closure
                    UI->>Gate: Check authorized CSR and closure eligibility
                    alt Closure permitted
                        UI->>Audit: Record human closure decision and transition to closed
                        UI-->>CSR: Simulated case closed
                    else Closure blocked
                        UI->>Audit: Record blocked closure. case stays open
                    end
                end
            end
        else No approval decision yet
            UI-->>CSR: Case remains open. no reversal or closure
        end
    end
    CSR->>UI: Export JSON audit
    UI->>Audit: Read synthetic events
    Audit-->>UI: Events without verification secrets
    UI-->>CSR: JSON audit export. case state unchanged
```

The sequence shows one successful attestation path and its failure branches. An authorized human CSR supplies the verification attestation; AI never performs verification. Every assessment or AI entry point must enforce that prerequisite. The manual assessment route is also available without invoking AI, after verification.

Supervisor approval, CSR-triggered mock reversal, and CSR-confirmed closure are separate events. The absence of a CSR action or closure confirmation leaves the case open. Rejected, withdrawn, and failed-action cases remain open for review. No real banking or payment system is contacted.
