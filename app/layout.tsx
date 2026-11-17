import type { Metadata } from "next";
import { Marcellus, Open_Sans, Oooh_Baby } from "next/font/google";
import { CartConfirmationProvider } from "./components/cart-confirmation";
import { SiteFooter } from "./components/site-footer";
import "./globals.css";

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
  title: "Crème de la pêche — Art to wear. Art to keep.",
  description:
    "I’m Charlotte. Discover my original drawings, art prints, tees and sweatshirts. Drawn by hand. Feminine, sensual, a little bold.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${marcellus.variable} ${ooohBaby.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartConfirmationProvider>
          {children}
          <SiteFooter />
        </CartConfirmationProvider>
      </body>
    </html>
  );
}
