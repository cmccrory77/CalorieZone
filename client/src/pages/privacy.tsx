export default function Privacy() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-slate-900">
      <nav className="border-b border-slate-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-['Poppins',sans-serif] font-bold text-lg">CalorieZone</a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-['Poppins',sans-serif] text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-500 mb-6">Last updated: March 2026</p>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p>CalorieZone ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
            <p>We collect information you voluntarily provide, including:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Personal details: name, age, weight, height, and fitness goals</li>
              <li>Dietary preferences and restrictions</li>
              <li>Food intake and exercise logs</li>
              <li>Account credentials (email, password)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide and improve the CalorieZone service</li>
              <li>Generate personalized meal plans and calorie recommendations</li>
              <li>Track your progress toward health goals</li>
              <li>Send service-related notifications</li>
              <li>Respond to your inquiries and support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">4. Data Storage & Security</h2>
            <p>Your data is stored securely in our PostgreSQL database. We use industry-standard encryption and security measures to protect your information. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">5. Third-Party Services</h2>
            <p>CalorieZone may integrate with third-party services for features like barcode scanning and recipe data. We do not share your personal information with third parties without your consent, except as required by law.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">7. Children's Privacy</h2>
            <p>CalorieZone is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our privacy practices, please contact us at: privacy@caloriezone.app</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this page.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-8 px-6 mt-16">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} CalorieZone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
