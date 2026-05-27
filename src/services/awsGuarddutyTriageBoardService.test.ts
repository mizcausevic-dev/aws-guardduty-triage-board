// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import {
  detectorLane,
  findingRisks,
  payload,
  responsePosture,
  summary,
  verification
} from "./awsGuarddutyTriageBoardService.js";

describe("awsGuarddutyTriageBoardService", () => {
  test("summary reflects the sample GuardDuty posture", () => {
    expect(summary()).toMatchObject({
      detectors: 2,
      activeDetectors: 1,
      findings: 5,
      highSeverityFindings: 3
    });
    expect(summary().malwareSignals).toBeGreaterThanOrEqual(1);
  });

  test("detector lane stays mapped to owners", () => {
    const lanes = detectorLane();
    expect(lanes).toHaveLength(4);
    expect(lanes.some((lane) => lane.lane === "Detector coverage lane" && lane.owner === "Cloud Security Engineering")).toBe(true);
  });

  test("finding risks sort high severity first", () => {
    const risks = findingRisks();
    expect(risks[0]?.severity).toBe("high");
    expect(risks.some((risk) => risk.code === "credential-exfiltration")).toBe(true);
  });

  test("response posture and verification stay populated", () => {
    expect(responsePosture()).toHaveLength(4);
    expect(verification()).toHaveLength(5);
    expect(payload().sample).toBeDefined();
  });
});
