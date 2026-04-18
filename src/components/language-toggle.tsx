"use client";

import { useLocale } from "@/components/locale-provider";
import type { SupportedLocale } from "@/domain/locale";

type LanguageToggleProps = {
  className?: string;
};

function toggleButtonClass(isActive: boolean) {
  return isActive ? "sd-language-button sd-language-button--active" : "sd-language-button";
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, copy, setLocale } = useLocale();

  function onClick(nextLocale: SupportedLocale) {
    setLocale(nextLocale);
  }

  return (
    <div className={`sd-language-toggle ${className ?? ""}`.trim()}>
      <button
        type="button"
        className={toggleButtonClass(locale === "en")}
        onClick={() => onClick("en")}
        aria-label={copy.common.language.switchToEnglish}
      >
        {copy.common.language.en}
      </button>
      <button
        type="button"
        className={toggleButtonClass(locale === "pt")}
        onClick={() => onClick("pt")}
        aria-label={copy.common.language.switchToPortuguese}
      >
        {copy.common.language.pt}
      </button>
    </div>
  );
}
