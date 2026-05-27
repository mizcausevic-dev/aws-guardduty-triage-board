import type { GuardDutyExport } from "../types.js";

export const sampleGuarddutyPayload: GuardDutyExport = {
  detectors: [
    {
      id: "det-prod-use1",
      accountId: "111122223333",
      region: "us-east-1",
      status: "ACTIVE",
      dataSources: ["KUBERNETES_AUDIT_LOGS", "MALWARE_PROTECTION"],
      publishingDestination: true
    },
    {
      id: "det-sec-euw1",
      accountId: "444455556666",
      region: "eu-west-1",
      status: "DISABLED",
      dataSources: ["S3_DATA_EVENTS"],
      publishingDestination: false
    }
  ],
  findings: [
    {
      id: "gd-001",
      type: "UnauthorizedAccess:EC2/InstanceCredentialExfiltration.OutsideAWS",
      title: "EC2 instance credentials used outside AWS",
      region: "us-east-1",
      severity: "high",
      status: "ACTIVE",
      resourceType: "EC2",
      resource: "i-0f014c9e11appapi",
      principal: "arn:aws:iam::111122223333:role/app-prod-ec2",
      service: "EC2",
      createdAt: "2026-05-26T10:10:00Z",
      updatedAt: "2026-05-26T13:42:00Z",
      owner: "Cloud Security Engineering",
      note: "Cut session and rotate role credentials before the next deploy window."
    },
    {
      id: "gd-002",
      type: "CryptoCurrency:EC2/BitcoinTool.B!DNS",
      title: "Crypto-mining signal on media worker",
      region: "us-east-1",
      severity: "medium",
      status: "ACTIVE",
      resourceType: "EC2",
      resource: "i-0a91b2mediaworker",
      service: "EC2",
      createdAt: "2026-05-25T23:15:00Z",
      updatedAt: "2026-05-26T00:40:00Z",
      owner: "Platform SRE",
      note: "Isolate workload and review recent AMI drift."
    },
    {
      id: "gd-003",
      type: "Discovery:Kubernetes/SuccessfulAnonymousAccess",
      title: "Anonymous access succeeded against EKS control plane",
      region: "us-east-1",
      severity: "high",
      status: "ACTIVE",
      resourceType: "EKSCluster",
      resource: "eks/prod-growth-cluster",
      service: "EKS",
      createdAt: "2026-05-24T18:00:00Z",
      updatedAt: "2026-05-24T18:55:00Z",
      owner: "Cluster Security",
      note: "Validate API server exposure and kubeconfig issuance."
    },
    {
      id: "gd-004",
      type: "Exfiltration:S3/ObjectRead.Unusual",
      title: "Unusual object read from finance bucket",
      region: "us-east-1",
      severity: "high",
      status: "ACTIVE",
      resourceType: "S3Bucket",
      resource: "s3://kg-finance-exports-prod",
      service: "S3",
      createdAt: "2026-05-24T09:00:00Z",
      updatedAt: "2026-05-24T09:15:00Z",
      owner: "Data Security",
      note: "Cross-check with expected export job windows and VPC endpoint policy."
    },
    {
      id: "gd-005",
      type: "Recon:IAMUser/AnomalousBehavior",
      title: "IAM user unusual read sequence",
      region: "eu-west-1",
      severity: "medium",
      status: "ARCHIVED",
      resourceType: "IAMUser",
      resource: "iam/miz-temp-audit",
      principal: "arn:aws:iam::444455556666:user/miz-temp-audit",
      service: "IAM",
      createdAt: "2026-05-20T12:00:00Z",
      updatedAt: "2026-05-21T08:00:00Z",
      owner: "Identity Operations",
      note: "Closed after expected audit replay was confirmed."
    }
  ]
};

export const detectorLanePackets = [
  {
    id: "detector-coverage-lane",
    lane: "Detector coverage lane",
    owner: "Cloud Security Engineering",
    focus: "Regional detector health, publishing destinations, and signal coverage.",
    status: "red",
    note: "One detector is disabled and primary S3 data-event coverage is still incomplete.",
    nextAction: "Re-enable eu-west-1 detector and turn on S3 data-event visibility for the production detector."
  },
  {
    id: "credential-abuse-lane",
    lane: "Credential abuse lane",
    owner: "Identity Operations",
    focus: "Stolen role credentials, anomalous API use, and trust validation.",
    status: "red",
    note: "Credential exfiltration and anomalous behavior need the fastest containment path.",
    nextAction: "Rotate compromised role credentials and validate IAM user activity against expected runbooks."
  },
  {
    id: "runtime-compromise-lane",
    lane: "Runtime compromise lane",
    owner: "Platform SRE",
    focus: "Crypto-mining, malware, and workload isolation posture.",
    status: "yellow",
    note: "Compromised runtime signals are present, but an owner and response path already exist.",
    nextAction: "Isolate the media worker and verify AMI, startup scripts, and egress controls."
  },
  {
    id: "data-exfiltration-lane",
    lane: "Data exfiltration lane",
    owner: "Data Security",
    focus: "S3 read anomalies, export movement, and perimeter containment.",
    status: "red",
    note: "Finance export reads and missing S3 detector coverage increase exfiltration risk.",
    nextAction: "Validate S3 object read context and restore data-event signal completeness."
  }
];

export const responsePackets = [
  {
    packetId: "GD-11",
    lane: "Credential containment packet",
    owner: "Identity Operations",
    completenessScore: 62,
    status: "red",
    blocker: "Role credential rotation is not fully scheduled across dependent workloads.",
    launchWindowHours: 6,
    decisionNote: "Do not wait for the next deploy cycle before cutting the exfiltrated role path."
  },
  {
    packetId: "GD-18",
    lane: "Runtime isolation packet",
    owner: "Platform SRE",
    completenessScore: 78,
    status: "yellow",
    blocker: "Forensic snapshot is queued but not yet attached to the compromise incident.",
    launchWindowHours: 10,
    decisionNote: "Instance can be isolated once the forensic capture lands in the incident record."
  },
  {
    packetId: "GD-22",
    lane: "EKS exposure packet",
    owner: "Cluster Security",
    completenessScore: 57,
    status: "red",
    blocker: "Anonymous access control-plane posture still needs network and auth proof.",
    launchWindowHours: 8,
    decisionNote: "Hold platform changes until API server access posture is verified."
  },
  {
    packetId: "GD-31",
    lane: "Finance bucket containment packet",
    owner: "Data Security",
    completenessScore: 71,
    status: "red",
    blocker: "Expected-reader allowlist has not been reconciled against the GuardDuty event yet.",
    launchWindowHours: 4,
    decisionNote: "Investigate the S3 read anomaly before more finance exports move out of the expected path."
  }
];
