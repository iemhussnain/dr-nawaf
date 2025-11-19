export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Terms and Conditions
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Last updated: November 18, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              By accessing and using Dr. Nawaf Medical Center's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Services Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Dr. Nawaf Medical Center provides medical consultation, diagnostic, and treatment services. Our services include but are not limited to general practice, specialist consultations, diagnostic tests, and pharmacy services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Patient Responsibilities
            </h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Provide accurate and complete medical information</li>
              <li>Attend scheduled appointments or cancel 24 hours in advance</li>
              <li>Follow prescribed treatment plans</li>
              <li>Pay for services rendered in a timely manner</li>
              <li>Respect medical staff and other patients</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Appointments and Cancellations
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Appointments must be cancelled at least 24 hours in advance. Failure to attend scheduled appointments without prior notice may result in cancellation fees. We reserve the right to refuse service to patients who repeatedly miss appointments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Payment Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Payment is expected at the time of service unless other arrangements have been made. We accept:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Cash payments</li>
              <li>Credit and debit cards</li>
              <li>Insurance coverage (subject to verification)</li>
              <li>Online payments through patient portal</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Medical Records
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Patient medical records are maintained in accordance with Saudi Arabian healthcare regulations and privacy laws. Patients have the right to access their medical records upon request.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              While we strive to provide the highest quality of care, Dr. Nawaf Medical Center cannot guarantee specific medical outcomes. We are not liable for any damages arising from the use of our services except as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Privacy and Confidentiality
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We are committed to protecting patient privacy and maintaining the confidentiality of medical information. Please refer to our Privacy Policy for detailed information on how we handle your personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Changes to Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We reserve the right to modify these terms at any time. Changes will be posted on our website, and your continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Contact Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              For questions about these Terms and Conditions, please contact us:
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Email: legal@drnawaf.com<br />
              Phone: +966 50 123 4567<br />
              Address: Riyadh, Saudi Arabia
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
