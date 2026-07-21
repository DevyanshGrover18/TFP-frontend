"use client";
import { createContext, useContext, useState } from "react";






const CartCountContext = createContext(undefined);

export const CartCountProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  return (
    <CartCountContext.Provider value={{ count, setCount }}>
      {children}
    </CartCountContext.Provider>);

};

export const useCartCount = () => {
  const context = useContext(CartCountContext);

  if (!context) {
    throw new Error("useCartCount must be used within CartCountProvider");
  }

  return context;
};