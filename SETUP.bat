@echo off
title Monitor Kurulumu
echo.
echo === MONITOR SISTEM KURULUMU ===
echo.
echo 1. Servis kontrol ediliyor...
sc query MonitorService > nul 2>&1
if %errorlevel% equ 0 (
    echo Servis zaten kurulu.
) else (
    echo 2. Servis kuruluyor...
    install-service.bat
)
echo.
echo 3. Yapılandırma:
echo    - Gmail: fiksbasis@gmail.com
echo    - Kontrol aralığı: 1 dakika
echo    - Log dosyası: logs/monitor.log
echo.
echo Kurulum tamamlandi!
echo.
echo Servis durumu: service-status.bat
echo.
pause