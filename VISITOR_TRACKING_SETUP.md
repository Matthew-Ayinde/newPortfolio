# Visitor Alert System - Setup Guide

## 📋 Overview

This system tracks visitors to your portfolio and sends real-time alerts with detailed information including:
- IP Address
- City, Region, Country
- Device Type
- Browser & OS
- Page Visited
- Timestamp
- Email (if available)

## 🚀 Quick Start

### 1. Install Dependencies
Already done! The following packages are installed:
- `ua-parser-js` - Parse user agent for device/browser info
- `axios` - HTTP requests for geolocation API
- `nodemailer` - Send email notifications

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your credentials.

### 3. Choose Your Notification Method

You can enable one or multiple notification channels:

#### Option A: Email Notifications (Recommended for beginners)

**Using Gmail:**
1. Enable 2-Factor Authentication in your Google Account
2. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated 16-character password

3. Update `.env.local`:
```env
ENABLE_EMAIL_ALERTS=true
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
ALERT_EMAIL=your-email@gmail.com
```

#### Option B: Telegram Notifications (Free & Instant)

1. Create a Telegram bot:
   - Open Telegram and message [@BotFather](https://t.me/botfather)
   - Send command: `/newbot`
   - Follow instructions
   - Copy the bot token

2. Get your Chat ID:
   - Start a chat with your bot
   - Send any message
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Look for `"chat":{"id": YOUR_CHAT_ID}`

3. Update `.env.local`:
```env
ENABLE_TELEGRAM_ALERTS=true
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

#### Option C: Discord Webhook (For Discord users)

1. In your Discord server:
   - Go to Server Settings → Integrations → Webhooks
   - Click "New Webhook"
   - Customize name and channel
   - Copy Webhook URL

2. Update `.env.local`:
```env
ENABLE_DISCORD_ALERTS=true
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-url
```

#### Option D: Slack Webhook (For teams)

1. Create Slack App:
   - Go to https://api.slack.com/apps
   - Click "Create New App" → "From scratch"
   - Name your app and select workspace

2. Enable Incoming Webhooks:
   - In app settings, go to "Incoming Webhooks"
   - Toggle "Activate Incoming Webhooks" to On
   - Click "Add New Webhook to Workspace"
   - Select channel and authorize
   - Copy Webhook URL

3. Update `.env.local`:
```env
ENABLE_SLACK_ALERTS=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

## 🧪 Testing

1. Start your development server:
```bash
npm run dev
```

2. Open your portfolio in a browser: `http://localhost:3000`

3. Check your configured notification channel for an alert!

## 📊 What Gets Tracked

The system automatically collects:

| Data | Description |
|------|-------------|
| **IP Address** | Visitor's public IP |
| **City** | City from IP geolocation |
| **Region** | State/Province |
| **Country** | Country name |
| **Device** | Device type (Desktop, Mobile, Tablet) |
| **Browser** | Browser name & version |
| **OS** | Operating system & version |
| **Page** | URL visited |
| **Timestamp** | ISO 8601 timestamp |
| **Email** | *(Optional)* If stored from contact form |

## 🔒 Privacy & GDPR Compliance

⚠️ **Important:** Collecting visitor data may require:
- Privacy Policy disclosure
- Cookie consent banner
- GDPR compliance (for EU visitors)
- Terms of Service update

Consider adding a privacy notice to your site.

## 🎯 Advanced Features

### Track Email from Contact Form

If you have a contact form, you can capture emails:

```typescript
// In your contact form submit handler:
const handleSubmit = async (email: string) => {
  // Store email in localStorage
  localStorage.setItem('userEmail', email);
  
  // Your existing form logic...
};
```

The tracker will automatically pick it up on next visit.

### Limit Tracking Frequency

The current implementation tracks once per session. To change this behavior, edit `app/components/VisitorTracker.tsx`.

### Add Database Storage

To store visitor data long-term:

1. Install database client:
```bash
npm install mongoose  # for MongoDB
# or
npm install pg  # for PostgreSQL
```

2. Uncomment and implement the database logic in `app/api/track-visitor/route.ts`

### Custom Geolocation Service

The default uses `ipapi.co` (1000 free requests/day). Alternatives:

- **ip-api.com** - 45 requests/minute free
- **ipinfo.io** - 50k requests/month free
- **ipgeolocation.io** - 1000 requests/day free

Change the URL in `app/api/track-visitor/route.ts`:
```typescript
const response = await axios.get(`https://ip-api.com/json/${ip}`);
```

## 🔧 Troubleshooting

### Notifications not sending

1. Check `.env.local` is in the correct location (project root)
2. Verify environment variables are set correctly
3. Restart dev server after changing `.env.local`
4. Check browser console and terminal for errors

### Geolocation not working

- IP `127.0.0.1` (localhost) won't return location data
- Deploy to production to get real visitor IPs
- Use services like ngrok for local testing with real IPs

### Getting spammed with alerts

- The tracker uses `useRef` to prevent duplicate calls
- Consider adding rate limiting in the API route
- Use session storage instead of localStorage

## 📈 Production Deployment

When deploying to Vercel/Netlify:

1. Add environment variables in hosting dashboard
2. Don't commit `.env.local` to git
3. Monitor API usage limits for geolocation service
4. Consider adding rate limiting for API route

## 💡 Tips

- **Start Simple:** Enable just one notification method first
- **Test Locally:** Use ngrok or similar to test with real IPs
- **Monitor Costs:** Most services have free tiers, but watch limits
- **Add Analytics:** Consider Google Analytics alongside this system
- **Respect Privacy:** Always inform users about tracking

## 📝 Example Alert

```
🚨 NEW VISITOR ALERT 🚨

📍 Location:
  • City: Lagos
  • Region: Lagos
  • Country: Nigeria

🌐 IP Address: 197.210.x.x

💻 Device Info:
  • Device: Apple iPhone
  • Browser: Safari 17.2
  • OS: iOS 17.2

📄 Page: https://yourportfolio.com/
⏰ Timestamp: 2025-11-15T14:30:00.000Z
```

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments in the implementation files
3. Consult the documentation for third-party services

---

**Happy tracking! 🎉**
