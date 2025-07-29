@echo off
echo Paket hazirlaniyor...
zip monitor-package.zip monitor.exe config/settings.json config/jobs.json *.bat README.md
echo Paket olusturuldu: monitor-package.zip
echo.
dir monitor-package.zip
echo.
pause