"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  DEFAULT_LOCALE,
  getInitialLocale,
  localeCopy,
  LOCALE_STORAGE_KEY,
  type LocaleCopy,
  type SupportedLocale
} from "@/domain/locale";

type LocaleContextValue = {
  locale: SupportedLocale;
  copy: LocaleCopy;
  setLocale: (nextLocale: SupportedLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const persistedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const initialLocale = getInitialLocale(persistedLocale);

    setLocaleState(initialLocale);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: SupportedLocale) => {
    setLocaleState(nextLocale);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      copy: localeCopy[locale],
      setLocale
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  return value;
}
