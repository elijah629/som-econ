import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoM Economy",
  description: "Summer of Making economic measurements",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased m-8`}
      >
        <header className="bg-card text-card-foreground flex p-3 items-center mb-8 gap-6 rounded-xl border shadow-sm">
          <Link href="/" className="font-bold text-xl">
            The SoMconomy
          </Link>
          <nav className="ml-auto">
            <SearchBar/>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
