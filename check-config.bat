@echo off
echo.
echo ================================================
echo Config ve Dosya Kontrolü
echo ================================================

set CONFIG_DIR=%~dp0config
set EXE_PATH=%~dp0monitor.exe

echo Çalışma dizini: %CD%
echo.

:: Config dizinini kontrol et
if exist "%CONFIG_DIR%" (
    echo ✅ Config dizini bulundu: %CONFIG_DIR%
) else (
    echo ❌ Config dizini bulunamadı: %CONFIG_DIR%
    echo    Yeni kurulum için: install-service.bat
)

:: JSON dosyalarını kontrol et
echo.
echo JSON Dosyaları:
if exist "%CONFIG_DIR%\jobs.json" (
    echo ✅ jobs.json bulundu
) else (
    echo ❌ jobs.json bulunamadı
)

if exist "%CONFIG_DIR%\settings.json" (
    echo ✅ settings.json bulundu
) else (
    echo ❌ settings.json bulunamadı
)

:: EXE dosyasını kontrol et
echo.
echo EXE Dosyası:
if exist "%EXE_PATH%" (
    echo ✅ monitor.exe bulundu: %EXE_PATH%
) else (
    echo ❌ monitor.exe bulunamadı: %EXE_PATH%
)

echo.
echo Servis Durumu Kontrolü:
sc query MonitorService 2>nul
if %errorLevel% neq 0 (
    echo ❌ MonitorService servisi bulunamadı
) else (
    echo ✅ MonitorService servisi bulundu
)

pause