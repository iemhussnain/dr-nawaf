import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Heart, ShoppingBag, Stethoscope, Users, Clock, Shield, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
            <Star className="h-4 w-4" />
            <span>Trusted by 10,000+ Patients</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Your Health, Our Priority
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience comprehensive medical care with our team of expert doctors,
            modern facilities, and patient-centered approach to healthcare.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Us?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We provide comprehensive healthcare services with a focus on quality,
            accessibility, and patient satisfaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Expert Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Board-certified specialists with years of experience in their fields
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">24/7 Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Round-the-clock emergency care and online consultation services
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Your medical records are protected with industry-leading security
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Patient-Centered</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Personalized care plans tailored to your unique health needs
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Overview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive healthcare solutions for you and your family
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle className="text-gray-900 dark:text-white">Medical Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-gray-600 dark:text-gray-400">
                Expert consultations with our team of specialized doctors for all your health concerns
              </CardDescription>
              <Link href="/services">
                <Button variant="link" className="p-0 text-blue-600 dark:text-blue-400">
                  Learn More →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <Calendar className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
              <CardTitle className="text-gray-900 dark:text-white">Online Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-gray-600 dark:text-gray-400">
                Schedule appointments online at your convenience with instant confirmation
              </CardDescription>
              <Link href="/register">
                <Button variant="link" className="p-0 text-blue-600 dark:text-blue-400">
                  Book Now →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <ShoppingBag className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <CardTitle className="text-gray-900 dark:text-white">Medical Shop</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-gray-600 dark:text-gray-400">
                Order medications and health products online with home delivery
              </CardDescription>
              <Link href="/shop">
                <Button variant="link" className="p-0 text-blue-600 dark:text-blue-400">
                  Shop Now →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 text-white border-0">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl md:text-4xl text-white">
              Ready to Take Control of Your Health?
            </CardTitle>
            <CardDescription className="text-blue-100 dark:text-blue-200 text-lg">
              Join thousands of satisfied patients who trust us with their healthcare needs
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white hover:bg-white/10 border-white">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  )
}
