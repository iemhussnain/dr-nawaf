# 🚀 Vercel Deployment Guide - Dr. Nawaf

## 📋 Table of Contents
- [Quick Deploy](#quick-deploy)
- [Environment Variables Setup](#environment-variables-setup)
- [Email Login Fix](#email-login-fix)
- [Troubleshooting](#troubleshooting)
- [Testing Checklist](#testing-checklist)

---

## ⚡ Quick Deploy

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

### 3. Configure Environment Variables (CRITICAL)
Before deploying, add ALL environment variables listed below.

---

## 🔑 Environment Variables Setup

### Required Variables for Email Login to Work

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

#### 1️⃣ Database Configuration
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dr-nawaf?retryWrites=true&w=majority
```

**MongoDB Atlas Setup:**
- Go to MongoDB Atlas → Network Access
- Click "Add IP Address"
- Select "Allow Access from Anywhere" (0.0.0.0/0)
- This is required for Vercel serverless functions

#### 2️⃣ NextAuth Configuration (CRITICAL FOR LOGIN)
```env
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here

# Replace with your actual Vercel URL
NEXTAUTH_URL=https://your-project.vercel.app
```

**How to generate NEXTAUTH_SECRET:**
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### 3️⃣ Email Configuration (FOR VERIFICATION & PASSWORD RESET)

**For Gmail:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=your-email@gmail.com
```

**How to get Gmail App Password:**
1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and generate
4. Copy the 16-character password (NO spaces)
5. Use this in `EMAIL_PASSWORD` (NOT your regular Gmail password)

**For SendGrid:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=verified-sender@yourdomain.com
```

**For AWS SES:**
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=verified-sender@yourdomain.com
```

#### 4️⃣ Application URLs
```env
# Must match your Vercel deployment URL
APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

#### 5️⃣ Environment
```env
NODE_ENV=production
```

### Optional Variables
```env
# For cron jobs
CRON_SECRET=random-secret-string

# For CORS
ALLOWED_ORIGINS=https://your-project.vercel.app

# For payments (if using Stripe)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🔧 Email Login Fix

### Why Email Login Doesn't Work on Vercel

The login email functionality requires ALL of these to be configured correctly:

1. **NEXTAUTH_SECRET** - Without this, JWT sessions won't be created
2. **NEXTAUTH_URL** - Must match your Vercel URL exactly (including https://)
3. **Email SMTP Settings** - Required to send verification emails
4. **APP_URL** - Used in email links for verification and password reset
5. **MongoDB Connection** - Must allow connections from Vercel IPs

### Step-by-Step Fix

#### Step 1: Check Vercel Environment Variables
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# List environment variables
vercel env ls
```

#### Step 2: Add Missing Variables
```bash
# Add NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET

# Add NEXTAUTH_URL
vercel env add NEXTAUTH_URL

# Add EMAIL_HOST
vercel env add EMAIL_HOST

# Add EMAIL_USER
vercel env add EMAIL_USER

# Add EMAIL_PASSWORD
vercel env add EMAIL_PASSWORD

# Add APP_URL
vercel env add APP_URL
```

**Important:** When prompted, select:
- Environment: Production, Preview, Development (select all)
- Copy value to all environments

#### Step 3: Redeploy
```bash
# Trigger new deployment with updated env vars
vercel --prod
```

Or redeploy from Vercel Dashboard:
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

---

## 🐛 Troubleshooting

### Issue 1: "Email or password is incorrect"

**Symptoms:**
- Can't login with correct credentials
- Error shows immediately after clicking login

**Causes & Solutions:**

1. **NEXTAUTH_SECRET not set**
   ```bash
   # Generate secret
   openssl rand -base64 32

   # Add to Vercel
   vercel env add NEXTAUTH_SECRET
   ```

2. **NEXTAUTH_URL mismatch**
   - Go to Vercel Dashboard → Settings → Domains
   - Copy your exact domain (e.g., `https://dr-nawaf.vercel.app`)
   - Set `NEXTAUTH_URL` to this EXACT value
   - Must include `https://`
   - No trailing slash

3. **Email not verified**
   - User must verify email before login
   - Check if verification email was sent
   - Check MongoDB: `db.users.find({ email: "user@example.com" })`
   - Check `isVerified` field is `true`

### Issue 2: Verification Email Not Sending

**Symptoms:**
- User registers but no email received
- Email stuck in pending

**Causes & Solutions:**

1. **EMAIL_PASSWORD is wrong**
   - For Gmail: Must use App Password (16 characters)
   - NOT your regular Gmail password
   - Generate new: https://myaccount.google.com/apppasswords

2. **EMAIL_PORT and EMAIL_SECURE mismatch**
   ```env
   # For port 587 (STARTTLS)
   EMAIL_PORT=587
   EMAIL_SECURE=false

   # For port 465 (SSL/TLS)
   EMAIL_PORT=465
   EMAIL_SECURE=true
   ```

3. **EMAIL_HOST blocked by provider**
   - Gmail may block first attempts
   - Check Gmail → Security for blocked sign-in attempts
   - Allow less secure apps if needed
   - Better: Use App Password

4. **Check Vercel logs**
   ```bash
   # View real-time logs
   vercel logs --follow
   ```

   Or in Vercel Dashboard:
   - Go to your project
   - Click "Logs" tab
   - Look for email sending errors

### Issue 3: Verification Link Invalid

**Symptoms:**
- User clicks email link
- Shows "Invalid or expired token"

**Causes & Solutions:**

1. **APP_URL points to wrong domain**
   ```env
   # Check these match your deployment
   APP_URL=https://your-actual-vercel-url.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-actual-vercel-url.vercel.app
   ```

2. **Token expired**
   - Verification tokens don't expire
   - Password reset tokens expire in 1 hour
   - User must request new reset email

3. **Database connection issue**
   - Token saved but database unreachable
   - Check MongoDB Atlas IP whitelist
   - Add 0.0.0.0/0 for Vercel

### Issue 4: Session Not Persisting

**Symptoms:**
- Login succeeds but immediately logs out
- Session lost on page refresh

**Causes & Solutions:**

1. **NEXTAUTH_URL wrong**
   ```bash
   # Must match EXACTLY
   echo $NEXTAUTH_URL
   # Should output: https://your-project.vercel.app
   ```

2. **NEXTAUTH_SECRET missing or changed**
   - Check it's set in Vercel
   - Don't change it after deployment
   - Changing it invalidates all sessions

3. **Cookie domain issues**
   - Cookies must match domain
   - Check browser DevTools → Application → Cookies
   - Should see `next-auth.session-token`

### Issue 5: Database Connection Fails

**Symptoms:**
- "Database connection error"
- "MongoServerError: connection refused"

**Causes & Solutions:**

1. **IP not whitelisted**
   - MongoDB Atlas → Network Access
   - Add IP: 0.0.0.0/0 (allows all)
   - Wait 2-3 minutes for changes

2. **Wrong connection string**
   ```env
   # Should look like this:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

   # Common mistakes:
   # ❌ mongodb://localhost:27017/dr-nawaf (local only)
   # ❌ Missing database name
   # ❌ Special characters not URL-encoded
   ```

3. **Password has special characters**
   ```bash
   # URL-encode password
   # Replace these characters:
   # @ → %40
   # : → %3A
   # / → %2F
   # ? → %3F
   # # → %23
   # [ → %5B
   # ] → %5D
   # @ → %40
   ```

### Issue 6: 429 Too Many Requests

**Symptoms:**
- "Too many login attempts"
- Can't login for 15 minutes

**Causes & Solutions:**

1. **Rate limiting triggered**
   - Current limit: 5 failed attempts per 15 minutes
   - Wait 15 minutes
   - Or temporarily disable in `/src/middleware.js`

2. **Multiple users on same IP**
   - Rate limit is per IP
   - In production, consider per-email rate limit

---

## ✅ Testing Checklist

After deployment, test these flows:

### Registration Flow
- [ ] Can access `/register` page
- [ ] Can submit registration form
- [ ] Verification email arrives (check spam folder)
- [ ] Email contains correct verification link
- [ ] Clicking link shows "Email verified successfully"
- [ ] Redirects to `/login` page

### Login Flow
- [ ] Can access `/login` page
- [ ] Unverified email shows error: "Please verify your email"
- [ ] Verified email + correct password logs in
- [ ] Session persists on page refresh
- [ ] Dashboard loads correctly
- [ ] Logout works

### Forgot Password Flow
- [ ] Can access `/forgot-password` page
- [ ] Submit email shows success message
- [ ] Reset email arrives
- [ ] Email contains correct reset link
- [ ] Clicking link loads `/reset-password?token=...`
- [ ] Can set new password
- [ ] Can login with new password
- [ ] Old password no longer works

### Environment Variables Check
```bash
# Run this locally to validate .env file
node -e "
const required = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'APP_URL'
];

const missing = required.filter(key => !process.env[key]);

if (missing.length) {
  console.log('❌ Missing variables:', missing.join(', '));
  process.exit(1);
} else {
  console.log('✅ All required variables set');
}
"
```

---

## 🔍 Debug Email Sending

Add this test endpoint to check email configuration:

Create `/src/app/api/test-email/route.js`:
```javascript
import { sendEmail } from '@/lib/email';

export async function GET(request) {
  try {
    const result = await sendEmail({
      to: 'your-test-email@gmail.com',
      subject: 'Test Email from Vercel',
      text: 'If you receive this, email is working!',
      html: '<h1>Email is working!</h1>',
    });

    return Response.json({
      success: true,
      message: 'Email sent successfully',
      result
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
```

Visit: `https://your-project.vercel.app/api/test-email`

**Delete this file after testing!**

---

## 📊 Monitoring & Logs

### View Logs in Real-time
```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Stream logs
vercel logs --follow
```

### Check Specific Function Logs
```bash
# Login/register related logs
vercel logs --follow | grep -i "auth"

# Email related logs
vercel logs --follow | grep -i "email"

# Database related logs
vercel logs --follow | grep -i "mongo"
```

### Vercel Dashboard Logs
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click "Logs" tab
4. Filter by:
   - Runtime logs (serverless functions)
   - Build logs (deployment)
   - Edge logs (middleware)

---

## 🚨 Common Vercel-Specific Issues

### 1. Serverless Function Timeout
- Default: 10 seconds
- Email sending may timeout on slow SMTP
- Solution: Upgrade Vercel plan or use transactional email service

### 2. Cold Starts
- First request after inactivity is slow
- Database connection may timeout
- Solution: Keep-alive pings or connection pooling

### 3. Environment Variables Not Updating
- Variables cached between deployments
- Solution: Redeploy after changing env vars

### 4. File System Access
- Serverless functions have read-only filesystem
- Can't write files to disk
- Solution: Use external storage (S3, Cloudinary)

---

## 📞 Need Help?

### Check Vercel Logs First
```bash
vercel logs --follow
```

### Check MongoDB Logs
- MongoDB Atlas → Database → Collections
- Check if user was created
- Check if `isVerified` is true

### Check Email Logs
- Gmail: https://myaccount.google.com/security
- SendGrid: https://app.sendgrid.com/statistics
- AWS SES: CloudWatch Logs

### Still Stuck?
1. Check all environment variables are set
2. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
3. Confirm Gmail App Password is correct
4. Check Vercel deployment logs for errors
5. Test locally first: `npm run dev`

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ User can register with email
✅ Verification email arrives within 1 minute
✅ Verification link works and marks email as verified
✅ User can login with verified email
✅ Session persists across page refreshes
✅ User can reset password via email
✅ Reset link works and allows password change
✅ All environment variables are set correctly
✅ No errors in Vercel logs
✅ MongoDB connection stable

---

**Built with ❤️ for Dr. Nawaf Medical Center**
