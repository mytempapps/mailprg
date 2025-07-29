@echo off
echo.
echo ================================================
echo Monitor Servisi Kaldırma
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

echo Servis kontrol ediliyor...
sc query %SERVICE_NAME% >nul 2>&1
if %errorLevel% neq 0 (
    echo Servis bulunamadı: %SERVICE_NAME%
    pause
    exit /b 1
)

echo Servis durduruluyor...
net stop %SERVICE_NAME%
timeout /t 3 /nobreak >nul

echo Servis kaldırılıyor...
sc delete %SERVICE_NAME%

if %errorLevel% equ 0 (
    echo.
    echo ================================================
    echo Servis başarıyla kaldırıldı!
    echo ================================================
    pause
) else (
    echo Servis kaldırılamadı!
    pause
)