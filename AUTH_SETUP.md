# 🔐 Authentication System - Setup Complete!

## ✅ What's Been Implemented

### 1. NextAuth Configuration
**File:** `src/app/api/auth/[...nextauth]/route.js`

- ✅ JWT session strategy (30-day expiry)
- ✅ Credentials provider configured
- ✅ Custom session callbacks
- ✅ User role management (admin, doctor, patient)
- ✅ Email verification check
- ✅ Password validation with Argon2
- ✅ Last login tracking
- ✅ Profile data included in session

### 2. Authentication API Routes

#### **Registration** - `POST /api/auth/register`
- Creates new user account
- Auto-creates patient profile
- Sends verification email
- Validates input with Zod

#### **Email Verification** - `POST /api/auth/verify-email`
- Verifies email with token
- Marks user as verified
- Enables login

#### **Forgot Password** - `POST /api/auth/forgot-password`
- Generates reset token
- Sends reset email
- Token expires in 1 hour

#### **Reset Password** - `POST /api/auth/reset-password`
- Validates reset token
- Updates password
- Clears reset token

### 3. Custom React Hook
**File:** `src/hooks/use-auth.js`

Provides easy authentication methods:
- `login(email, password)` - Sign in
- `logout()` - Sign out
- `register(userData)` - Create account
- `verifyEmail(token)` - Verify email
- `forgotPassword(email)` - Request reset
- `resetPassword(token, password)` - Reset password
- `user` - Current user object
- `isAuthenticated` - Auth status
- `isLoading` - Loading state

### 4. Session Provider
**File:** `src/components/auth-provider.jsx`
- Wraps app with NextAuth SessionProvider
- Already added to root layout

---

## 🚀 How to Use

### Client-Side Usage

```jsx
"use client"

import { useAuth } from '@/hooks/use-auth'

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user.profile?.firstName}!</p>
        <p>Role: {user.role}</p>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }

  return <LoginForm />
}
```

### Server-Side Usage

```jsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <div>Protected content for {session.user.email}</div>
}
```

### API Route Protection

```javascript
import { requireAuth } from '@/middleware/auth'

export async function GET(req) {
  const { session, error } = await requireAuth(req)

  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  // Protected endpoint logic
  return NextResponse.json({ data: 'Protected data' })
}
```

---

## 📝 Session Object Structure

```javascript
{
  user: {
    id: "user_id",
    email: "user@example.com",
    role: "patient" | "doctor" | "admin",
    isVerified: true,
    profile: {
      id: "profile_id",
      firstName: "John",
      lastName: "Doe"
    }
  },
  expires: "2025-01-15T00:00:00.000Z"
}
```

---

## 🔑 API Endpoints

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}

Response:
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account."
}
```

### Login
```bash
POST /api/auth/signin/credentials
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "SecurePass123"
}
```

### Verify Email
```bash
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_here"
}

Response:
{
  "success": true,
  "message": "Email verified successfully! You can now login."
}
```

### Forgot Password
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "patient@example.com"
}

Response:
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

### Reset Password
```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "NewSecurePass123"
}

Response:
{
  "success": true,
  "message": "Password reset successful! You can now login with your new password."
}
```

---

## 🔒 Security Features

1. **Password Security**
   - Argon2 hashing (most secure algorithm)
   - Minimum 8 characters
   - Password never returned in API responses

2. **Email Verification**
   - Users must verify email before login
   - Unique verification tokens
   - Prevents fake accounts

3. **Session Management**
   - JWT tokens (stateless)
   - 30-day expiry
   - Secure httpOnly cookies

4. **Password Reset**
   - Secure token generation (crypto.randomBytes)
   - 1-hour expiry
   - One-time use tokens

5. **Input Validation**
   - Zod schema validation
   - Email format validation
   - Password strength requirements

---

## 🧪 Testing the Authentication

### 1. Test Registration Flow

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "firstName": "Test",
    "lastName": "User",
    "phone": "1234567890"
  }'

# Check MongoDB for new user
# Check email for verification link
```

### 2. Test Email Verification

```bash
# Verify email (use token from email or database)
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "your_verification_token"}'
```

### 3. Test Login

```javascript
// In your React component
const { login } = useAuth()

const handleLogin = async () => {
  const result = await login('test@example.com', 'Test123456')

  if (result.success) {
    console.log('Login successful!')
  } else {
    console.error(result.error)
  }
}
```

### 4. Test Password Reset

```bash
# Request password reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Reset password (use token from email)
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_here",
    "password": "NewPassword123"
  }'
```

---

## 🛡️ Role-Based Access Control

### Middleware Functions Available:

```javascript
import { requireAuth, requireRole, requireAdmin, requireDoctor, requirePatient } from '@/middleware/auth'

// Any authenticated user
const { session, error } = await requireAuth(req)

// Admin only
const { session, error } = await requireAdmin(req)

// Doctor or Admin
const { session, error } = await requireDoctor(req)

// Patient or Admin
const { session, error } = await requirePatient(req)

// Custom roles
const { session, error } = await requireRole(req, ['admin', 'doctor'])
```

---

## 📧 Email Configuration Required

Before testing, configure email in `.env.local`:

```bash
# Gmail Example
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Dr. Nawaf Clinic <noreply@drnawaf.com>
```

**Note:** For Gmail, create an App Password:
1. Enable 2FA on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Use that password in EMAIL_PASSWORD

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid email or password"
- Check user exists in database
- Verify email is verified (`isVerified: true`)
- Check password is correct

### Issue: "Please verify your email"
- User hasn't clicked verification link
- Check email spam folder
- Manually set `isVerified: true` in database for testing

### Issue: Email not sending
- Check EMAIL_* environment variables
- Check SMTP credentials
- Test with a real email service (Gmail, SendGrid, etc.)

### Issue: Session not persisting
- Check NEXTAUTH_SECRET is set
- Clear browser cookies
- Check NEXTAUTH_URL matches your domain

---

## 🎯 Next Steps

Now that authentication is set up, you can:

1. **Create Login Page** - `src/app/(auth)/login/page.js`
2. **Create Register Page** - `src/app/(auth)/register/page.js`
3. **Create Protected Admin Routes** - Use `requireAdmin` middleware
4. **Build User Dashboard** - Patient/Doctor specific pages
5. **Add OAuth Providers** (optional) - Google, Facebook login

---

## 📚 Related Files

- `src/models/User.js` - User model with password hashing
- `src/models/Patient.js` - Patient profile model
- `src/models/Doctor.js` - Doctor profile model
- `src/lib/email.js` - Email templates and sending
- `src/lib/validations.js` - Zod schemas
- `src/middleware/auth.js` - Auth helper functions

---

**Authentication system is fully functional and ready to use!** 🎉
