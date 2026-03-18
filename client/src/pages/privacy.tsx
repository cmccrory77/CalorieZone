export default function Privacy() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-slate-900">
      <nav className="border-b border-slate-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-['Poppins',sans-serif] font-bold text-lg">CalorieZone</a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-['Poppins',sans-serif] text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-slate-500 mb-10">Last updated: March 2026</p>

        <div className="space-y-8 text-slate-600 leading-relaxed">

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p>CalorieZone ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains what data CalorieZone uses, where it is stored, and how the app interacts with third-party services. We designed CalorieZone with a privacy-first approach: <strong className="text-slate-800">virtually all of your personal data stays on your device and is never sent to our servers.</strong></p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">2. Data Stored On Your Device</h2>
            <p className="mb-3">All personal and health data you enter into CalorieZone is stored <strong className="text-slate-800">locally on your device only</strong>, using your device's built-in storage. This data never leaves your device and is not transmitted to CalorieZone servers. It includes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1.5">
              <li>Your profile: name, starting weight, current weight, goal weight, activity level, and target date</li>
              <li>Daily food entries and calorie logs</li>
              <li>Exercise entries</li>
              <li>Saved recipes</li>
              <li>Planned meals</li>
              <li>Frequent and recently logged foods</li>
              <li>App preferences (e.g. dark mode, premium status)</li>
            </ul>
            <p className="mt-3">Because this data is stored locally, <strong className="text-slate-800">deleting the app from your device permanently removes all of your data.</strong> We recommend using your device's built-in backup (e.g. iCloud) if you want to preserve it.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">3. Data We Do Not Collect</h2>
            <p className="mb-2">CalorieZone does <strong className="text-slate-800">not</strong>:</p>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Require you to create an account or provide an email address</li>
              <li>Store your health or food data on our servers or any remote database</li>
              <li>Share your personal data with advertisers or data brokers</li>
              <li>Track your location</li>
              <li>Use cookies for advertising or tracking purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">4. AI Features & Third-Party Services</h2>
            <p className="mb-3">Certain Pro features use our server to process requests via OpenAI's API. When you use these features, the following data is temporarily transmitted to our server and then to OpenAI for processing:</p>
            <ul className="list-disc list-inside space-y-1.5 mb-3">
              <li><strong className="text-slate-800">AI Meal Scanner:</strong> The photo you take of your meal is sent to OpenAI to identify food items and estimate nutrition. The image is not stored on our servers after the response is returned.</li>
              <li><strong className="text-slate-800">Barcode Scanner:</strong> The barcode value is used to look up nutrition data. No personal information is included in this request.</li>
              <li><strong className="text-slate-800">AI Recipe Generator:</strong> The text prompt you enter (e.g. "high-protein chicken dinner") is sent to OpenAI to generate a recipe. Your name or any personal health data is not included.</li>
            </ul>
            <p>OpenAI may retain submitted data in accordance with their own privacy policy. We encourage you to review <a href="https://openai.com/privacy" className="text-[#4CAF50] hover:underline" target="_blank" rel="noopener noreferrer">OpenAI's Privacy Policy</a> for details on how they handle data.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">5. In-App Purchases</h2>
            <p>CalorieZone Pro subscriptions and lifetime purchases are processed entirely through Apple's App Store and StoreKit. We do not collect, store, or have access to your payment details. Apple handles all billing and purchase verification. Please refer to <a href="https://www.apple.com/legal/privacy/" className="text-[#4CAF50] hover:underline" target="_blank" rel="noopener noreferrer">Apple's Privacy Policy</a> for details.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">6. Camera & Photo Library Access</h2>
            <p>The AI Meal Scanner and Barcode Scanner request access to your device's camera. This access is used solely to capture food images or barcodes within the app. We do not access your photo library without your explicit permission, and captured images are not stored on your device by the app or on our servers.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">7. Data Deletion</h2>
            <p>Since all personal data is stored locally on your device, you can delete it at any time by:</p>
            <ul className="list-disc list-inside mt-2 space-y-1.5">
              <li>Deleting the CalorieZone app from your device — this removes all locally stored data permanently</li>
              <li>Using the Profile section within the app to reset your data</li>
            </ul>
            <p className="mt-3">There is no account to delete because no account is created. We hold no personal data on our servers to remove.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">8. Children's Privacy</h2>
            <p>CalorieZone is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe a child has used the app and you have concerns, please contact us.</p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">9. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our privacy practices, please contact us at: <a href="mailto:privacy@caloriezone.app" className="text-[#4CAF50] hover:underline">privacy@caloriezone.app</a></p>
          </section>

          <section>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the "Last updated" date at the top of this page. Continued use of the app after changes constitutes acceptance of the updated policy.</p>
          </section>

        </div>
      </main>

      <footer className="border-t border-slate-100 py-8 px-6 mt-16">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} CalorieZone. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/terms" className="hover:text-slate-600 transition-colors">Terms of Use</a>
            <a href="/support" className="hover:text-slate-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
