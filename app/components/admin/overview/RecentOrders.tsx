"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DashboardRecentOrder } from "@/app/services/overviewService";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

type RecentOrdersProps = {
  orders: DashboardRecentOrder[];
  isLoading: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function RecentOrders({
  orders,
  isLoading,
}: RecentOrdersProps) {
  const router = useRouter();

  return (
    <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Recent Orders</h2>
        <button
          onClick={() => router.push("/admin/orders")}
          className="cursor-pointer text-xs text-indigo-500 flex items-center gap-1 hover:underline"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="py-4 text-xs text-gray-400">No orders in this date range.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400">
              <th className="pb-2 text-left font-medium">Order</th>
              <th className="pb-2 text-left font-medium">Customer</th>
              <th className="hidden pb-2 text-left font-medium md:table-cell">
                Date
              </th>
              <th className="pb-2 text-left font-medium">Status</th>
              <th className="pb-2 text-right font-medium">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="py-2.5 text-xs text-gray-400">
                  {order.orderNumber}
                </td>
                <td className="py-2.5">
                  <p className="text-xs font-medium leading-tight text-gray-800">
                    {order.customerName || "-"}
                  </p>
                  <p className="text-[11px] text-gray-400">{order.email}</p>
                </td>
                <td className="hidden py-2.5 text-xs text-gray-500 md:table-cell">
                  {formatDate(order.createdAt)}
                </td>
                <td className="py-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[order.status] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2.5 text-right text-xs font-semibold text-gray-800">
                  {order.itemCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
