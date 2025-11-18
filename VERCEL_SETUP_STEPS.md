# 🚀 Vercel Setup Steps - Dr. Nawaf (Urdu/English)

## 📌 Quick Fix for Login Email Issue

### Step 1: Vercel Dashboard mein Environment Variables Set karein
### Step 1: Set Environment Variables in Vercel Dashboard

**IMPORTANT:** Ye variables Vercel dashboard mein manually set karne honge. Terminal se nahi ho sakta!
**IMPORTANT:** You MUST set these variables in Vercel dashboard manually. Cannot be done from terminal!

### 🔗 Vercel Dashboard Link
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click: **Settings** → **Environment Variables**
4. Add each variable below

---

## ✅ Required Environment Variables for Vercel

### Copy-Paste these EXACT values in Vercel:

#### 1. Database Connection
```
Name: MONGODB_URI
Value: mongodb+srv://iemhussnain_db_user:PQovqr3gsIPBzeAr@nawaf-dev.qldd56x.mongodb.net/?appName=nawaf-dev
Environment: Production, Preview, Development (select all 3)
```

#### 2. NextAuth URL (CRITICAL - Fix Required!)
```
Name: NEXTAUTH_URL
Value: https://www.drnawaftariq.com
Environment: Production, Preview, Development (select all 3)
```
⚠️ **Currently you have:** `http://localhost:3000` (WRONG for production!)
✅ **Must change to:** `https://www.drnawaftariq.com` (your domain)

#### 3. NextAuth Secret
```
Name: NEXTAUTH_SECRET
Value: kgPO+SpQer0Ld68dYlFeUAyTO7PIYTkG12s8t3mSzmI=
Environment: Production, Preview, Development (select all 3)
```

#### 4. Email Configuration
```
Name: EMAIL_HOST
Value: smtp.gmail.com
Environment: Production, Preview, Development (select all 3)

Name: EMAIL_PORT
Value: 587
Environment: Production, Preview, Development (select all 3)

Name: EMAIL_SECURE
Value: false
Environment: Production, Preview, Development (select all 3)

Name: EMAIL_USER
Value: hussnain@digi-invoice.online
Environment: Production, Preview, Development (select all 3)

Name: EMAIL_PASSWORD
Value: grtzjtqjzhtqllbl
Environment: Production, Preview, Development (select all 3)

Name: EMAIL_FROM
Value: Dr. Nawaf Clinic <hussnain@digi-invoice.online>
Environment: Production, Preview, Development (select all 3)
```

#### 5. App URLs (CRITICAL - Fix Required!)
```
Name: APP_URL
Value: https://www.drnawaftariq.com
Environment: Production, Preview, Development (select all 3)

Name: NEXT_PUBLIC_APP_URL
Value: https://www.drnawaftariq.com
Environment: Production, Preview, Development (select all 3)
```
⚠️ **Currently you have:** `http://localhost:3000` (WRONG!)
✅ **Must change to:** `https://www.drnawaftariq.com`

#### 6. Node Environment
```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development (select all 3)
```

---

## 📋 Step-by-Step Instructions (Urdu/English)

### Step 1: MongoDB Atlas IP Whitelist Check
**English:** Check if Vercel IPs are whitelisted
**Urdu:** Check karein ke Vercel IPs whitelist mein hain

1. Go to: https://cloud.mongodb.com/
2. Select your cluster: **nawaf-dev**
3. Click: **Network Access** (left sidebar)
4. Check if you see: `0.0.0.0/0` (Allow from anywhere)
5. If NOT present:
   - Click **"+ ADD IP ADDRESS"**
   - Click **"ALLOW ACCESS FROM ANYWHERE"**
   - Confirm: `0.0.0.0/0`
   - Click **"Confirm"**
   - Wait 2-3 minutes for changes to apply

### Step 2: Set Environment Variables in Vercel
**English:** Add all variables listed above
**Urdu:** Upar diye gaye saare variables add karein

1. Go to: https://vercel.com/dashboard
2. Select your project (drnawaftariq)
3. Click: **Settings** (top menu)
4. Click: **Environment Variables** (left sidebar)
5. For EACH variable above:
   - Click **"Add New"**
   - Type: Variable **Name** (e.g., `MONGODB_URI`)
   - Type: Variable **Value** (e.g., `mongodb+srv://...`)
   - Select: **Production, Preview, Development** (all 3 checkboxes)
   - Click: **"Save"**
6. Repeat for ALL 12 variables

### Step 3: Redeploy Application
**English:** Trigger new deployment with updated variables
**Urdu:** Updated variables ke saath nayi deployment karein

**Option A: From Vercel Dashboard (Easiest)**
1. Go to: **Deployments** tab
2. Find latest deployment (top one)
3. Click **"..." (3 dots)** on right side
4. Click: **"Redeploy"**
5. Keep: **"Use existing Build Cache"** UNCHECKED
6. Click: **"Redeploy"**
7. Wait 2-3 minutes for deployment

**Option B: From Terminal (Advanced)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy
vercel --prod
```

### Step 4: Test Email Login Flow
**English:** Test complete authentication flow
**Urdu:** Pura authentication flow test karein

1. **Register New User:**
   - Go to: https://www.drnawaftariq.com/register
   - Enter: First Name, Last Name, Email, Phone, Password
   - Click: **"Sign Up"**
   - Check if success message appears

2. **Check Verification Email:**
   - Open your email inbox
   - Look for email from: `Dr. Nawaf Clinic <hussnain@digi-invoice.online>`
   - Subject: "Verify Your Email - Dr. Nawaf Clinic"
   - If NOT received:
     - Check **Spam/Junk** folder
     - Wait 2-3 minutes
     - Check Vercel logs (next section)

3. **Click Verification Link:**
   - Open verification email
   - Click: **"Verify Email"** button
   - Should redirect to: `https://www.drnawaftariq.com/verify-email?token=...`
   - Should see: **"Email verified successfully"**
   - Should auto-redirect to login after 3 seconds

4. **Login:**
   - Go to: https://www.drnawaftariq.com/login
   - Enter: Email and Password
   - Click: **"Sign In"**
   - Should redirect to dashboard based on role

5. **Test Password Reset:**
   - Go to: https://www.drnawaftariq.com/forgot-password
   - Enter: Your email
   - Click: **"Send Reset Link"**
   - Check email for reset link
   - Click link and set new password
   - Login with new password

---

## 🐛 Troubleshooting (Agar koi issue ho)

### Issue 1: Email Nahi Aa Rahi / Email Not Arriving

**Check 1: Vercel Logs**
```bash
# Install CLI
npm i -g vercel

# View logs
vercel logs --follow
```

Or from Dashboard:
- Go to: https://vercel.com/dashboard
- Select your project
- Click: **"Logs"** tab
- Look for errors with "email" keyword

**Check 2: Gmail Settings**
- Go to: https://myaccount.google.com/security
- Check: "Less secure app access" is ON
- Or better: Use App Password
  - https://myaccount.google.com/apppasswords
  - Create new app password
  - Replace `EMAIL_PASSWORD` in Vercel

**Check 3: Email Variables**
- Go back to Vercel → Settings → Environment Variables
- Verify ALL email variables are set correctly:
  - `EMAIL_HOST` = smtp.gmail.com
  - `EMAIL_PORT` = 587
  - `EMAIL_SECURE` = false
  - `EMAIL_USER` = hussnain@digi-invoice.online
  - `EMAIL_PASSWORD` = grtzjtqjzhtqllbl
  - `EMAIL_FROM` = Dr. Nawaf Clinic <hussnain@digi-invoice.online>

### Issue 2: Login Nahi Ho Raha / Cannot Login

**Check 1: Email Verified?**
- Check database: MongoDB Atlas
- Collection: `users`
- Find your email
- Check field: `isVerified` should be `true`
- If `false`: User must verify email first

**Check 2: NEXTAUTH_URL Correct?**
- Must be: `https://www.drnawaftariq.com`
- NOT: `http://localhost:3000`
- Redeploy after changing

**Check 3: NEXTAUTH_SECRET Set?**
- Check in Vercel environment variables
- Should be: `kgPO+SpQer0Ld68dYlFeUAyTO7PIYTkG12s8t3mSzmI=`

### Issue 3: Verification Link Not Working

**Symptom:** "Invalid or expired token"

**Solution:**
- Check `APP_URL` in Vercel = `https://www.drnawaftariq.com`
- Check `NEXT_PUBLIC_APP_URL` in Vercel = `https://www.drnawaftariq.com`
- Both must match your domain EXACTLY
- Redeploy after changing

### Issue 4: Database Connection Failed

**Solution:**
- MongoDB Atlas → Network Access
- Add IP: `0.0.0.0/0` (allow all)
- Wait 2-3 minutes
- Redeploy

---

## ✅ Success Checklist

After following all steps, you should be able to:

- [ ] Register new user at /register
- [ ] Receive verification email within 1 minute
- [ ] Verification email has correct link with your domain
- [ ] Click link and see "Email verified successfully"
- [ ] Login at /login with verified email
- [ ] Session persists on page refresh
- [ ] Can access dashboard based on role
- [ ] Can request password reset
- [ ] Receive password reset email
- [ ] Can reset password and login with new password

---

## 📞 Need Help?

**Check Logs:**
```bash
vercel logs --follow
```

**Check Database:**
- MongoDB Atlas: https://cloud.mongodb.com/
- Collection: `users`
- Check: `isVerified` field

**Check Environment Variables:**
- Vercel Dashboard → Settings → Environment Variables
- Verify all 12 variables are set

**Common Mistakes:**
1. ❌ `NEXTAUTH_URL` = `http://localhost:3000` (WRONG!)
   ✅ Should be: `https://www.drnawaftariq.com`

2. ❌ `APP_URL` = `http://localhost:3000` (WRONG!)
   ✅ Should be: `https://www.drnawaftariq.com`

3. ❌ Forgot to select all 3 environments when adding variables
   ✅ Must select: Production, Preview, Development

4. ❌ Didn't redeploy after adding variables
   ✅ Must redeploy for changes to take effect

5. ❌ MongoDB IP not whitelisted
   ✅ Add `0.0.0.0/0` in Network Access

---

## 🎯 Summary (Quick Reference)

**What was the problem?**
- Email login not working on Vercel because:
  1. `NEXTAUTH_URL` was set to localhost instead of production domain
  2. `APP_URL` was localhost, so verification links pointed to wrong URL
  3. Inconsistent email configuration (fixed in code)

**What did we fix?**
1. Created `.env.example` with all required variables
2. Created complete Vercel deployment guide
3. Fixed dual email configuration in code (consolidated to `EMAIL_*` variables)
4. Created this step-by-step setup guide

**What you need to do:**
1. Set environment variables in Vercel Dashboard (12 variables)
2. Change `NEXTAUTH_URL` from localhost to `https://www.drnawaftariq.com`
3. Change `APP_URL` from localhost to `https://www.drnawaftariq.com`
4. Add `NEXT_PUBLIC_APP_URL` = `https://www.drnawaftariq.com`
5. Whitelist `0.0.0.0/0` in MongoDB Atlas
6. Redeploy from Vercel Dashboard
7. Test complete registration → verification → login flow

---

**Last Updated:** November 18, 2024
**Author:** Claude Code Assistant
**Project:** Dr. Nawaf Medical Center
