"use client"
import { createContext, useContext, useState, ReactNode } from "react";

type CartCountContextType = {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

const CartCountContext = createContext<CartCountContextType | undefined>(undefined);

export const CartCountProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);

  return (
    <CartCountContext.Provider value={{ count, setCount }}>
      {children}
    </CartCountContext.Provider>
  );
};

export const useCartCount = () => {
  const context = useContext(CartCountContext);

  if (!context) {
    throw new Error("useCartCount must be used within CartCountProvider");
  }

  return context;
};