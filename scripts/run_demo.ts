import { detectorLane, findingRisks, summary } from "../src/services/awsGuarddutyTriageBoardService.js";

console.log("aws-guardduty-triage-board demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(
  JSON.stringify(
    detectorLane().map((lane) => ({
      lane: lane.lane,
      owner: lane.owner,
      status: lane.status
    })),
    null,
    2
  )
);
console.log(JSON.stringify(findingRisks().slice(0, 3), null, 2));
