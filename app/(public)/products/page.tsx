import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";
import ProductCard from "../../components/common/ProductCard";
import {
  getAllProducts,
  getProductDisplayColor,
  getProductHref,
  getProductPrimaryImage,
  getProductSpecification,
} from "../../services/productsService";

export default async function ProductsPage() {
  const response = await getAllProducts();
  const products = response.products ?? [];

  const categories = Array.from(
    new Set(products.map((product) => product.categoryId?.name).filter(Boolean)),
  );
  const subCategories = Array.from(
    new Set(
      products.map((product) => product.subCategoryId?.name).filter(Boolean),
    ),
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f2ea] text-stone-900">
      <Navbar />

      <main className="flex-1 pb-16 pt-4">

        <section className="mt-8 px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="h-fit rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                    Catalog Overview
                  </p>
                  <h2
                    className="mt-3 text-3xl italic text-stone-900"
                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                  >
                    Refined selection
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-stone-600">
                    The catalog is currently shown as a live grid without
                    storefront filtering. Product pages are fully connected to
                    the backend records.
                  </p>
                </div>

                <div className="mt-8 border-t border-stone-200 pt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                    Available Categories
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {categories.length ? (
                      categories.map((category) => (
                        <span
                          key={category}
                          className="rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-600"
                        >
                          {category}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-stone-500">
                        No categories available yet.
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 rounded-[1.5rem] bg-stone-900 px-5 py-6 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                    Trade Support
                  </p>
                  <p
                    className="mt-3 text-2xl italic"
                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                  >
                    Need help sourcing?
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Use the current catalog as a starting point, then reach out
                    for custom sourcing and bulk requirements.
                  </p>
                  <button
                    type="button"
                    className="mt-5 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900"
                  >
                    Contact Studio
                  </button>
                </div>
              </aside>

              <div>
                <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-stone-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:px-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                      Live Inventory
                    </p>
                    <h2
                      className="mt-2 text-3xl italic text-stone-900"
                      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                    >
                      All products
                    </h2>
                  </div>
                  <p className="text-sm text-stone-600">
                    Showing <span className="font-semibold text-stone-900">{products.length}</span> backend-backed
                    {products.length === 1 ? " product" : " products"}.
                  </p>
                </div>

                {products.length ? (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        name={product.name}
                        image={getProductPrimaryImage(product)}
                        href={getProductHref(product)}
                        details={{
                          sku: product.sku,
                          composition: getProductSpecification(
                            product,
                            "composition",
                          ),
                          color: getProductDisplayColor(product),
                          width: getProductSpecification(product, "width"),
                          weight: getProductSpecification(product, "weight"),
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
                    <p
                      className="text-3xl italic text-stone-900"
                      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                    >
                      No products yet
                    </p>
                    <p className="mt-3 text-sm text-stone-600">
                      Add products from the admin panel and they will appear
                      here automatically.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
