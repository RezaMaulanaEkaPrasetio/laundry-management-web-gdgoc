import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "LaundryKu - POS & Manajemen Laundry",
  description:
    "Sistem Operasional Laundry Terpadu — POS Kasir, Manajemen Order, dan Tracking Real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Material Symbols Outlined Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakartaSans.className} bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
