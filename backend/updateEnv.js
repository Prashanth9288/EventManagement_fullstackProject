const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const newKeyId = 'rzp_test_RsDMX3R6Pzv1Wp';
const newKeySecret = 'L9sjAMttJsn4jya2y2hNMvVg';

try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace or Append RAZORPAY_KEY_ID
    if (envContent.includes('RAZORPAY_KEY_ID=')) {
        envContent = envContent.replace(/RAZORPAY_KEY_ID=.*/g, `RAZORPAY_KEY_ID=${newKeyId}`);
    } else {
        envContent += `\nRAZORPAY_KEY_ID=${newKeyId}`;
    }

    // Replace or Append RAZORPAY_KEY_SECRET
    if (envContent.includes('RAZORPAY_KEY_SECRET=')) {
        envContent = envContent.replace(/RAZORPAY_KEY_SECRET=.*/g, `RAZORPAY_KEY_SECRET=${newKeySecret}`);
    } else {
        envContent += `\nRAZORPAY_KEY_SECRET=${newKeySecret}`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('Successfully updated .env');
} catch (err) {
    console.error('Error updating .env:', err);
}
