# 🏥 Dr. Nawaf - Medical Practice Management System

## 📋 Project Overview

A comprehensive, full-stack medical practice management platform built with Next.js 16, featuring patient management, appointment booking, e-commerce, and multi-doctor support.

---

## 🛠️ Tech Stack (Based on Current package.json)

### Frontend
- **Framework:** Next.js 16.0.3 (App Router)
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS v4
- **Component Library:** shadcn/ui + Radix UI
- **Animations:** Framer Motion, GSAP
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand
- **Theme:** next-themes (dark/light mode)

### Backend & Database
- **Database:** MongoDB + Mongoose
- **Authentication:** NextAuth.js
- **Session Management:** express-session
- **File Upload:** Formidable
- **Email:** Nodemailer
- **Password Hashing:** Argon2

### Security
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting:** rate-limiter-flexible
- **Sanitization:** express-mongo-sanitize
- **HPP** - HTTP Parameter Pollution protection

### Data & Analytics
- **Tables:** AG Grid, TanStack Table
- **Charts:** Recharts
- **Data Fetching:** TanStack Query (React Query), Axios
- **Date Handling:** dayjs

### Additional Features
- **PDF Generation:** @react-pdf/renderer
- **Excel Export:** exceljs, xlsx
- **Notifications:** react-hot-toast, Sonner
- **Logging:** Winston, Pino
- **Browser Automation:** Puppeteer (for reports)

---

## 📁 Project Structure

\`\`\`
dr-nawaf/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── verify-email/
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   ├── doctors/
│   │   │   ├── patients/
│   │   │   ├── appointments/
│   │   │   ├── services/
│   │   │   ├── blog/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── settings/
│   │   │   └── analytics/
│   │   ├── (patient)/
│   │   │   ├── my-appointments/
│   │   │   ├── my-prescriptions/
│   │   │   ├── my-orders/
│   │   │   ├── profile/
│   │   │   └── medical-records/
│   │   ├── (public)/
│   │   │   ├── doctors/
│   │   │   ├── services/
│   │   │   ├── blog/
│   │   │   ├── shop/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── faq/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── doctors/
│   │   │   ├── patients/
│   │   │   ├── appointments/
│   │   │   ├── services/
│   │   │   ├── blog/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── notifications/
│   │   │   ├── newsletter/
│   │   │   └── upload/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── admin/
│   │   ├── patient/
│   │   ├── public/
│   │   ├── shared/
│   │   ├── forms/
│   │   ├── charts/
│   │   ├── tables/
│   │   └── layout/
│   ├── lib/
│   │   ├── db.js
│   │   ├── auth.js
│   │   ├── email.js
│   │   ├── utils.js
│   │   ├── validations.js
│   │   └── constants.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   ├── Service.js
│   │   ├── Blog.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Notification.js
│   │   └── Newsletter.js
│   ├── hooks/
│   │   ├── use-auth.js
│   │   ├── use-appointments.js
│   │   ├── use-notifications.js
│   │   └── use-debounce.js
│   ├── store/
│   │   ├── auth-store.js
│   │   ├── cart-store.js
│   │   └── notification-store.js
│   └── utils/
│       ├── email-templates/
│       ├── pdf-templates/
│       └── helpers/
├── public/
│   ├── images/
│   ├── doctors/
│   ├── products/
│   └── uploads/
├── .env.local
└── package.json
\`\`\`

---

## 🗄️ Database Schema

### 1. Users Collection
\`\`\`javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed with Argon2),
  role: Enum ['admin', 'doctor', 'patient'],
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### 2. Doctors Collection
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  specialty: String,
  qualifications: [String],
  experience: Number,
  bio: String,
  photo: String,
  email: String,
  phone: String,
  consultationFee: Number,
  availability: [{
    day: String, // 'monday', 'tuesday', etc.
    slots: [{
      startTime: String, // '09:00'
      endTime: String,   // '17:00'
      isAvailable: Boolean
    }]
  }],
  services: [ObjectId] (ref: Service),
  rating: Number,
  reviewCount: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### 3. Patients Collection
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: Enum ['male', 'female', 'other'],
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }],
  allergies: [String],
  currentMedications: [String],
  bloodGroup: String,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### 4. Appointments Collection
\`\`\`javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient),
  doctorId: ObjectId (ref: Doctor),
  serviceId: ObjectId (ref: Service),
  appointmentDate: Date,
  timeSlot: String, // '10:00 AM'
  duration: Number, // minutes
  status: Enum ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
  reason: String,
  notes: String,
  prescription: String,
  amount: Number,
  paymentStatus: Enum ['pending', 'paid', 'refunded'],
  reminderSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### 5. Services Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  duration: Number, // minutes
  price: Number,
  isActive: Boolean,
  icon: String,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### 6. Blog/Articles Collection
\`\`\`javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  content: String, // Rich text/HTML
  excerpt: String,
  featuredImage: String,
  author: ObjectId (ref: Doctor),
  category: String,
  tags: [String],
  status: Enum ['draft', 'published'],
  views: Number,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### 7. Products Collection (E-Commerce)
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  slug: String (unique),
  description: String,
  category: String,
  price: Number,
  compareAtPrice: Number,
  images: [String],
  stock: Number,
  sku: String,
  isActive: Boolean,
  prescription_required: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### 8. Orders Collection
\`\`\`javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  patientId: ObjectId (ref: Patient),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  subtotal: Number,
  tax: Number,
  shippingFee: Number,
  total: Number,
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  paymentMethod: String,
  paymentStatus: Enum ['pending', 'paid', 'failed', 'refunded'],
  orderStatus: Enum ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### 9. Notifications Collection
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: Enum ['appointment', 'order', 'reminder', 'announcement'],
  title: String,
  message: String,
  isRead: Boolean,
  link: String,
  createdAt: Date
}
\`\`\`

### 10. Newsletter Subscriptions Collection
\`\`\`javascript
{
  _id: ObjectId,
  email: String (unique),
  isActive: Boolean,
  subscribedAt: Date,
  unsubscribedAt: Date
}
\`\`\`

### 11. FAQ Collection
\`\`\`javascript
{
  _id: ObjectId,
  question: String,
  answer: String,
  category: String,
  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

---

## 🎯 Feature Implementation Plan

### Phase 1: Core Setup (Week 1)
- [x] Project structure setup
- [x] Database connection
- [x] Authentication system (NextAuth)
- [x] User roles & permissions
- [x] Admin layout
- [x] Basic UI components

### Phase 2: Doctor Management (Week 2)
- [ ] Doctor profile CRUD
- [ ] Availability management
- [ ] Specialties & qualifications
- [ ] Doctor listing page
- [ ] Doctor detail page

### Phase 3: Patient Features (Week 3)
- [ ] Patient registration
- [ ] Patient profile
- [ ] Medical history management
- [ ] Patient dashboard

### Phase 4: Appointment System (Week 4-5)
- [ ] Appointment booking flow
- [ ] Calendar integration
- [ ] Time slot management
- [ ] Appointment status tracking
- [ ] Email notifications
- [ ] SMS reminders (optional)

### Phase 5: Services & Pricing (Week 6)
- [ ] Services CRUD
- [ ] Service categories
- [ ] Pricing management
- [ ] Service listing page

### Phase 6: Blog/Articles (Week 7)
- [ ] Blog CRUD
- [ ] Rich text editor
- [ ] Categories & tags
- [ ] Blog listing & detail pages
- [ ] SEO optimization

### Phase 7: E-Commerce (Week 8-9)
- [ ] Product CRUD
- [ ] Shopping cart (Zustand)
- [ ] Checkout flow
- [ ] Order management
- [ ] Payment integration (Stripe/PayPal)
- [ ] Invoice generation (PDF)

### Phase 8: Admin Panel (Week 10)
- [ ] Dashboard with analytics
- [ ] Appointment management
- [ ] Patient management
- [ ] Order management
- [ ] Content management
- [ ] Settings

### Phase 9: Notifications & Reminders (Week 11)
- [ ] Real-time notifications
- [ ] Email reminders
- [ ] SMS reminders (Twilio)
- [ ] Newsletter system

### Phase 10: Security & Optimization (Week 12)
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] SSL/HTTPS
- [ ] Security headers
- [ ] Performance optimization
- [ ] SEO optimization

---

## 🔐 Security Implementation

### 1. Authentication
\`\`\`javascript
// Using NextAuth with credentials & OAuth
- Argon2 password hashing
- JWT tokens
- Session management
- Email verification
- Password reset
\`\`\`

### 2. Authorization
\`\`\`javascript
// Middleware for route protection
- Role-based access control (RBAC)
- Admin-only routes
- Patient-only routes
- Doctor-only routes
\`\`\`

### 3. Data Protection
\`\`\`javascript
- express-mongo-sanitize for NoSQL injection
- Helmet.js for security headers
- CORS configuration
- Rate limiting per user/IP
- Input validation with Zod
\`\`\`

---

## 📧 Email Templates

### 1. Appointment Confirmation
### 2. Appointment Reminder (24h before)
### 3. Order Confirmation
### 4. Password Reset
### 5. Email Verification
### 6. Newsletter

---

## 📊 Key API Routes

\`\`\`
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/doctors
GET    /api/doctors/:id
POST   /api/doctors (admin)
PUT    /api/doctors/:id (admin)
DELETE /api/doctors/:id (admin)

GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id

GET    /api/products
GET    /api/products/:slug
POST   /api/products (admin)
PUT    /api/products/:id (admin)

POST   /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/status (admin)

POST   /api/newsletter/subscribe
POST   /api/newsletter/unsubscribe

GET    /api/notifications
PUT    /api/notifications/:id/read
\`\`\`

---

## 🎨 UI Components Needed

### Public Pages
- Hero Section
- Service Cards
- Doctor Cards
- Testimonials
- FAQ Accordion
- Blog Cards
- Product Cards
- Contact Form

### Patient Dashboard
- Appointment Calendar
- Upcoming Appointments
- Medical Records
- Order History
- Profile Settings

### Admin Dashboard
- Analytics Cards
- Appointment Table
- Patient Table
- Doctor Table
- Order Table
- Revenue Charts

---

## 📱 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop experience
- Touch-friendly UI
- Accessibility (WCAG 2.1)

---

## 🚀 Deployment Checklist
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] SSL certificate installed
- [ ] Rate limiting enabled
- [ ] Error logging (Winston)
- [ ] Performance monitoring
- [ ] Backup strategy
- [ ] CDN for images
- [ ] Vercel deployment

---

## 📈 Analytics & Monitoring
- Google Analytics
- Patient acquisition metrics
- Appointment conversion rate
- Revenue tracking
- Popular services
- Blog engagement

---

## 🔄 Cron Jobs Needed
1. **Daily:** Send appointment reminders (24h before)
2. **Weekly:** Newsletter dispatch
3. **Monthly:** Generate analytics reports
4. **Hourly:** Clean expired sessions

---

## 💡 Future Enhancements
- Video consultation (WebRTC)
- Mobile app (React Native)
- Multi-language support
- Telemedicine integration
- Insurance verification
- Lab test booking
- Prescription management
- Health tracking dashboard

---

**Total Estimated Timeline:** 12-14 weeks for MVP
**Team Size:** 2-3 developers recommended
