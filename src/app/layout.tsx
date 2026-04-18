import type { ReactNode } from "react";
import "./globals.css";
import { LocaleProvider } from "@/components/locale-provider";

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
