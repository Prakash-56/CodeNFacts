export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Privacy Policy
      </h1>

      <section className="mb-12">
        <p className="mb-6 text-gray-400 leading-relaxed">
          At CodeNFacts, we respect your privacy and are committed to protecting your personal information. 
          This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
        </p>
        <p className="text-gray-400 text-sm">
          Last updated: February 13, 2026
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-purple-500 pl-4">1. Information We Collect</h2>
        <div className="space-y-4 text-gray-400">
          <p>
            When you purchase courses or create an account, we collect:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Name and email address</li>
            <li>Payment information (processed securely by Cashfree)</li>
            <li>Course enrollment and progress data</li>
          </ul>
          <p>
            We also automatically collect standard web analytics like IP address, browser type, and pages visited 
            (via Google Analytics).
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-purple-500 pl-4">2. How We Use Your Information</h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-400">
          <div>
            <ul className="space-y-2">
              <li>• Process course purchases and payments</li>
              <li>• Deliver course content and track progress</li>
              <li>• Send important service updates</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li>• Improve our platform and content</li>
              <li>• Respond to support queries</li>
              <li>• Comply with legal obligations</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-purple-500 pl-4">3. Payments & Security</h2>
        <p className="text-gray-400 mb-4">
          All payments are securely processed via <strong>Cashfree Payments</strong>. We do not store your 
          credit card details or banking information on our servers.
        </p>
        <p className="text-gray-400">
          We use HTTPS encryption and follow industry-standard security practices to protect your data.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-purple-500 pl-4">4. Cookies & Tracking</h2>
        <p className="text-gray-400 mb-4">
          We use essential cookies for site functionality and Google Analytics cookies for usage insights. 
          You can manage cookie preferences through your browser settings.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-purple-500 pl-4">5. Data Sharing</h2>
        <p className="text-gray-400">
          We never sell your personal data. We only share information with:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4 mt-3 text-gray-400">
          <li>Cashfree Payments (for processing)</li>
          <li>Legal authorities (if required by law)</li>
          <li>Service providers (under strict agreements)</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-purple-500 pl-4">6. Your Rights</h2>
        <p className="text-gray-400 mb-4">
          You can request access, correction, or deletion of your personal data. Contact us at the email below.
        </p>
        <p className="text-gray-400 text-sm">
          Note: We may retain data required for legal or accounting purposes.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-purple-500 pl-4">7. Data Retention</h2>
        <p className="text-gray-400">
          We keep your data only as long as needed for our services or legal requirements. 
          Account data is retained for 2 years after last activity.
        </p>
      </section>

      <section className="mt-16 pt-12 border-t border-gray-800">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-purple-500 pl-4">Contact Us</h2>
        <div className="bg-gray-900 p-6 rounded-lg">
          <p className="text-gray-400 mb-4">
            Questions about this Privacy Policy? We'd love to hear from you.
          </p>
          <p className="text-xl font-semibold">
            <a href="mailto:support@codenfacts.in" className="hover:text-purple-400 transition-colors">
              support@codenfacts.in
            </a>
          </p>
        </div>
      </section>

      <footer className="mt-20 pt-12 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; 2026 CodeNFacts. All rights reserved.</p>
      </footer>
    </div>
  );
}

