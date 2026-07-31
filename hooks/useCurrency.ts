import { Currency, DEFAULT_CURRENCY } from "@/constants/currencies";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const CURRENCY_KEY = "selected_currency";

export const useCurrency = () => {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await SecureStore.getItemAsync(CURRENCY_KEY);
        if (stored) setCurrencyState(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load currency:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currency]);

  const setCurrency = useCallback(async (newCurrency: Currency) => {
    try {
      await SecureStore.setItemAsync(CURRENCY_KEY, JSON.stringify(newCurrency));
      setCurrencyState(newCurrency);
    } catch (e) {
      console.error("Failed to save currency:", e);
    }
  }, []);

  return { currency, setCurrency, loading };
};
