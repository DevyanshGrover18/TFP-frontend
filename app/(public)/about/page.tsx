"use client";

import Link from "next/link";

const stats = [
  { value: "35+", label: "Years in business" },
  { value: "200+", label: "Brands served" },
  { value: "50K+", label: "Metres shipped monthly" },
  { value: "12+", label: "Partner labels" },
];

const values = [
  {
    title: "Quality first",
    description:
      "Every roll of fabric we stock is sourced from mills that meet our strict standards for weave consistency, colourfastness, and finish. We reject anything we wouldn't put our name on.",
  },
  {
    title: "Wholesale integrity",
    description:
      "Transparent pricing, honest minimums, and no hidden charges. We build long-term relationships with retailers and manufacturers who value reliability over short-term deals.",
  },
  {
    title: "Speed & reliability",
    description:
      "Our warehouse in Tronica City means same-day dispatch for in-stock orders placed before noon. We know fabric delays cost your business money.",
  },
  {
    title: "Breadth of range",
    description:
      "From premium cotton lawns and viscose jerseys to technical blended fabrics — we maintain depth across categories so you can source everything from one partner.",
  },
];

const team = [
  {
    name: "Rajiv Sharma",
    role: "Founder & Managing Director",
    since: "Est. 1989",
    bio: "Three decades navigating Delhi's cloth markets gave Rajiv an instinct for fabric that no catalogue can teach. He built The Fabric People around the belief that wholesalers should be partners, not just suppliers.",
  },
  {
    name: "Priya Sharma",
    role: "Head of Sourcing",
    since: "Since 2008",
    bio: "Priya oversees relationships with over 40 mills across India and Southeast Asia, ensuring the range stays ahead of seasonal trends without compromising on the quality benchmarks the business was founded on.",
  },
  {
    name: "Arjun Mehta",
    role: "Operations & Logistics",
    since: "Since 2015",
    bio: "Arjun runs the Ghaziabad warehouse and built the dispatch system that keeps turnaround times tight. If your order shipped on time, Arjun had something to do with it.",
  },
];

const categories = [
  "Cotton & Cotton Blends",
  "Viscose & Rayon",
  "Polyester & Synthetics",
  "Jersey & Knits",
  "Lace & Embroidered",
  "Innerwear Fabrics",
  "Linen & Linen Blends",
  "Printed & Yarn-dyed",
];

export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="border-b border-[#f0e0dc] bg-[#fdf5f3] px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
            Who we are
          </p>
          <h1
            className="mt-3 max-w-2xl text-5xl italic leading-tight text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Fabric at wholesale scale, without the wholesale headaches.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#888]">
            The Fabric People has been supplying India's garment manufacturers,
            retail brands, and boutique labels from the heart of Delhi's Cloth
            Market since 1989. We stock thousands of metres across dozens of
            categories — ready to ship when you need them.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)",
              }}
            >
              Get in touch
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[#f0e0dc] bg-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d94f4f] transition-colors hover:border-[#E8654A]"
            >
              Browse catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="border-b border-[#f0e0dc] px-4 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1100px] grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-4xl italic text-[#d94f4f]"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#aaa]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1100px] grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
              Our story
            </p>
            <h2
              className="mt-3 text-3xl italic text-[#1a1a1a]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Born in the lanes of Fatehpuri
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-[#888]">
              <p>
                In 1989, Rajiv Sharma set up a small trading operation at 477B,
                Ram Bazar — one stall among hundreds in Delhi's legendary Cloth
                Market. His edge wasn't price; it was consistency. Buyers came
                back because the colour they ordered in January matched the
                shade that arrived in June.
              </p>
              <p>
                Over the decades, that reputation compounded. Brands like
                Clovia, Nykaa Fashion, and Groversons trusted us with their
                base fabric needs. We outgrew the market stall, added a
                warehouse in Ghaziabad's Tronica City, and built a team that
                can turn around large orders without cutting corners.
              </p>
              <p>
                Today The Fabric People supplies innerwear manufacturers,
                kidswear labels, ethnic wear designers, and fast-fashion
                retailers across India. The stall is still there. The standards
                haven't moved.
              </p>
            </div>
          </div>

          {/* Decorative block */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-6">
              <p
                className="text-5xl italic text-[#E8654A]"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                1989
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#aaa]">
                Founded
              </p>
              <p className="mt-3 text-[13px] leading-6 text-[#888]">
                Started as a single trading unit in Delhi's historic Cloth
                Market, Fatehpuri.
              </p>
            </div>
            <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-6">
              <p
                className="text-5xl italic text-[#E8426A]"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                B2B
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#aaa]">
                Wholesale only
              </p>
              <p className="mt-3 text-[13px] leading-6 text-[#888]">
                We serve manufacturers, labels, and retailers — not end
                consumers. Minimum order quantities apply.
              </p>
            </div>
            <div className="col-span-2 rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d94f4f]">
                Fabric categories we stock
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full border border-[#f0e0dc] bg-white px-3 py-1 text-[11px] font-medium text-[#888]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────── */}
      <section className="border-t border-[#f0e0dc] bg-[#fdf5f3] px-4 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
            How we work
          </p>
          <h2
            className="mt-3 text-3xl italic text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            What we stand for
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="rounded-2xl border border-[#f0e0dc] bg-white p-6"
              >
                <span
                  className="text-3xl italic text-[#f0e0dc]"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-sm font-bold text-[#1a1a1a]">
                  {v.title}
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-[#888]">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section className="border-t border-[#f0e0dc] px-4 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
            The people
          </p>
          <h2
            className="mt-3 text-3xl italic text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Who you'll work with
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-white text-sm font-bold"
                  style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}
                >
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3
                  className="mt-4 text-base italic text-[#1a1a1a]"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {member.name}
                </h3>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d94f4f]">
                  {member.role}
                </p>
                <p className="mt-0.5 text-[11px] text-[#ccc]">{member.since}</p>
                <p className="mt-3 text-[13px] leading-6 text-[#888]">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-t border-[#f0e0dc] bg-[#fdf5f3] px-4 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1100px] flex flex-col items-center text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
            Ready to source?
          </p>
          <h2
            className="mt-3 max-w-lg text-3xl italic text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Let's talk fabric.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#888]">
            Tell us what you need — category, quantity, and timeline — and we'll
            come back to you within one business day.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)",
            }}
          >
            Send an enquiry
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}