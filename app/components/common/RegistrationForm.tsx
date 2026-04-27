"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createOrder, sendOrderSuccessMail } from "@/app/services/orderService";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  type UserQuoteProfile,
} from "@/app/services/userService";
import { getStoredUser, storeUser } from "@/app/services/userSession";

type InvoiceAddress = UserQuoteProfile["invoice"];
type ShippingAddress = UserQuoteProfile["shipping"];
type YourDetails = UserQuoteProfile["details"];
type FormData = UserQuoteProfile;

type Country = {
  name: { common: string };
  idd: { root: string; suffixes: string[] };
  cca2: string;
  flag: string;
};

type CountryOption = {
  name: string;
  dialCode: string;
  flag: string;
  code: string;
};

const CATEGORIES = [
  "Retailer",
  "Wholesaler",
  "Manufacturer",
  "Designer",
  "Importer",
  "Distributor",
  "Other",
];

const EMPTY_CATEGORY = { id: "", name: "" };

const emptyForm: FormData = {
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
    category: EMPTY_CATEGORY,
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

const steps = ["Company / invoice address", "Shipping address", "Your details"];

const inputClass =
  "w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-400";

const selectClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-400";

const labelClass = "block space-y-2 text-sm font-medium text-gray-700";

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-red-500">{message}</p> : null;
}

function buildNameParts(name: string | undefined) {
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

function CountrySelect({
  value,
  onChange,
  error,
  countries,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  countries: CountryOption[];
  disabled: boolean;
}) {
  return (
    <div className="space-y-1">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${selectClass} ${error ? "border-red-400" : ""}`}
        disabled={disabled}
      >
        <option value="">- Select country -</option>
        {countries.map((country) => (
          <option key={country.code} value={country.name}>
            {country.flag} {country.name}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  );
}

function PhoneRow({
  codeValue,
  onCodeChange,
  numberValue,
  onNumberChange,
  placeholder,
  error,
  countries,
  disabled,
}: {
  codeValue: string;
  onCodeChange: (value: string) => void;
  numberValue: string;
  onNumberChange: (value: string) => void;
  placeholder: string;
  error?: string;
  countries: CountryOption[];
  disabled: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <select
          value={codeValue}
          onChange={(event) => onCodeChange(event.target.value)}
          className="w-32 rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-red-400"
          disabled={disabled}
        >
          {countries.map((country) => (
            <option
              key={`${country.code}-${country.dialCode}`}
              value={country.dialCode}
            >
              {country.flag} {country.dialCode}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={numberValue}
          onChange={(event) => onNumberChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-400 ${
            error ? "border-red-400" : ""
          }`}
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,cca2,flag")
      .then((res) => res.json())
      .then((data: Country[]) => {
        const parsed: CountryOption[] = data
          .filter(
            (country) => country.idd?.root && country.idd?.suffixes?.length,
          )
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
            flag: country.flag,
            dialCode:
              country.idd.suffixes.length === 1
                ? `${country.idd.root}${country.idd.suffixes[0]}`
                : country.idd.root,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(parsed);

        const india = parsed.find((country) => country.code === "IN");
        if (india) {
          setForm((current) => ({
            ...current,
            details: {
              ...current.details,
              mobileCode: current.details.mobileCode || india.dialCode,
              phoneCode: current.details.phoneCode || india.dialCode,
            },
          }));
        }
      })
      .catch(() => setCountries([]))
      .finally(() => setLoadingCountries(false));
  }, []);

  useEffect(() => {
    const currentUser = getStoredUser();

    if (!currentUser?.id) {
      setIsLoadingProfile(false);
      return;
    }

    const nameParts = buildNameParts(currentUser.name);

    setForm((current) => ({
      ...current,
      details: {
        ...current.details,
        firstName: current.details.firstName || nameParts.firstName,
        lastName: current.details.lastName || nameParts.lastName,
        email: current.details.email || currentUser.email,
      },
    }));

    const loadProfile = async () => {
      try {
        const response = await getCurrentUserProfile();
        const profile = response.profile;

        if (profile) {
          setForm((current) => ({
            invoice: {
              ...current.invoice,
              ...profile.invoice,
            },
            shipping: {
              ...current.shipping,
              ...profile.shipping,
            },
            details: {
              ...current.details,
              ...profile.details,
              email:
                profile.details.email ||
                currentUser.email ||
                current.details.email,
            },
          }));
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load your profile.",
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    void loadProfile();
  }, []);

  const setInvoice = (patch: Partial<InvoiceAddress>) =>
    setForm((current) => ({
      ...current,
      invoice: { ...current.invoice, ...patch },
    }));

  const setShipping = (patch: Partial<ShippingAddress>) =>
    setForm((current) => ({
      ...current,
      shipping: { ...current.shipping, ...patch },
    }));

  const setDetails = (patch: Partial<YourDetails>) =>
    setForm((current) => ({
      ...current,
      details: { ...current.details, ...patch },
    }));

  const validateStep = (currentStep: number): Record<string, string> => {
    const nextErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!form.invoice.companyName.trim())
        nextErrors.companyName = "Company name is required";
      if (!form.invoice.street.trim()) nextErrors.street = "Street is required";
      if (!form.invoice.city.trim()) nextErrors.city = "City is required";
      if (!form.invoice.zip.trim())
        nextErrors.zip = "Zip / postal code is required";
      if (!form.invoice.country) nextErrors.country = "Country is required";
      if (!form.invoice.notLiableForVat && !form.invoice.vatNumber.trim()) {
        nextErrors.vatNumber = "VAT number is required";
      }
      if (!form.invoice.category.name) nextErrors.category = "Category is required";
    }

    if (currentStep === 1 && !form.shipping.sameAsInvoice) {
      if (!form.shipping.companyName.trim()) {
        nextErrors.shippingCompanyName = "Company name is required";
      }
      if (!form.shipping.street.trim())
        nextErrors.shippingStreet = "Street is required";
      if (!form.shipping.city.trim())
        nextErrors.shippingCity = "City is required";
      if (!form.shipping.zip.trim())
        nextErrors.shippingZip = "Zip / postal code is required";
      if (!form.shipping.country)
        nextErrors.shippingCountry = "Country is required";
    }

    if (currentStep === 2) {
      if (!form.details.firstName.trim())
        nextErrors.firstName = "First name is required";
      if (!form.details.lastName.trim())
        nextErrors.lastName = "Last name is required";
      if (!form.details.email.trim()) nextErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.details.email)) {
        nextErrors.email = "Invalid email address";
      }
      if (!form.details.mobile.trim())
        nextErrors.mobile = "Mobile number is required";
      if (!form.details.acceptTerms) {
        nextErrors.acceptTerms = "You must accept the terms and conditions";
      }
    }

    return nextErrors;
  };

  const handleNext = () => {
    const nextErrors = validateStep(step);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep((current) => current + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((current) => current - 1);
  };

  const handleSubmit = async () => {
    const nextErrors = validateStep(2);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const response = await updateCurrentUserProfile(form);

      if (response.user) {
        storeUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
        });
      }

      const orderResponse = await createOrder();
      if (orderResponse.success) {
        await sendOrderSuccessMail(
          response.user?.name,
          response.user?.email,
          orderResponse.order?._id,
        );
      }
      setSubmitted(true);
      toast.success(
        orderResponse.message ??
          response.message ??
          "Quote request created successfully. Please check you mail for confirmation",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save your details.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-6 w-6 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Request saved</h2>
        <p className="max-w-sm text-sm text-gray-500">
          Your quote details have been saved. The next time you proceed to
          quote, this form will be pre-filled.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-3">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`px-4 py-4 text-center text-sm font-semibold transition-colors ${
                index === step
                  ? "border-b-2 border-red-600 bg-red-50 text-red-600"
                  : index < step
                    ? "border-b-2 border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-b-2 border-transparent bg-white text-gray-400"
              }`}
            >
              <span className="hidden md:inline">
                {index + 1}. {label}
              </span>
              <span className="md:hidden">{index + 1}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-8 space-y-5">
          {isLoadingProfile ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
              Loading your saved quote details...
            </div>
          ) : null}

          {step === 0 && (
            <>
              <label className={labelClass}>
                <span>
                  Company name <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.invoice.companyName}
                  onChange={(event) =>
                    setInvoice({ companyName: event.target.value })
                  }
                  type="text"
                  disabled={isLoadingProfile}
                  className={`${inputClass} ${errors.companyName ? "border-red-400" : ""}`}
                />
                <FieldError message={errors.companyName} />
              </label>

              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </span>
                <div className="flex gap-2">
                  <input
                    value={form.invoice.street}
                    onChange={(event) =>
                      setInvoice({ street: event.target.value })
                    }
                    placeholder="Street"
                    disabled={isLoadingProfile}
                    className={`flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 ${
                      errors.street ? "border-red-400" : ""
                    }`}
                  />
                  <input
                    value={form.invoice.nr}
                    onChange={(event) => setInvoice({ nr: event.target.value })}
                    placeholder="Nr."
                    disabled={isLoadingProfile}
                    className="w-20 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400"
                  />
                </div>
                <FieldError message={errors.street} />
                <input
                  value={form.invoice.apartment}
                  onChange={(event) =>
                    setInvoice({ apartment: event.target.value })
                  }
                  placeholder="Apartment, suite, floor, etc. (optional)"
                  disabled={isLoadingProfile}
                  className={inputClass}
                />
              </div>

              <label className={labelClass}>
                <span>
                  City <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.invoice.city}
                  onChange={(event) => setInvoice({ city: event.target.value })}
                  type="text"
                  disabled={isLoadingProfile}
                  className={`${inputClass} ${errors.city ? "border-red-400" : ""}`}
                />
                <FieldError message={errors.city} />
              </label>

              <label className={labelClass}>
                <span>
                  Zip / postal code <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.invoice.zip}
                  onChange={(event) => setInvoice({ zip: event.target.value })}
                  type="text"
                  disabled={isLoadingProfile}
                  className={`${inputClass} ${errors.zip ? "border-red-400" : ""}`}
                />
                <FieldError message={errors.zip} />
              </label>

              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </span>
                <CountrySelect
                  value={form.invoice.country}
                  onChange={(value) => setInvoice({ country: value })}
                  error={errors.country}
                  countries={countries}
                  disabled={loadingCountries || isLoadingProfile}
                />
              </div>

              <div className="space-y-4 rounded-2xl border border-gray-200 p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.invoice.notLiableForVat}
                    onChange={(event) =>
                      setInvoice({ notLiableForVat: event.target.checked })
                    }
                    disabled={isLoadingProfile}
                    className="h-4 w-4 rounded accent-red-600"
                  />
                  <span className="text-sm text-gray-700">
                    I am not liable for VAT
                  </span>
                </label>

                {!form.invoice.notLiableForVat && (
                  <label className={labelClass}>
                    <span>
                      VAT nr. (starting with your country code){" "}
                      <span className="text-red-500">*</span>
                    </span>
                    <input
                      value={form.invoice.vatNumber}
                      onChange={(event) =>
                        setInvoice({ vatNumber: event.target.value })
                      }
                      type="text"
                      disabled={isLoadingProfile}
                      className={`${inputClass} ${errors.vatNumber ? "border-red-400" : ""}`}
                    />
                    <p className="text-xs text-gray-400">
                      Please start with your country code immediately followed
                      by the rest of your VAT number.
                    </p>
                    <FieldError message={errors.vatNumber} />
                  </label>
                )}

                <label className={labelClass}>
                  <span>Chamber of commerce nr.</span>
                  <input
                    value={form.invoice.chamberOfCommerce}
                    onChange={(event) =>
                      setInvoice({ chamberOfCommerce: event.target.value })
                    }
                    type="text"
                    disabled={isLoadingProfile}
                    className={inputClass}
                  />
                </label>
              </div>

              <label className={labelClass}>
                <span>
                  Category <span className="text-red-500">*</span>
                </span>
                <select
                  value={form.invoice.category.name}
                  onChange={(event) =>
                    setInvoice({
                      category: {
                        id: event.target.value.toLowerCase().replace(/\s+/g, "-"),
                        name: event.target.value,
                      },
                    })
                  }
                  disabled={isLoadingProfile}
                  className={`${selectClass} ${errors.category ? "border-red-400" : ""}`}
                >
                  <option value="">- Select category -</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.category} />
              </label>

              <label className={labelClass}>
                <span>Website</span>
                <input
                  value={form.invoice.website}
                  onChange={(event) =>
                    setInvoice({ website: event.target.value })
                  }
                  type="url"
                  placeholder="https://"
                  disabled={isLoadingProfile}
                  className={inputClass}
                />
              </label>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={form.shipping.sameAsInvoice}
                    onChange={() => setShipping({ sameAsInvoice: true })}
                    disabled={isLoadingProfile}
                    className="h-4 w-4 accent-red-600"
                  />
                  <span className="text-sm text-gray-700">
                    Same as invoice address
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={!form.shipping.sameAsInvoice}
                    onChange={() => setShipping({ sameAsInvoice: false })}
                    disabled={isLoadingProfile}
                    className="h-4 w-4 accent-red-600"
                  />
                  <span className="text-sm text-gray-700">
                    Enter delivery address
                  </span>
                </label>
              </div>

              {!form.shipping.sameAsInvoice && (
                <>
                  <label className={labelClass}>
                    <span>
                      Company name <span className="text-red-500">*</span>
                    </span>
                    <input
                      value={form.shipping.companyName}
                      onChange={(event) =>
                        setShipping({ companyName: event.target.value })
                      }
                      type="text"
                      disabled={isLoadingProfile}
                      className={`${inputClass} ${
                        errors.shippingCompanyName ? "border-red-400" : ""
                      }`}
                    />
                    <FieldError message={errors.shippingCompanyName} />
                  </label>

                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </span>
                    <div className="flex gap-2">
                      <input
                        value={form.shipping.street}
                        onChange={(event) =>
                          setShipping({ street: event.target.value })
                        }
                        placeholder="Street"
                        disabled={isLoadingProfile}
                        className={`flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 ${
                          errors.shippingStreet ? "border-red-400" : ""
                        }`}
                      />
                      <input
                        value={form.shipping.nr}
                        onChange={(event) =>
                          setShipping({ nr: event.target.value })
                        }
                        placeholder="Nr."
                        disabled={isLoadingProfile}
                        className="w-20 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400"
                      />
                    </div>
                    <FieldError message={errors.shippingStreet} />
                    <input
                      value={form.shipping.apartment}
                      onChange={(event) =>
                        setShipping({ apartment: event.target.value })
                      }
                      placeholder="Apartment, suite, floor, etc. (optional)"
                      disabled={isLoadingProfile}
                      className={inputClass}
                    />
                  </div>

                  <label className={labelClass}>
                    <span>
                      City <span className="text-red-500">*</span>
                    </span>
                    <input
                      value={form.shipping.city}
                      onChange={(event) =>
                        setShipping({ city: event.target.value })
                      }
                      type="text"
                      disabled={isLoadingProfile}
                      className={`${inputClass} ${
                        errors.shippingCity ? "border-red-400" : ""
                      }`}
                    />
                    <FieldError message={errors.shippingCity} />
                  </label>

                  <label className={labelClass}>
                    <span>
                      Zip / postal code <span className="text-red-500">*</span>
                    </span>
                    <input
                      value={form.shipping.zip}
                      onChange={(event) =>
                        setShipping({ zip: event.target.value })
                      }
                      type="text"
                      disabled={isLoadingProfile}
                      className={`${inputClass} ${
                        errors.shippingZip ? "border-red-400" : ""
                      }`}
                    />
                    <FieldError message={errors.shippingZip} />
                  </label>

                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Country <span className="text-red-500">*</span>
                    </span>
                    <CountrySelect
                      value={form.shipping.country}
                      onChange={(value) => setShipping({ country: value })}
                      error={errors.shippingCountry}
                      countries={countries}
                      disabled={loadingCountries || isLoadingProfile}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </span>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <input
                      value={form.details.firstName}
                      onChange={(event) =>
                        setDetails({ firstName: event.target.value })
                      }
                      placeholder="First name"
                      disabled={isLoadingProfile}
                      className={`${inputClass} ${errors.firstName ? "border-red-400" : ""}`}
                    />
                    <FieldError message={errors.firstName} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      value={form.details.lastName}
                      onChange={(event) =>
                        setDetails({ lastName: event.target.value })
                      }
                      placeholder="Last name"
                      disabled={isLoadingProfile}
                      className={`${inputClass} ${errors.lastName ? "border-red-400" : ""}`}
                    />
                    <FieldError message={errors.lastName} />
                  </div>
                </div>
              </div>

              <label className={labelClass}>
                <span>
                  E-mail address <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.details.email}
                  onChange={(event) =>
                    setDetails({ email: event.target.value })
                  }
                  type="email"
                  disabled={isLoadingProfile}
                  className={`${inputClass} ${errors.email ? "border-red-400" : ""}`}
                />
                <FieldError message={errors.email} />
              </label>

              <label className={labelClass}>
                <span>E-mail address invoice</span>
                <input
                  value={form.details.emailInvoice}
                  onChange={(event) =>
                    setDetails({ emailInvoice: event.target.value })
                  }
                  type="email"
                  disabled={isLoadingProfile}
                  className={inputClass}
                />
              </label>

              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Telephone <span className="text-red-500">*</span>
                </span>
                <PhoneRow
                  codeValue={form.details.mobileCode}
                  onCodeChange={(value) => setDetails({ mobileCode: value })}
                  numberValue={form.details.mobile}
                  onNumberChange={(value) => setDetails({ mobile: value })}
                  placeholder="Mobile number"
                  error={errors.mobile}
                  countries={countries}
                  disabled={loadingCountries || isLoadingProfile}
                />
                <PhoneRow
                  codeValue={form.details.phoneCode}
                  onCodeChange={(value) => setDetails({ phoneCode: value })}
                  numberValue={form.details.phone}
                  onNumberChange={(value) => setDetails({ phone: value })}
                  placeholder="Phone number"
                  error={errors.phone}
                  countries={countries}
                  disabled={loadingCountries || isLoadingProfile}
                />
              </div>

              <div className="space-y-3 rounded-2xl border border-gray-200 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.details.acceptUpdates}
                    onChange={(event) =>
                      setDetails({ acceptUpdates: event.target.checked })
                    }
                    disabled={isLoadingProfile}
                    className="mt-0.5 h-4 w-4 rounded accent-red-600"
                  />
                  <span className="text-sm text-gray-700">
                    I would like to be updated about the latest developments and
                    trends.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.details.acceptTerms}
                    onChange={(event) =>
                      setDetails({ acceptTerms: event.target.checked })
                    }
                    disabled={isLoadingProfile}
                    className={`mt-0.5 h-4 w-4 rounded accent-red-600 ${
                      errors.acceptTerms ? "outline outline-red-400" : ""
                    }`}
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold">Yes</span>, I accept the{" "}
                    <a
                      href="/terms"
                      className="text-gray-900 underline hover:text-red-600"
                    >
                      Terms and conditions
                    </a>
                    .
                  </span>
                </label>
                <FieldError message={errors.acceptTerms} />
              </div>
            </>
          )}
        </div>

        <div
          className={`flex border-t border-gray-100 px-6 py-5 ${
            step > 0 ? "justify-between" : "justify-end"
          }`}
        >
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoadingProfile || isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </button>
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoadingProfile}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isLoadingProfile || isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Send request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
