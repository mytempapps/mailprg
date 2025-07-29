@echo off
echo.
echo ================================================
echo Monitor Servisi Durumu
echo ================================================

set SERVICE_NAME=MonitorService

sc query %SERVICE_NAME% >nul 2>&1
if %errorLevel% neq 0 (
    echo Servis bulunamadı: %SERVICE_NAME%
    echo Servis kurulu değil veya adı yanlış.
    pause
    exit /b 1
)

echo.
echo Servis Bilgileri:
echo ================================================
sc query %SERVICE_NAME%

echo.
echo Ayrıntılı Bilgi:
echo ================================================
sc qc %SERVICE_NAME%

echo.
echo NSSM Ayarları:
echo ================================================
where nssm >nul 2>&1
if %errorLevel% equ 0 (
    nssm get %SERVICE_NAME% Application
    nssm get %SERVICE_NAME% Arguments
    nssm get %SERVICE_NAME% AppDirectory
    nssm get %SERVICE_NAME% AppStdout
    nssm get %SERVICE_NAME% AppStderr
) else (
    echo NSSM bulunamadı, ayrıntılı ayarlar gösterilemiyor.
)

pause