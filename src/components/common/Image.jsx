import React from "react";

export default function Image({ src, alt, width, height, fill, className, ...props }) {
  // If Next.js 'fill' property is true, simulate it with CSS
  const style = fill
    ? {
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: "cover",
      }
    : {};

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ ...style, ...props.style }}
      {...props}
    />
  );
}
