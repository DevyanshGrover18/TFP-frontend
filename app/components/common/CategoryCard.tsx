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
      className="group relative w-full overflow-hidden rounded-2xl text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Full-bleed image */}
      <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Bottom gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Category name — bottom-left, italic serif */}
        <div className="absolute bottom-0 left-0 p-4">
          <h3
            className="text-lg font-semibold italic text-white drop-shadow-sm"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            {name}
          </h3>
        </div>
      </div>
    </button>
  );
};

export default CategoryCard;