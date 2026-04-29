import { fetchApi } from "./api";

export type DashboardDateRange = {
  startDate: string;
  endDate: string;
};

export type DashboardStats = {
  productCount: number;
  userCount: number;
  orderCount: number;
  categoriesCount: number;
};

export type DashboardTopProduct = {
  id: string;
  name: string;
  requests: number;
  pct: number;
};

export type DashboardTopCategory = {
  name: string;
  count: number;
  pct: number;
};

export type DashboardRecentOrder = {
  id: string;
  orderNumber: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createdAt: string;
  customerName: string;
  email: string;
  itemCount: number;
};

export type DashboardRecentUser = {
  id: string;
  name: string;
  email: string;
  status?: boolean;
  createdAt: string;
};

export type OverviewDashboardData = {
  stats: DashboardStats;
  topProducts: DashboardTopProduct[];
  topCategories: DashboardTopCategory[];
  recentOrders: DashboardRecentOrder[];
  recentUsers: DashboardRecentUser[];
};

function buildRangeQuery(range: DashboardDateRange) {
  const params = new URLSearchParams({
    startDate: range.startDate,
    endDate: range.endDate,
  });

  return params.toString();
}

export const getOverviewDashboardData = (range: DashboardDateRange) => {
  return fetchApi<{ success: boolean; data: OverviewDashboardData }>(
    `/overview/stats?${buildRangeQuery(range)}`,
    {
      cache: "no-store",
    },
  );
};
