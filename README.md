# aws-guardduty-triage-board

[![CI](https://github.com/mizcausevic-dev/aws-guardduty-triage-board/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/aws-guardduty-triage-board/actions/workflows/ci.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](./LICENSE)
[![Deploy](https://github.com/mizcausevic-dev/aws-guardduty-triage-board/actions/workflows/pages.yml/badge.svg)](https://github.com/mizcausevic-dev/aws-guardduty-triage-board/actions/workflows/pages.yml)

Operator control plane for AWS GuardDuty detectors, threat findings, credential abuse, runtime compromise, exfiltration signals, and response sequencing.

## Why this exists

- GuardDuty exports become dangerous when they stay trapped in raw JSON instead of one operator-readable surface.
- Detector coverage, credential abuse, runtime compromise, and exfiltration posture need to stay visible together before incidents, audits, or release windows drift.
- Recruiters looking for `AWS / GuardDuty / incident response / cloud security` proof should see a real threat-operations dashboard, not a keyword page.
- This repo turns GuardDuty data into a control plane for detector gaps, high-severity findings, stale triage, and response packet sequencing.

## Why this matters (KG Embedded tie-back)

This repo demonstrates the AWS managed-threat-detection control-plane primitive for cloud operations: detector health, compromise findings, exfiltration posture, and remediation packets in one operator surface. Kinetic Gain Embedded extends this pattern into productized in-app dashboards where platform, SOC, and security teams need evidence-rich surfaces without exposing raw admin backends or cloud credentials. See [kineticgain.com/embedded](https://kineticgain.com/embedded).

## What it shows

- `detector-lane` visibility for active and disabled detectors, data-source coverage, and response ownership in one dashboard
- `finding-risks` detection for credential exfiltration, crypto-mining/runtime compromise, anomalous API behavior, and S3 exfiltration posture
- response packets for detector restoration, credential containment, workload isolation, and finance-bucket containment
- offline-safe analysis of captured AWS GuardDuty exports
- recruiter-facing AWS threat-detection / incident-response proof that complements the Microsoft, GCP, and broader cloud-admin lanes

## Product depth

AWS GuardDuty Triage Board is a leadership-readable threat-operations surface for AWS estates. It helps platform, SOC, compliance, and cloud-finance leaders understand which detectors are healthy, which findings are material, which owners need to act, and what response packet should move before risk becomes board-visible.

- **Buyer value:** reduces alert sprawl by turning GuardDuty exports into a clear containment queue for credential abuse, runtime compromise, exfiltration risk, and detector coverage gaps.
- **Technical proof:** normalizes synthetic GuardDuty detector and finding exports into detector lanes, finding-risk rows, response posture cards, verification packets, CLI output, and prerendered routes.
- **GTM story:** positions AWS threat detection as an operator-grade control plane that complements IAM Access Analyzer, GCP IAM drift, Microsoft Entra governance, and broader cloud-security readiness.

## What these repos have in common

Every Kinetic Gain operator surface follows the same pattern: convert fragmented admin exports into leadership-readable decisions without exposing live cloud credentials or tenant data.

- **Risk signal:** disabled detectors, stale findings, credential abuse, runtime compromise, and exfiltration posture are modeled explicitly.
- **Owner context:** every lane ties the finding to a cloud, SOC, platform, or response owner.
- **Evidence packet:** summary APIs, sample JSON, screenshots, docs, and CLI output make the proof reusable for audits, demos, and diligence.
- **Next action:** each route names the corrective move so the page is operational, not just descriptive.

## Operating workflow

1. Load normalized GuardDuty detector and finding exports or use the included synthetic fixture.
2. Score detector coverage, high-severity findings, stale finding pressure, malware/runtime signals, and exfiltration posture.
3. Route the highest-risk findings into response packets with owner, blocker, readiness score, and next checkpoint.
4. Publish the static proof surface for review by platform, SOC, compliance, and buyer-facing teams.

## Routes

- `/`
- `/detector-lane`
- `/finding-risks`
- `/response-posture`
- `/verification`
- `/docs`

## API

- `/api/dashboard/summary`
- `/api/detector-lane`
- `/api/finding-risks`
- `/api/response-posture`
- `/api/verification`
- `/api/sample`

## Screenshots

![Overview](./screenshots/01-overview-proof.png)
![Detector lane](./screenshots/02-detector-lane-proof.png)
![Finding risks](./screenshots/03-finding-risks-proof.png)
![Response posture](./screenshots/04-response-posture-proof.png)

## CLI

```powershell
npx aws-guardduty-triage fixtures/guardduty.json `
    --format json|markdown|summary `
    --now 2026-05-30T00:00:00Z `
    --stale-finding-after-hours 48 `
    --fail-on-high `
    --out report.md
```

Input shape:

```json
{
  "detectors": [ ... ],
  "findings": [ ... ]
}
```

## Local Development

```powershell
cd aws-guardduty-triage-board
npm install
npm run dev
```

Open:
- [http://127.0.0.1:5520/](http://127.0.0.1:5520/)
- [http://127.0.0.1:5520/detector-lane](http://127.0.0.1:5520/detector-lane)
- [http://127.0.0.1:5520/finding-risks](http://127.0.0.1:5520/finding-risks)
- [http://127.0.0.1:5520/response-posture](http://127.0.0.1:5520/response-posture)
- [http://127.0.0.1:5520/verification](http://127.0.0.1:5520/verification)

## Validation

- `npm run lint`
- `npm run typecheck`
- `npm run coverage`
- `npm run build`
- `npm run demo`
- `npm run smoke`
- `npm run prerender`
- `npm run render:assets`

## Production status

| Aspect | Status |
|--------|--------|
| CI | Node 20 + 22 matrix — lint · typecheck · coverage · build · demo · smoke · prerender · `npm audit` |
| License | [AGPL-3.0-or-later](./LICENSE) |
| Deploy | Static prerender -> **https://guardduty.kineticgain.com/** |
| Data posture | Synthetic sample data only; no live AWS credentials, account tokens, or production GuardDuty exports |
| Suite | Part of the [Kinetic Gain Protocol Suite](https://suite.kineticgain.com/) operator portfolio · apex: [kineticgain.com](https://kineticgain.com) |

## Docs

- [Kinetic Gain Embedded tie-back](./docs/KINETIC_GAIN_EMBEDDED.md)
- [Changelog](./CHANGELOG.md)

## Composes with

- [**`entra-access-review-control-plane`**](https://github.com/mizcausevic-dev/entra-access-review-control-plane) — Microsoft Entra access reviews
- [**`aws-iam-access-analyzer-console`**](https://github.com/mizcausevic-dev/aws-iam-access-analyzer-console) — AWS IAM analyzer posture
- [**`gcp-iam-policy-diff-lab`**](https://github.com/mizcausevic-dev/gcp-iam-policy-diff-lab) — GCP IAM drift and guardrail posture

Together they form a broader recruiter-facing cloud admin lane: Microsoft tenant governance plus AWS identity, threat-detection, and GCP admin proof.
