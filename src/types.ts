// Operator surface for AWS GuardDuty detectors, finding triage, and response posture.
//
// Inputs reflect exported or captured GuardDuty payloads:
//   - account/region detector coverage
//   - finding summaries for credential abuse, runtime compromise, exfiltration, and malware signals

export type DetectorStatus = "ACTIVE" | "DISABLED";
export type FindingStatus = "ACTIVE" | "ARCHIVED";
export type FindingSeverity = "high" | "medium" | "low" | "info";
export type ResourceType = "EC2" | "IAMUser" | "EKSCluster" | "S3Bucket" | "Lambda" | string;
export type DataSource =
  | "S3_DATA_EVENTS"
  | "KUBERNETES_AUDIT_LOGS"
  | "MALWARE_PROTECTION"
  | "RDS_LOGIN_EVENTS"
  | string;

export interface GuardDutyDetector {
  id: string;
  accountId: string;
  region: string;
  status: DetectorStatus;
  dataSources: DataSource[];
  publishingDestination: boolean;
}

export interface GuardDutyFinding {
  id: string;
  type: string;
  title: string;
  region: string;
  severity: FindingSeverity;
  status: FindingStatus;
  resourceType: ResourceType;
  resource: string;
  principal?: string;
  service?: string;
  createdAt: string;
  updatedAt?: string;
  owner?: string;
  note?: string;
}

export interface GuardDutyExport {
  detectors?: GuardDutyDetector[];
  findings?: GuardDutyFinding[];
}

export type FindingCode =
  | "no-active-detector"
  | "detector-disabled"
  | "eks-protection-missing"
  | "s3-protection-missing"
  | "credential-exfiltration"
  | "crypto-mining-runtime"
  | "anomalous-api-call"
  | "data-exfiltration-s3"
  | "stale-active-finding"
  | "high-severity-unassigned";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  region?: string;
  principal?: string;
  owner?: string;
}

export interface TriageReport {
  generatedAt: string;
  detectors: number;
  activeDetectors: number;
  findings: number;
  findingsByStatus: Record<FindingStatus, number>;
  highSeverityFindings: number;
  malwareSignals: number;
  staleFindings: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface TriageOptions {
  now?: string;
  staleFindingAfterHours?: number;
}
