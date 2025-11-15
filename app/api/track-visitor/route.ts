import { NextRequest, NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';
import axios from 'axios';

interface VisitorData {
  ip: string;
  city?: string;
  country?: string;
  region?: string;
  device: string;
  browser: string;
  os: string;
  page: string;
  timestamp: string;
  email?: string;
}

// Get visitor's IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  return 'Unknown';
}

// Get geolocation data from IP
async function getGeolocation(ip: string) {
  try {
    // Using ipapi.co (free tier: 1000 requests/day)
    // Alternative free services: ip-api.com, ipinfo.io
    const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
      timeout: 5000,
    });
    
    return {
      city: response.data.city || 'Unknown',
      country: response.data.country_name || 'Unknown',
      region: response.data.region || 'Unknown',
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    return {
      city: 'Unknown',
      country: 'Unknown',
      region: 'Unknown',
    };
  }
}

// Send notification (you can customize this)
async function sendNotification(visitorData: VisitorData) {
  const message = `
🚨 NEW VISITOR ALERT 🚨

📍 Location:
  • City: ${visitorData.city}
  • Region: ${visitorData.region}
  • Country: ${visitorData.country}

🌐 IP Address: ${visitorData.ip}

💻 Device Info:
  • Device: ${visitorData.device}
  • Browser: ${visitorData.browser}
  • OS: ${visitorData.os}

📄 Page: ${visitorData.page}
⏰ Timestamp: ${visitorData.timestamp}
${visitorData.email ? `📧 Email: ${visitorData.email}` : ''}
  `;

  // Send to your preferred notification service
  // Example: Email, Telegram, Discord, Slack, etc.
  
  // EMAIL NOTIFICATION (using nodemailer)
  console.log('🔍 Checking email alerts...');
  console.log('ENABLE_EMAIL_ALERTS:', process.env.ENABLE_EMAIL_ALERTS);
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set ✓' : 'Missing ✗');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set ✓' : 'Missing ✗');
  console.log('ALERT_EMAIL:', process.env.ALERT_EMAIL);
  
  if (process.env.ENABLE_EMAIL_ALERTS === 'true') {
    console.log('📧 Attempting to send email...');
    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const result = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ALERT_EMAIL,
        subject: '🚨 New Visitor Alert - Portfolio',
        text: message,
      });
      
      console.log('✅ Email sent successfully!', result.messageId);
    } catch (error) {
      console.error('❌ Email notification error:', error);
    }
  } else {
    console.log('⚠️ Email alerts disabled or env var not "true"');
  }

  // TELEGRAM NOTIFICATION
  if (process.env.ENABLE_TELEGRAM_ALERTS === 'true') {
    try {
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }
      );
    } catch (error) {
      console.error('Telegram notification error:', error);
    }
  }

  // DISCORD WEBHOOK
  if (process.env.ENABLE_DISCORD_ALERTS === 'true') {
    try {
      await axios.post(process.env.DISCORD_WEBHOOK_URL!, {
        content: message,
      });
    } catch (error) {
      console.error('Discord notification error:', error);
    }
  }

  // SLACK WEBHOOK
  if (process.env.ENABLE_SLACK_ALERTS === 'true') {
    try {
      await axios.post(process.env.SLACK_WEBHOOK_URL!, {
        text: message,
      });
    } catch (error) {
      console.error('Slack notification error:', error);
    }
  }

  console.log('Visitor tracked:', visitorData);
}

export async function POST(request: NextRequest) {
  try {
    console.log('📍 Track visitor API called');
    console.log('Email alerts enabled:', process.env.ENABLE_EMAIL_ALERTS);
    
    const body = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    
    // Parse user agent
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    // Get IP address
    const ip = getClientIP(request);
    
    // Get geolocation
    const geoData = await getGeolocation(ip);
    
    // Construct visitor data
    const visitorData: VisitorData = {
      ip,
      city: geoData.city,
      country: geoData.country,
      region: geoData.region,
      device: `${result.device.vendor || 'Unknown'} ${result.device.model || result.device.type || 'Desktop'}`,
      browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`,
      os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`,
      page: body.page || '/',
      timestamp: new Date().toISOString(),
      email: body.email || undefined,
    };
    
    // Send notification (async, don't wait)
    sendNotification(visitorData).catch(err => 
      console.error('Notification failed:', err)
    );
    
    // Optional: Save to database here
    // await saveToDatabase(visitorData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Visitor tracked successfully' 
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}
