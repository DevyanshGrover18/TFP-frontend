import React from "react";

type CategoryCardProps = {
  name: string;
  image: string;
  onClick?: () => void;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-[28px] border border-stone-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={name}
          className="aspect-square w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h3 className="line-clamp-2 text-base font-semibold text-stone-900">
          {name}
        </h3>
        <span className="shrink-0 rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors duration-300 group-hover:border-stone-900 group-hover:text-stone-900">
          Shop Now
        </span>
      </div>
    </button>
  );
};

export default CategoryCard;
