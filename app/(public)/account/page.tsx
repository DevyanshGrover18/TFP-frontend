"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import { buildLoginRedirectPath } from "@/app/services/authRedirect";
import { getMyOrders, type OrderRecord } from "@/app/services/orderService";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  type UserQuoteProfile,
} from "@/app/services/userService";
import {
  getStoredSpecialUserProfile,
  storeSpecialUserProfile,
} from "@/app/services/specialUserProfileSession";
import { storeUser } from "@/app/services/userSession";

const emptyProfile: UserQuoteProfile = {
  invoice: {
    companyName: "",
    street: "",
    nr: "",
    apartment: "",
    city: "",
    zip: "",
    country: "",
    notLiableForVat: false,
    vatNumber: "",
    chamberOfCommerce: "",
    category: { id: "", name: "" },
    website: "",
  },
  shipping: {
    sameAsInvoice: false,
    companyName: "",
    street: "",
    nr: "",
    apartment: "",
    city: "",
    zip: "",
    country: "",
  },
  details: {
    firstName: "",
    lastName: "",
    email: "",
    emailInvoice: "",
    mobileCode: "",
    mobile: "",
    phoneCode: "",
    phone: "",
    acceptUpdates: false,
    acceptTerms: false,
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusClasses(status: OrderRecord["status"]) {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700";
    case "Processing":
      return "bg-blue-100 text-blue-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function splitName(name: string | undefined) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, ...rest] = trimmed.split(/\s+/);
  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function hasProfileDetails(profile: UserQuoteProfile) {
  return Boolean(
    profile.invoice.companyName ||
      profile.invoice.street ||
      profile.invoice.city ||
      profile.invoice.zip ||
      profile.invoice.country ||
      profile.shipping.companyName ||
      profile.shipping.street ||
      profile.shipping.city ||
      profile.shipping.zip ||
      profile.shipping.country ||
      profile.details.emailInvoice ||
      profile.details.mobile ||
      profile.details.phone,
  );
}

export default function AccountPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, specialUser, isSpecialSession, logout } = useAuth();
  const [profile, setProfile] = useState<UserQuoteProfile>(emptyProfile);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [hasSavedDetails, setHasSavedDetails] = useState(false);

  useEffect(() => {
    const activeUser = isSpecialSession ? specialUser : user;

    if (!activeUser?.id) {
      setIsLoading(false);
      return;
    }

    const name = splitName(activeUser.name);

    setProfile((current) => ({
      ...current,
      details: {
        ...current.details,
        firstName: current.details.firstName || name.firstName,
        lastName: current.details.lastName || name.lastName,
        email: current.details.email || activeUser.email,
      },
    }));

    if (isSpecialSession) {
      const storedProfile = getStoredSpecialUserProfile(activeUser.id);

      if (storedProfile) {
        setProfile({
          invoice: storedProfile.invoice,
          shipping: storedProfile.shipping,
          details: {
            ...storedProfile.details,
            firstName: storedProfile.details.firstName || name.firstName,
            lastName: storedProfile.details.lastName || name.lastName,
            email: storedProfile.details.email || activeUser.email,
          },
        });
        setHasSavedDetails(hasProfileDetails(storedProfile));
      } else {
        setHasSavedDetails(false);
      }

      setOrders([]);
      setIsLoading(false);
      return;
    }

    const loadAccount = async () => {
      try {
        setError("");
        const [profileResponse, ordersResponse] = await Promise.all([
          getCurrentUserProfile(),
          getMyOrders(),
        ]);

        if (profileResponse.profile) {
          setProfile(profileResponse.profile);
          setHasSavedDetails(hasProfileDetails(profileResponse.profile));
        }

        setOrders(ordersResponse.orders ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load your account.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadAccount();
  }, [isSpecialSession, specialUser, user]);

  const fullName = useMemo(
    () => `${profile.details.firstName} ${profile.details.lastName}`.trim(),
    [profile.details.firstName, profile.details.lastName],
  );

  const setInvoice = (
    field: keyof UserQuoteProfile["invoice"],
    value: string | boolean | UserQuoteProfile["invoice"]["category"],
  ) => {
    setProfile((current) => ({
      ...current,
      invoice: {
        ...current.invoice,
        [field]: value,
      },
    }));
  };

  const setShipping = (
    field: keyof UserQuoteProfile["shipping"],
    value: string | boolean,
  ) => {
    setProfile((current) => ({
      ...current,
      shipping: {
        ...current.shipping,
        [field]: value,
      },
    }));
  };

  const setDetails = (
    field: keyof UserQuoteProfile["details"],
    value: string | boolean,
  ) => {
    setProfile((current) => ({
      ...current,
      details: {
        ...current.details,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");

      if (isSpecialSession && specialUser?.id) {
        storeSpecialUserProfile(specialUser.id, profile);
        setHasSavedDetails(hasProfileDetails(profile));
        toast.success("Details saved");
        return;
      }

      const response = await updateCurrentUserProfile(profile);

      if (response.profile) {
        setProfile(response.profile);
        setHasSavedDetails(hasProfileDetails(response.profile));
      }

      if (response.user) {
        storeUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
        });
      }

      toast.success(response.message ?? "Account updated");
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Failed to update account.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch {
      // Clear local state even if the cookie is already missing.
    } finally {
      router.push("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const activeUser = isSpecialSession ? specialUser : user;

  if (!activeUser && !isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf5] px-6 py-20 text-[#1a1c19]">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
          <h1
            className="text-4xl italic text-[#01010f]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Account
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#47464c]">
            Sign in to view your saved details, quote requests, and account
            activity.
          </p>
          <Link
            href={buildLoginRedirectPath(pathname)}
            className="mt-8 inline-flex rounded-md bg-[#01010f] px-6 py-3 text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:bg-primary"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf5] px-6 pb-24 pt-10 text-[#1a1c19] sm:px-12">
      <div className="mx-auto max-w-[1320px]">
        <header className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1
              className="text-5xl italic tracking-tight text-[#01010f]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Account
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#47464c]">
              Review your saved quote details, update your business information,
              and track the status of submitted requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="rounded-md border cursor-pointer border-[#c8c5cd] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#01010f] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </header>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#f4dfcf] bg-white px-6 py-5 text-sm text-[#6a4334]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
              <div className="flex flex-col gap-2 border-b border-[#ece7de] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                    Your details
                  </p>
                  <h2
                    className="mt-2 text-3xl italic text-[#01010f]"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {fullName || "Your profile"}
                  </h2>
                </div>
                <p className="text-sm text-[#6b6a70]">
                  {profile.details.email || activeUser?.email || "No email"}
                </p>
              </div>

              {isLoading ? (
                <p className="pt-6 text-sm text-[#47464c]">
                  Loading your account...
                </p>
              ) : (
                <div className="mt-6 space-y-8">
                  {isSpecialSession && (
                    <div className="rounded-3xl border border-[#ece7de] bg-[#fbf8f2] p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                        Special access
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#47464c]">
                        {hasSavedDetails
                          ? "Your special-user details are loaded below."
                          : "No saved details were found for this special user. Fill out the empty form below."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#f3efe8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#5f594f]">
                          {specialUser?.allowedCategories.length ?? 0} allowed categories
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-[#47464c]">
                      <span>First name</span>
                      <input
                        value={profile.details.firstName}
                        onChange={(event) =>
                          setDetails("firstName", event.target.value)
                        }
                        className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                      />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-[#47464c]">
                      <span>Last name</span>
                      <input
                        value={profile.details.lastName}
                        onChange={(event) =>
                          setDetails("lastName", event.target.value)
                        }
                        className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                      />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-[#47464c]">
                      <span>Email</span>
                      <input
                        type="email"
                        value={profile.details.email}
                        onChange={(event) =>
                          setDetails("email", event.target.value)
                        }
                        className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                      />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-[#47464c]">
                      <span>Invoice email</span>
                      <input
                        type="email"
                        value={profile.details.emailInvoice}
                        onChange={(event) =>
                          setDetails("emailInvoice", event.target.value)
                        }
                        className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                      />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-[#47464c]">
                      <span>Mobile code</span>
                      <input
                        value={profile.details.mobileCode}
                        onChange={(event) =>
                          setDetails("mobileCode", event.target.value)
                        }
                        className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                      />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-[#47464c]">
                      <span>Mobile number</span>
                      <input
                        value={profile.details.mobile}
                        onChange={(event) =>
                          setDetails("mobile", event.target.value)
                        }
                        className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                      />
                    </label>
                  </div>

                  <div className="rounded-3xl border border-[#ece7de] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                      Business details
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="space-y-2 text-sm font-medium text-[#47464c]">
                        <span>Company name</span>
                        <input
                          value={profile.invoice.companyName}
                          onChange={(event) =>
                            setInvoice("companyName", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-[#47464c]">
                        <span>Category</span>
                        <input
                          value={profile.invoice.category.name}
                          onChange={(event) =>
                            setInvoice("category", {
                              id: event.target.value.toLowerCase().replace(/\s+/g, "-"),
                              name: event.target.value,
                            })
                          }
                          className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-[#47464c]">
                        <span>Website</span>
                        <input
                          value={profile.invoice.website}
                          onChange={(event) =>
                            setInvoice("website", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-[#47464c]">
                        <span>VAT number</span>
                        <input
                          value={profile.invoice.vatNumber}
                          onChange={(event) =>
                            setInvoice("vatNumber", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#ece7de] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                      Invoice address
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="space-y-2 text-sm font-medium text-[#47464c]">
                        <span>Street</span>
                        <input
                          value={profile.invoice.street}
                          onChange={(event) =>
                            setInvoice("street", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-[#47464c]">
                        <span>Number</span>
                        <input
                          value={profile.invoice.nr}
                          onChange={(event) =>
                            setInvoice("nr", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-[#47464c]">
                        <span>City</span>
                        <input
                          value={profile.invoice.city}
                          onChange={(event) =>
                            setInvoice("city", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-[#47464c]">
                        <span>ZIP</span>
                        <input
                          value={profile.invoice.zip}
                          onChange={(event) =>
                            setInvoice("zip", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-[#47464c] md:col-span-2">
                        <span>Country</span>
                        <input
                          value={profile.invoice.country}
                          onChange={(event) =>
                            setInvoice("country", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#ece7de] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                        Shipping address
                      </p>
                      <label className="flex items-center gap-2 text-sm text-[#47464c]">
                        <input
                          type="checkbox"
                          checked={profile.shipping.sameAsInvoice}
                          onChange={(event) =>
                            setShipping("sameAsInvoice", event.target.checked)
                          }
                          className="h-4 w-4 rounded accent-[#171512]"
                        />
                        Same as invoice
                      </label>
                    </div>

                    {!profile.shipping.sameAsInvoice ? (
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-[#47464c]">
                          <span>Company name</span>
                          <input
                            value={profile.shipping.companyName}
                            onChange={(event) =>
                              setShipping("companyName", event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                          />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-[#47464c]">
                          <span>Street</span>
                          <input
                            value={profile.shipping.street}
                            onChange={(event) =>
                              setShipping("street", event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                          />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-[#47464c]">
                          <span>City</span>
                          <input
                            value={profile.shipping.city}
                            onChange={(event) =>
                              setShipping("city", event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                          />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-[#47464c]">
                          <span>Country</span>
                          <input
                            value={profile.shipping.country}
                            onChange={(event) =>
                              setShipping("country", event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#ddd6cc] px-4 py-3 outline-none transition focus:border-[#171512]"
                          />
                        </label>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => void handleSave()}
                      disabled={isSaving}
                      className="rounded-md bg-[#01010f] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving
                        ? "Saving..."
                        : isSpecialSession
                          ? "Save details"
                          : "Update details"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-[0_20px_40px_rgba(26,28,25,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a736c]">
                    Your orders
                  </p>
                  <h2
                    className="mt-2 text-3xl italic text-[#01010f]"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    Requests
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {isLoading ? (
                  <p className="text-sm text-[#47464c]">Loading orders...</p>
                ) : isSpecialSession ? (
                  <div className="rounded-2xl border border-dashed border-[#ddd6cc] p-6 text-sm text-[#6b6a70]">
                    Special users do not have an account order history in this
                    view.
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/order/${order.id}`}
                      className="block rounded-2xl border border-[#ece7de] p-4 transition hover:border-[#c8c0b6] hover:shadow-[0_4px_16px_rgba(26,28,25,0.06)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[#01010f]">
                            {order.orderNumber}
                          </p>
                          <p className="mt-1 text-sm text-[#6b6a70]">
                            {formatDate(order.createdAt)} · {order.itemCount}{" "}
                            items
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#ddd6cc] p-6 text-sm text-[#6b6a70]">
                    No quote requests yet. Add fabrics to your cart and proceed
                    to quote.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
