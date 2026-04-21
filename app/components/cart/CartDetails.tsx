"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  getCartItems,
  removeCartItem,
  type CartItemRecord,
} from "@/app/services/cartService";
import { getStoredUser } from "@/app/services/userSession";

type PendingState = Record<string, boolean>;

function getItemKey(item: CartItemRecord) {
  return `${item.productId}:${item.variantId ?? "base"}`;
}

function getVariantLabel(item: CartItemRecord) {
  return item.variant?.name || item.colorCode || "Base fabric";
}

export default function CartDetails() {
  const [items, setItems] = useState<CartItemRecord[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pendingRows, setPendingRows] = useState<PendingState>({});

  useEffect(() => {
    const user = getStoredUser();

    if (!user?.id) {
      setUserId(null);
      setIsLoading(false);
      return;
    }

    setUserId(user.id);

    const loadCart = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const response = await getCartItems(user.id);
        setItems(response.items ?? []);
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Unable to load cart.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const totalItems = useMemo(() => items.length, [items]);


  const setRowPending = (key: string, value: boolean) => {
    setPendingRows((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemove = async (item: CartItemRecord) => {
    if (!userId) {
      return;
    }

    const itemKey = getItemKey(item);

    try {
      setRowPending(itemKey, true);
      await removeCartItem({
        userId,
        productId: item.productId,
        variantId: item.variantId,
      });

      setItems((prev) => prev.filter((entry) => getItemKey(entry) !== itemKey));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to remove item.",
      );
    } finally {
      setRowPending(itemKey, false);
    }
  };

  if (!userId && !isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf5] px-6 py-20 text-[#1a1c19]">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
          <h1
            className="text-4xl italic text-[#01010f]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Your Cart
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#47464c]">
            Sign in to load your saved fabric selections and continue building your
            bulk order.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex rounded-md bg-[#01010f] px-6 py-3 text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:bg-primary"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf5] px-6 pb-24 pt-10 text-[#1a1c19] antialiased sm:px-12">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-16">
          <h1
            className="mb-3 text-5xl italic tracking-tight text-[#01010f]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Bulk Order
          </h1>
          <p className="max-w-xl text-sm leading-6 text-[#47464c]">
            Manage and review your professional wholesale fabric orders before
            requesting a quote from the selected variants in your cart.
          </p>
        </header>

        {loadError ? (
          <div className="rounded-2xl border border-[#f4dfcf] bg-white px-6 py-5 text-sm text-[#6a4334]">
            {loadError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-sm text-[#47464c] shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
            Loading your cart...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-white px-8 py-14 text-center shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
            <h2
              className="text-3xl italic text-[#01010f]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              No fabrics in your cart
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#47464c]">
              Browse the catalogue and add fabric variants from any product page.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex rounded-md bg-[#01010f] px-6 py-3 text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:bg-primary"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-16 lg:flex-row">
            <div className="grow">
              <div className="overflow-hidden rounded-lg bg-white">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f4f4ef] text-left">
                      {["Product", "Variant", ""].map((heading) => (
                        <th
                          key={heading}
                          className="px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#47464c]"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f4ef]">
                    {items.map((item) => {
                      const rowKey = getItemKey(item);
                      const isPending = pendingRows[rowKey];

                      return (
                        <tr
                          key={rowKey}
                          className="group transition-colors duration-200 hover:bg-[#f4f4ef]"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-6">
                              <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-[#eeeee9]">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <span
                                  className="block text-lg italic text-[#01010f]"
                                  style={{
                                    fontFamily: "Georgia, 'Times New Roman', serif",
                                  }}
                                >
                                  {item.name}
                                </span>
                                <p className="mt-1 text-xs leading-5 text-[#6b6a70]">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[11px] font-bold uppercase tracking-widest text-[#47464c]">
                                {item.variant?.sku || item.sku}
                              </span>
                              <span className="text-sm text-[#01010f]">
                                {getVariantLabel(item)}
                              </span>
                            </div>
                          </td>

                          <td className="px-8 py-6 text-right">
                            <button
                              onClick={() => handleRemove(item)}
                              disabled={isPending}
                              className="text-[#47464c] transition-colors hover:text-[#ba1a1a] disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Remove item"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex items-center justify-between px-4">
                <div className="flex gap-12">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-[#47464c]">
                      Total Variants
                    </span>
                    <span
                      className="text-2xl text-[#01010f]"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {totalItems}
                    </span>
                  </div>
                </div>

                <Link
                  href="/products"
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#47464c] transition-all duration-300 hover:text-[#01010f]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Add Fabric Variant
                </Link>
              </div>
            </div>

            <aside className="w-full lg:w-[400px]">
              <div className="sticky top-32 rounded-lg bg-[#f4f4ef] p-10 shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
                <h2
                  className="mb-8 border-b border-[#c8c5cd]/30 pb-4 text-3xl italic text-[#01010f]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Summary
                </h2>

                <div className="mb-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-[#47464c]">
                      Number of Items
                    </span>
                    <span className="font-bold text-[#01010f]">{totalItems}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full rounded-md bg-[#01010f] py-5 text-[12px] font-bold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-primary active:scale-[0.98]">
                    Proceed to Quote
                  </button>
                  <button className="w-full rounded-md border border-[#c8c5cd] py-5 text-[12px] font-bold uppercase tracking-[0.25em] text-[#01010f] transition-all duration-300 hover:bg-white">
                    Save as Draft
                  </button>
                </div>

                <p className="mt-8 text-center text-[11px] italic leading-relaxed text-[#47464c]/70">
                  * Final pricing and logistics will be confirmed in the generated
                  formal quote within 24 business hours.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
