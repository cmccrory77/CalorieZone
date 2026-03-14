export default function Support() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-slate-900">
      <nav className="border-b border-slate-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-['Poppins',sans-serif] font-bold text-lg">CalorieZone</a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-['Poppins',sans-serif] text-4xl font-bold mb-8">Support</h1>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">Getting Help</h2>
            <p>We're here to help! If you have questions, feedback, or need assistance with CalorieZone, please reach out to us.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">Contact Us</h2>
            <p className="mb-3">Email us at: <a href="mailto:support@caloriezone.app" className="text-[#4CAF50] hover:underline">support@caloriezone.app</a></p>
            <p>We typically respond within 24 hours.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How do I log a meal?</h3>
                <p>You can log meals by searching for foods, scanning barcodes with your phone camera, or using the AI meal scanner to photograph your meal. The app will automatically calculate calories and macros.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How accurate are the calorie estimates?</h3>
                <p>Our database includes nutrition information from thousands of foods. For packaged foods with barcodes, the data comes directly from manufacturers. For meals and recipes, we provide estimates based on ingredients and portion sizes.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Can I adjust my calorie goals?</h3>
                <p>Yes! Go to your Profile and update your target weight, activity level, or other settings. Your daily calorie goal will automatically recalculate.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How do meal plans work?</h3>
                <p>Generate a meal plan by selecting your preferred meal types and dietary preferences. The app creates a week of meals tailored to your calorie goal. You can swap meals or regenerate for different options.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Is my data private?</h3>
                <p>Yes. Your personal data, meal logs, and progress are stored securely and never shared with third parties. See our <a href="/privacy" className="text-[#4CAF50] hover:underline">Privacy Policy</a> for details.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">Troubleshooting</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">The app won't load</h3>
                <p>Try closing and reopening the app. Make sure you have an internet connection. If the problem persists, contact support at support@caloriezone.app.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Barcode scanner isn't working</h3>
                <p>Make sure you've granted camera permission to the app. Go to Settings → CalorieZone → Camera and enable it, then try again.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">My progress isn't syncing</h3>
                <p>Check your internet connection and try closing and reopening the app. Data syncs automatically when you log meals or make changes.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">Feature Requests & Feedback</h2>
            <p>We'd love to hear your ideas! Email us with feature requests or suggestions at support@caloriezone.app. Your feedback helps us improve CalorieZone.</p>
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
