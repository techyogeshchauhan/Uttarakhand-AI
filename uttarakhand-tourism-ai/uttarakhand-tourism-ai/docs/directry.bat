@echo off
echo Creating Uttarakhand Tourism AI project structure...

REM ============================================
REM ROOT DIRECTORY
REM ============================================

REM ============================================
REM BACKEND
REM ============================================
mkdir backend
mkdir backend\app
mkdir backend\app\api
mkdir backend\app\models
mkdir backend\app\services
mkdir backend\app\utils
mkdir backend\app\config
mkdir backend\tests

type nul > backend\app\__init__.py
type nul > backend\app\api\__init__.py
type nul > backend\app\api\chat.py
type nul > backend\app\api\vision.py
type nul > backend\app\api\itinerary.py
type nul > backend\app\api\emergency.py
type nul > backend\app\models\__init__.py
type nul > backend\app\models\tourist.py
type nul > backend\app\models\place.py
type nul > backend\app\models\itinerary.py
type nul > backend\app\services\__init__.py
type nul > backend\app\services\gemini_service.py
type nul > backend\app\services\translation_service.py
type nul > backend\app\services\weather_service.py
type nul > backend\app\utils\__init__.py
type nul > backend\app\utils\logger.py
type nul > backend\app\utils\validators.py
type nul > backend\app\config\__init__.py
type nul > backend\app\config\settings.py
type nul > backend\requirements.txt
type nul > backend\.env
type nul > backend\run.py

REM ============================================
REM FRONTEND
REM ============================================
mkdir frontend
mkdir frontend\src
mkdir frontend\src\components
mkdir frontend\src\components\chat
mkdir frontend\src\components\vision
mkdir frontend\src\components\itinerary
mkdir frontend\src\components\emergency
mkdir frontend\src\components\common
mkdir frontend\src\services
mkdir frontend\src\types
mkdir frontend\src\hooks
mkdir frontend\src\utils
mkdir frontend\src\assets
mkdir frontend\src\assets\images
mkdir frontend\src\assets\icons
mkdir frontend\src\styles
mkdir frontend\public

type nul > frontend\src\App.tsx
type nul > frontend\src\main.tsx
type nul > frontend\src\vite-env.d.ts
type nul > frontend\src\components\chat\ChatInterface.tsx
type nul > frontend\src\components\chat\MessageBubble.tsx
type nul > frontend\src\components\chat\VoiceInput.tsx
type nul > frontend\src\components\vision\ImageUpload.tsx
type nul > frontend\src\components\vision\PlaceInfo.tsx
type nul > frontend\src\components\itinerary\ItineraryForm.tsx
type nul > frontend\src\components\itinerary\ItineraryDisplay.tsx
type nul > frontend\src\components\emergency\EmergencyAlert.tsx
type nul > frontend\src\components\emergency\WeatherWidget.tsx
type nul > frontend\src\components\common\Header.tsx
type nul > frontend\src\components\common\Footer.tsx
type nul > frontend\src\components\common\LanguageSelector.tsx
type nul > frontend\src\services\api.ts
type nul > frontend\src\services\gemini.ts
type nul > frontend\src\services\speech.ts
type nul > frontend\src\types\index.ts
type nul > frontend\src\types\chat.ts
type nul > frontend\src\types\place.ts
type nul > frontend\src\hooks\useChat.ts
type nul > frontend\src\hooks\useVoice.ts
type nul > frontend\src\utils\helpers.ts
type nul > frontend\src\styles\globals.css
type nul > frontend\package.json
type nul > frontend\tsconfig.json
type nul > frontend\vite.config.ts
type nul > frontend\.env
type nul > frontend\index.html
type nul > frontend\tailwind.config.js
type nul > frontend\postcss.config.js

REM ============================================
REM DATABASE
REM ============================================
mkdir database
mkdir database\schemas
mkdir database\seeds

type nul > database\schemas\places.json
type nul > database\schemas\emergencies.json
type nul > database\seeds\seed_places.py
type nul > database\seeds\seed_data.json

REM ============================================
REM ROOT FILES
REM ============================================
type nul > README.md
type nul > .gitignore
type nul > docker-compose.yml
type nul > .env.example

echo.
echo ============================================
echo ✅ Directory structure created successfully!
echo ============================================
echo.

pause
