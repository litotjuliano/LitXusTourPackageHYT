@echo off
setlocal EnableDelayedExpansion

cd /d "%~dp0"

if not exist ".env" (
    echo [ERROR] .env file not found. Copy .env.example to .env and fill in your values.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [INFO] node_modules not found, running npm install...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

set "XAMPP_DIR=C:\xampp"

echo [INFO] Checking MySQL (XAMPP) status on port 3306...
set "MYSQL_UP=0"
netstat -ano | findstr /c:":3306 " | findstr /c:"LISTENING" >nul 2>&1
if not errorlevel 1 set "MYSQL_UP=1"

if "%MYSQL_UP%"=="1" (
    echo [INFO] MySQL already running on port 3306.
) else if not exist "%XAMPP_DIR%\mysql_start.bat" (
    echo [WARNING] XAMPP not found at "%XAMPP_DIR%". Please start MySQL manually, or edit XAMPP_DIR in this script.
) else (
    echo [INFO] MySQL not running, starting XAMPP MySQL service...
    start "XAMPP MySQL" /min "%XAMPP_DIR%\mysql_start.bat"

    echo [INFO] Waiting for MySQL to become ready...
    set "MYSQL_READY=0"
    for /l %%i in (1,1,30) do (
        if "!MYSQL_READY!"=="0" (
            netstat -ano | findstr /c:":3306 " | findstr /c:"LISTENING" >nul 2>&1
            if not errorlevel 1 (
                set "MYSQL_READY=1"
            ) else (
                timeout /t 1 /nobreak >nul
            )
        )
    )

    if "!MYSQL_READY!"=="1" (
        echo [INFO] MySQL is up.
    ) else (
        echo [WARNING] MySQL did not start within 30 seconds. Check the XAMPP Control Panel.
    )
)

set "PORT=3000"
for /f "usebackq tokens=2 delims==" %%A in (`findstr /b /i "PORT=" .env`) do set "PORT=%%A"

echo [INFO] Checking for existing process on port %PORT%...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:"LISTENING" ^| findstr /c:":%PORT% "') do (
    echo [INFO] Killing process %%P using port %PORT%...
    taskkill /F /PID %%P >nul 2>&1
)

echo [INFO] Opening browser at http://localhost:%PORT%/ once the server is ready...
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 4; Start-Process 'http://localhost:%PORT%/'"

echo [INFO] Starting HYT Tour Itineraries server...
call npm run dev

pause
