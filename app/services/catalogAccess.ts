export type CatalogCategoryNode = {
  _id: string;
  name: string;
  image: string;
  parentId: string | null;
  level: number;
  children?: CatalogCategoryNode[];
};

type ProductCategoryRef =
  | string
  | { _id?: string; id?: string; name?: string }
  | undefined;

type CatalogProductLike = {
  categoryId?: ProductCategoryRef;
  subCategoryId?: ProductCategoryRef;
  subSubCategoryId?: ProductCategoryRef;
  isSpecial?: boolean;
  badges?: string[];
};

export function filterCategoryTreeByAllowedIds(
  nodes: CatalogCategoryNode[],
  allowedIds: string[],
): CatalogCategoryNode[] {
  const allowed = new Set(allowedIds);

  function walk(node: CatalogCategoryNode): CatalogCategoryNode | null {
    if (allowed.has(node._id)) return node;

    if (node.children?.length) {
      const filteredChildren = node.children
        .map(walk)
        .filter(Boolean) as CatalogCategoryNode[];

      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
    }

    return null;
  }

  return nodes.map(walk).filter(Boolean) as CatalogCategoryNode[];
}

export function isProductAllowedForCategoryIds(
  product: CatalogProductLike,
  allowedIds: Set<string> | null,
) {
  if (!allowedIds) return true;

  const categoryId = getCategoryRefId(product.categoryId);
  const subCategoryId = getCategoryRefId(product.subCategoryId);
  const subSubCategoryId = getCategoryRefId(product.subSubCategoryId);

  return (
    (categoryId && allowedIds.has(categoryId)) ||
    (subCategoryId && allowedIds.has(subCategoryId)) ||
    (subSubCategoryId && allowedIds.has(subSubCategoryId))
  );
}

export function isProductVisibleForSession(
  product: CatalogProductLike,
  isSpecialSession: boolean,
) {
  return !product.isSpecial || isSpecialSession;
}

export function sortSpecialProductsFirst<T extends CatalogProductLike>(
  products: T[],
) {
  return [...products].sort((left, right) => {
    if (left.isSpecial === right.isSpecial) {
      return 0;
    }

    return left.isSpecial ? -1 : 1;
  });
}

function getCategoryRefId(value: ProductCategoryRef) {
  if (typeof value === "string") return value;
  return value?._id ?? value?.id;
}
