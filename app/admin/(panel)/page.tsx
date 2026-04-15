import React from 'react';
import {
  ShoppingBag,
  ClipboardList,
  Users,
  Folders,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';

const stats = [
  {
    label: 'Products',
    value: '1,284',
    delta: '+12%',
    up: true,
    icon: <ShoppingBag size={20} />,
    color: 'bg-violet-50 text-violet-600',
    iconBg: 'bg-violet-100',
  },
  {
    label: 'Orders',
    value: '3,572',
    delta: '+8.4%',
    up: true,
    icon: <ClipboardList size={20} />,
    color: 'bg-blue-50 text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    label: 'Users',
    value: '842',
    delta: '-2.1%',
    up: false,
    icon: <Users size={20} />,
    color: 'bg-emerald-50 text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
  {
    label: 'Categories',
    value: '38',
    delta: '+3',
    up: true,
    icon: <Folders size={20} />,
    color: 'bg-amber-50 text-amber-600',
    iconBg: 'bg-amber-100',
  },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Alice Johnson', product: 'Wireless Headphones', status: 'Delivered', amount: '$129.00' },
  { id: '#ORD-002', customer: 'Bob Smith', product: 'Mechanical Keyboard', status: 'Pending', amount: '$89.00' },
  { id: '#ORD-003', customer: 'Carol White', product: 'USB-C Hub', status: 'Processing', amount: '$45.00' },
  { id: '#ORD-004', customer: 'David Lee', product: 'Webcam HD', status: 'Delivered', amount: '$72.00' },
  { id: '#ORD-005', customer: 'Eva Martinez', product: 'Standing Desk Mat', status: 'Cancelled', amount: '$34.00' },
];

const topProducts = [
  { name: 'Wireless Headphones', sales: 340, revenue: '$43,860', pct: 90 },
  { name: 'Mechanical Keyboard', sales: 280, revenue: '$24,920', pct: 74 },
  { name: 'USB-C Hub', sales: 210, revenue: '$9,450', pct: 55 },
  { name: 'Webcam HD', sales: 175, revenue: '$12,600', pct: 46 },
  { name: 'Standing Desk Mat', sales: 140, revenue: '$4,760', pct: 37 },
];

const categories = [
  { name: 'Electronics', count: 520, color: 'bg-violet-500', pct: 40 },
  { name: 'Accessories', count: 384, color: 'bg-blue-500', pct: 30 },
  { name: 'Office', count: 230, color: 'bg-emerald-500', pct: 18 },
  { name: 'Others', count: 150, color: 'bg-amber-500', pct: 12 },
];

const recentUsers = [
  { name: 'Alice Johnson', email: 'alice@email.com', joined: 'Apr 12', orders: 5 },
  { name: 'Bob Smith', email: 'bob@email.com', joined: 'Apr 11', orders: 2 },
  { name: 'Carol White', email: 'carol@email.com', joined: 'Apr 10', orders: 8 },
  { name: 'David Lee', email: 'david@email.com', joined: 'Apr 9', orders: 1 },
];

const statusStyles: Record<string, string> = {
  Delivered: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Processing: 'bg-blue-50 text-blue-700',
  Cancelled: 'bg-red-50 text-red-700',
};

const Overview: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4">
            <div className={`${s.iconBg} p-2.5 rounded-xl`}>
              <span className={s.color.split(' ')[1]}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 leading-none">{s.value}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {s.up
                  ? <TrendingUp size={12} className="text-emerald-500" />
                  : <TrendingDown size={12} className="text-red-400" />}
                <span className={`text-xs font-medium ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {s.delta} this month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">

        {/* Top Products */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Top Products</h2>
            <button className="text-xs text-indigo-500 flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <p className="text-sm text-gray-700 w-44 truncate">{p.name}</p>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 w-8 text-right">{p.sales}</p>
                <p className="text-xs font-semibold text-gray-700 w-16 text-right">{p.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Categories</h2>
            <button className="text-xs text-indigo-500 flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </button>
          </div>

          {/* Stacked bar */}
          <div className="flex h-2 rounded-full overflow-hidden mb-5 gap-0.5">
            {categories.map((c) => (
              <div key={c.name} className={`${c.color} h-full`} style={{ width: `${c.pct}%` }} />
            ))}
          </div>

          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${c.color} flex-shrink-0`} />
                <p className="text-sm text-gray-700 flex-1">{c.name}</p>
                <p className="text-xs text-gray-400">{c.count} products</p>
                <p className="text-xs font-semibold text-gray-600 w-8 text-right">{c.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Recent Orders</h2>
            <button className="text-xs text-indigo-500 flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Order</th>
                <th className="text-left pb-2 font-medium">Customer</th>
                <th className="text-left pb-2 font-medium hidden md:table-cell">Product</th>
                <th className="text-left pb-2 font-medium">Status</th>
                <th className="text-right pb-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-gray-400 text-xs">{o.id}</td>
                  <td className="py-2.5 text-gray-800 font-medium">{o.customer}</td>
                  <td className="py-2.5 text-gray-500 hidden md:table-cell">{o.product}</td>
                  <td className="py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-gray-800 font-semibold">{o.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Recent Users</h2>
            <button className="text-xs text-indigo-500 flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u) => {
              const initials = u.name.split(' ').map((n) => n[0]).join('');
              return (
                <div key={u.email} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{u.joined}</p>
                    <p className="text-xs font-semibold text-gray-600">{u.orders} orders</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;