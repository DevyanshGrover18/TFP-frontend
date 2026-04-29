"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DashboardTopCategory } from "@/app/services/overviewService";

const BAR_COLORS = [
  "bg-indigo-400",
  "bg-violet-400",
  "bg-blue-400",
  "bg-cyan-400",
  "bg-teal-400",
  "bg-gray-300",
];

type FlatCategory = DashboardTopCategory & {
  color: string;
};

type TopCategoriesProps = {
  categories: DashboardTopCategory[];
  isLoading: boolean;
};

function attachColors(categories: DashboardTopCategory[]): FlatCategory[] {
  return categories.map((category, index) => ({
    ...category,
    color: BAR_COLORS[index] ?? BAR_COLORS[BAR_COLORS.length - 1],
  }));
}

export default function TopCategories({
  categories,
  isLoading,
}: TopCategoriesProps) {
  const router = useRouter();
  const items = attachColors(categories);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Categories</h2>
        <button
          onClick={() => router.push("/admin/category")}
          className="cursor-pointer text-xs text-indigo-500 flex items-center gap-1 hover:underline"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="mb-5 h-2 rounded-full bg-gray-100 animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-3 flex-1 rounded bg-gray-100 animate-pulse" />
              <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-4 text-xs text-gray-400">
          No categories found in this date range.
        </p>
      ) : (
        <>
          <div className="mb-5 flex h-2 gap-0.5 overflow-hidden rounded-full">
            {items.map((category) => (
              <div
                key={category.name}
                className={`${category.color} h-full transition-all`}
                style={{ width: `${category.pct}%` }}
              />
            ))}
          </div>

          <div className="space-y-3">
            {items.map((category) => (
              <div key={category.name} className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${category.color}`}
                />
                <p className="flex-1 truncate text-sm text-gray-700">
                  {category.name}
                </p>
                <p className="text-xs text-gray-400">{category.count} products</p>
                <p className="w-8 text-right text-xs font-semibold text-gray-600">
                  {category.pct}%
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
