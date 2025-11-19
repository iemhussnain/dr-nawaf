import { Heart, Users, Award, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const stats = [
    { label: "Years of Experience", value: "15+", icon: Award },
    { label: "Happy Patients", value: "10,000+", icon: Users },
    { label: "Expert Doctors", value: "25+", icon: Heart },
    { label: "Available 24/7", value: "365", icon: Clock },
  ]

  const values = [
    {
      title: "Patient-Centered Care",
      description: "We put our patients first, ensuring personalized attention and comprehensive care for every individual."
    },
    {
      title: "Medical Excellence",
      description: "Our team of highly qualified doctors and medical professionals are committed to providing world-class healthcare services."
    },
    {
      title: "Modern Technology",
      description: "We utilize the latest medical technology and equipment to ensure accurate diagnosis and effective treatment."
    },
    {
      title: "Compassionate Service",
      description: "We treat every patient with dignity, respect, and compassion, creating a comfortable and caring environment."
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              About Dr. Nawaf Medical Center
            </h1>
            <p className="text-xl text-blue-100">
              Providing exceptional healthcare services in Saudi Arabia for over 15 years
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            </div>
            <Card>
              <CardContent className="p-8">
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  At Dr. Nawaf Medical Center, our mission is to provide accessible, high-quality healthcare services to our community. We are committed to treating each patient with compassion, dignity, and respect while maintaining the highest standards of medical excellence. Through continuous improvement, innovation, and dedication, we strive to be the healthcare provider of choice in Saudi Arabia.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Story
              </h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            </div>
            <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              <p>
                Dr. Nawaf Medical Center was established in 2009 with a vision to provide comprehensive, patient-centered healthcare services to the community of Riyadh and beyond. What started as a small clinic with a handful of dedicated medical professionals has grown into one of the region's most trusted healthcare providers.
              </p>
              <p>
                Over the years, we have expanded our services, invested in state-of-the-art medical technology, and assembled a team of highly qualified doctors and healthcare professionals across various specialties. Our commitment to excellence and patient satisfaction has earned us the trust of thousands of families throughout Saudi Arabia.
              </p>
              <p>
                Today, Dr. Nawaf Medical Center continues to evolve and adapt to meet the changing healthcare needs of our community. We remain dedicated to our founding principles of compassionate care, medical excellence, and patient-first service while embracing innovation and modern healthcare practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Experience Healthcare Excellence
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust Dr. Nawaf Medical Center for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/doctors"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Book an Appointment
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
