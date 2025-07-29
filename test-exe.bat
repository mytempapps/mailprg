@echo off
echo.
echo ================================================
echo Monitor.exe Test
echo ================================================

echo Çalışma dizini: %CD%
echo.

if not exist "config" mkdir config

if not exist "config\jobs.json" (
    echo Test jobs.json oluşturuluyor...
    echo [{"id":"test_ping","type":"ping","host":"8.8.8.8","interval_ms":10000,"mail":{"to":"test@example.com"}}] > config\jobs.json
)

if not exist "config\settings.json" (
    echo Test settings.json oluşturuluyor...
    echo {"mail":{"from":"test@example.com","to":"test@example.com","smtp":{"host":"smtp.gmail.com","port":465,"secure":true,"user":"test","pass":"test"}},"logging":{"enabled":true,"level":"info","log_to_console":true,"log_to_file":false}} > config\settings.json
)

echo.
echo JSON dosyaları:
dir config\*.json

echo.
echo Monitor.exe çalıştırılıyor...
echo ----------------------------
monitor.exe --jobs=config\jobs.json --settings=config\settings.json
echo ----------------------------

echo.
echo Hata ayıklama logları:
if exist logs\debug.log (
    type logs\debug.log
) else (
    echo Debug log bulunamadı
)

pause