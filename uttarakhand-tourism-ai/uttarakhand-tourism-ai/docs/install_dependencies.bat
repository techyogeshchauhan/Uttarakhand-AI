@echo off
echo ========================================
echo Installing MongoDB Dependencies
echo ========================================
echo.

REM Activate virtual environment if exists
if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo Virtual environment not found. Using global Python.
)

echo.
echo Installing required packages...
echo.

REM Install dependencies
python -m pip install --upgrade pip
python -m pip install email-validator==2.1.0
python -m pip install PyJWT==2.8.0
python -m pip install bcrypt==4.1.2

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run: python scripts\init_database.py --all
echo 3. Run: python run.py
echo.
pause
