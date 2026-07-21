import { fetchApi } from "./api";




















































function buildRangeQuery(range) {
  const params = new URLSearchParams({
    startDate: range.startDate,
    endDate: range.endDate
  });

  return params.toString();
}

export const getOverviewDashboardData = (range) => {
  return fetchApi(
    `/overview/stats?${buildRangeQuery(range)}`,
    {
      cache: "no-store"
    }
  );
};