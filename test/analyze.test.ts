import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { GuardDutyExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): GuardDutyExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as GuardDutyExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts detectors and findings", () => {
    const report = analyze(fixture("guardduty.json"), { now: NOW });
    expect(report.detectors).toBe(2);
    expect(report.activeDetectors).toBe(1);
    expect(report.findings).toBe(5);
  });

  it("flags missing active detector as high", () => {
    const report = analyze({ detectors: [], findings: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-active-detector")?.severity).toBe("high");
  });

  it("flags disabled detector coverage", () => {
    const report = analyze(fixture("guardduty.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "detector-disabled")?.region).toBe("eu-west-1");
  });

  it("flags missing S3 source coverage", () => {
    const report = analyze(fixture("guardduty.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "s3-protection-missing")).toBeDefined();
  });

  it("flags credential exfiltration", () => {
    const report = analyze(fixture("guardduty.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "credential-exfiltration")?.subjectName).toContain("i-0f014c9e11appapi");
  });

  it("flags crypto-mining runtime compromise", () => {
    const report = analyze(fixture("guardduty.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "crypto-mining-runtime")).toBeDefined();
  });

  it("flags anomalous API behavior and S3 exfiltration", () => {
    const report = analyze(fixture("guardduty.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "anomalous-api-call")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "data-exfiltration-s3")).toBeDefined();
  });

  it("flags stale active findings", () => {
    const report = analyze(fixture("guardduty.json"), { now: NOW, staleFindingAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-active-finding")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("guardduty-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("guardduty.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("guardduty.json"), { now: NOW }));
    expect(summary).toMatch(/detectors/);
    expect(summary).toMatch(/findings/);
  });
});
