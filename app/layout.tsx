import type { Metadata } from "next";
import "./globals.css";

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
        {/* Plus Jakarta Sans — loaded at runtime via CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols Outlined Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans bg-[#F8FAFC] antialiased min-h-screen flex flex-col"
      >
        {children}
      </body>
    </html>
  );
}
