# Fix: Email Capture Not Working in Production 🔧

## The Problem

Vercel's serverless functions have a **read-only file system**, so the CSV file approach doesn't work in production.

## The Solution: MongoDB Database

I've updated the system to automatically use:
- **MongoDB** in production (when `MONGODB_URI` is set)
- **CSV file** in local development (when `MONGODB_URI` is not set)

## Setup Instructions

### Step 1: Create Free MongoDB Database

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Sign up** for a free account
3. **Create a cluster**:
   - Choose FREE tier (M0)
   - Select a region close to you
   - Click "Create Cluster"

### Step 2: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Replace `<password>`** with your actual database password
5. **Add database name** before the `?`:
   ```
   mongodb+srv://username:yourpassword@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

### Step 3: Add to Vercel Environment Variables

1. Go to your **Vercel Dashboard**
2. Select your **newPortfolio** project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your connection string from Step 2
   - **Environment**: Production (and Preview if you want)

5. Click **Save**

### Step 4: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click the **three dots (...)** on latest deployment
3. Select **"Redeploy"**
4. Wait for deployment to complete

### Step 5: Test

Visit your live site and:
1. Subscribe via the email popup or subscription section
2. You should receive the welcome email
3. Check Vercel logs to confirm: "✅ Email saved to database"

## What Changed

The code now automatically detects the environment:

```typescript
if (process.env.MONGODB_URI) {
  // Production: Save to MongoDB
  await saveEmailToDatabase(email, 'popup');
} else {
  // Local: Save to CSV
  await saveEmailToCSV(email, 'popup');
}
```

## Benefits

✅ **Works in production** (no file system issues)
✅ **Persistent storage** (data survives between deployments)
✅ **No duplicates** (automatic duplicate checking)
✅ **Scalable** (handles thousands of subscribers)
✅ **Free tier available** (MongoDB Atlas free tier)
✅ **Still works locally** (uses CSV when no database configured)

## Accessing Your Subscribers

### From MongoDB Atlas:
1. Go to your cluster
2. Click **"Browse Collections"**
3. Find **portfolio** → **subscribers**
4. View all emails with timestamps and sources

### Via API:
```bash
# Get all subscribers as JSON
curl -X POST https://your-site.vercel.app/api/subscribers
```

## Local Development

No changes needed! The system automatically uses CSV files when developing locally (when `MONGODB_URI` is not set).

Your CSV file will still work at: `data/subscribers.csv`

## Troubleshooting

**Email capture still not working?**

1. Check Vercel logs for errors
2. Verify `MONGODB_URI` is set in Vercel dashboard
3. Make sure MongoDB cluster is running
4. Check connection string format
5. Verify database user has write permissions

**Connection string issues?**

- Make sure password doesn't contain special characters (or URL encode them)
- Database name should be between `/` and `?`
- Example: `mongodb+srv://user:pass@cluster.mongodb.net/portfolio?retryWrites=true`

## Alternative: Use Vercel Postgres

If you prefer SQL, you can also use Vercel Postgres:

1. Go to your Vercel project
2. Click **"Storage"** tab
3. Create a **Postgres** database
4. Vercel will auto-add `POSTGRES_URL` to your env vars
5. Update the code to use Postgres instead of MongoDB

---

**Once setup is complete, your email capture will work perfectly in production!** 🎉
