"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DashboardRecentUser } from "@/app/services/overviewService";

type RecentUsersProps = {
  users: DashboardRecentUser[];
  isLoading: boolean;
};

export default function RecentUsers({ users, isLoading }: RecentUsersProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Recent Users</h2>
        <button
          onClick={() => router.push("/admin/users")}
          className="cursor-pointer text-xs text-indigo-500 flex items-center gap-1 hover:underline"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-gray-100 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 rounded bg-gray-100 animate-pulse" />
                <div className="h-2.5 w-24 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className="py-4 text-xs text-gray-400">No users in this date range.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const initials = user.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div key={user.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-gray-400">{user.email}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.status
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {user.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
