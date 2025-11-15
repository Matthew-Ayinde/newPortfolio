// Test email configuration
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    console.log('Testing email configuration...');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Alert Email:', process.env.ALERT_EMAIL);
    
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const testMessage = `
🧪 TEST EMAIL - Portfolio Visitor Alert System

This is a test email to verify your notification system is working correctly.

✅ If you received this, your email configuration is correct!

📋 Configuration Details:
  • Email Service: ${process.env.EMAIL_SERVICE || 'gmail'}
  • Sender: ${process.env.EMAIL_USER}
  • Recipient: ${process.env.ALERT_EMAIL}
  • Timestamp: ${new Date().toISOString()}

Next step: Visit your portfolio in dev mode to test the full tracking system!
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ALERT_EMAIL,
      subject: '🧪 Test - Portfolio Visitor Alert System',
      text: testMessage,
    });

    console.log('✅ Test email sent successfully!');
    console.log('Check your inbox at:', process.env.ALERT_EMAIL);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('\nCommon issues:');
    console.error('1. Check EMAIL_PASSWORD is your app-specific password (not regular password)');
    console.error('2. Verify 2FA is enabled on your Google account');
    console.error('3. Make sure .env.local has correct email settings');
  }
}

testEmail();
