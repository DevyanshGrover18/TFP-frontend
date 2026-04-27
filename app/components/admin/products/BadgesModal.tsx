"use client";

import { Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { BadgeRecord } from "@/app/services/badgesService";

const RESERVED_BADGE_NAMES = new Set(["New", "Sold Out"]);

type BadgesModalProps = {
  isOpen: boolean;
  badges: BadgeRecord[];
  isSaving?: boolean;
  isDeletingId?: string | null;
  onClose: () => void;
  onCreate: (name: string) => void | Promise<void>;
  onDelete: (badge: BadgeRecord) => void | Promise<void>;
};

const BadgesModal = ({
  isOpen,
  badges,
  isSaving = false,
  isDeletingId = null,
  onClose,
  onCreate,
  onDelete,
}: BadgesModalProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName("");
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
          Product badges
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-gray-900">
          Customize badges
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Create reusable badge labels and assign one or more badges per product.
        </p>

        <div className="mt-6 rounded-2xl border border-gray-200 p-4">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            <span>Add badge</span>
            <div className="flex gap-3">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Bestseller"
                className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
              />
              <button
                type="button"
                onClick={async () => {
                  await onCreate(name);
                  setName("");
                }}
                disabled={isSaving}
                className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Add"}
              </button>
            </div>
          </label>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">
              Saved badges
            </h4>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {badges.length} total
            </span>
          </div>

          {badges.length ? (
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {badges.map((badge) => (
                (() => {
                  const isReserved = RESERVED_BADGE_NAMES.has(badge.name);

                  return (
                    <div
                      key={badge.id}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">
                          {badge.name}
                        </span>
                        {isReserved ? (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                            Built in
                          </span>
                        ) : null}
                      </div>
                      {isReserved ? (
                        <span className="text-xs font-medium text-gray-400">
                          Cannot delete
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void onDelete(badge)}
                          disabled={isDeletingId === badge.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <Trash2 size={14} />
                          {isDeletingId === badge.id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  );
                })()
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
              No badges created yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgesModal;
