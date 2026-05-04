"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createEnquiry } from "@/app/services/contactService";

type ContactFormValues = {
  isExistingCustomer: "yes" | "no" | null;
  name: string;
  companyName: string;
  email: string;
  telephone: string;
  reason: string;
  message: string;
};

const REASONS = [
  "General enquiry",
  "Product information",
  "Pricing & quotes",
  "Order support",
  "Sampling request",
  "Partnership",
  "Other",
];

const emptyForm: ContactFormValues = {
  isExistingCustomer: null,
  name: "",
  companyName: "",
  email: "",
  telephone: "",
  reason: "",
  message: "",
};

function Field({
  label,
  required = false,
  children,
  colSpan2 = false,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  colSpan2?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${colSpan2 ? "sm:col-span-2" : ""}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d94f4f]">
        {label}
        {required && <span className="ml-0.5 text-[#d94f4f]"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#f0e0dc] bg-[#fdf5f3] px-4 py-3 text-[13px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#ccc] focus:border-[#E8654A] bg-white";

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormValues>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K],
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (
      !form.isExistingCustomer ||
      !form.name.trim() ||
      !form.companyName.trim() ||
      !form.email.trim() ||
      !form.telephone.trim() ||
      !form.reason.trim() ||
      !form.message.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const response = await createEnquiry({
        existingCustomer: form.isExistingCustomer === "yes",
        name: form.name.trim(),
        companyName: form.companyName.trim(),
        email: form.email.trim(),
        phone: form.telephone.trim(),
        reason: form.reason.trim(),
        message: form.message.trim(),
      });
      toast.success(response.message ?? "Enquiry sent");
      setSubmitted(true);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to send your enquiry.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white px-4 py-16 sm:px-8 lg:px-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mx-auto max-w-[1100px]">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
            Get in touch
          </p>
          <h1
            className="mt-2 text-4xl italic text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Contact Us
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#888]">
            On our{" "}
            <a href="/faq" className="underline underline-offset-2 text-[#d94f4f]">
              FAQ page
            </a>{" "}
            you will find the answers to the most frequently asked questions. You
            can also start a{" "}
            <a href="/support" className="underline underline-offset-2 text-[#d94f4f]">
              support chat
            </a>{" "}
            or fill in the form below. We are happy to help you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* ── Form ─────────────────────────────────────────────────── */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] px-8 py-20 text-center">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12l5 5L20 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2
                className="mt-5 text-2xl italic text-[#1a1a1a]"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Message sent
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#888]">
                Thank you for reaching out. We'll get back to you within one
                business day.
              </p>
              <button
                onClick={() => {
                  setForm(emptyForm);
                  setError("");
                  setSubmitted(false);
                }}
                className="mt-8 rounded-xl border border-[#f0e0dc] bg-white px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] cursor-pointer text-[#d94f4f] transition-colors hover:border-[#E8654A]"
              >
                Send another
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-6 sm:p-8">
              {error ? (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {/* Existing customer radio */}
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d94f4f]">
                  Are you already a customer? <span className="text-[#d94f4f]">*</span>
                </p>
                <div className="mt-3 flex gap-6">
                  {(["yes", "no"] as const).map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-2 text-sm text-[#1a1a1a]"
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded-full border transition-colors"
                        style={{
                          borderColor: form.isExistingCustomer === opt ? "#E8654A" : "#f0e0dc",
                          background: form.isExistingCustomer === opt
                            ? "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)"
                            : "#fff",
                        }}
                        onClick={() => set("isExistingCustomer", opt)}
                      >
                        {form.isExistingCustomer === opt && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      <span
                        className="capitalize"
                        onClick={() => set("isExistingCustomer", opt)}
                      >
                        {opt === "yes" ? "Yes" : "No"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fields grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder=""
                    className={inputCls}
                  />
                </Field>

                <Field label="Company name" required>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => set("companyName", e.target.value)}
                    placeholder=""
                    className={inputCls}
                  />
                </Field>

                <Field label="Email" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder=""
                    className={inputCls}
                  />
                </Field>

                <Field label="Telephone" required>
                  <input
                    type="tel"
                    value={form.telephone}
                    onChange={(e) => set("telephone", e.target.value)}
                    placeholder=""
                    className={inputCls}
                  />
                </Field>

                <Field label="Reason for your message" required colSpan2>
                  <select
                    value={form.reason}
                    onChange={(e) => set("reason", e.target.value)}
                    className={`${inputCls} appearance-none`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23d94f4f' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "36px",
                    }}
                  >
                    <option value="">— Select reason —</option>
                    {REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Your message" required colSpan2>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    rows={5}
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>

              {/* Submit */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={isSubmitting}
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Right info sidebar ────────────────────────────────────── */}
          <aside className="space-y-5">

            {/* Company info */}
            <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
                Head office
              </p>
              <p
                className="mt-3 text-base italic text-[#1a1a1a]"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                
                The Fabric Prople
              </p>
              <div className="mt-3 space-y-0.5 text-[13px] leading-6 text-[#888]">
                <p>477B, 1st Floor,</p>
                <p>Ram Bazar, Cloth Market, Fatehpuri,</p>
                <p>Delhi - 110006, India</p>
              </div>
              <div
                className="my-4 border-t border-[#f0e0dc]"
              />
              <div className="space-y-0.5 text-[13px] leading-6 text-[#888]">
                <p>G-3B, Ground Floor, Sector D1(P3),</p>
                <p>Tronica City, Loni,</p>
                <p>Ghaziabad, UP - 201102, India</p>
              </div>
              <div className="my-4 border-t border-[#f0e0dc]" />
              <a
                href="tel:+31137710 10"
                className="block text-[13px] text-[#d94f4f] transition-opacity hover:opacity-70"
              >
                +91 8811071145
              </a>
              <a
                href="mailto:thefabricpeople@gmail.com"
                className="mt-1 block break-all text-[13px] text-[#d94f4f] transition-opacity hover:opacity-70"
              >
                thefabricpeople@gmail.com
              </a>
            </div>

            {/* Opening hours */}
            {/* <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
                Opening hours showroom
              </p>
              <div className="mt-3 space-y-1 text-[13px] leading-6 text-[#888]">
                <p>Monday to Friday 08:00 – 17:00h</p>
                <p>No appointment required.</p>
              </div>
              <div className="mt-4 border-t border-[#f0e0dc] pt-4">
                <p className="text-[12px] italic leading-5 text-[#bbb]">
                  Our showroom is only available for business relations.
                </p>
              </div>
            </div> */}


          </aside>
        </div>
      </div>
    </div>
  );
}
