# Changelog

## v1.0.0-prod — 2026-05-27

Production-readiness hardening on top of v0.1-shipped.

- Verified all CI gates pass on a clean `npm ci`: lint, typecheck, coverage (94.19% statements / 80.83% branches / 95.45% functions / 94.19% lines), build, demo, smoke, `npm audit --audit-level=high` (0 vulnerabilities at high/critical).
- Confirmed AGPL-3.0-or-later licensing, `SECURITY.md`, `CODE_OF_CONDUCT.md`, weekly `dependabot.yml` for `npm` + `github-actions`.
- Confirmed CI workflow runs the Node 20 + 22 matrix and the production-status surfaces (CI / License / Deploy badges + `## Production status` block) are intact in the README.
- Live operator surface running at https://guardduty.kineticgain.com/ via the GitHub Pages deploy rail with HTTPS enforcement enabled.
- No changes to source, README content, docs, or screenshots — those remain the v0.1-shipped surface from the build lane.

## v0.1.0 — 2026-05-30

- Initial release: operator surface for AWS GuardDuty detector and threat-finding triage.
- Added a public dashboard surface with overview, detector-lane, finding-risks, response-posture, verification, and docs routes.
- Added prerendered GitHub Pages packaging for `guardduty.kineticgain.com` with `CNAME`, `robots.txt`, `sitemap.xml`, and OG/meta injection at deploy time.
- Added synthetic README proof screenshots and `docs/KINETIC_GAIN_EMBEDDED.md` tie-back packaging.
- Reads a combined JSON envelope `{ detectors, findings }` — each section is optional.
- 10 finding codes covering missing active detectors, disabled detectors, missing EKS/S3 coverage, credential exfiltration, crypto-mining/runtime compromise, anomalous API behavior, S3 exfiltration, stale active findings, and unassigned high findings.
- Library API: `analyze(input, opts)` -> `TriageReport`; `toMarkdown(report)` + `toSummary(report)` formatters.
- CLI: `aws-guardduty-triage <export.json>` with `--format json|markdown|summary`, `--now <iso>`, `--stale-finding-after-hours N`, `--fail-on-high`, `--out FILE`.
- Multi-cloud security and cost lane (Wave 12) — extends the AWS track from IAM/perimeter proof into managed threat-detection and incident triage.
- Node 20/22 CI (lint, typecheck, coverage, build, demo, smoke, prerender, `npm audit`), AGPL-3.0-or-later, Dependabot.
