"use client";

import React, { useEffect, useMemo, useState } from "react";
import SepcialHero from "@/components/special/SpecialHero";
import SpecialNewArrival from "@/components/special/SpecialNewArrival";
import SpecialQuickAccess from "@/components/special/SpecialQuickAccess";
import SpecialRecommendation from "@/components/special/SpecialRecommendation";
import SpecialAccessGate from "@/components/special/SpecialAccessGate";
import { useAuth } from "@/context/AuthContext";
import { getAllProducts } from "@/services/productsService";
import {
  isProductAllowedForCategoryIds,
  sortSpecialProductsFirst } from
"@/services/catalogAccess";

const SpecialUserPage = () => {
  const { specialUser } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await getAllProducts();
      setProducts(response.products ?? []);
    };

    void loadProducts();
  }, []);

  const allowedCategoryIds = useMemo(
    () =>
    specialUser?.allowedCategories.length ?
    new Set(specialUser.allowedCategories) :
    null,
    [specialUser]
  );

  const visibleProducts = useMemo(
    () =>
    sortSpecialProductsFirst(
      products.filter((product) =>
      isProductAllowedForCategoryIds(product, allowedCategoryIds)
      )
    ),
    [allowedCategoryIds, products]
  );

  const specialProducts = useMemo(
    () => visibleProducts.filter((product) => product.isSpecial),
    [visibleProducts]
  );

  const newArrivalProducts = useMemo(
    () =>
    specialProducts.
    filter((product) =>
    product.badges.some((badge) => badge.toLowerCase() === "new")
    ).
    slice(0, 3),
    [specialProducts]
  );

  const recommendedProducts = useMemo(() => {
    const preferred = specialProducts.filter(
      (product) =>
      !product.badges.some((badge) => badge.toLowerCase() === "new")
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
          totalVisibleProductCount={visibleProducts.length} />
        
        <SpecialNewArrival products={newArrivalProducts} />
        <SpecialRecommendation products={recommendedProducts} />
      </div>
    </SpecialAccessGate>);

};

export default SpecialUserPage;