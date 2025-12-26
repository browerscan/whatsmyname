import Link from "next/link";

export default async function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="text-primary hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>

      <article className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: December 14, 2024
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing and using whatismyname (&quot;Service&quot;,
            &quot;Website&quot;, or &quot;Application&quot;), you accept and
            agree to be bound by the terms and provision of this agreement. If
            you do not agree to these Terms of Service, please do not use our
            Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Description of Service
          </h2>
          <p className="mb-4">
            whatismyname provides a username search service that allows users to
            check the availability and presence of usernames across various
            social media platforms and websites. The Service includes:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Username Search:</strong> Search across 1,400+ platforms
              simultaneously
            </li>
            <li>
              <strong>Google Search Integration:</strong> Additional search
              results from Google Custom Search
            </li>
            <li>
              <strong>AI-Powered Analysis:</strong> Analyze search results using
              AI assistance
            </li>
            <li>
              <strong>Multi-Language Support:</strong> Interface available in 6
              languages
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Obligations</h2>

          <h3 className="text-xl font-semibold mb-3">3.1 Acceptable Use</h3>
          <p className="mb-4">
            You agree to use the Service only for lawful purposes. You must not
            use the Service:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To harass, stalk, or harm another person</li>
            <li>
              To violate any applicable local, state, national, or international
              law
            </li>
            <li>To infringe upon the intellectual property rights of others</li>
            <li>To transmit any malicious code, viruses, or harmful data</li>
            <li>
              To attempt to gain unauthorized access to our systems or networks
            </li>
            <li>
              To scrape, crawl, or use automated tools to access the Service
              excessively
            </li>
            <li>
              For any commercial purpose without our prior written consent
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">3.2 Rate Limiting</h3>
          <p className="mb-4">
            To ensure fair usage and service availability for all users, we
            implement rate limiting on our API endpoints:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Search API:</strong> 10 requests per 10 seconds per IP
              address
            </li>
            <li>
              <strong>Google Search:</strong> 5 requests per 10 seconds per IP
              address
            </li>
            <li>
              <strong>AI Analysis:</strong> 3 requests per 10 seconds per IP
              address
            </li>
          </ul>
          <p className="mb-4">
            Exceeding these limits will result in temporary request blocking.
            Repeated violations may result in permanent service suspension.
          </p>

          <h3 className="text-xl font-semibold mb-3">3.3 Account Security</h3>
          <p className="mb-4">
            While our Service does not require user accounts, you are
            responsible for maintaining the security of your device and browser
            when using our Service. You must immediately notify us if you become
            aware of any security breach.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Intellectual Property
          </h2>

          <h3 className="text-xl font-semibold mb-3">4.1 Service Content</h3>
          <p className="mb-4">
            All content, features, and functionality of the Service, including
            but not limited to text, graphics, logos, icons, images, audio
            clips, digital downloads, data compilations, and software, are the
            exclusive property of whatismyname or its licensors and are
            protected by international copyright, trademark, patent, trade
            secret, and other intellectual property laws.
          </p>

          <h3 className="text-xl font-semibold mb-3">4.2 Third-Party Data</h3>
          <p className="mb-4">
            Search results displayed by the Service contain data from
            third-party platforms. We do not claim ownership of this data. All
            trademarks, service marks, and logos displayed belong to their
            respective owners.
          </p>

          <h3 className="text-xl font-semibold mb-3">
            4.3 User-Generated Content
          </h3>
          <p className="mb-4">
            When you use our AI analysis feature, the questions you submit and
            responses generated are considered User-Generated Content. By
            submitting content, you grant us a non-exclusive, worldwide,
            royalty-free license to use, store, and display such content solely
            for the purpose of providing the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Disclaimer of Warranties
          </h2>
          <p className="mb-4">
            The Service is provided on an &quot;AS IS&quot; and &quot;AS
            AVAILABLE&quot; basis without warranties of any kind, either express
            or implied, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Accuracy, completeness, or reliability of search results</li>
            <li>Uninterrupted or error-free operation of the Service</li>
            <li>Freedom from viruses or other harmful components</li>
            <li>Availability of any particular platform in search results</li>
          </ul>
          <p className="mb-4">We make no warranty that:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>The Service will meet your specific requirements</li>
            <li>Search results will be accurate, complete, or current</li>
            <li>Any defects in the Service will be corrected</li>
            <li>The Service will be compatible with your device or browser</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Limitation of Liability
          </h2>
          <p className="mb-4">
            To the maximum extent permitted by applicable law, whatismyname and
            its affiliates, officers, employees, agents, partners, and licensors
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Loss of profits, data, use, goodwill, or other intangible losses
            </li>
            <li>
              Damages resulting from unauthorized access to or alteration of
              your transmissions or data
            </li>
            <li>
              Damages resulting from any conduct or content of any third party
              on the Service
            </li>
            <li>Damages resulting from reliance on search results</li>
          </ul>
          <p className="mb-4">
            Our total liability to you for any claims arising from your use of
            the Service shall not exceed the amount you paid us in the past 12
            months (which is zero for free users).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Third-Party Services
          </h2>
          <p className="mb-4">
            Our Service integrates with and relies on third-party services:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>WhatsMyName API:</strong> Username search data provider
            </li>
            <li>
              <strong>Google Custom Search:</strong> Additional search results
            </li>
            <li>
              <strong>OpenRouter (DeepSeek AI):</strong> AI analysis
              capabilities
            </li>
            <li>
              <strong>Cloudflare:</strong> Hosting and CDN services
            </li>
          </ul>
          <p className="mb-4">
            These third-party services have their own terms of service and
            privacy policies. We are not responsible for the practices or
            content of these services. Your use of third-party services is at
            your own risk.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Privacy and Data Protection
          </h2>
          <p className="mb-4">
            Your use of the Service is also governed by our Privacy Policy.
            Please review our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            to understand our practices regarding the collection and use of your
            information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. Modifications to the Service
          </h2>
          <p className="mb-4">We reserve the right to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Modify, suspend, or discontinue the Service at any time without
              notice
            </li>
            <li>
              Change the features, functionality, or availability of the Service
            </li>
            <li>Update the list of platforms included in search results</li>
            <li>
              Impose limits on certain features or restrict access to parts of
              the Service
            </li>
          </ul>
          <p className="mb-4">
            We shall not be liable to you or any third party for any
            modification, suspension, or discontinuance of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms of Service at any time.
            We will notify users of any material changes by:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Updating the &quot;Last updated&quot; date at the top of this page
            </li>
            <li>Posting a notice on our homepage</li>
            <li>
              Sending an email notification (if you have provided an email
              address)
            </li>
          </ul>
          <p className="mb-4">
            Your continued use of the Service after such modifications
            constitutes your acceptance of the updated Terms of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your access to the Service immediately,
            without prior notice or liability, for any reason, including but not
            limited to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Breach of these Terms of Service</li>
            <li>Excessive use or abuse of the Service</li>
            <li>Violation of applicable laws or regulations</li>
            <li>Fraudulent, harmful, or illegal activity</li>
          </ul>
          <p className="mb-4">
            Upon termination, your right to use the Service will immediately
            cease.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with
            the laws of the jurisdiction in which whatismyname operates, without
            regard to its conflict of law provisions.
          </p>
          <p className="mb-4">
            Any disputes arising from these Terms or your use of the Service
            shall be subject to the exclusive jurisdiction of the courts in that
            jurisdiction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Indemnification</h2>
          <p className="mb-4">
            You agree to indemnify, defend, and hold harmless whatismyname and
            its affiliates, officers, directors, employees, agents, licensors,
            and suppliers from and against all claims, losses, expenses,
            damages, and costs, including reasonable attorneys&apos; fees,
            resulting from:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Your violation of these Terms of Service</li>
            <li>Your violation of any rights of another party</li>
            <li>Your use or misuse of the Service</li>
            <li>Your violation of applicable laws or regulations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Severability</h2>
          <p className="mb-4">
            If any provision of these Terms is found to be invalid or
            unenforceable by a court of competent jurisdiction, the remaining
            provisions shall remain in full force and effect. The invalid or
            unenforceable provision shall be deemed modified to the extent
            necessary to make it valid and enforceable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Entire Agreement</h2>
          <p className="mb-4">
            These Terms of Service, together with our Privacy Policy, constitute
            the entire agreement between you and whatismyname regarding the use
            of the Service and supersede all prior and contemporaneous
            understandings, agreements, representations, and warranties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            16. Contact Information
          </h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please
            contact us at:
          </p>
          <ul className="list-none mb-4 space-y-2">
            <li>
              <strong>Email:</strong> legal@whatismyname.org
            </li>
            <li>
              <strong>Website:</strong> https://whatismyname.org
            </li>
          </ul>
        </section>

        <section className="mb-8 p-6 bg-muted/30 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4">Fair Use Notice</h2>
          <p className="mb-4">
            This Service is intended for personal, educational, and research
            purposes. Commercial use requires prior written authorization. We
            reserve the right to limit or restrict access to users who we
            believe are using the Service in a manner inconsistent with these
            Terms.
          </p>
        </section>

        <section className="mb-8 p-6 bg-muted/30 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4">Acknowledgment</h2>
          <p className="mb-4">
            By using whatismyname, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service and our
            Privacy Policy.
          </p>
        </section>
      </article>
    </div>
  );
}
