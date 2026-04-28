"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllOrders, type OrderRecord } from "@/app/services/orderService";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAllOrders();
        setOrders((response.orders ?? []).slice(0, 5));
      } catch {
        // silently fail — this is a dashboard widget
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
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
        <p className="text-xs text-gray-400 py-4">No orders yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-100">
              <th className="text-left pb-2 font-medium">Order</th>
              <th className="text-left pb-2 font-medium">Customer</th>
              <th className="text-left pb-2 font-medium hidden md:table-cell">
                Date
              </th>
              <th className="text-left pb-2 font-medium">Status</th>
              <th className="text-right pb-2 font-medium">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 text-gray-400 text-xs">
                  {order.orderNumber}
                </td>
                <td className="py-2.5">
                  <p className="text-gray-800 font-medium text-xs leading-tight">
                    {order.customerName || "—"}
                  </p>
                  <p className="text-gray-400 text-[11px]">{order.email}</p>
                </td>
                <td className="py-2.5 text-gray-500 text-xs hidden md:table-cell">
                  {formatDate(order.createdAt)}
                </td>
                <td className="py-2.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[order.status] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2.5 text-right text-gray-800 font-semibold text-xs">
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