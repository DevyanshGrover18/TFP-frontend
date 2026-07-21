





















export function filterCategoryTreeByAllowedIds(
nodes,
allowedIds)
{
  const allowed = new Set(allowedIds);

  function walk(node) {
    if (allowed.has(node._id)) return node;

    if (node.children?.length) {
      const filteredChildren = node.children.
      map(walk).
      filter(Boolean);

      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
    }

    return null;
  }

  return nodes.map(walk).filter(Boolean);
}

export function isProductAllowedForCategoryIds(
product,
allowedIds)
{
  if (!allowedIds) return true;

  const categoryId = getCategoryRefId(product.categoryId);
  const subCategoryId = getCategoryRefId(product.subCategoryId);
  const subSubCategoryId = getCategoryRefId(product.subSubCategoryId);

  return (
    categoryId && allowedIds.has(categoryId) ||
    subCategoryId && allowedIds.has(subCategoryId) ||
    subSubCategoryId && allowedIds.has(subSubCategoryId));

}

export function isProductVisibleForSession(
product,
isSpecialSession)
{
  return !product.isSpecial || isSpecialSession;
}

export function sortSpecialProductsFirst(
products)
{
  return [...products].sort((left, right) => {
    if (left.isSpecial === right.isSpecial) {
      return 0;
    }

    return left.isSpecial ? -1 : 1;
  });
}

function getCategoryRefId(value) {
  if (typeof value === "string") return value;
  return value?._id ?? value?.id;
}