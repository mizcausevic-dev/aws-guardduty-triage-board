// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { detectorLanePackets, responsePackets, sampleGuarddutyPayload } from "../data/sampleGuardduty.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleGuarddutyPayload, {
  now: NOW,
  staleFindingAfterHours: 36
});

function severityRank(finding: Finding): number {
  return finding.severity === "high"
    ? 0
    : finding.severity === "medium"
      ? 1
      : finding.severity === "low"
        ? 2
        : 3;
}

export function summary() {
  return {
    detectors: report.detectors,
    activeDetectors: report.activeDetectors,
    findings: report.findings,
    highSeverityFindings: report.highSeverityFindings,
    malwareSignals: report.malwareSignals,
    staleFindings: report.staleFindings,
    recommendation:
      "Restore detector coverage, contain the exfiltrated role, isolate compromised workloads, and validate the finance-bucket read path before calling GuardDuty posture healthy."
  };
}

export function detectorLane() {
  return detectorLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "detector-coverage-lane") {
        return (
          finding.code === "detector-disabled" ||
          finding.code === "eks-protection-missing" ||
          finding.code === "s3-protection-missing" ||
          finding.code === "no-active-detector"
        );
      }
      if (lane.id === "credential-abuse-lane") {
        return finding.code === "credential-exfiltration" || finding.code === "anomalous-api-call";
      }
      if (lane.id === "runtime-compromise-lane") {
        return finding.code === "crypto-mining-runtime" || finding.code === "stale-active-finding";
      }
      if (lane.id === "data-exfiltration-lane") {
        return finding.code === "data-exfiltration-s3";
      }
      return false;
    }).length
  }));
}

export function findingRisks() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "credential-exfiltration" || finding.code === "anomalous-api-call"
          ? "Identity Operations"
          : finding.code === "data-exfiltration-s3"
            ? "Data Security"
            : finding.code === "crypto-mining-runtime"
              ? "Platform SRE"
              : "Cloud Security Engineering")
    }));
}

export function responsePosture() {
  return responsePackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline triage analyzer and CLI, not static copy alone.",
    "Detector records and GuardDuty findings are synthetic sample data only; no live AWS credentials, account secrets, or production telemetry are published.",
    "The control plane keeps detector coverage, credential abuse, runtime compromise, and exfiltration posture visible for AWS security stakeholders.",
    "This surface demonstrates AWS GuardDuty triage operations, not a generic cloud keyword page.",
    "It complements Azure, Entra, Intune, AWS IAM, and GCP proof with a concrete managed-threat-detection lane."
  ];
}

export function payload() {
  return {
    summary: summary(),
    detectorLane: detectorLane(),
    findingRisks: findingRisks(),
    responsePosture: responsePosture(),
    verification: verification(),
    sample: sampleGuarddutyPayload
  };
}
