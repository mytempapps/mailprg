const { log } = require("./logger");
const sendMail = require("./mail/sendMail");
const pingCheck = require("./utils/pingCheck");
const telnetCheck = require("./utils/telnetCheck");
const diskCheck = require("./utils/diskCheck");

async function runJob(job) {
  try {
    let result = { success: true, message: "" };

    if (job.type === "ping") {
      result = await pingCheck(job);
    } else if (job.type === "telnet") {
      result = await telnetCheck(job);
    } else if (job.type === "disk") {
      result = await diskCheck(job);
    } else {
      log("warn", job.id, `Bilinmeyen job tipi: ${job.type}`);
      return;
    }

    if (!result.success) {
      log("error", job.id, result.message);
      await sendMail(job, result.message);
    } else {
      log("info", job.id, result.message);
    }

  } catch (err) {
    log("error", job.id, `Hata oluştu: ${err.message}`);
  }
}

module.exports = { runJob };
