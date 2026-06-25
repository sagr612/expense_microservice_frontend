// context/CurrencyContext.tsx
import { Currency } from "@/constants/currencies";
import { useCurrency } from "@/hooks/useCurrency";
import React, { createContext, useContext } from "react";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => Promise<void>;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = useCurrency(); // hook runs ONCE here
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useSharedCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx)
    throw new Error("useSharedCurrency must be used within CurrencyProvider");
  return ctx;
};
