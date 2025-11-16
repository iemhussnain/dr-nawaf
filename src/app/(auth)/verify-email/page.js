"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail } = useAuth()

  const [status, setStatus] = useState("loading") // loading, success, error
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link. No token provided.")
      return
    }

    // Verify email automatically
    const verify = async () => {
      try {
        const result = await verifyEmail(token)

        if (result.success) {
          setStatus("success")
          setMessage(result.message || "Email verified successfully!")
          toast.success("Email verified successfully!")

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login")
          }, 3000)
        } else {
          setStatus("error")
          setMessage(result.error || "Failed to verify email")
          toast.error(result.error || "Failed to verify email")
        }
      } catch (err) {
        setStatus("error")
        setMessage("An unexpected error occurred")
        toast.error("An unexpected error occurred")
      }
    }

    verify()
  }, [searchParams, verifyEmail, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Verifying Your Email
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Email Verified!
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Your email has been successfully verified
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
              </Alert>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You can now log in to your account and start using Dr. Nawaf Medical Center.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Redirecting to login page...
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Go to Login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              We couldn't verify your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900">
              <AlertDescription className="text-red-800 dark:text-red-200">{message}</AlertDescription>
            </Alert>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The verification link may be invalid or expired. Please try registering again or contact support.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                Register Again
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
