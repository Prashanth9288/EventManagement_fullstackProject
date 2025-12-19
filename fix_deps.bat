@echo off
echo ==========================================
echo FIXING DEPENDENCIES... PLEASE WAIT
echo ==========================================

echo [1/2] Installing Backend Dependencies (razorpay)...
cd backend
call npm install razorpay
if %errorlevel% neq 0 (
    echo FAILED to install Razorpay. Please check your internet connection.
    pause
    exit /b %errorlevel%
)
echo Backend dependencies fixed.

echo [2/2] Installing Frontend Dependencies (socket.io-client)...
cd ../Frontend
call npm install socket.io-client
if %errorlevel% neq 0 (
    echo FAILED to install socket.io-client.
    pause
    exit /b %errorlevel%
)
echo Frontend dependencies fixed.

echo ==========================================
echo SUCCESS! You can now run "npm run dev"
echo ==========================================
pause
