// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import { renderDocs, renderFindingRisks, renderOverview } from "./render.js";

describe("render", () => {
  test("overview includes GuardDuty framing", () => {
    expect(renderOverview()).toContain("AWS GuardDuty Triage Board");
    expect(renderOverview()).toContain("detector coverage");
  });

  test("docs and finding routes use the new route names", () => {
    expect(renderDocs()).toContain("/detector-lane");
    expect(renderDocs()).toContain("aws-guardduty-triage");
    expect(renderFindingRisks()).toContain("Finding Risks");
  });
});
