import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { FloatingWidget } from "@/components/ui/floating-widget";

export const metadata: Metadata = {
  title: "PackCustom — Premium Custom Packaging Solutions",
  description:
    "Design your perfect custom packaging boxes. Mailer boxes, rigid boxes, folding cartons and more. Eco-friendly materials, competitive pricing, worldwide shipping.",
  keywords: [
    "custom packaging",
    "custom boxes",
    "mailer box",
    "rigid box",
    "packaging design",
    "eco-friendly packaging",
    "B2B packaging",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <ConditionalLayout>
            <Navbar />
            <FloatingWidget />
          </ConditionalLayout>
          
          <main>{children}</main>
          
          <ConditionalLayout>
            <Footer />
          </ConditionalLayout>
        </I18nProvider>
      </body>
    </html>
  );
}
