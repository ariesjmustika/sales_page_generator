@echo off
echo ==========================================
echo    MARKETAI - QUICK SETUP SCRIPT 🚀
echo ==========================================

echo [1/4] Installing Composer dependencies...
call composer install

echo [2/4] Installing NPM dependencies...
call npm install

echo [3/4] Running Database Migrations & Seeding...
php artisan migrate:fresh --seed

echo [4/4] Building Assets...
call npm run build

echo ==========================================
echo    SETUP COMPLETE! 🎉
echo    Run 'php artisan serve' to start.
echo    Demo User: demo@marketai.com / demo123456
echo ==========================================
pause
