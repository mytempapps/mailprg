const ping = require("ping");
const nodemailer = require("nodemailer");

// Ping atılacak IP listesi
const ipList = [
  {
    id: "VET",
    ip: "192.168.2.14",
    port: "3200",
    process: "telnet"
  },

  {
    id: "VET",
    ip: "192.168.2.14",
    port: "",
    process: "ping"
  },

  {
    id: "VET",
    ip: "192.168.2.14",
    port: "3600",
    process: "telnet"
  },
]; // Buraya kendi IP'lerini ekle

// Ping atma aralığı (ms cinsinden) -> 1 dakika
const interval = 3000; //60000

// Mail gönderme ayarları
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SSL için 465 kullan
  secure: true, // 465 için true, 587 için false olmalı
  auth: {
    user: "felecebasis@gmail.com",
    pass: "tlve fpuy gpbl llpr",
  },
});

// Mail gönderme fonksiyonu
const sendMail = async (ip) => {
  const mailOptions = {
    from: "felecebasis@gmail.com",
    to: "husnu.sahin@felece.com", // Uyarı gidecek mail adresi
    subject: `Sistem Uyarısı - ${ip} Yanıt Vermiyor`,
    text: `Dikkat! ${ip} adresine yapılan ping isteğine yanıt alınamadı.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Mail gönderildi: ${ip} erişilemiyor.`);
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
  }
};

// IP'leri belirli aralıklarla kontrol etme
const checkHosts = async () => {
  for (const ip of ipList) {
    try {
      const res = await ping.promise.probe(ip);
      if (!res.alive) {
        console.log(`${ip} yanıt vermiyor, mail gönderiliyor...`);
        sendMail(ip);
      } else {
        console.log(`${ip} çalışıyor.`);
      }
    } catch (error) {
      console.error(`Ping hatası: ${ip}`, error);
    }
  }
};

// Belirtilen zaman aralığında çalıştır
setInterval(checkHosts, interval);

console.log("Ping kontrol servisi başlatıldı...");
