const nodemailer = require("nodemailer");
const settings = require("./config/settings.json");

const transporter = nodemailer.createTransport({
  host: settings.mail.smtp.host,
  port: settings.mail.smtp.port,
  secure: settings.mail.smtp.secure,
  auth: {
    user: settings.mail.smtp.user,
    pass: settings.mail.smtp.pass
  }
});

transporter.sendMail({
  from: settings.mail.from,
  to: settings.mail.to,
  subject: "Gmail Test - Başarılı",
  text: "Gmail SMTP ayarları çalışıyor."
}, (error, info) => {
  if (error) {
    console.log("❌ Gmail hatası:", error.message);
  } else {
    console.log("✅ Gmail mesaj gönderildi:", info.messageId);
  }
});