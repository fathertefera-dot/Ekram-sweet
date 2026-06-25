import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Iku Sweet Cake - Freshly Baked Cakes Delivered",
  description: "Order delicious, freshly baked cakes online. Wide variety of flavors and custom designs for any occasion.",
  keywords: "cakes, bakery, custom cakes, birthday cakes, wedding cakes, Ethiopia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
