const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'fiksbasis@gmail.com',
        pass: 'AWIC EKTP DQGC HILK' // Buraya kendi şifrenizi yazın, boşlukları kaldırın
    }
});

const mailOptions = {
    from: 'fiksbasis@gmail.com',
    to: 'harunkaradogan@gmail.com',
    subject: 'Test - Gmail SMTP',
    text: 'Bu bir test mailidir. Eğer bu maili alıyorsanız, SMTP ayarları doğru.'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('❌ Hata:', error.message);
        console.log('🔍 Detay:', error);
    } else {
        console.log('✅ Mail gönderildi:', info.response);
    }
});