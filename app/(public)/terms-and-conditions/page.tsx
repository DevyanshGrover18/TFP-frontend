"use client";

export default function TermsPage() {
  return (
    <div
      className="min-h-screen bg-white px-4 py-20 sm:px-8 lg:px-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mx-auto max-w-[720px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
          Legal
        </p>
        <h1
          className="mt-3 text-4xl italic text-[#1a1a1a]"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-[#aaa]">Last updated: 1 May 2026</p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-[#666]">
          <p>
            The Fabric People operates exclusively as a wholesale supplier. Our
            products and services are available to registered businesses,
            manufacturers, and retailers only — not to end consumers. By placing
            an order with us, you confirm that you are purchasing for commercial
            or resale purposes and that you accept these terms in full.
          </p>
          <p>
            All orders are subject to minimum order quantities and are confirmed
            only upon written acknowledgement from us. Prices are quoted in INR,
            exclude GST, and are valid for 7 days unless otherwise stated. We
            reserve the right to revise prices at any time, but confirmed orders
            will be honoured at the agreed price. Payment terms for new accounts
            require full advance payment; established accounts may be offered
            credit terms in writing.
          </p>
          <p>
            Dispatch timelines are estimates and not guaranteed unless confirmed
            in writing. Risk passes to you on handover to the carrier. Fabric is
            supplied subject to standard industry tolerances of ±2% on
            metreage, ±1% on width, and ±5% on GSM. Natural shade variation
            between dye lots is inherent in textile production and does not
            constitute a defect. We strongly recommend approving samples before
            placing bulk orders.
          </p>
          <p>
            Returns are only accepted where goods are materially different from
            what was ordered, contain manufacturing defects beyond accepted
            tolerances, or the wrong product was dispatched. All claims must be
            raised in writing within 7 days of delivery with photographic
            evidence. Our total liability in any dispute is limited to the
            invoice value of the goods in question. We are not liable for
            indirect losses including lost production time or lost profits.
          </p>
          <p>
            These terms are governed by the laws of India. Any disputes will
            first be resolved through good-faith negotiation, and if unresolved
            within 30 days, referred to arbitration in Delhi under the
            Arbitration and Conciliation Act, 1996. For any questions, contact
            us at{" "}
            <a
              href="mailto:thefabricpeople@gmail.com"
              className="text-[#d94f4f] underline underline-offset-2"
            >
              thefabricpeople@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}