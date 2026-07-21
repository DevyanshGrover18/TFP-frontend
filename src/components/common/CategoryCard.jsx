import React from "react";







const CategoryCard = ({ name, image }) => {
  return (
    <button
      type="button"
      className="group cursor-pointer relative w-full overflow-hidden rounded-2xl text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      
      <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3
            className="text-lg font-semibold italic text-white drop-shadow-sm"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            
            {name}
          </h3>
        </div>
      </div>
    </button>);

};

export default CategoryCard;