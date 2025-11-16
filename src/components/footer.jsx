import Link from "next/link"
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "Services", href: "/services" },
    { name: "Our Doctors", href: "/doctors" },
    { name: "Health Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Appointments", href: "/appointments" },
    { name: "Shop", href: "/shop" },
  ]

  const supportLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Help Center", href: "/help" },
    { name: "Careers", href: "/careers" },
    { name: "About Us", href: "/about" },
  ]

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ]

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Dr. Nawaf
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Providing quality healthcare services with compassion and excellence.
              Your health is our priority, and we're here to serve you 24/7.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <div>Emergency: (123) 456-7890</div>
                  <div>Appointments: (123) 456-7891</div>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>info@drnawaf.com</div>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>123 Medical Center Drive<br />Healthcare City, HC 12345</div>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Hours: Mon-Fri 8AM - 10PM
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Emergency Services: 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              &copy; {currentYear} Dr. Nawaf Medical Center. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
                Privacy
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">
                Terms
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link href="/cookies" className="hover:text-blue-600 dark:hover:text-blue-400">
                Cookies
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link href="/accessibility" className="hover:text-blue-600 dark:hover:text-blue-400">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
