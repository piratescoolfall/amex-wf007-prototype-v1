# Week 10 handoff publication

Published to week10-product-v1-candidate only under explicit Product Owner authorization. Immutable validated application candidate: **e16b9967aaa2bf2ab6f595a76c3ac07b21638041**, npm **0.1.0**. Later documentation publication is a different Git commit adding docs/week10 only; no application, tests, dependencies, Week 8 artifacts or main changes.

## Three distinct identities

1. Application source: e16b9967aaa2bf2ab6f595a76c3ac07b21638041.
2. Validated ZIP: AMEX-WF007-Week10-Demo2-Candidate-e16b9967.zip, SHA-256 **d07ae6dbe333cbd7d1662339f24100a33307097fcd0d32a3ffed1262402f69e0**. ZIP was assembled and validated before publication, remains unchanged and is not committed to GitHub.
3. Documentation publication: commit adding this file, reported after push verification. Use git log -1 --format=%H -- docs/week10/PUBLICATION.md, or GitHub file history. No self-referential SHA embedded.

Preserved ZIP/report/manifest statements that no packaging Git commit existed describe the assembly-time snapshot, not subsequent publication. The source SHA must not be replaced with the publication SHA. No freeze, release or submission approval implied.

## Review entry points

- [Week 10 README](README.md): package-root README copy; paths there resolve from ZIP root. Root repository README remains Week 8.
- [PCFG](PCFG.md), [engineering reconciliation](ENGINEERING-RECONCILIATION.md), [D2CHK](D2CHK.md), [PKG6](PKG6-INDEX.md), [recording script](DEMO-2.md).
- [Final report](FINAL-PACKAGE-VALIDATION-REPORT.md), [results](FINAL-VALIDATION-RESULTS.json), [manifest](FINAL-PACKAGE-MANIFEST.json), [checksum](AMEX-WF007-Week10-Demo2-Candidate-e16b9967.zip.sha256).
- [Final extraction checks](final-validation/checks.json), [browser checks](final-validation/browser-checks.json), [payload integrity](final-validation/payload-hashes-after-all-checks.json).
- [Preparation evidence](package-validation/VALIDATION-SUMMARY.md), including initial failures and successful retries.
- [Original hardening evidence](../test-artifacts/week10-hardening/README.md), unchanged.

Copied results/manifests remain byte-identical to local downloadable counterparts. Local .gitattributes disables evidence line-ending conversion. Validated ZIP, report and checksum remain downloadable locally; publication includes report/checksum/evidence but not ZIP.

## Remaining limitations

High-severity development-only zod advisory disclosed; runtime-only audit zero findings; lockfile unchanged. Original VIS-07/08/09 exports/workbook references missing, provisional text labeled. Roles/verification/AI/account actions simulated; audit in memory, not tamper-resistant. No video/Canvas submission, peer review, workbook update, formal Week 11 V&V, production certification, freeze, merge or release.
