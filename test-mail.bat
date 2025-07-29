@echo off
echo.
echo ================================================
echo Test Mail Gönderimi
echo ================================================

echo Çalışma dizini: %CD%
echo.

if not exist "config\settings.json" (
    echo ❌ config\settings.json bulunamadı!
    echo Lütfen önce ayar dosyasını oluşturun.
    pause
    exit /b 1
)

echo 📧 Settings dosyası kontrol ediliyor...
type config\settings.json

echo.
echo 📧 Test maili gönderiliyor...
echo ----------------------------
node test-mail.js
echo ----------------------------

echo.
echo Test tamamlandı.
pause