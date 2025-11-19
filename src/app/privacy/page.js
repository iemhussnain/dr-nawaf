export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Last updated: November 18, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Personal information (name, email, phone number, address)</li>
              <li>Medical history and health information</li>
              <li>Appointment and consultation records</li>
              <li>Payment and billing information</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Provide, maintain, and improve our medical services</li>
              <li>Process appointments and consultations</li>
              <li>Send appointment reminders and notifications</li>
              <li>Process payments and maintain billing records</li>
              <li>Communicate with you about our services</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>To healthcare providers involved in your care</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Request transfer of your information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Email: privacy@drnawaf.com<br />
              Phone: +966 50 123 4567<br />
              Address: Riyadh, Saudi Arabia
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
