"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllCategories, type Category } from "@/app/services/categoriesService";

const BAR_COLORS = [
  "bg-indigo-400",
  "bg-violet-400",
  "bg-blue-400",
  "bg-cyan-400",
  "bg-teal-400",
  "bg-gray-300", // for "Others"
];

type FlatCategory = {
  name: string;
  count: number;
  color: string;
  pct: number;
};

function flattenTopLevel(categories: Category[]): FlatCategory[] {
  const top = categories
    .filter((c) => c.level === 1)
    .map((c) => ({ name: c.name, count: c.productCount ?? 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const top5 = top.slice(0, 5);
  const rest = top.slice(5);
  const othersCount = rest.reduce((sum, c) => sum + c.count, 0);

  const final = [
    ...top5.map((c, i) => ({ ...c, color: BAR_COLORS[i] })),
    ...(othersCount > 0
      ? [{ name: "Others", count: othersCount, color: BAR_COLORS[5] }]
      : []),
  ];

  const total = final.reduce((sum, c) => sum + c.count, 0);

  return final.map((c) => ({
    ...c,
    pct: total > 0 ? Math.round((c.count / total) * 100) : 0,
  }));
}

export default function TopCategories() {
  const [items, setItems] = useState<FlatCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAllCategories();
        setItems(flattenTopLevel(response.categories ?? []));
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
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
          <div className="h-2 rounded-full bg-gray-100 animate-pulse mb-5" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-100 animate-pulse shrink-0" />
              <div className="flex-1 h-3 rounded bg-gray-100 animate-pulse" />
              <div className="w-16 h-3 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-gray-400 py-4">No categories with products yet.</p>
      ) : (
        <>
          {/* Stacked bar */}
          <div className="flex h-2 rounded-full overflow-hidden mb-5 gap-0.5">
            {items.map((c) => (
              <div
                key={c.name}
                className={`${c.color} h-full transition-all`}
                style={{ width: `${c.pct}%` }}
              />
            ))}
          </div>

          <div className="space-y-3">
            {items.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${c.color} shrink-0`} />
                <p className={`text-sm flex-1 truncate ${c.name === "Others" ? "text-gray-400 italic" : "text-gray-700"}`}>
                  {c.name}
                </p>
                <p className="text-xs text-gray-400">{c.count} products</p>
                <p className="text-xs font-semibold text-gray-600 w-8 text-right">
                  {c.pct}%
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}