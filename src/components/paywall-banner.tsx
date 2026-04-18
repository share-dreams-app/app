"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

export function PaywallBanner() {
  const { copy } = useLocale();

  return (
    <aside aria-label="Free plan limit" className="sd-paywall">
      <strong>{copy.paywall.title}</strong>
      <p>{copy.paywall.description}</p>
      <Link href="/insights?plan=premium" className="sd-link-button sd-link-button--primary">
        {copy.paywall.cta}
      </Link>
    </aside>
  );
}
