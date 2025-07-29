const nodemailer = require("nodemailer");
const settings = require("./settings.json");

async function testSMTP2GO() {
  const transporter = nodemailer.createTransport({
    host: settings.mail.smtp.host,
    port: settings.mail.smtp.port,
    secure: settings.mail.smtp.secure,
    auth: {
      user: settings.mail.smtp.user,
      pass: settings.mail.smtp.pass
    },
    logger: true,
    debug: true,
    tls: settings.mail.smtp.tls || { rejectUnauthorized: true }
  });

  try {
    console.log("SMTP2GO bağlantısı test ediliyor...");
    await transporter.verify();
    console.log("✅ SMTP2GO bağlantısı başarılı");

    const mailOptions = {
      from: settings.mail.from,
      to: settings.mail.to,
      subject: "SMTP2GO Test - Başarılı",
      text: "SMTP2GO SMTP ayarları doğru şekilde yapılandırıldı."
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Test maili gönderildi:", result.messageId);
  } catch (error) {
    console.error("❌ SMTP2GO hatası:", error.message);
  }
}

testSMTP2GO();