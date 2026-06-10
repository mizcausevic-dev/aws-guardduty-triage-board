// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import {
  renderDetectorLane,
  renderDocs,
  renderFindingRisks,
  renderOverview,
  renderResponsePosture,
  renderSample,
  renderVerification,
  severityClass
} from "./render.js";

describe("render", () => {
  test("overview includes GuardDuty framing", () => {
    const html = renderOverview();
    expect(html).toContain("AWS GuardDuty Triage Board");
    expect(html).toContain("detector coverage");
    expect(html).toContain("Product depth");
    expect(html).toContain("What these repos have in common");
    expect(html).toContain("portfolio.kineticgain.com");
    expect(html).toContain("GTM story");
  });

  test("docs and finding routes use the new route names", () => {
    expect(renderDocs()).toContain("/detector-lane");
    expect(renderDocs()).toContain("aws-guardduty-triage");
    expect(renderFindingRisks()).toContain("Finding Risks");
  });

  test("all public routes render their route-specific sections", () => {
    expect(renderDetectorLane()).toContain("Detector Lane");
    expect(renderResponsePosture()).toContain("Response Posture");
    expect(renderVerification()).toContain("Verification");
    expect(renderSample()).toContain("detectors");
  });

  test("severity classes cover the expected display states", () => {
    expect(severityClass("high")).toBe("red");
    expect(severityClass("medium")).toBe("yellow");
    expect(severityClass("low")).toBe("green");
    expect(severityClass("unknown")).toBe("info");
  });
});
