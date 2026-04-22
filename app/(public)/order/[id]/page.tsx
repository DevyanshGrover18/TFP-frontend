"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Package, CheckCircle2, Clock, XCircle, Loader2, MapPin, Building2, Mail, Phone } from "lucide-react";
import { getOrderById, type OrderRecord } from "@/app/services/orderService";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type TimelineStep = {
  key: OrderRecord["status"];
  label: string;
  description: string;
  icon: React.ReactNode;
};

const TIMELINE_STEPS: TimelineStep[] = [
  {
    key: "Pending",
    label: "Quote received",
    description: "Your request has been submitted and is awaiting review.",
    icon: <Clock size={16} />,
  },
  {
    key: "Processing",
    label: "Being processed",
    description: "Our team is reviewing your request and preparing your quote.",
    icon: <Loader2 size={16} />,
  },
  {
    key: "Completed",
    label: "Order completed",
    description: "Your order was delivered to your address",
    icon: <CheckCircle2 size={16} />,
  },
];

const STATUS_ORDER: OrderRecord["status"][] = ["Pending", "Processing", "Completed"];

function isCancelled(status: OrderRecord["status"]) {
  return status === "Cancelled";
}

function getStepState(
  stepKey: OrderRecord["status"],
  currentStatus: OrderRecord["status"],
): "completed" | "active" | "upcoming" {
  if (isCancelled(currentStatus)) return "upcoming";
  const stepIdx = STATUS_ORDER.indexOf(stepKey);
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  if (stepIdx < currentIdx) return "completed";
  if (stepIdx === currentIdx) return "active";
  return "upcoming";
}

export default function OrderPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadOrder = async () => {
      try {
        setIsLoading(false);
        setError("");
        const response = await getOrderById(id);
        setOrder(response.order ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf5] flex items-center justify-center">
        <p className="text-sm text-[#47464c]">Loading order…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#fafaf5] px-6 py-20 text-[#1a1c19]">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
          <p className="text-sm text-[#6a4334]">{error || "Order not found."}</p>
          <Link
            href="/account"
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#01010f] underline underline-offset-4"
          >
            <ArrowLeft size={12} /> Back to account
          </Link>
        </div>
      </div>
    );
  }

  const cancelled = isCancelled(order.status);
  const invoice = order.profile.invoice;
  const shipping = order.profile.shipping;
  const details = order.profile.details;

  return (
    <div className="min-h-screen bg-[#fafaf5] px-6 pb-24 pt-10 text-[#1a1c19] sm:px-12">
      <div className="mx-auto max-w-[1200px]">

        {/* Back nav */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7a736c] transition hover:text-[#01010f]"
        >
          <ArrowLeft size={12} />
          Back to account
        </Link>

        {/* Header */}
        <header className="mt-8 mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a736c]">
            Quote request
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h1
              className="text-4xl italic tracking-tight text-[#01010f]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {order.orderNumber}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6b6a70]">
                Submitted {formatDateTime(order.createdAt)}
              </span>
              <StatusBadge status={order.status} />
            </div>
          </div>
        </header>

        {/* Main layout */}
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">

          {/* LEFT — Timeline */}
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                Order progress
              </p>
              <h2
                className="mt-2 text-2xl italic text-[#01010f]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {cancelled ? "Request cancelled" : "Tracking your quote"}
              </h2>

              {cancelled ? (
                <div className="mt-8 flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50 p-5">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <XCircle size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">Request cancelled</p>
                    <p className="mt-1 text-sm text-red-600">
                      This quote request has been cancelled. Please reach out if you believe this is an error or to resubmit.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const state = getStepState(step.key, order.status);
                    const isLast = idx === TIMELINE_STEPS.length - 1;

                    return (
                      <div key={step.key} className="flex gap-5">
                        {/* Spine */}
                        <div className="flex flex-col items-center">
                          <StepDot state={state} icon={step.icon} />
                          {!isLast && (
                            <div
                              className={`mt-1 w-px flex-1 transition-colors ${
                                state === "completed"
                                  ? "bg-[#01010f]"
                                  : "bg-[#e5e0d8]"
                              }`}
                              style={{ minHeight: "40px" }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                          <p
                            className={`text-sm font-semibold ${
                              state === "active"
                                ? "text-[#01010f]"
                                : state === "completed"
                                  ? "text-[#01010f]"
                                  : "text-[#b0a898]"
                            }`}
                          >
                            {step.label}
                            {state === "active" && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-[#01010f] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                Current
                              </span>
                            )}
                          </p>
                          <p
                            className={`mt-1 text-sm leading-6 ${
                              state === "upcoming" ? "text-[#c8c0b6]" : "text-[#6b6a70]"
                            }`}
                          >
                            {step.description}
                          </p>
                          {state === "completed" && (
                            <p className="mt-1 text-xs text-[#b0a898]">
                              {formatDate(order.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="rounded-3xl bg-white p-8 shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                Requested items
              </p>
              <h2
                className="mt-2 text-2xl italic text-[#01010f]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {order.items.length} {order.items.length === 1 ? "fabric" : "fabrics"}
              </h2>

              <div className="mt-6 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId ?? "base"}`}
                    className="flex items-center gap-4 rounded-2xl border border-[#ece7de] p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 flex-shrink-0 rounded-xl border border-[#ece7de] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#01010f]">{item.name}</p>
                      <p className="mt-0.5 text-xs text-[#6b6a70]">{item.sku}</p>
                      {item.variant?.name && (
                        <p className="mt-0.5 text-xs text-[#6b6a70]">
                          Variant: {item.variant.name}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="rounded-full border border-[#ddd6cc] bg-[#fafaf5] px-3 py-1 text-xs font-semibold text-[#47464c]">
                        ×{item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT — Summary */}
          <aside className="space-y-6">

            {/* Contact */}
            <div className="rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                <Mail size={11} />
                Contact
              </div>
              <div className="mt-4 space-y-2 text-sm text-[#47464c]">
                <p className="font-semibold text-[#01010f]">
                  {order.customerName || "Unnamed"}
                </p>
                {details.email && <p>{details.email}</p>}
                {order.mobile && <p>{order.mobile}</p>}
                {details.emailInvoice && (
                  <p className="text-xs text-[#7a736c]">Invoice: {details.emailInvoice}</p>
                )}
              </div>
            </div>

            {/* Company */}
            <div className="rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                <Building2 size={11} />
                Company
              </div>
              <div className="mt-4 space-y-1.5 text-sm text-[#47464c]">
                {invoice.companyName && (
                  <p className="font-semibold text-[#01010f]">{invoice.companyName}</p>
                )}
                {invoice.category && <p>{invoice.category}</p>}
                {invoice.website && (
                  <p className="text-xs text-[#7a736c]">{invoice.website}</p>
                )}
                {invoice.vatNumber && (
                  <p className="text-xs text-[#7a736c]">VAT: {invoice.vatNumber}</p>
                )}
              </div>
            </div>

            {/* Addresses */}
            <div className="rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                <MapPin size={11} />
                Addresses
              </div>

              <div className="mt-4 space-y-5">
                <AddressSummary
                  title="Invoice address"
                  lines={[
                    invoice.companyName,
                    [invoice.street, invoice.nr].filter(Boolean).join(" ").trim(),
                    invoice.apartment,
                    [invoice.city, invoice.zip].filter(Boolean).join(", "),
                    invoice.country,
                  ]}
                />

                <div className="border-t border-[#ece7de]" />

                <AddressSummary
                  title="Shipping address"
                  sameLabel={shipping.sameAsInvoice ? "Same as invoice" : undefined}
                  lines={
                    shipping.sameAsInvoice
                      ? []
                      : [
                          shipping.companyName,
                          [shipping.street, shipping.nr].filter(Boolean).join(" ").trim(),
                          shipping.apartment,
                          [shipping.city, shipping.zip].filter(Boolean).join(", "),
                          shipping.country,
                        ]
                  }
                />
              </div>
            </div>

            {/* Need help */}
            <div className="rounded-3xl border border-dashed border-[#ddd6cc] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                Need help?
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6b6a70]">
                Questions about your quote? Reach out and we'll get back to you within one business day.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center rounded-md border border-[#c8c5cd] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#01010f] transition hover:bg-white"
              >
                Contact us
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatusBadge({ status }: { status: OrderRecord["status"] }) {
  const map: Record<OrderRecord["status"], string> = {
    Pending: "bg-amber-100 text-amber-700",
    Processing: "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
}

function StepDot({
  state,
  icon,
}: {
  state: "completed" | "active" | "upcoming";
  icon: React.ReactNode;
}) {
  const base = "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all";
  if (state === "completed") {
    return (
      <div className={`${base} bg-[#01010f] text-white`}>
        <CheckCircle2 size={16} />
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className={`${base} bg-[#01010f] text-white ring-4 ring-[#01010f]/10`}>
        {icon}
      </div>
    );
  }
  return (
    <div className={`${base} border-2 border-[#e5e0d8] bg-white text-[#c8c0b6]`}>
      {icon}
    </div>
  );
}

function AddressSummary({
  title,
  lines,
  sameLabel,
}: {
  title: string;
  lines: string[];
  sameLabel?: string;
}) {
  const visible = lines.filter(Boolean);
  return (
    <div>
      <p className="text-xs font-semibold text-[#01010f]">{title}</p>
      {sameLabel ? (
        <p className="mt-1 text-xs text-[#7a736c]">{sameLabel}</p>
      ) : visible.length > 0 ? (
        <div className="mt-1.5 space-y-0.5">
          {visible.map((line) => (
            <p key={line} className="text-sm text-[#47464c]">
              {line}
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-xs text-[#b0a898]">No address on file</p>
      )}
    </div>
  );
}