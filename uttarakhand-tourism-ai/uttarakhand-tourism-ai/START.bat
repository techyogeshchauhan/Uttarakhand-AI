@echo off
echo ============================================
echo Uttarakhand Tourism AI - Quick Start
echo ============================================
echo.

REM Check if backend virtual environment exists
if not exist "backend\venv" (
    echo [ERROR] Backend virtual environment not found!
    echo Please run setup first:
    echo   cd backend
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules" (
    echo [ERROR] Frontend dependencies not installed!
    echo Please run: cd frontend ^&^& npm install
    echo.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo [WARNING] Backend .env file not found!
    echo Please create backend\.env with your API keys
    echo.
)

echo Starting Backend Server...
start "Uttarakhand Tourism - Backend" cmd /k "cd backend && venv\Scripts\activate && python run.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Uttarakhand Tourism - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo Servers are starting...
echo ============================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:3000

echo.
echo Application is running!
echo Close the terminal windows to stop the servers.
echo.
pause
