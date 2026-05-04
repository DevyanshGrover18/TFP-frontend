"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import {
  getCartItems,
  removeCartItem,
  type CartItemRecord,
} from "@/app/services/cartService";
import { buildLoginRedirectPath } from "@/app/services/authRedirect";
import { useCartCount } from "@/app/context/CartCountContext";
import { useAuth } from "@/app/context/AuthContext";
import { ArrowRight } from "lucide-react";

type PendingState = Record<string, boolean>;

function getItemKey(item: CartItemRecord) {
  return `${item.productId}:${item.variantId ?? "base"}`;
}

function getVariantLabel(item: CartItemRecord) {
  return item.variant?.name || item.colorCode || "Base fabric";
}

export default function CartDetails() {
  const [items, setItems] = useState<CartItemRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pendingRows, setPendingRows] = useState<PendingState>({});
  const pathname = usePathname();
  const { user, specialUser, isSpecialSession } = useAuth();
  const { setCount } = useCartCount();
  const activeUser = isSpecialSession ? specialUser : user;

  useEffect(() => {
    if (!activeUser?.id) {
      setItems([]);
      setCount(0);
      setLoadError("");
      setIsLoading(false);
      return;
    }

    const loadCart = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const response = await getCartItems();
        setItems(response.items ?? []);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Unable to load cart.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadCart();
  }, [activeUser?.id, pathname, setCount]);

  const totalItems = useMemo(() => items.length, [items]);
  useEffect(() => { setCount(totalItems); }, [totalItems, setCount]);

  const setRowPending = (key: string, value: boolean) =>
    setPendingRows((prev) => ({ ...prev, [key]: value }));

  const handleRemove = async (item: CartItemRecord) => {
    const itemKey = getItemKey(item);
    try {
      setRowPending(itemKey, true);
      await removeCartItem({ productId: item.productId, variantId: item.variantId });
      setItems((prev) => prev.filter((entry) => getItemKey(entry) !== itemKey));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove item.");
    } finally {
      setRowPending(itemKey, false);
    }
  };

  if (!activeUser && !isLoading) {
    return (
      <div
        className="min-h-screen bg-white px-6 py-20"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
            Trade Portal
          </p>
          <h1
            className="mt-3 text-4xl italic text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Cart
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#888]">
            Sign in to access your cart, review selected fabrics, and continue
            with your sample request.
          </p>
          <Link
            href={buildLoginRedirectPath(pathname)}
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)",
            }}
          >
            Sign In <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white px-4 pb-24 pt-10 antialiased sm:px-8 lg:px-12"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mx-auto max-w-[1600px]">

        {/* Header */}
        <header className="mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
            Trade Portal
          </p>
          <h1
            className="mt-2 text-5xl italic tracking-tight text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Sample Order
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#888]">
            Manage and review your professional wholesale fabric orders before
            requesting a quote from the selected variants in your cart.
          </p>
        </header>

        {/* Error */}
        {loadError && (
          <div className="mb-6 rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] px-6 py-4 text-sm text-[#d94f4f]">
            {loadError}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] px-6 py-12 text-sm text-[#888]">
            Loading your cart...
          </div>

        /* Empty */
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] px-8 py-14 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
              Your cart
            </p>
            <h2
              className="mt-3 text-3xl italic text-[#1a1a1a]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              No fabrics in your cart
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#888]">
              Browse the catalogue and add fabric variants from any product page.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}
            >
              Explore Products →
            </Link>
          </div>

        /* Cart items */
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">

            {/* Table */}
            <div className="grow">
              <div className="overflow-hidden rounded-2xl border border-[#f0e0dc]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#f0e0dc] bg-[#fdf5f3]">
                      {["Product", "Variant", ""].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d94f4f]"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0e0dc] bg-white">
                    {items.map((item) => {
                      const rowKey = getItemKey(item);
                      const isPending = pendingRows[rowKey];

                      return (
                        <tr
                          key={rowKey}
                          className="transition-colors duration-200 hover:bg-[#fdf5f3]"
                        >
                          {/* Product */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-5">
                              <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-[#f0e0dc] bg-[#fdf5f3]">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <span
                                  className="block text-lg italic text-[#1a1a1a]"
                                  style={{ fontFamily: "'Georgia', serif" }}
                                >
                                  {item.name}
                                </span>
                                <p className="mt-1 text-xs leading-5 text-[#888]">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Variant */}
                          <td className="px-6 py-5">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d94f4f]">
                                {item.variant?.sku || item.sku}
                              </span>
                              <span className="text-sm text-[#1a1a1a]">
                                {getVariantLabel(item)}
                              </span>
                            </div>
                          </td>

                          {/* Remove */}
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => handleRemove(item)}
                              disabled={isPending}
                              className="text-[#ccc] transition-colors hover:text-[#d94f4f] disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Remove item"
                            >
                              <svg
                                width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor"
                                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
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

              {/* Table footer */}
              <div className="mt-6 flex items-center justify-between px-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d94f4f]">
                    Total Variants
                  </span>
                  <span
                    className="mt-1 text-2xl italic text-[#1a1a1a]"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {totalItems}
                  </span>
                </div>

                <Link
                  href="/products"
                  className="flex items-center gap-2 rounded-xl border border-[#f0e0dc] bg-[#fdf5f3] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d94f4f] transition-colors hover:border-[#E8654A]"
                >
                  <svg
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Fabric Variant
                </Link>
              </div>
            </div>

            {/* Summary sidebar */}
            <aside className="w-full lg:w-[380px]">
              <div className="sticky top-32 space-y-4">

                {/* Summary card */}
                <div className="rounded-2xl border border-[#f0e0dc] bg-[#fdf5f3] p-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">
                    Order summary
                  </p>
                  <h2
                    className="mt-2 border-b border-[#f0e0dc] pb-5 text-3xl italic text-[#1a1a1a]"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    Summary
                  </h2>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#888]">
                        Number of Items
                      </span>
                      <span
                        className="text-xl italic text-[#1a1a1a]"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {totalItems}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/order-form"
                    className="mt-8 block w-full rounded-xl py-4 text-center text-[12px] font-bold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}
                  >
                    Request for Sample
                  </Link>

                  <p className="mt-6 text-center text-[11px] italic leading-relaxed text-[#bbb]">
                    * Final pricing and logistics will be confirmed in the
                    generated formal quote within 24 business hours.
                  </p>
                </div>

                {/* Trade support card */}
                <div
                  className="rounded-2xl px-6 py-6"
                  style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
                    Trade Support
                  </p>
                  <p
                    className="mt-3 text-xl italic text-white"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    Need help sourcing?
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/60">
                    Reach out for custom sourcing and bulk requirements.
                  </p>
                  <button
                    type="button"
                    className="mt-4 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-[#1a1a1a] transition-opacity hover:opacity-90"
                  >
                    Contact Us
                  </button>
                </div>

              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
