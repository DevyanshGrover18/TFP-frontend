"use client";

import { Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderModal from "@/app/components/admin/orders/OrderModal";
import {
  getAllOrders,
  type OrderDateRange,
  type OrderRecord,
} from "@/app/services/orderService";
import Pagination from "@/app/components/common/Pagination";
import * as XLSX from "xlsx";

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

function toInputDate(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultRange(): OrderDateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);

  return {
    startDate: toInputDate(start),
    endDate: toInputDate(end),
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState<OrderDateRange>(getDefaultRange);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "special" | "user">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | OrderRecord["status"]
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const response = await getAllOrders(range);
        setOrders(response.orders ?? []);
      } catch (loadError) {
        toast.error(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load orders",
        );
      } finally {
        setIsLoading(false);
      }
    };
    void loadOrders();
  }, [range]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter, range]);

  function handleOrderUpdate(updatedOrder: OrderRecord) {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
    );
    setSelectedOrder((prev) =>
      prev?.id === updatedOrder.id ? updatedOrder : prev,
    );
  }

  const filteredOrders = orders.filter((order) => {
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "special" && order.userRole === "special") ||
      (roleFilter === "user" && order.userRole !== "special");
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesRole && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function handleDownloadExcel() {
    const data = filteredOrders.map((order) => ({
      "Order Number": order.orderNumber,
      Date: formatDate(order.createdAt),
      Customer: order.customerName || "—",
      Email: order.email || "—",
      Mobile: order.mobile || "—",
      Company: order.companyName || "—",
      "User Type": order.userRole === "special" ? "Special" : "Normal",
      Items: order.itemCount,
      Status: order.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Auto column widths
    const colWidths = Object.keys(data[0] ?? {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...data.map((row) => String(row[key as keyof typeof row] ?? "").length),
      ),
    }));
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(
      workbook,
      `orders-${new Date().toISOString().slice(0, 10)}.xlsx`,
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
            Review customer quote requests submitted from the order form,
            including company, contact, and requested fabric variants.
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {filteredOrders.length} requests
        </span>
      </div>

      <div>
        <div className="flex flex-wrap justify-between items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-end gap-3 px-4 py-3 shadow-sm">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Start
              <input
                type="date"
                value={range.startDate}
                max={range.endDate}
                onChange={(event) =>
                  setRange((prev) => ({
                    ...prev,
                    startDate: event.target.value,
                  }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium normal-case tracking-normal text-gray-700 outline-none focus:border-indigo-400"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
              End
              <input
                type="date"
                value={range.endDate}
                min={range.startDate}
                onChange={(event) =>
                  setRange((prev) => ({
                    ...prev,
                    endDate: event.target.value,
                  }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium normal-case tracking-normal text-gray-700 outline-none focus:border-indigo-400"
              />
            </label>
          </div>
          <button
            onClick={handleDownloadExcel}
            disabled={filteredOrders.length === 0}
            className="cursor-pointer flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={14} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Role filter */}
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            User
          </span>
          {(["all", "user", "special"] as const).map((val) => (
            <button
              key={val}
              onClick={() => setRoleFilter(val)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                roleFilter === val
                  ? val === "special"
                    ? "bg-yellow-400 text-white"
                    : val === "user"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {val === "all" ? "All" : val === "special" ? "Special" : "Normal"}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Status
          </span>
          {(
            ["all", "Pending", "Processing", "Completed", "Cancelled"] as const
          ).map((val) => (
            <button
              key={val}
              onClick={() => setStatusFilter(val)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === val
                  ? val === "all"
                    ? "bg-gray-900 text-white"
                    : statusStyles[val]
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {val === "all" ? "All" : val}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            All quote requests
          </h2>
        </div>

        {isLoading ? (
          <p className="px-5 py-6 text-sm text-gray-500">Loading orders...</p>
        ) : filteredOrders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Order</th>
                    <th className="px-5 py-4 font-medium">Customer</th>
                    <th className="px-5 py-4 font-medium">Company</th>
                    <th className="px-5 py-4 font-medium">Items</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-100">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium">
                          <span
                            className={`${
                              order.userRole === "special"
                                ? "rounded-full bg-yellow-400 px-2 py-0.5 text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {order.userRole === "special"
                              ? "Special"
                              : "Normal"}
                          </span>
                        </p>
                        <p className="text-gray-500">
                          {order.email || "No email"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {order.companyName || "No company"}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {order.itemCount}
                      </td>
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
                            className="cursor-pointer rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
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

            {/* Pagination */}
            <div className="border-t border-gray-100 px-5 py-4">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredOrders.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                pageSizeOptions={[10, 20, 50]}
              />
            </div>
          </>
        ) : (
          <div className="px-5 py-8 text-sm text-gray-500">
            No orders match the selected filters.
          </div>
        )}
      </div>

      <OrderModal
        isOpen={selectedOrder !== null}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdate={handleOrderUpdate}
      />
    </section>
  );
}
