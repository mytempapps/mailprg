@echo off
echo.
echo ================================================
echo Monitor Servisi Restart
echo ================================================

:: Yönetici hakları kontrolü
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Hata: Bu script yönetici hakları gerektiriyor!
    echo Lütfen "Yönetici olarak çalıştır" seçeneğiyle tekrar deneyin.
    pause
    exit /b 1
)

set SERVICE_NAME=MonitorService

echo Servis durumu kontrol ediliyor...
sc query %SERVICE_NAME% >nul 2>&1
if %errorLevel% neq 0 (
    echo Servis bulunamadı: %SERVICE_NAME%
    echo Önce servisi kurmak için install-service.bat çalıştırın.
    pause
    exit /b 1
)

echo Servis durduruluyor...
net stop %SERVICE_NAME%
timeout /t 5 /nobreak >nul

echo Servis durumu kontrol ediliyor...
sc query %SERVICE_NAME%

echo Servis başlatılıyor...
net start %SERVICE_NAME%

if %errorLevel% equ 0 (
    echo.
    echo ================================================
    echo Servis başarıyla restart edildi!
    echo ================================================
    echo Servis durumu:
    sc query %SERVICE_NAME%
    pause
) else (
    echo Servis restart edilemedi!
    echo Log dosyalarını kontrol edin: logs/service-error.log
    pause
)