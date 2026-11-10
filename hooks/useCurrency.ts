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
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.code === "INR") {
            setCurrencyState(parsed);
          } else {
            // Overwrite any old USD/EUR cache with INR
            await SecureStore.setItemAsync(CURRENCY_KEY, JSON.stringify(DEFAULT_CURRENCY));
            setCurrencyState(DEFAULT_CURRENCY);
          }
        }
      } catch (e) {
        console.error("Failed to load currency:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
