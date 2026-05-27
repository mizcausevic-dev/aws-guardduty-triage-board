// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  detectorLane,
  findingRisks,
  payload,
  responsePosture,
  summary,
  verification
} from "./services/awsGuarddutyTriageBoardService.js";
import {
  renderDetectorLane,
  renderDocs,
  renderFindingRisks,
  renderOverview,
  renderResponsePosture,
  renderVerification
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5520);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/detector-lane", (_req, res) => res.type("html").send(renderDetectorLane()));
app.get("/finding-risks", (_req, res) => res.type("html").send(renderFindingRisks()));
app.get("/response-posture", (_req, res) => res.type("html").send(renderResponsePosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/detector-lane", (_req, res) => res.json(detectorLane()));
app.get("/api/finding-risks", (_req, res) => res.json(findingRisks()));
app.get("/api/response-posture", (_req, res) => res.json(responsePosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`AWS GuardDuty Triage Board listening on http://${host}:${port}`);
  });
}

export default app;
