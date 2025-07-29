@echo off
echo.
echo ================================================
echo Monitor Servisi Kurulumu
echo ================================================

:: Yönetici hakları kontrolü
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Hata: Bu script yönetici hakları gerektiriyor!
    echo Lütfen "Yönetici olarak çalıştır" seçeneğiyle tekrar deneyin.
    pause
    exit /b 1
)

:: Değişkenler
set SERVICE_NAME=MonitorService
set DISPLAY_NAME="Sistem Monitor Servisi"
set DESCRIPTION="IP, telnet ve disk izleme servisi"
set EXE_PATH=%~dp0monitor.exe
set CONFIG_DIR=%~dp0config
set LOGS_DIR=%~dp0logs

:: Dizinleri oluştur
if not exist "%CONFIG_DIR%" mkdir "%CONFIG_DIR%"
if not exist "%LOGS_DIR%" mkdir "%LOGS_DIR%"

:: JSON dosyalarını sadece hiç yoksa oluştur
if not exist "%CONFIG_DIR%\jobs.json" (
    echo Varsayılan jobs.json oluşturuluyor...
    echo [ {"id":"test_ping","type":"ping","host":"8.8.8.8","interval_ms":60000,"mail":{"to":"admin@example.com"}} ] > "%CONFIG_DIR%\jobs.json"
) else (
    echo jobs.json zaten var, atlanıyor...
)

if not exist "%CONFIG_DIR%\settings.json" (
    echo Varsayılan settings.json oluşturuluyor...
    echo {"mail":{"from":"monitor@example.com","to":"admin@example.com","smtp":{"host":"smtp.gmail.com","port":465,"secure":true,"user":"monitor@example.com","pass":"password"}},"logging":{"enabled":true,"level":"info","log_to_console":false,"log_to_file":true,"file_path":"logs\\monitor.log","max_file_size_mb":10,"max_backup_files":5}} > "%CONFIG_DIR%\settings.json"
) else (
    echo settings.json zaten var, atlanıyor...
)

:: Mevcut servisi durdur ve kaldır
sc query %SERVICE_NAME% >nul 2>&1
if %errorLevel% equ 0 (
    echo Mevcut servis durduruluyor...
    net stop %SERVICE_NAME%
    sc delete %SERVICE_NAME%
    timeout /t 3 /nobreak >nul
)

:: NSSM ile servisi kur
where nssm >nul 2>&1
if %errorLevel% neq 0 (
    echo Hata: NSSM bulunamadı!
    echo Lütfen NSSM'yi indirip PATH'e ekleyin: https://nssm.cc/download
    pause
    exit /b 1
)

echo Servis kuruluyor...
nssm install %SERVICE_NAME% "%EXE_PATH%"
nssm set %SERVICE_NAME% Description %DESCRIPTION%
nssm set %SERVICE_NAME% DisplayName %DISPLAY_NAME%
nssm set %SERVICE_NAME% Application "%EXE_PATH%"
nssm set %SERVICE_NAME% Arguments --jobs="config\jobs.json" --settings="config\settings.json"
nssm set %SERVICE_NAME% Start SERVICE_DELAYED_AUTO_START
nssm set %SERVICE_NAME% Type SERVICE_WIN32_OWN_PROCESS
nssm set %SERVICE_NAME% ObjectName LocalSystem

:: Çalışma dizinini ayarla
nssm set %SERVICE_NAME% AppDirectory "%CD%"

:: Çıktı ve hata loglarını ayarla
nssm set %SERVICE_NAME% AppStdout "%LOGS_DIR%\service-out.log"
nssm set %SERVICE_NAME% AppStderr "%LOGS_DIR%\service-error.log"

:: Servis recovery ayarlarını yapılandır
echo Servis recovery ayarları yapılandırılıyor...
sc failure %SERVICE_NAME% reset= 86400 actions= restart/60000/restart/60000/restart/60000

:: Servisi başlat
echo Servis başlatılıyor...
net start %SERVICE_NAME%

if %errorLevel% equ 0 (
    echo.
    echo ================================================
    echo Servis başarıyla kuruldu!
    echo ================================================
    echo Servis Adı: %SERVICE_NAME%
    echo Config Dizini: %CONFIG_DIR%
    echo Log Dizini: %LOGS_DIR%
    echo.
    echo Servisi durdurmak için: net stop %SERVICE_NAME%
    echo Servisi kaldırmak için: sc delete %SERVICE_NAME%
    echo.
    echo Log dosyalarını kontrol edin: %LOGS_DIR%
    pause
) else (
    echo Servis başlatılamadı!
    pause
)