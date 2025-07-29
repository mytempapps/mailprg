const fs = require('fs');
const path = require('path');
const sendMail = require('./mail/sendMail');

// Pkg için gerçek dosya sistemi yolu
const isPkg = process.pkg !== undefined;
const baseDir = isPkg ? path.dirname(process.execPath) : __dirname;

// Settings dosyasını dinamik olarak yükle
const settingsPath = path.join(baseDir, 'config', 'settings.json');
delete require.cache[require.resolve(settingsPath)];
global.settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

async function testDirectMail() {
  console.log('🧪 Test mail gönderimi başlatılıyor...');
  console.log('📁 Settings dosyası:', settingsPath);
  
  try {
    // Test jobu oluştur
    const testJob = {
      id: "test_mail",
      type: "test",
      system: "MonitorService",
      target: {
        ip: "8.8.8.8",
        port: 53
      },
      mail: {
        to: global.settings.mail.to,
        subject: "🧪 Monitor Service Test Mail",
        body: "Merhaba!\n\nBu bir test mailidir.\n\n📊 İşlem: {system} sistem testi\n📍 Hedef: {ip}:{port}\n\nServis başarıyla çalışıyor."
      }
    };

    console.log('📧 Mail gönderiliyor...');
    console.log('Kimden:', global.settings.mail.from);
    console.log('Kime:', global.settings.mail.to);
    console.log('SMTP:', global.settings.mail.smtp.host + ':' + global.settings.mail.smtp.port);

    await sendMail(testJob, "Test işlemi başarıyla tamamlandı. Monitor servisi çalışıyor.");

    console.log('✅ Test maili başarıyla gönderildi!');
    console.log('📬 Lütfen mail kutunuzu kontrol edin.');

  } catch (error) {
    console.error('❌ Mail gönderme hatası:', error.message);
    console.error('📋 Detay:', error);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 SMTP kimlik doğrulama hatası:');
      console.error('   - Kullanıcı adı/şifre kontrol edin');
      console.error('   - Gmail için uygulama şifresi kullanın');
      console.error('   - 2FA açıksa özel uygulama şifresi gerekir');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🌐 Bağlantı hatası:');
      console.error('   - SMTP host/port kontrol edin');
      console.error('   - İnternet bağlantısı kontrol edin');
      console.error('   - Firewall/antivirus kontrol edin');
    } else {
      console.error('🔧 Genel hata:', error.code);
    }
    
    process.exit(1);
  }
}

// CLI parametreleri
if (require.main === module) {
  testDirectMail().catch(console.error);
}

module.exports = { testDirectMail };