import type { Metadata } from "next";
import { Marcellus, Open_Sans, Oooh_Baby } from "next/font/google";
import { CartConfirmationProvider } from "./components/cart-confirmation";
import { SiteFooter } from "./components/site-footer";
import { SmoothScroll } from "./components/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";
import { indexable, siteDescription, siteName, siteUrl } from "@/lib/seo";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const ooohBaby = Oooh_Baby({
  variable: "--font-oooh-baby",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
  applicationName: siteName,
  robots: { index: indexable, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openSans.variable} ${marcellus.variable} ${ooohBaby.variable} h-full antialiased`}
    >
      <head>
        {/* Hide scroll-reveal targets before first paint; without JS they simply stay visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('reveals')" }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        <CartConfirmationProvider>
          {children}
          <SiteFooter />
        </CartConfirmationProvider>
      </body>
    </html>
  );
}
