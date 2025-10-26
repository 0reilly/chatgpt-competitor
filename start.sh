#!/bin/bash

echo "🚀 Starting ChatGPT Competitor..."

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env file not found!"
    echo "Please create backend/.env with your DeepSeek API key"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

echo "✅ Dependencies installed successfully!"
echo ""
echo "🎯 Starting servers..."
echo "Backend will run on http://localhost:3001"
echo "Frontend will run on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Start backend server (in background)
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID