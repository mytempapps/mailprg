var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525, // 8025, 587 and 25 can also be used.
  auth: {
    user: "fiksbasis",
    pass: "8Jx8oX4Wl0npvmg0",
  },
});

smtpTransport.sendMail({
  from: "harun.karadogan@fiksbilisim.com",
  to: "harunkaradogan@gmail.com",
  subject: "SMTP2GO Test - Başarılı",
  text: "SMTP2GO SMTP ayarları doğru şekilde yapılandırıldı.",
  html: "<h1>SMTP2GO Test</h1><p>SMTP2GO SMTP ayarları doğru şekilde yapılandırıldı.</p>"
},
  function (error, response) {
    if(error){
      console.log("❌ Hata:", error);
    } else {
      console.log("✅ Mesaj gönderildi:", response.messageId);
    }
  }
);