import type {
  Finding,
  FindingStatus,
  GuardDutyDetector,
  GuardDutyExport,
  GuardDutyFinding,
  TriageOptions,
  TriageReport
} from "./types.js";

const HOUR_MS = 3_600_000;

function emptyStatusCounts(): Record<FindingStatus, number> {
  return {
    ACTIVE: 0,
    ARCHIVED: 0
  };
}

function lastUpdatedAt(finding: GuardDutyFinding): Date {
  return new Date(finding.updatedAt ?? finding.createdAt);
}

function detectorHasSource(detector: GuardDutyDetector, source: string): boolean {
  return detector.dataSources.includes(source);
}

export function analyze(input: GuardDutyExport, opts: TriageOptions = {}): TriageReport {
  const now = opts.now ? new Date(opts.now) : new Date();
  const staleAfter = (opts.staleFindingAfterHours ?? 48) * HOUR_MS;

  const detectors = input.detectors ?? [];
  const findings = input.findings ?? [];
  const findingsList: Finding[] = [];
  const findingsByStatus = emptyStatusCounts();

  const activeDetectors = detectors.filter((detector) => detector.status === "ACTIVE");
  const highSeverityFindings = findings.filter((finding) => finding.status === "ACTIVE" && finding.severity === "high");
  const malwareSignals = findings.filter(
    (finding) =>
      finding.status === "ACTIVE" &&
      (finding.type.includes("CryptoCurrency") || finding.type.includes("Malware"))
  );

  if (activeDetectors.length === 0) {
    findingsList.push({
      code: "no-active-detector",
      severity: "high",
      message: "No active GuardDuty detector is enabled for the captured AWS scope.",
      subject: "detectors"
    });
  }

  for (const detector of detectors) {
    if (detector.status === "DISABLED") {
      findingsList.push({
        code: "detector-disabled",
        severity: "medium",
        message: `GuardDuty detector in ${detector.region} is disabled and will not surface new compromise or exfiltration signals.`,
        subject: detector.id,
        subjectName: detector.accountId,
        region: detector.region
      });
    }

    if (detector.status === "ACTIVE" && !detectorHasSource(detector, "KUBERNETES_AUDIT_LOGS")) {
      findingsList.push({
        code: "eks-protection-missing",
        severity: "medium",
        message: `GuardDuty detector in ${detector.region} is missing Kubernetes audit coverage for EKS triage.`,
        subject: detector.id,
        subjectName: detector.accountId,
        region: detector.region
      });
    }

    if (detector.status === "ACTIVE" && !detectorHasSource(detector, "S3_DATA_EVENTS")) {
      findingsList.push({
        code: "s3-protection-missing",
        severity: "medium",
        message: `GuardDuty detector in ${detector.region} is missing S3 data-event protection for exfiltration visibility.`,
        subject: detector.id,
        subjectName: detector.accountId,
        region: detector.region
      });
    }
  }

  for (const finding of findings) {
    findingsByStatus[finding.status] += 1;

    if (finding.status !== "ACTIVE") {
      continue;
    }

    if (finding.type.includes("InstanceCredentialExfiltration")) {
      findingsList.push({
        code: "credential-exfiltration",
        severity: "high",
        message: `Instance or IAM credentials tied to "${finding.resource}" show exfiltration posture and need immediate containment.`,
        subject: finding.id,
        subjectName: finding.resource,
        region: finding.region,
        principal: finding.principal,
        owner: finding.owner
      });
    }

    if (finding.type.includes("CryptoCurrency") || finding.type.includes("Malware")) {
      findingsList.push({
        code: "crypto-mining-runtime",
        severity: finding.severity,
        message: `Runtime compromise signal on "${finding.resource}" suggests crypto-mining or malware behavior that should be isolated fast.`,
        subject: finding.id,
        subjectName: finding.resource,
        region: finding.region,
        owner: finding.owner
      });
    }

    if (finding.type.includes("AnomalousBehavior") || finding.type.includes("UnauthorizedAccess")) {
      findingsList.push({
        code: "anomalous-api-call",
        severity: finding.severity,
        message: `Anomalous API behavior on "${finding.resource}" should be triaged before trust or blast radius expands.`,
        subject: finding.id,
        subjectName: finding.resource,
        region: finding.region,
        principal: finding.principal,
        owner: finding.owner
      });
    }

    if (finding.type.includes("Exfiltration:S3") || (finding.resourceType === "S3Bucket" && finding.severity === "high")) {
      findingsList.push({
        code: "data-exfiltration-s3",
        severity: "high",
        message: `S3 exfiltration signal is active on "${finding.resource}" and should be contained before more data leaves the perimeter.`,
        subject: finding.id,
        subjectName: finding.resource,
        region: finding.region,
        owner: finding.owner
      });
    }

    if (!finding.owner && finding.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "medium",
        message: `High-severity finding "${finding.title}" still has no assigned owner.`,
        subject: finding.id,
        subjectName: finding.resource,
        region: finding.region
      });
    }

    if (now.getTime() - lastUpdatedAt(finding).getTime() > staleAfter) {
      findingsList.push({
        code: "stale-active-finding",
        severity: "medium",
        message: `Finding "${finding.title}" has remained active since ${lastUpdatedAt(finding).toISOString().slice(0, 16)}Z.`,
        subject: finding.id,
        subjectName: finding.resource,
        region: finding.region,
        owner: finding.owner
      });
    }
  }

  const staleFindings = findings.filter(
    (finding) => finding.status === "ACTIVE" && now.getTime() - lastUpdatedAt(finding).getTime() > staleAfter
  ).length;

  return {
    generatedAt: now.toISOString(),
    detectors: detectors.length,
    activeDetectors: activeDetectors.length,
    findings: findings.length,
    findingsByStatus,
    highSeverityFindings: highSeverityFindings.length,
    malwareSignals: malwareSignals.length,
    staleFindings,
    findingsList,
    ok: !findingsList.some((finding) => finding.severity === "high")
  };
}
