"use client";

export default function PrivacyPolicyPage() {
  return (
    <div
      className="min-h-screen bg-white px-4 py-20 sm:px-8 lg:px-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      <div className="mx-auto max-w-[720px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
          Legal
        </p>
        <h1
          className="mt-3 text-4xl italic text-[#1a1a1a]"
          style={{ fontFamily: "'Georgia', serif" }}>
          
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[#aaa]">Last updated: 1 May 2026</p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-[#666]">
          <p>
            The Fabric People collects personal information only to the extent
            needed to run our wholesale business. This includes your name,
            company name, email address, phone number, delivery address, and
            payment details. We collect this information when you place an
            order, submit an enquiry through our website, or contact us
            directly by email, phone, or WhatsApp.
          </p>
          <p>
            We use your information to process and fulfil orders, respond to
            enquiries, issue invoices, and manage our ongoing business
            relationship with you. We are also required by Indian law to retain
            financial and tax records for a minimum of 8 years. We do not sell,
            rent, or share your personal data with third parties, except with
            logistics partners who need your delivery details to ship your
            order, or where disclosure is required by law.
          </p>
          <p>
            We may occasionally contact you about new fabric arrivals or
            relevant offers if you are an existing customer. You can opt out at
            any time by emailing us. Our website may use basic analytics cookies
            to understand how visitors use the site. You can disable cookies
            through your browser settings, though this may affect some website
            functionality.
          </p>
          <p>
            You have the right to access, correct, or request deletion of the
            personal information we hold about you, subject to our legal
            retention obligations. To make a request or raise any concern about
            how we handle your data, contact us at{" "}
            <a
              href="mailto:thefabricpeople@gmail.com"
              className="text-[#d94f4f] underline underline-offset-2">
              
              thefabricpeople@gmail.com
            </a>
            . We will respond within 30 days.
          </p>
          <p>
            We take reasonable steps to keep your information secure and limit
            access to those who need it. We may update this policy from time to
            time — the current version will always be on our website. Continued
            use of our site or services after any update means you accept the
            revised policy.
          </p>
        </div>
      </div>
    </div>);

}