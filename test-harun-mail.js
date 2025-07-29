const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

async function testHarunMail() {
  console.log('🧪 Harun için test mail gönderimi başlatılıyor...');

  try {
    // Harun'un Gmail hesabı için doğrudan ayarlar
    const mailConfig = {
      from: 'harunkaradogan@gmail.com',
      smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        user: 'harunkaradogan@gmail.com',
        pass: 'sqmd teqv xmjv fhpp'
      }
    };

    console.log('SMTP konfigürasyonu:');
    console.log('- Host:', mailConfig.smtp.host);
    console.log('- Port:', mailConfig.smtp.port);
    console.log('- User:', mailConfig.smtp.user);
    console.log('- Secure:', mailConfig.smtp.secure);

    const transporter = nodemailer.createTransporter({
      host: mailConfig.smtp.host,
      port: mailConfig.smtp.port,
      secure: mailConfig.smtp.secure,
      auth: {
        user: mailConfig.smtp.user,
        pass: mailConfig.smtp.pass
      }
    });

    console.log('🔍 SMTP bağlantısı test ediliyor...');
    await transporter.verify();
    console.log('✅ SMTP bağlantısı başarılı');

    const mailOptions = {
      from: 'harunkaradogan@gmail.com',
      to: 'harunkaradogan@gmail.com',
      subject: 'Monitor Service - Test Mail',
      text: `Merhaba,

Bu harunkaradogan@gmail.com hesabından gönderilen bir test mailidir.

📊 Test Detayları:
- Gönderen: harunkaradogan@gmail.com
- Alan: harunkaradogan@gmail.com
- Tarih: ${new Date().toLocaleString('tr-TR')}
- Uygulama: Monitor Service

Eğer bu maili aldıysanız, SMTP ayarları doğru çalışıyor demektir.

İyi çalışmalar,
Monitor Service`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Monitor Service - Test Mail</h2>
          <p>Bu <strong>harunkaradogan@gmail.com</strong> hesabından gönderilen bir test mailidir.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #495057;">📊 Test Detayları</h4>
            <ul style="margin: 0;">
              <li><strong>Gönderen:</strong> harunkaradogan@gmail.com</li>
              <li><strong>Alan:</strong> harunkaradogan@gmail.com</li>
              <li><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</li>
              <li><strong>Uygulama:</strong> Monitor Service</li>
            </ul>
          </div>
          
          <p style="color: #28a745; font-weight: bold;">
            ✅ Eğer bu maili aldıysanız, SMTP ayarları doğru çalışıyor demektir.
          </p>
          
          <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
            İyi çalışmalar,<br>
            <strong>Monitor Service</strong>
          </p>
        </div>
      `
    };

    console.log('📧 Test maili gönderiliyor...');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);

    const result = await transporter.sendMail(mailOptions);
    
    console.log('🎉 Test maili başarıyla gönderildi!');
    console.log('📋 Message ID:', result.messageId);
    console.log('📋 Response:', result.response);

  } catch (error) {
    console.error('❌ Mail gönderme hatası:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 SMTP kimlik doğrulama hatası. Şifre veya kullanıcı adı yanlış olabilir.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🌐 SMTP sunucusuna bağlanılamadı. İnternet bağlantınızı kontrol edin.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('⏰ Bağlantı zaman aşımına uğradı. Firewall/antivirüs kontrol edin.');
    }
    
    process.exit(1);
  }
}

// CLI parametreleri
if (require.main === module) {
  testHarunMail().catch(console.error);
}

module.exports = { testHarunMail };