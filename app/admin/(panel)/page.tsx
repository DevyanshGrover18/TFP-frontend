"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  ClipboardList,
  Users,
  Folders,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getOverviewDashboardData,
  type OverviewDashboardData,
} from "@/app/services/overviewService";
import RecentOrders from "@/app/components/admin/overview/RecentOrders";
import RecentUsers from "@/app/components/admin/overview/RecentUsers";
import TopCategories from "@/app/components/admin/overview/TopCategories";

const EMPTY_DASHBOARD: OverviewDashboardData = {
  stats: {
    productCount: 0,
    userCount: 0,
    orderCount: 0,
    categoriesCount: 0,
  },
  topProducts: [],
  topCategories: [],
  recentOrders: [],
  recentUsers: [],
};

function toInputDate(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);

  return {
    startDate: toInputDate(start),
    endDate: toInputDate(end),
  };
}

const Overview: React.FC = () => {
  const router = useRouter();
  const [range, setRange] = useState(getDefaultRange);
  const [data, setData] = useState<OverviewDashboardData>(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      try {
        const response = await getOverviewDashboardData(range);
        setData(response.data);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboardData();
  }, [range]);

  const stats = [
    {
      label: "Products",
      value: data.stats.productCount,
      delta: "+12%",
      up: true,
      icon: <ShoppingBag size={20} />,
      color: "bg-violet-50 text-violet-600",
      iconBg: "bg-violet-100",
    },
    {
      label: "Orders",
      value: data.stats.orderCount,
      delta: "+8.4%",
      up: true,
      icon: <ClipboardList size={20} />,
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      label: "Users",
      value: data.stats.userCount,
      delta: "-2.1%",
      up: false,
      icon: <Users size={20} />,
      color: "bg-emerald-50 text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Categories",
      value: data.stats.categoriesCount,
      delta: "+3",
      up: true,
      icon: <Folders size={20} />,
      color: "bg-amber-50 text-amber-600",
      iconBg: "bg-amber-100",
    },
  ];

  return (
    <div className="flex-1 min-h-screen overflow-y-auto">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="mt-1 text-sm text-gray-400">
            Dashboard data is filtered by the selected date range.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-500">
            Start date
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
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-500">
            End date
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
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
            />
          </label>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4"
          >
            <div className={`${stat.iconBg} rounded-xl p-2.5`}>
              <span className={stat.color.split(" ")[1]}>{stat.icon}</span>
            </div>
            <div>
              <p className="mb-0.5 text-xs text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold leading-none text-gray-900">
                {isLoading ? "..." : stat.value}
              </p>
              
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">
              Top Products
            </h2>
            <button
              onClick={() => router.push("/admin/products")}
              className="flex cursor-pointer items-center gap-1 text-xs text-indigo-500 hover:underline"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-5 rounded-lg bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : data.topProducts.length === 0 ? (
            <p className="py-4 text-xs text-gray-400">
              No product requests found in this date range.
            </p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3">
                  <p className="w-44 truncate text-sm text-gray-700">
                    {product.name}
                  </p>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full bg-indigo-500"
                      style={{ width: `${product.pct}%` }}
                    />
                  </div>
                  <p className="w-16 text-right text-xs font-semibold text-gray-700">
                    {product.requests}
                  </p>
                  <p className="w-16 text-right text-xs text-gray-400">
                    requests
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <TopCategories categories={data.topCategories} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <RecentOrders orders={data.recentOrders} isLoading={isLoading} />
        <RecentUsers users={data.recentUsers} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Overview;
