"use client";

import type { OrderRecord } from "@/app/services/orderService";
import { updateOrderStatus } from "@/app/services/orderService";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

const ORDER_STATUSES = ["Pending", "Processing", "Completed", "Cancelled"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

type OrderModalProps = {
  isOpen: boolean;
  order: OrderRecord | null;
  onClose: () => void;
  onStatusUpdate?: (orderId: string, newStatus: OrderRecord["status"]) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function AddressBlock({ title, lines }: { title: string; lines: string[] }) {
  const visibleLines = lines.filter(Boolean);

  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <div className="mt-2 space-y-1 text-sm text-gray-600">
        {visibleLines.length > 0 ? (
          visibleLines.map((line) => <p key={line}>{line}</p>)
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
}

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrderModal({
  isOpen,
  order,
  onClose,
  onStatusUpdate,
}: OrderModalProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(
    (order?.status as OrderStatus) ?? "Pending",
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
  if (order?.status) {
    setCurrentStatus(order.status as OrderStatus);
  }
}, [order?.id, order?.status]);

  if (!isOpen || !order) {
    return null;
  }

  const invoice = order.profile.invoice;
  const shipping = order.profile.shipping;
  const details = order.profile.details;

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as OrderStatus;
    setIsUpdating(true);
    try {
      await updateOrderStatus(order!.id, newStatus);
      setCurrentStatus(newStatus);
      onStatusUpdate?.(order!.id, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[90vh] relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button onClick={onClose} className="group cursor-pointer absolute top-4 right-6">
          <X className="text-gray-400 group-hover:text-gray-800" />
        </button>
        <div className="border-b border-gray-100 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
            Order details
          </p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {order.orderNumber}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {order.customerName || "Unnamed customer"} ·{" "}
                {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[currentStatus] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {currentStatus}
              </span>
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {/* {isUpdating && (
                <span className="text-xs text-gray-400 animate-pulse">
                  Saving…
                </span>
              )} */}
            </div>
          </div>
        </div>

        <div className="max-h-[calc(90vh-152px)] overflow-y-auto px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Contact
              </p>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.customerName || "No name"}
                </p>
                <p>{details.email || "No email"}</p>
                <p>{order.mobile || "No mobile"}</p>
                <p>{details.emailInvoice || "No invoice email"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Company
              </p>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {invoice.companyName || "No company"}
                </p>
                <p>{invoice.category || "No category"}</p>
                <p>{invoice.website || "No website"}</p>
                <p>{invoice.vatNumber || "No VAT number"}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <AddressBlock
              title="Invoice address"
              lines={[
                invoice.companyName,
                [invoice.street, invoice.nr].filter(Boolean).join(" ").trim(),
                invoice.apartment,
                [invoice.city, invoice.zip].filter(Boolean).join(", "),
                invoice.country,
                invoice.chamberOfCommerce
                  ? `Chamber of commerce: ${invoice.chamberOfCommerce}`
                  : "",
              ]}
            />

            <AddressBlock
              title="Shipping address"
              lines={
                shipping.sameAsInvoice
                  ? [
                      invoice.companyName,
                      [invoice.street, invoice.nr]
                        .filter(Boolean)
                        .join(" ")
                        .trim(),
                      invoice.apartment,
                      [invoice.city, invoice.zip].filter(Boolean).join(", "),
                      invoice.country,
                      invoice.chamberOfCommerce
                        ? `Chamber of commerce: ${invoice.chamberOfCommerce}`
                        : "",
                    ]
                  : [
                      shipping.companyName,
                      [shipping.street, shipping.nr]
                        .filter(Boolean)
                        .join(" ")
                        .trim(),
                      shipping.apartment,
                      [shipping.city, shipping.zip].filter(Boolean).join(", "),
                      shipping.country,
                    ]
              }
            />
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200">
            <div className="border-b border-gray-100 px-5 py-4">
              <h4 className="text-sm font-semibold text-gray-900">
                Requested items
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Product</th>
                    <th className="px-5 py-4 font-medium">Variant</th>
                    <th className="px-5 py-4 font-medium">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={`${item.productId}-${item.variantId ?? "base"}`}
                      className="border-t border-gray-100"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-xl border border-gray-200 object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-gray-500">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {item.variant?.name || item.colorCode || "Base fabric"}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}