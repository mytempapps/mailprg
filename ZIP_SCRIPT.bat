@echo off
echo =================================
echo Monitor Service ZIP Creator
echo =================================

REM Dağıtım klasörünü oluştur
if exist dist rd /s /q dist
mkdir dist

REM Windows executable oluştur
if exist build-exe.bat (
    echo Windows executable oluşturuluyor...
    call build-exe.bat
) else (
    echo build-exe.bat bulunamadı, mevcut exe kullanılıyor...
)

REM Temel dosyaları kopyala
echo Dosyalar kopyalanıyor...
if exist monitor.exe copy monitor.exe dist\
xcopy config dist\config\ /E /I /Y
xcopy *.bat dist\ /Y
xcopy *.md dist\ /Y
xcopy package.json dist\ /Y

REM Logs klasörünü oluştur (boş)
mkdir dist\logs

REM ZIP dosyası oluştur
echo ZIP paketi oluşturuluyor...
for /f "tokens=2 delims==" %%a in ('find "version" package.json') do (
    set VERSION=%%a
    set VERSION=!VERSION:"=!
)

set ZIP_NAME=monitor-service-v%VERSION%.zip

if exist "%ProgramFiles%\7-Zip\7z.exe" (
    "%ProgramFiles%\7-Zip\7z.exe" a %ZIP_NAME% dist\
) else if exist "%ProgramFiles(x86)%\7-Zip\7z.exe" (
    "%ProgramFiles(x86)%\7-Zip\7z.exe" a %ZIP_NAME% dist\
) else (
    REM Windows built-in compress
    powershell Compress-Archive -Path dist\* -DestinationPath %ZIP_NAME% -Force
)

if exist %ZIP_NAME% (
    echo =================================
    echo ✅ Başarılı! ZIP oluşturuldu: %ZIP_NAME%
    dir %ZIP_NAME%
) else (
    echo ❌ ZIP oluşturulamadı!
)

echo.
pause