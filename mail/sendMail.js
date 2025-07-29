const nodemailer = require("nodemailer");
const settings = require("../settings.json");
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

const transporter = nodemailer.createTransport({
  host: settings.mail.smtp.host,
  port: settings.mail.smtp.port,
  secure: settings.mail.smtp.secure,
  auth: {
    user: settings.mail.smtp.user,
    pass: settings.mail.smtp.pass
  }
});

async function sendMail(job, resultMessage) {
  if (!job.mail) return;

  const subject = formatTemplate(job.mail.subject, job);
  const body = `${formatTemplate(job.mail.body, job)}\n\n📄 Sistem Mesajı:\n${resultMessage}\n⏱ Tarih: ${new Date().toLocaleString()}`;

  const mailOptions = {
    from: settings.mail.from,
    to: settings.mail.to,
    subject,
    text: body
  };

  try {
    await transporter.sendMail(mailOptions);
    log("info", job.id, "📧 Mail gönderildi");
  } catch (err) {
    log("error", job.id, `Mail gönderme hatası: ${err.message}`);
  }
}

module.exports = sendMail;
