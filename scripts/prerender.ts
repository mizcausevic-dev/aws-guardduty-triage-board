import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  detectorLane,
  findingRisks,
  payload,
  responsePosture,
  summary,
  verification
} from "../src/services/awsGuarddutyTriageBoardService.js";
import {
  renderDetectorLane,
  renderDocs,
  renderFindingRisks,
  renderOverview,
  renderResponsePosture,
  renderVerification
} from "../src/services/render.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "site");

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(path.join(outputDir, "api", "dashboard"), { recursive: true });
fs.copyFileSync(path.join(root, "CNAME"), path.join(outputDir, "CNAME"));

const pages: Record<string, string> = {
  "index.html": renderOverview(),
  [path.join("detector-lane", "index.html")]: renderDetectorLane(),
  [path.join("finding-risks", "index.html")]: renderFindingRisks(),
  [path.join("response-posture", "index.html")]: renderResponsePosture(),
  [path.join("verification", "index.html")]: renderVerification(),
  [path.join("docs", "index.html")]: renderDocs()
};

for (const [relativePath, html] of Object.entries(pages)) {
  const fullPath = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, html, "utf8");
}

const apiPayloads: Record<string, unknown> = {
  [path.join("api", "dashboard", "summary.json")]: summary(),
  [path.join("api", "detector-lane.json")]: detectorLane(),
  [path.join("api", "finding-risks.json")]: findingRisks(),
  [path.join("api", "response-posture.json")]: responsePosture(),
  [path.join("api", "verification.json")]: verification(),
  [path.join("api", "sample.json")]: payload()
};

for (const [relativePath, data] of Object.entries(apiPayloads)) {
  const fullPath = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
}
