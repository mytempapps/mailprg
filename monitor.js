const fs = require("fs");
const path = require("path");
const jobRunner = require("./jobRunner");
const { log } = require("./logger");

const jobs = JSON.parse(fs.readFileSync("jobs.json", "utf-8"));

log("info", "core", `Toplam ${jobs.length} job bulundu.`);

for (const job of jobs) {
  setInterval(() => {
    jobRunner.runJob(job);
  }, job.interval_ms);

  log("info", job.id, `Job başlatıldı, her ${job.interval_ms} ms'de çalışacak.`);
}
