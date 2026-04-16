@echo off
REM Contact Book - Quick Start Script for Windows
REM This script sets up and runs the Contact Book application

echo.
echo ======================================
echo  Contact Book Application
echo  Quick Start Setup
echo ======================================
echo.

REM Check Node.js installation
echo Checking prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)
echo [OK] Node.js installed

npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed
    exit /b 1
)
echo [OK] npm installed

REM Setup Backend
echo.
echo Setting up Backend...
cd backend

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error: Failed to install backend dependencies
        exit /b 1
    )
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)

REM Create .env if not exists
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env >nul
    echo [OK] .env file created
)

REM Setup Frontend
echo.
echo Setting up Frontend...
cd ..\frontend

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error: Failed to install frontend dependencies
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

REM Create .env if not exists
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env >nul
    echo [OK] .env file created
)

cd ..\

REM Summary
echo.
echo ======================================
echo  Setup Complete!
echo ======================================
echo.

echo To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm start
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm start
echo.
echo Then open your browser to:
echo   http://localhost:3000
echo.
echo For documentation:
echo   - Quick Start: README.md
echo   - Setup Help: docs\SETUP.md
echo   - API Docs: docs\API_DOCUMENTATION.md
echo   - Architecture: docs\ARCHITECTURE.md
echo.
pause
