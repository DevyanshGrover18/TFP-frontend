const orders = [
  { id: "#10241", customer: "Aarav Mehta", total: "$184.00", status: "Shipped" },
  { id: "#10242", customer: "Sara Khan", total: "$92.50", status: "Processing" },
  { id: "#10243", customer: "Riya Sharma", total: "$321.75", status: "Pending" },
];

export default function OrdersPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
          Orders
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-2 text-sm text-gray-500">
          Order management placeholder for the admin panel.
        </p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-500">{order.customer}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{order.total}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1">{order.status}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
