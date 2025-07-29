const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Pkg için gerçek dosya sistemi yolu
const isPkg = process.pkg !== undefined;
const baseDir = isPkg ? path.dirname(process.execPath) : __dirname;
const settingsFile = path.join(baseDir, 'config', 'settings.json');

async function testMail() {
  console.log('Test mail gönderimi başlatılıyor...');
  console.log('Settings dosyası:', settingsFile);

  try {
    // Settings dosyasını oku
    if (!fs.existsSync(settingsFile)) {
      throw new Error(`Settings dosyası bulunamadı: ${settingsFile}`);
    }

    const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
    console.log('Settings okundu:', JSON.stringify(settings.mail, null, 2));

    // SMTP transporter oluştur
    const transporter = nodemailer.createTransporter({
      host: settings.mail.smtp.host,
      port: settings.mail.smtp.port,
      secure: settings.mail.smtp.secure,
      auth: {
        user: settings.mail.smtp.user,
        pass: settings.mail.smtp.pass
      }
    });

    console.log('SMTP konfigürasyonu test ediliyor...');
    
    // SMTP bağlantısını test et
    await transporter.verify();
    console.log('✅ SMTP bağlantısı başarılı');

    // Test maili hazırla
    const mailOptions = {
      from: settings.mail.from,
      to: settings.mail.to,
      subject: 'Monitor Service Test Mail',
      text: 'Bu bir test mailidir. Monitor servisi çalışıyor.\n\nTarih: ' + new Date().toISOString(),
      html: '<h1>Monitor Service Test</h1><p>Bu bir test mailidir.</p><p><strong>Tarih:</strong> ' + new Date().toISOString() + '</p>'
    };

    console.log('Test maili gönderiliyor...');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);

    // Maili gönder
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test maili başarıyla gönderildi!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);

  } catch (error) {
    console.error('❌ Mail gönderme hatası:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('SMTP kimlik doğrulama hatası. Kullanıcı adı/şifre kontrol edin.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('SMTP sunucusuna bağlanılamadı. Host/port kontrol edin.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Bağlantı zaman aşımına uğradı. Ağ/firewall kontrol edin.');
    }
    
    console.error('Hata detayı:', error);
    process.exit(1);
  }
}

// CLI parametreleri
if (require.main === module) {
  testMail().catch(console.error);
}

module.exports = { testMail };