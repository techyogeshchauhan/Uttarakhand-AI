@echo off
echo ============================================
echo Uttarakhand Tourism AI - Installation
echo ============================================
echo.

echo [1/4] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found! Please install Python 3.9 or higher
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [OK] Python found

echo.
echo [2/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found! Please install Node.js 18 or higher
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

echo.
echo [3/4] Setting up Backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

if not exist ".env" (
    echo.
    echo [WARNING] .env file not found!
    echo Please create backend\.env with your API keys
    echo See .env.example for reference
    echo.
)

cd ..

echo.
echo [4/4] Setting up Frontend...
cd frontend

echo Installing Node.js dependencies...
call npm install

cd ..

echo.
echo ============================================
echo Installation Complete!
echo ============================================
echo.
echo Next Steps:
echo 1. Add your API keys to backend\.env
echo 2. Update Google Maps API key in frontend\index.html
echo 3. Run START.bat to launch the application
echo.
echo For detailed setup instructions, see SETUP_GUIDE.md
echo.
pause
