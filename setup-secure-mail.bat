@echo off
echo.
echo ================================================
echo Güvenli Mail Kurulumu
echo ================================================

echo.
echo 🔐 Gmail için Uygulama Şifresi Kurulumu:
echo.
echo 1. Google Hesabınıza gidin: https://myaccount.google.com/
echo 2. Güvenlik > 2-Adımlı Doğrulama'yi açın
echo 3. https://myaccount.google.com/apppasswords adresine gidin
echo 4. "Uygulama şifresi oluştur" seçin
echo 5. Uygulama: "Posta", Cihaz: "Windows Bilgisayar"
echo 6. 16 karakterlik şifreyi kopyalayın
echo.
echo 📋 settings.json dosyasını güncelleyin:
echo.
echo {
echo   "mail": {
echo     "from": "senin-email@gmail.com",
echo     "to": "hedef-email@gmail.com",
echo     "smtp": {
echo       "host": "smtp.gmail.com",
echo       "port": 465,
echo       "secure": true,
echo       "user": "senin-email@gmail.com",
echo       "pass": "16-karakter-uygulama-sifresi"
echo     }
echo   }
echo }

echo.
echo 🔄 Alternatif çözümler:
echo.
echo 1. Gmail için: config\settings-gmail.json kullanın
echo 2. Outlook için: config\settings-outlook.json kullanın
echo 3. Diğer SMTP sağlayıcıları için GMAIL_SETUP.md dosyasına bakın

echo.
echo Test etmek için:
echo node test-mail-direct.js

echo.
echo Kurulum tamamlandı!
pause