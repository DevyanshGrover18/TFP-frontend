"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderModal from "@/app/components/admin/orders/OrderModal";
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const response = await getAllOrders();
        setOrders(response.orders ?? []);
      } catch (loadError) {
        toast.error(
          loadError instanceof Error ? loadError.message : "Failed to load orders",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, []);

  function handleStatusUpdate(orderId: string, newStatus: OrderRecord["status"]) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    setSelectedOrder((prev) =>
      prev?.id === orderId ? { ...prev, status: newStatus } : prev,
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Quote Requests
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Review customer quote requests submitted from the order form, including
            company, contact, and requested fabric variants.
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {orders.length} requests
        </span>
      </div>
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">All quote requests</h2>
        </div>

        {isLoading ? (
          <p className="px-5 py-6 text-sm text-gray-500">Loading orders...</p>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Order</th>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Company</th>
                  <th className="px-5 py-4 font-medium">Items</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-gray-500">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {order.customerName || "Unnamed customer"}
                      </p>
                      <p className="text-gray-500">{order.email || "No email"}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {order.companyName || "No company"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{order.itemCount}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[order.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-8 text-sm text-gray-500">
            No quote requests have been submitted yet.
          </div>
        )}
      </div>

      <OrderModal
        isOpen={selectedOrder !== null}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </section>
  );
}
