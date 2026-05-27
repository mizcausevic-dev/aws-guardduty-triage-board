# Security Policy

`aws-guardduty-triage-board` ships both an offline analyzer and a synthetic public dashboard surface. It reads JSON exports from AWS GuardDuty detector and finding summaries (or synthetic data) and emits structured findings, route JSON, and prerendered HTML. No live AWS credential storage, no remote fetch of cloud data, and no execution of user-supplied code is included.

## Supported Versions

The latest release on `main` is supported for security fixes and dependency refreshes.

## Reporting a Vulnerability

Please report vulnerabilities privately through GitHub Security Advisories:

- [Open a security advisory](https://github.com/mizcausevic-dev/aws-guardduty-triage-board/security/advisories/new)

Include:

- affected route or package surface
- sample payload or steps to reproduce
- whether the issue affects the analyzer, CLI, or prerendered dashboard
- expected impact (data disclosure, XSS, SSRF, prototype pollution, supply chain, etc.)

## Scope Notes

- Sample data in this repo is synthetic.
- The public dashboard is a static proof surface, not a live bridge into a production AWS account.
- If future versions ever ingest customer-owned exports or privileged security telemetry, threat posture should be re-reviewed before enabling that path publicly.
