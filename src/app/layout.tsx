import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";   
import Header from "@/components/Header";
import DangerousFooter from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SearchProvider>
          <CartProvider>
            <WishlistProvider>
              <Header/>
              {children}
              <DangerousFooter/>
            </WishlistProvider>
          </CartProvider>
        </SearchProvider>
        <Script
          src="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.js"
          strategy="afterInteractive"
        />
        <div
          hidden
          id="snipcart"
          data-api-key="NDMyNjY3ZjMtYjYxYy00NTEzLWFhZGMtYmUyZGQ2Yjg3MTk2NjM4NzE2NDkyNjg1MjU4OTc4"
        ></div>
      </body>
    </html>
      
  );
}
