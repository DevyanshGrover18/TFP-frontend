"use client";

import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "@/hooks/useRouter";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { buildLoginRedirectPath } from "@/services/authRedirect";
import {
  getMyOrders,
  getOrderHref } from

"@/services/orderService";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile } from

"@/services/userService";
import { storeUser, storeSpecialUser } from "@/services/userSession";
import { ArrowRight } from "lucide-react";

const emptyProfile = {
  invoice: {
    companyName: "", street: "", nr: "", apartment: "", city: "", zip: "",
    country: "", notLiableForVat: false, gstNumber: "", chamberOfCommerce: "",
    category: { id: "", name: "" }, website: ""
  },
  shipping: {
    sameAsInvoice: false, companyName: "", street: "", nr: "",
    apartment: "", city: "", zip: "", country: ""
  },
  details: {
    firstName: "", lastName: "", email: "", emailInvoice: "",
    mobileCode: "", mobile: "", phoneCode: "", phone: "",
    acceptUpdates: false, acceptTerms: false
  }
};

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  }).format(new Date(value));
}

function statusClasses(status) {
  switch (status) {
    case "Completed":return "bg-emerald-50 text-emerald-700";
    case "Processing":return "bg-[#fdf5f3] text-[#d94f4f]";
    case "Cancelled":return "bg-red-50 text-red-600";
    default:return "bg-amber-50 text-amber-700";
  }
}

function splitName(name) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const [firstName, ...rest] = trimmed.split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

function hasProfileDetails(profile) {
  return Boolean(
    profile.invoice.companyName || profile.invoice.street ||
    profile.invoice.city || profile.invoice.zip || profile.invoice.country ||
    profile.shipping.companyName || profile.shipping.street ||
    profile.shipping.city || profile.shipping.zip || profile.shipping.country ||
    profile.details.emailInvoice || profile.details.mobile || profile.details.phone
  );
}

// ─── Reusable field components ────────────────────────────────────────────────

function Field({
  label, value, onChange, type = "text", colSpan2 = false






}) {
  return (
    <label className={`flex flex-col gap-1.5 ${colSpan2 ? "md:col-span-2" : ""}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d94f4f]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#f0e0dc] bg-white px-4 py-3 text-[13px] text-[#1a1a1a] outline-none transition-colors focus:border-[#E8654A]"
        style={{ fontFamily: "'DM Sans', sans-serif" }} />
      
    </label>);

}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
        {title}
      </p>
      <div className="mt-4">{children}</div>
    </div>);

}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AccountPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, specialUser, isSpecialSession, logout } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [hasSavedDetails, setHasSavedDetails] = useState(false);

  useEffect(() => {
    const activeUser = isSpecialSession ? specialUser : user;
    if (!activeUser?.id) {setIsLoading(false);return;}

    const name = splitName(activeUser.name);
    setProfile((current) => ({
      ...current,
      details: {
        ...current.details,
        firstName: current.details.firstName || name.firstName,
        lastName: current.details.lastName || name.lastName,
        email: current.details.email || activeUser.email
      }
    }));

    const loadAccount = async () => {
      try {
        setError("");
        const [profileResponse, ordersResponse] = await Promise.all([
        getCurrentUserProfile(),
        isSpecialSession ? Promise.resolve({ orders: [] }) : getMyOrders()]
        );
        if (profileResponse.profile) {
          setProfile(profileResponse.profile);
          setHasSavedDetails(hasProfileDetails(profileResponse.profile));
        }
        setOrders(ordersResponse.orders ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load your account.");
      } finally {
        setIsLoading(false);
      }
    };
    void loadAccount();
  }, [isSpecialSession, specialUser?.id, user?.id]);

  const fullName = useMemo(
    () => `${profile.details.firstName} ${profile.details.lastName}`.trim(),
    [profile.details.firstName, profile.details.lastName]
  );

  const setInvoice = (
  field,
  value) =>
  setProfile((c) => ({ ...c, invoice: { ...c.invoice, [field]: value } }));

  const setShipping = (field, value) =>
  setProfile((c) => ({ ...c, shipping: { ...c.shipping, [field]: value } }));

  const setDetails = (field, value) =>
  setProfile((c) => ({ ...c, details: { ...c.details, [field]: value } }));

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      const response = await updateCurrentUserProfile(profile);
      if (response.profile) {
        setProfile(response.profile);
        setHasSavedDetails(hasProfileDetails(response.profile));
      }
      if (response.user) {
        if (isSpecialSession) {
          storeSpecialUser({
            id: response.user.id, name: response.user.name,
            email: response.user.email, isSpecial: true,
            allowedCategories: specialUser?.allowedCategories ?? []
          });
        } else {
          storeUser({ id: response.user.id, name: response.user.name, email: response.user.email });
        }
      }
      toast.success(response.message ?? "Account updated");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Failed to update account.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch {/* clear local state even if cookie is missing */} finally {
      router.push("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const activeUser = isSpecialSession ? specialUser : user;

  // ── Unauthenticated state ──────────────────────────────────────────────────
  if (!activeUser && !isLoading) {
    return (
      <div className="min-h-screen bg-white px-6 py-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
            Trade Portal
          </p>
          <h1
            className="mt-3 text-4xl italic text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}>
            
            Account
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#888]">
            Sign in to view your saved details, quote requests, and account activity.
          </p>
          <Link to={buildLoginRedirectPath(pathname)}
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}>
            
            Sign In <ArrowRight size={15} />
          </Link>
        </div>
      </div>);

  }

  // ── Authenticated ──────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-white px-4 pb-24 pt-10 sm:px-8 lg:px-12"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      <div className="mx-auto max-w-[1320px]">

        {/* Header */}
        <header className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
              Trade Portal
            </p>
            <h1
              className="mt-2 text-5xl italic tracking-tight text-[#1a1a1a]"
              style={{ fontFamily: "'Georgia', serif" }}>
              
              Account
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#888]">
              Review your saved quote details, update your business information,
              and track the status of submitted requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="self-start rounded-xl border border-[#f0e0dc] bg-[#fdf5f3] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d94f4f] transition-colors hover:border-[#E8654A] disabled:cursor-not-allowed disabled:opacity-60">
            
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </header>

        {/* Error banner */}
        {error &&
        <div className="mb-6 rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] px-6 py-4 text-sm text-[#d94f4f]">
            {error}
          </div>
        }

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">

          {/* ── Left: Profile form ─────────────────────────────────────── */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-6 sm:p-8">

              {/* Card header */}
              <div className="flex flex-col gap-2 border-b border-[#f0e0dc] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
                    Your details
                  </p>
                  <h2
                    className="mt-2 text-3xl italic text-[#1a1a1a]"
                    style={{ fontFamily: "'Georgia', serif" }}>
                    
                    {fullName || "Your profile"}
                  </h2>
                </div>
                <p className="text-sm text-[#888]">
                  {profile.details.email || activeUser?.email || "No email"}
                </p>
              </div>

              {isLoading ?
              <p className="pt-6 text-sm text-[#888]">Loading your account...</p> :

              <div className="mt-6 space-y-6">

                  {/* Special session notice */}
                  {isSpecialSession &&
                <div className="rounded-2xl border border-[#f0e0dc] bg-white p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
                        Special access
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#888]">
                        {hasSavedDetails ?
                    "Your special-user details are loaded below." :
                    "No saved details were found. Fill out the form below."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-[#f0e0dc] bg-[#fdf5f3] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d94f4f]">
                          {specialUser?.allowedCategories.length ?? 0} allowed categories
                        </span>
                      </div>
                    </div>
                }

                  {/* Personal details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="First name" value={profile.details.firstName}
                  onChange={(v) => setDetails("firstName", v)} />
                    <Field label="Last name" value={profile.details.lastName}
                  onChange={(v) => setDetails("lastName", v)} />
                    <Field label="Email" type="email" value={profile.details.email}
                  onChange={(v) => setDetails("email", v)} />
                    <Field label="Invoice email" type="email" value={profile.details.emailInvoice}
                  onChange={(v) => setDetails("emailInvoice", v)} />
                    <Field label="Mobile code" value={profile.details.mobileCode}
                  onChange={(v) => setDetails("mobileCode", v)} />
                    <Field label="Mobile number" value={profile.details.mobile}
                  onChange={(v) => setDetails("mobile", v)} />
                  </div>

                  {/* Business details */}
                  <SectionCard title="Business details">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Company name" value={profile.invoice.companyName}
                    onChange={(v) => setInvoice("companyName", v)} />
                      <Field label="Category" value={profile.invoice.category.name}
                    onChange={(v) => setInvoice("category", {
                      id: v.toLowerCase().replace(/\s+/g, "-"), name: v
                    })} />
                      <Field label="Website" value={profile.invoice.website}
                    onChange={(v) => setInvoice("website", v)} />
                      <Field label="GST number" value={profile.invoice.gstNumber ? profile.invoice.gstNumber : ""}
                    onChange={(v) => setInvoice("gstNumber", v)} />
                    </div>
                  </SectionCard>

                  {/* Invoice address */}
                  <SectionCard title="Invoice address">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Street" value={profile.invoice.street}
                    onChange={(v) => setInvoice("street", v)} />
                      <Field label="Number" value={profile.invoice.nr}
                    onChange={(v) => setInvoice("nr", v)} />
                      <Field label="City" value={profile.invoice.city}
                    onChange={(v) => setInvoice("city", v)} />
                      <Field label="ZIP" value={profile.invoice.zip}
                    onChange={(v) => setInvoice("zip", v)} />
                      <Field label="Country" value={profile.invoice.country}
                    onChange={(v) => setInvoice("country", v)} colSpan2 />
                    </div>
                  </SectionCard>

                  {/* Shipping address */}
                  <SectionCard title="Shipping address">
                    <div className="flex items-center justify-between gap-4">
                      <label className="flex items-center gap-2 text-sm text-[#888]">
                        <input
                        type="checkbox"
                        checked={profile.shipping.sameAsInvoice}
                        onChange={(e) => setShipping("sameAsInvoice", e.target.checked)}
                        className="h-4 w-4 rounded accent-[#E8654A]" />
                      
                        Same as invoice
                      </label>
                    </div>

                    {!profile.shipping.sameAsInvoice &&
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <Field label="Company name" value={profile.shipping.companyName}
                    onChange={(v) => setShipping("companyName", v)} />
                        <Field label="Street" value={profile.shipping.street}
                    onChange={(v) => setShipping("street", v)} />
                        <Field label="City" value={profile.shipping.city}
                    onChange={(v) => setShipping("city", v)} />
                        <Field label="Country" value={profile.shipping.country}
                    onChange={(v) => setShipping("country", v)} />
                      </div>
                  }
                  </SectionCard>

                  {/* Save button */}
                  <div className="flex justify-end">
                    <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={isSaving}
                    className="rounded-xl px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}>
                    
                      {isSaving ? "Saving..." : isSpecialSession ? "Save details" : "Update details"}
                    </button>
                  </div>
                </div>
              }
            </div>
          </section>

          {/* ── Right: Orders ──────────────────────────────────────────── */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
                Your orders
              </p>
              <h2
                className="mt-2 text-3xl italic text-[#1a1a1a]"
                style={{ fontFamily: "'Georgia', serif" }}>
                
                Requests
              </h2>

              <div className="mt-6 space-y-3">
                {isLoading ?
                <p className="text-sm text-[#888]">Loading orders...</p> :
                isSpecialSession ?
                <div className="rounded-xl border border-dashed border-[#f0e0dc] p-6 text-sm text-[#888]">
                    Special users do not have an order history in this view.
                  </div> :
                orders.length > 0 ?
                orders.map((order) =>
                <Link key={order.id}
                  to={getOrderHref(order.id)}
                  className="block rounded-xl border border-[#f0e0dc] bg-white p-4 transition-colors hover:border-[#E8654A]">
                  
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                        className="font-semibold text-[#1a1a1a]"
                        style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
                        
                            {order.orderNumber}
                          </p>
                          <p className="mt-1 text-xs text-[#888]">
                            {formatDate(order.createdAt)} · {order.itemCount} items
                          </p>
                        </div>
                        <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusClasses(order.status)}`}>
                      
                          {order.status}
                        </span>
                      </div>
                    </Link>
                ) :

                <div className="rounded-xl border border-dashed border-[#f0e0dc] p-6 text-sm text-[#888]">
                    No quote requests yet. Add fabrics to your cart and proceed to quote.
                  </div>
                }
              </div>

              {/* Trade support card */}
              <div
                className="mt-8 rounded-2xl px-5 py-6"
                style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}>
                
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
                  Trade Support
                </p>
                <p
                  className="mt-3 text-xl italic text-white"
                  style={{ fontFamily: "'Georgia', serif" }}>
                  
                  Need help sourcing?
                </p>
                <p className="mt-2 text-xs leading-5 text-white/60">
                  Reach out for custom sourcing and bulk requirements.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-[#1a1a1a] transition-opacity hover:opacity-90">
                  
                  Contact Us
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>);

}