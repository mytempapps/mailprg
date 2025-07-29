const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { log } = require("../logger");

function formatTemplate(template, job) {
  const vars = {
    ...job.target,
    id: job.id,
    system: job.system,
    min_free_gb: job.target?.min_free_gb,
    ip: job.target?.ip,
    port: job.target?.port,
    path: job.target?.path
  };

  return template.replace(/\{(.*?)\}/g, (_, key) => vars[key] ?? "");
}

function getSettings() {
  // Pkg için çalışma dizinini belirle
  const isPkg = process.pkg !== undefined;
  const baseDir = isPkg ? path.dirname(process.execPath) : __dirname;
  const settingsPath = path.join(baseDir, "config", "settings.json");
  
  try {
    const settingsContent = fs.readFileSync(settingsPath, "utf8");
    return JSON.parse(settingsContent);
  } catch (error) {
    log("error", "system", `Settings dosyası okunamadı: ${error.message}`);
    throw error;
  }
}

function createTransporter() {
  const settings = getSettings();
  
  return nodemailer.createTransport({
    host: settings.mail.smtp.host,
    port: settings.mail.smtp.port,
    secure: settings.mail.smtp.secure,
    auth: {
      user: settings.mail.smtp.user,
      pass: settings.mail.smtp.pass
    },
    tls: settings.mail.smtp.tls || { rejectUnauthorized: true }
  });
}

async function sendMail(job, resultMessage) {
  if (!job.mail) return;

  try {
    const settings = getSettings();
    const transporter = createTransporter();

    const subject = formatTemplate(job.mail.subject, job);
    const body = `${formatTemplate(job.mail.body, job)}

📄 Sistem Mesajı:
${resultMessage}
⏱ Tarih: ${new Date().toLocaleString()}`;

    const mailOptions = {
      from: settings.mail.from,
      to: job.mail.to,
      subject,
      text: body
    };

    await transporter.sendMail(mailOptions);
    log("info", job.id, "📧 Mail gönderildi");
  } catch (err) {
    log("error", job.id, `Mail gönderme hatası: ${err.message}`);
  }
}

module.exports = sendMail;