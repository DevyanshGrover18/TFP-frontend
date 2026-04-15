import React from "react";

type ProductCardProps = {
  name: string;
  image: string;
  category?: string;
  details?: {
    sku?: string;
    composition?: string;
    weight?: string;
    color?: string;
    width?: string;
  };
  onClick?: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  image,
  category,
  details,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full cursor-pointer overflow-hidden rounded-[28px] border border-stone-200/80 bg-white text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative overflow-hidden bg-white p-3">
        <img
          src={image}
          alt={name}
          className="aspect-square w-full rounded-[22px] object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay with details */}
        {details && (
          <div className="absolute inset-3 rounded-[22px] bg-black/60 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 flex flex-col justify-end p-4 gap-1.5">
            {details.sku && (
              <div className="flex justify-between text-xs">
                <span className="text-white/60 uppercase tracking-wide">SKU</span>
                <span className="text-white font-medium">{details.sku}</span>
              </div>
            )}
            {details.composition && (
              <div className="flex justify-between text-xs">
                <span className="text-white/60 uppercase tracking-wide">Composition</span>
                <span className="text-white font-medium text-right max-w-[60%]">{details.composition}</span>
              </div>
            )}
            {details.color && (
              <div className="flex justify-between text-xs">
                <span className="text-white/60 uppercase tracking-wide">Color</span>
                <span className="text-white font-medium">{details.color}</span>
              </div>
            )}
            {details.width && (
              <div className="flex justify-between text-xs">
                <span className="text-white/60 uppercase tracking-wide">Width</span>
                <span className="text-white font-medium">{details.width}</span>
              </div>
            )}
            {details.weight && (
              <div className="flex justify-between text-xs">
                <span className="text-white/60 uppercase tracking-wide">Weight</span>
                <span className="text-white font-medium">{details.weight}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1 px-5 pb-2 pt-4">
        {category && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
            {category}
          </p>
        )}

        <div className="space-y-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-stone-900">
            {name}
          </h3>
        </div>

        <span className="inline-flex items-center text-sm font-medium text-stone-900 transition-transform duration-300 group-hover:translate-x-1">
          Explore fabric
          <span className="ml-2 text-base leading-none" aria-hidden="true">
            {">"}
          </span>
        </span>
      </div>
    </button>
  );
};

export default ProductCard;