"use client";

import React, { useEffect, useMemo, useState } from "react";
import SepcialHero from "@/app/components/special/SpecialHero";
import SpecialNewArrival from "@/app/components/special/SpecialNewArrival";
import SpecialQuickAccess from "@/app/components/special/SpecialQuickAccess";
import SpecialRecommendation from "@/app/components/special/SpecialRecommendation";
import SpecialAccessGate from "@/app/components/special/SpecialAccessGate";
import { useAuth } from "@/app/context/AuthContext";
import { getAllProducts, type ProductRecord } from "@/app/services/productsService";
import {
  isProductAllowedForCategoryIds,
  sortSpecialProductsFirst,
} from "@/app/services/catalogAccess";

const SpecialUserPage = () => {
  const { specialUser } = useAuth();
  const [products, setProducts] = useState<ProductRecord[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await getAllProducts();
      setProducts(response.products ?? []);
    };

    void loadProducts();
  }, []);

  const allowedCategoryIds = useMemo(
    () =>
      specialUser?.allowedCategories.length
        ? new Set(specialUser.allowedCategories)
        : null,
    [specialUser],
  );

  const visibleProducts = useMemo(
    () =>
      sortSpecialProductsFirst(
        products.filter((product) =>
          isProductAllowedForCategoryIds(product, allowedCategoryIds),
        ),
      ),
    [allowedCategoryIds, products],
  );

  const specialProducts = useMemo(
    () => visibleProducts.filter((product) => product.isSpecial),
    [visibleProducts],
  );

  const newArrivalProducts = useMemo(
    () =>
      specialProducts
        .filter((product) =>
          product.badges.some((badge) => badge.toLowerCase() === "new"),
        )
        .slice(0, 3),
    [specialProducts],
  );

  const recommendedProducts = useMemo(() => {
    const preferred = specialProducts.filter(
      (product) =>
        !product.badges.some((badge) => badge.toLowerCase() === "new"),
    );

    return (preferred.length ? preferred : specialProducts).slice(0, 6);
  }, [specialProducts]);

  return (
    <SpecialAccessGate>
      <div>
        <SepcialHero name={specialUser?.name} />
        <SpecialQuickAccess
          allowedCategoryCount={specialUser?.allowedCategories.length ?? 0}
          specialProductCount={specialProducts.length}
          totalVisibleProductCount={visibleProducts.length}
        />
        <SpecialNewArrival products={newArrivalProducts} />
        <SpecialRecommendation products={recommendedProducts} />
      </div>
    </SpecialAccessGate>
  );
};

export default SpecialUserPage;
