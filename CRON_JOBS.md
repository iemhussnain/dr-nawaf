# Cron Jobs Setup

This document explains how to set up automated cron jobs for the Dr. Nawaf Medical Center application.

## Environment Variables

First, add the following environment variable to your `.env` file:

```env
CRON_SECRET=your-secure-random-secret-here
```

Generate a secure random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Available Cron Jobs

### 1. Appointment Reminders (Daily)

Sends email and in-app reminders 24 hours before appointments.

**Endpoint:** `GET /api/cron/send-reminders`

**Recommended Schedule:** Daily at 9:00 AM
- Vercel Cron: `0 9 * * *`
- cron-job.org: Every day at 09:00

**Setup:**

#### Using Vercel Cron (Recommended for Vercel deployments)

1. Create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

2. Add authorization header in the cron job by using Vercel's built-in authentication.

#### Using External Cron Service (cron-job.org, EasyCron, etc.)

1. Register at https://cron-job.org (free)
2. Create new cron job:
   - **URL:** `https://yourdomain.com/api/cron/send-reminders`
   - **Schedule:** `0 9 * * *` (9 AM daily)
   - **Headers:**
     ```
     Authorization: Bearer YOUR_CRON_SECRET
     ```

### 2. Send Newsletter (Weekly)

Sends newsletter emails to all active subscribers.

**Endpoint:** `POST /api/cron/send-newsletter`

**Recommended Schedule:** Weekly on Mondays at 10:00 AM
- Vercel Cron: `0 10 * * 1`
- cron-job.org: Every Monday at 10:00

**Note:** This endpoint requires a POST request with newsletter content:

```json
{
  "subject": "Weekly Health Tips",
  "content": "<h2>This Week's Health Tips</h2><p>Your newsletter content here...</p>"
}
```

**Setup:**

You'll need to create an admin interface or script to trigger newsletters with custom content. Alternatively, you can modify the cron job to fetch content from a database or CMS.

#### Example using curl:

```bash
curl -X POST https://yourdomain.com/api/cron/send-newsletter \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Weekly Health Tips",
    "content": "<h2>Your Newsletter Content</h2>"
  }'
```

### 3. Cleanup Old Notifications (Weekly)

Removes read notifications older than 30 days to keep the database clean.

**Endpoint:** `GET /api/cron/cleanup-notifications`

**Recommended Schedule:** Weekly on Sundays at 2:00 AM
- Vercel Cron: `0 2 * * 0`
- cron-job.org: Every Sunday at 02:00

**Setup:**

#### Using Vercel Cron:

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-notifications",
      "schedule": "0 2 * * 0"
    }
  ]
}
```

## Complete Vercel Cron Configuration

Create or update `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/cleanup-notifications",
      "schedule": "0 2 * * 0"
    }
  ]
}
```

## Email Configuration

Ensure you have configured SMTP settings in your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Gmail Setup:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `SMTP_PASS`

## Testing Cron Jobs Locally

You can test cron jobs locally using curl:

```bash
# Test appointment reminders
curl -H "Authorization: Bearer your-cron-secret" \
  http://localhost:3000/api/cron/send-reminders

# Test cleanup
curl -H "Authorization: Bearer your-cron-secret" \
  http://localhost:3000/api/cron/cleanup-notifications

# Test newsletter (requires POST with content)
curl -X POST http://localhost:3000/api/cron/send-newsletter \
  -H "Authorization: Bearer your-cron-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test Newsletter",
    "content": "<h2>Test Content</h2>"
  }'
```

## Monitoring Cron Jobs

### Check Logs

- **Vercel:** View logs in Vercel Dashboard → Your Project → Functions
- **External Services:** Check the cron job service's execution history

### Recommended Monitoring

1. Set up email notifications for failed cron jobs
2. Monitor API response times
3. Track email delivery rates
4. Monitor database notification cleanup

## Troubleshooting

### Cron job returns 401 Unauthorized

- Verify `CRON_SECRET` environment variable is set correctly
- Check that the Authorization header matches: `Bearer YOUR_CRON_SECRET`

### Emails not sending

- Verify SMTP credentials in `.env`
- Check Gmail App Password is correct
- Ensure 2FA is enabled on Gmail account
- Check spam folder for test emails

### No appointments found for reminders

- Verify appointments are scheduled 24 hours in advance
- Check appointment status is 'scheduled' or 'confirmed'
- Ensure appointment dates are in the future

## Alternative: Using Node Cron (Self-Hosted)

If you're self-hosting, you can use `node-cron` package:

```bash
npm install node-cron
```

Create `src/utils/cron-jobs.js`:

```javascript
const cron = require('node-cron')
const axios = require('axios')

// Run appointment reminders daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    await axios.get('http://localhost:3000/api/cron/send-reminders', {
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`
      }
    })
    console.log('Appointment reminders sent')
  } catch (error) {
    console.error('Error sending reminders:', error)
  }
})

// Run cleanup weekly on Sunday at 2 AM
cron.schedule('0 2 * * 0', async () => {
  try {
    await axios.get('http://localhost:3000/api/cron/cleanup-notifications', {
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`
      }
    })
    console.log('Notifications cleaned up')
  } catch (error) {
    console.error('Error cleaning up:', error)
  }
})
```

Then import and initialize in your server startup file.

## Security Best Practices

1. **Never expose CRON_SECRET** in client-side code
2. **Use HTTPS** for all cron job endpoints
3. **Rotate secrets regularly** (every 90 days)
4. **Monitor failed requests** for potential attacks
5. **Rate limit** cron endpoints to prevent abuse
6. **Log all cron executions** for audit trail

## Production Checklist

- [ ] `CRON_SECRET` environment variable set
- [ ] SMTP credentials configured
- [ ] Vercel cron jobs configured (or external service)
- [ ] Test emails are being received
- [ ] Notification cleanup is working
- [ ] Logs are being monitored
- [ ] Email delivery rate is acceptable (>95%)
- [ ] Failed job alerts are configured
