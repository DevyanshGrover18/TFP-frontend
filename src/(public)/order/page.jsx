import { Suspense } from "react";
import OrderPageClient from "@/components/order/OrderPageClient";

export default function OrderPage() {
  return (
    <Suspense
      fallback={
      <div className="min-h-screen bg-[#fafaf5] flex items-center justify-center">
          <p className="text-sm text-[#47464c]">Loading order...</p>
        </div>
      }>
      
      <OrderPageClient />
    </Suspense>);

}