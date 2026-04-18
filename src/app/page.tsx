"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/components/locale-provider";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

export default function HomePage() {
  const { copy } = useLocale();

  return (
    <main className="sd-page-shell">
      <div className="sd-content-width">
        <header className="sd-top-bar" aria-label="Marketing navigation">
          <Link href="/" className="sd-brand">
            {copy.common.appName}
          </Link>
          <nav className="sd-nav-links">
            <a href="#features" className="sd-nav-link">
              {copy.common.nav.features}
            </a>
            <a href="#integrations" className="sd-nav-link">
              {copy.common.nav.integrations}
            </a>
            <a href="#pricing" className="sd-nav-link">
              {copy.common.nav.pricing}
            </a>
            <a href="#about" className="sd-nav-link">
              {copy.common.nav.about}
            </a>
            <a href="#contact" className="sd-nav-link">
              {copy.common.nav.contact}
            </a>
          </nav>
          <div className="sd-top-actions">
            <Link href="/dashboard?plan=free&limit=open" className="sd-nav-link">
              {copy.common.nav.login}
            </Link>
            <Link
              href="/dashboard?plan=free&limit=open"
              className="sd-link-button sd-link-button--secondary"
            >
              {copy.common.nav.startTrial}
            </Link>
            <LanguageToggle />
          </div>
        </header>

        <section className="sd-hero-grid" id="features">
          <Card>
            <SectionHeader
              eyebrow={copy.marketing.eyebrow}
              title={copy.marketing.heroTitle}
              description={copy.marketing.heroSubtitle}
            />
            <div className="sd-hero-actions">
              <Link href="/dashboard?plan=free&limit=open" className="sd-link-button sd-link-button--primary">
                {copy.marketing.primaryCta}
              </Link>
              <Link href="/dashboard?plan=free&limit=open" className="sd-link-button sd-link-button--secondary">
                {copy.marketing.secondaryCta}
              </Link>
            </div>
          </Card>

          <Card id="integrations">
            <h2 className="sd-value-title">{copy.marketing.loopTitle}</h2>
            <ul className="sd-loop-list">
              {copy.marketing.loopItems.map((item) => (
                <li key={item} className="sd-loop-list-item">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="sd-value-grid" id="about">
          <Card>
            <h2 className="sd-value-title">{copy.marketing.trustTitle}</h2>
            <p className="sd-body-copy">{copy.marketing.trustCopy}</p>
          </Card>

          <Card id="pricing">
            <h2 className="sd-value-title">{copy.marketing.premiumTitle}</h2>
            <p className="sd-body-copy">{copy.marketing.premiumCopy}</p>
          </Card>
        </section>
      </div>
    </main>
  );
}
