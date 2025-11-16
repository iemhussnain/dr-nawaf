# 🏥 Dr. Nawaf - Medical Practice Management System

A comprehensive, full-stack medical practice management platform built with Next.js 16, featuring patient management, appointment booking, e-commerce, and multi-doctor support.

## ✨ Features

- 🔐 **Secure Authentication** - NextAuth.js with Argon2 password hashing
- 👨‍⚕️ **Multi-Doctor Management** - Manage multiple doctors with individual profiles
- 📅 **Appointment Booking** - Real-time appointment scheduling with calendar
- 🛒 **E-Commerce** - Sell healthcare products online
- 📝 **Blog/Articles** - Health tips and educational content
- 📧 **Email Notifications** - Automated appointment reminders and confirmations
- 🔔 **Real-time Notifications** - In-app notification system
- 📊 **Admin Dashboard** - Analytics, reports, and management tools
- 🌙 **Dark Mode** - Beautiful dark/light theme with system preference support
- 📱 **Fully Responsive** - Mobile-first design

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19.2**
- **Tailwind CSS v4**
- **shadcn/ui + Radix UI**
- **Framer Motion + GSAP**
- **Zustand** (State Management)
- **TanStack Query** (Data Fetching)

### Backend
- **MongoDB + Mongoose**
- **NextAuth.js**
- **Argon2** (Password Hashing)
- **Nodemailer** (Email)
- **Formidable** (File Upload)

### Security
- **Helmet.js** - Security headers
- **Rate Limiting** - DDoS protection
- **CORS** - Cross-origin security
- **Input Sanitization** - XSS & injection prevention

## 📁 Project Structure

\`\`\`
dr-nawaf/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── models/          # Mongoose models
│   ├── lib/             # Utilities & configs
│   ├── hooks/           # Custom hooks
│   ├── store/           # Zustand stores
│   └── middleware/      # Auth & rate limiting
├── public/              # Static assets
└── .env.example         # Environment variables template
\`\`\`

## 🚀 Quick Start

### 1. Clone & Install

\`\`\`bash
git clone <repository-url>
cd dr-nawaf
npm install
\`\`\`

### 2. Environment Setup

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update `.env.local` with your credentials:
- MongoDB URI
- NextAuth secret
- Email SMTP settings
- Payment gateway keys (optional)

### 3. Start MongoDB

\`\`\`bash
# Local
mongod

# Or use MongoDB Atlas (cloud)
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [**PROJECT_PLAN.md**](./PROJECT_PLAN.md) - Complete project overview & architecture
- [**IMPLEMENTATION_GUIDE.md**](./IMPLEMENTATION_GUIDE.md) - Step-by-step implementation guide

## 🎯 Current Status

✅ **Completed:**
- Project structure & folder organization
- All database models (10 collections)
- Authentication middleware
- Email service configuration
- Form validation schemas
- Core utilities & constants
- Dark mode theme system
- All shadcn/ui components

🚧 **In Progress:**
- Authentication pages (login/register)
- Admin dashboard
- Appointment booking system

📋 **Upcoming:**
- Doctor management
- Patient portal
- E-commerce features
- Blog system

## 🔐 Security Features

- ✅ Argon2 password hashing
- ✅ NextAuth.js session management
- ✅ Rate limiting middleware
- ✅ MongoDB injection prevention
- ✅ Input validation with Zod
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ File upload validation

## 📦 Installed Packages

All necessary packages are already installed:
- UI: shadcn/ui, Radix UI, Lucide icons
- Forms: react-hook-form, Zod
- Data: TanStack Query, AG Grid
- Charts: Recharts
- Email: Nodemailer
- Database: Mongoose
- And many more...

See `package.json` for complete list.

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Railway
- Render
- AWS/Azure
- DigitalOcean

## 📊 Database Models

- **User** - Authentication & roles
- **Doctor** - Doctor profiles & availability
- **Patient** - Patient information & medical history
- **Appointment** - Booking & scheduling
- **Service** - Medical services & pricing
- **Product** - E-commerce products
- **Order** - Shopping orders
- **Blog** - Articles & health tips
- **Notification** - In-app notifications
- **Newsletter** - Email subscriptions
- **FAQ** - Frequently asked questions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Dr. Nawaf Medical Center**
- Website: [drnawaf.com](https://drnawaf.com)
- Email: support@drnawaf.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- All open-source contributors

---

**Built with ❤️ using Next.js**
