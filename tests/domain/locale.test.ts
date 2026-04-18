import { describe, expect, it } from "vitest";
import { getInitialLocale, resolveLocale, type SupportedLocale } from "@/domain/locale";

describe("locale helpers", () => {
  it("resolves supported locales and defaults to en", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("pt")).toBe("pt");
    expect(resolveLocale("PT-BR")).toBe("pt");
    expect(resolveLocale("fr")).toBe("en");
    expect(resolveLocale(undefined)).toBe("en");
  });

  it("prefers persisted locale over browser locale", () => {
    expect(getInitialLocale("pt")).toBe("pt");
  });

  it("defaults to english when there is no persisted value", () => {
    expect(getInitialLocale(null)).toBe("en");
    expect(getInitialLocale(undefined)).toBe("en");
  });

  it("keeps output typed to supported locales", () => {
    const locale: SupportedLocale = getInitialLocale("invalid");
    expect(["en", "pt"]).toContain(locale);
  });
});
