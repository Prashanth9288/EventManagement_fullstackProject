@echo off
echo Starting installation of razorpay... > install_log.txt
npm install razorpay --verbose >> install_log.txt 2>&1
echo Installation complete. >> install_log.txt
