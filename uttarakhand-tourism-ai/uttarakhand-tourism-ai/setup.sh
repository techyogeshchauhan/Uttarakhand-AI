#!/bin/bash

# Uttarakhand Tourism AI - Setup Script
# This script helps set up the project for development

echo "🏔️  Uttarakhand Tourism AI - Setup Script"
echo "=========================================="
echo ""

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node --version 2>&1)
echo "Node.js version: $node_version"

echo ""
echo "🔧 Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
FLASK_ENV=development
FLASK_APP=run.py
SECRET_KEY=dev-secret-key-change-in-production
MONGO_URI=mongodb://admin:password123@localhost:27017/uttarakhand_tourism
GEMINI_API_KEY=your-gemini-api-key-here
WEATHER_API_KEY=your-openweather-api-key-here
EOF
    echo "✅ Created .env file. Please update with your API keys!"
else
    echo "✅ .env file already exists"
fi

cd ..

echo ""
echo "🔧 Setting up Frontend..."
cd frontend

# Install Node dependencies
echo "Installing Node.js dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000/api
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

cd ..

echo ""
echo "✅ Setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your GEMINI_API_KEY and WEATHER_API_KEY"
echo "2. Start MongoDB (docker-compose up -d or local MongoDB)"
echo "3. Start backend: cd backend && python run.py"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "🚀 Happy coding!"

