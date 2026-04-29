import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ProductDetail from "@/app/components/product/ProductDetail";
import type { ProductRecord } from "@/app/services/productsService";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://tfp-backend.onrender.com"
    : "http://localhost:8000");

async function getProductForRequest(slug: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await fetch(
    `${BASE_URL}/api/products/${encodeURIComponent(slug)}`,
    {
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: "no-store",
    },
  );

  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    product?: ProductRecord;
  };

  return data;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productname: string }>;
}) {
  const { productname } = await params;

  const response = await getProductForRequest(productname);

  if (!response.success || !response.product) {
    notFound();
  }


  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow">
        <ProductDetail product={response.product} />
      </div>
    </div>
  );
}
