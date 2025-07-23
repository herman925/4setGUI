@echo off
REM This batch file starts the PowerShell web server for the survey.
echo Starting the survey server...
echo.
echo Your web browser will open shortly.
echo Please keep this window open to run the survey.
echo When you are finished, you can close this window.
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"

pause
