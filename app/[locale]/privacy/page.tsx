import Link from "next/link";

export default async function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="text-primary hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>

      <article className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: December 14, 2024
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to whatismyname (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;). We are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our username search service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Information We Collect
          </h2>

          <h3 className="text-xl font-semibold mb-3">
            2.1 Information You Provide
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Search Queries:</strong> Usernames you search for using
              our service
            </li>
            <li>
              <strong>AI Interactions:</strong> Questions you ask our AI
              assistant about search results
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            2.2 Automatically Collected Information
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Usage Data:</strong> Pages visited, features used, time
              spent
            </li>
            <li>
              <strong>Device Information:</strong> Browser type, device type,
              operating system
            </li>
            <li>
              <strong>IP Address:</strong> For rate limiting and security
              purposes
            </li>
            <li>
              <strong>Cookies:</strong> Essential cookies for functionality,
              analytics cookies (with consent)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To provide and improve our username search services</li>
            <li>To process and respond to your search queries</li>
            <li>To provide AI-powered analysis and insights</li>
            <li>To prevent abuse and ensure service security</li>
            <li>To analyze usage patterns and improve user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Third-Party Services
          </h2>
          <p className="mb-4">We use the following third-party services:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>WhatsMyName API:</strong> For username search across
              platforms
            </li>
            <li>
              <strong>Google Custom Search:</strong> For additional search
              results
            </li>
            <li>
              <strong>OpenRouter (DeepSeek AI):</strong> For AI-powered analysis
            </li>
            <li>
              <strong>Cloudflare:</strong> For hosting and CDN services
            </li>
          </ul>
          <p className="mb-4">
            These services may collect their own data according to their privacy
            policies. We recommend reviewing their policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
          <p className="mb-4">
            We retain your information only as long as necessary to provide our
            services and comply with legal obligations:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Search Queries:</strong> Not stored permanently; cached
              temporarily for performance (15-30 minutes)
            </li>
            <li>
              <strong>AI Conversations:</strong> Not stored permanently;
              session-based only
            </li>
            <li>
              <strong>Usage Logs:</strong> Retained for 90 days for security and
              analytics
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p className="mb-4">
            We implement industry-standard security measures to protect your
            information:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>HTTPS encryption for all data transmission</li>
            <li>Rate limiting to prevent abuse</li>
            <li>Regular security audits and updates</li>
            <li>No storage of sensitive personal information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your information</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Children&apos;s Privacy
          </h2>
          <p className="mb-4">
            Our service is not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. Changes to This Policy
          </h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy, please contact us
            at:
          </p>
          <ul className="list-none mb-4 space-y-2">
            <li>
              <strong>Email:</strong> privacy@whatismyname.org
            </li>
            <li>
              <strong>Website:</strong> https://whatismyname.org
            </li>
          </ul>
        </section>

        <section className="mb-8 p-6 bg-muted/30 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4">GDPR Compliance</h2>
          <p className="mb-4">
            For users in the European Economic Area (EEA), we comply with GDPR
            requirements. You have additional rights under GDPR, including the
            right to data portability and the right to lodge a complaint with a
            supervisory authority.
          </p>
        </section>

        <section className="mb-8 p-6 bg-muted/30 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4">CCPA Compliance</h2>
          <p className="mb-4">
            For California residents, we comply with the California Consumer
            Privacy Act (CCPA). You have the right to request disclosure of
            personal information collected, request deletion, and opt-out of
            sale of personal information (we do not sell personal information).
          </p>
        </section>
      </article>
    </div>
  );
}
