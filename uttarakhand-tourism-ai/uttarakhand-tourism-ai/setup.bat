@echo off
REM Uttarakhand Tourism AI - Setup Script for Windows

echo 🏔️  Uttarakhand Tourism AI - Setup Script
echo ==========================================
echo.

REM Check Python
echo 📋 Checking Python...
python --version
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.11+
    pause
    exit /b 1
)

REM Check Node.js
echo 📋 Checking Node.js...
node --version
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

echo.
echo 🔧 Setting up Backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file
if not exist ".env" (
    echo Creating .env file...
    (
        echo FLASK_ENV=development
        echo FLASK_APP=run.py
        echo SECRET_KEY=dev-secret-key-change-in-production
        echo MONGO_URI=mongodb://admin:password123@localhost:27017/uttarakhand_tourism
        echo GEMINI_API_KEY=your-gemini-api-key-here
        echo WEATHER_API_KEY=your-openweather-api-key-here
    ) > .env
    echo ✅ Created .env file. Please update with your API keys!
) else (
    echo ✅ .env file already exists
)

cd ..

echo.
echo 🔧 Setting up Frontend...
cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
call npm install

REM Create .env file
if not exist ".env" (
    echo Creating .env file...
    echo VITE_API_BASE_URL=http://localhost:5000/api > .env
    echo ✅ Created .env file
) else (
    echo ✅ .env file already exists
)

cd ..

echo.
echo ✅ Setup completed!
echo.
echo 📝 Next steps:
echo 1. Update backend\.env with your GEMINI_API_KEY and WEATHER_API_KEY
echo 2. Start MongoDB (docker-compose up -d or local MongoDB)
echo 3. Start backend: cd backend ^&^& python run.py
echo 4. Start frontend: cd frontend ^&^& npm run dev
echo.
echo 🚀 Happy coding!
pause

