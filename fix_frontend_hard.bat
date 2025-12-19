@echo off
echo ===========================================
echo HARD RESET OF FRONTEND DEPENDENCIES
echo ===========================================
cd Frontend
echo Deleting node_modules (this may take a while)...
rmdir /s /q node_modules
echo Deleting package-lock.json...
echo Deleting helper files...
del package-lock.json
del .npmrc
echo Cleaning npm cache (force)...
call npm cache clean --force
echo Setting registry to default...
call npm config set registry https://registry.npmjs.org/
echo Installing ALL dependencies (Verbose)...
call npm install --verbose
if %errorlevel% neq 0 (
    echo INSTALL FAILED! Check your internet or npm permissions.
    pause
    exit /b %errorlevel%
)
echo INSTALL SUCCESSFUL.
echo You can now run "npm run dev".
pause
