import { notFound } from "next/navigation";
import { getProductByName, ProductRecord } from "@/app/services/productsService";
import Navbar from "@/app/components/common/Navbar";
import Footer from "@/app/components/common/Footer";
import ProductDetail from "@/app/components/product/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productname: string }>;
}) {
  const { productname } = await params;

  const response = await getProductByName(productname);

  if (!response.success || !response.product) {
    notFound();
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="grow">
        <ProductDetail product={response.product} />
      </div>
      <Footer />
    </div>
  );
}
