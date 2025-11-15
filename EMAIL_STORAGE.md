# Email Subscriber Storage System 📧

## Overview

All emails collected from your portfolio (popup subscriptions and contact form) are automatically saved to a CSV file with **NO DUPLICATES**.

## Location

**File**: `data/subscribers.csv`

The file is created automatically when the first email is captured.

## CSV Format

```csv
Email,Timestamp,Source
john@example.com,2025-11-15T10:30:00.000Z,popup
jane@example.com,2025-11-15T11:45:00.000Z,contact
```

### Columns:
- **Email**: The subscriber's email address
- **Timestamp**: When they subscribed (ISO 8601 format)
- **Source**: How they subscribed (`popup` or `contact`)

## Features

✅ **Automatic duplicate detection** - Same email won't be added twice
✅ **Source tracking** - Know if they subscribed via popup or contact form
✅ **Timestamped** - Know exactly when they subscribed
✅ **Not committed to Git** - Added to `.gitignore` for privacy

## How It Works

1. **User subscribes via popup** → Email saved with source: `popup`
2. **User submits contact form** → Email saved with source: `contact`
3. **Duplicate check** → If email exists, it's skipped (but they still get welcome/confirmation email)
4. **CSV updated** → New row appended to file

## Accessing Your Subscribers

### Method 1: Direct File Access (Local)
Navigate to: `data/subscribers.csv` in your project folder

### Method 2: Download via API (Production)
Visit: `https://your-site.vercel.app/api/subscribers`

This will download the CSV file directly.

### Method 3: View Stats via API
Send POST request to: `/api/subscribers`

Returns JSON:
```json
{
  "total": 25,
  "emails": [
    {
      "email": "john@example.com",
      "timestamp": "2025-11-15T10:30:00.000Z",
      "source": "popup"
    }
  ]
}
```

## Production Deployment

⚠️ **Important**: On Vercel, the file system is read-only during runtime, so the CSV won't persist between deployments.

### For Production, Consider:
1. **Database** - Store in MongoDB, PostgreSQL, etc.
2. **Cloud Storage** - AWS S3, Google Cloud Storage
3. **Email Service** - Mailchimp, SendGrid, ConvertKit

For now, the CSV works perfectly for **local development and testing**.

## Example Usage

```typescript
// Import the storage functions
import { saveEmailToCSV, getAllEmails, getExistingEmails } from '@/lib/emailStorage';

// Save an email
await saveEmailToCSV('user@example.com', 'popup');

// Get all emails
const emails = await getAllEmails();

// Check if email exists
const existing = await getExistingEmails();
const isDuplicate = existing.includes('user@example.com');
```

## Privacy & GDPR

⚠️ **Important Considerations**:
- Inform users you're storing their email (Privacy Policy)
- Provide unsubscribe mechanism
- Secure the file (not publicly accessible)
- Consider encryption for sensitive data

## Testing

1. **Start dev server**: `npm run dev`
2. **Subscribe via popup** after 10 seconds
3. **Check**: `data/subscribers.csv` should be created
4. **Submit contact form** with same email
5. **Verify**: No duplicate in CSV

## Download Subscribers

Visit in browser:
```
http://localhost:3000/api/subscribers
```

Browser will download `subscribers.csv` automatically!

---

**Note**: The `data/` folder is in `.gitignore` to protect subscriber privacy. Never commit it to GitHub!
