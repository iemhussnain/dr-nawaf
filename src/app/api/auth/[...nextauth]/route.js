import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import Doctor from '@/models/Doctor'
import Patient from '@/models/Patient'

export const authOptions = {
  // Configure session strategy to use JWT
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Connect to database
          await dbConnect()

          // Validate input
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide email and password')
          }

          // Find user by email (including password field)
          const user = await User.findOne({ email: credentials.email }).select('+password')

          if (!user) {
            throw new Error('Invalid email or password')
          }

          // Check if email is verified
          if (!user.isVerified) {
            throw new Error('Please verify your email before logging in')
          }

          // Verify password
          const isPasswordValid = await user.comparePassword(credentials.password)

          if (!isPasswordValid) {
            throw new Error('Invalid email or password')
          }

          // Update last login
          user.lastLogin = new Date()
          await user.save()

          // Get additional profile data based on role
          let profile = null
          if (user.role === 'doctor') {
            profile = await Doctor.findOne({ userId: user._id })
          } else if (user.role === 'patient') {
            profile = await Patient.findOne({ userId: user._id })
          }

          // Return user object (will be encoded in JWT)
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            profile: profile ? {
              id: profile._id.toString(),
              firstName: profile.firstName,
              lastName: profile.lastName,
            } : null,
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw new Error(error.message || 'Authentication failed')
        }
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
    verifyRequest: '/verify-email',
  },

  // Callbacks
  callbacks: {
    // Called whenever a JWT is created or updated
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
        token.isVerified = user.isVerified
        token.profile = user.profile
      }

      // Update session (when using update method from client)
      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      return token
    },

    // Called whenever session is checked
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.role = token.role
        session.user.isVerified = token.isVerified
        session.user.profile = token.profile
      }

      return session
    },
  },

  // Events
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`)
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token.email}`)
    },
  },

  // Debug mode (disable in production)
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
