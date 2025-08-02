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
          <div className="flex flex-col">
            <Link href="/shells" className="font-bold text-xl">
              The SoMconomy
            </Link>
            <Link href="/users/U092CHMLB24" className="sm:block hidden">
              Powered by @Parth Intelligence
            </Link>
          </div>
          <nav className="ml-auto">
            <SearchBar />
          </nav>
        </header>
        <div className="flex justify-around w-full my-2">
<Link href="https://summer.hackclub.com/projects/7217">Summer The Explorer for API</Link>
<Link href="https://summer.hackclub.com/projects/8258">sonai for AI detection</Link>
        </div>
      <h1 className="text-3xl font-bold mb-3 text-center">
        Summer of Making economic measurements
      </h1>
      <h3 className="text-center mb-8">
        Based off of the latest data from Parth&apos;s API, refreshes every 5 minutes
      </h3>

        {children}
      </body>
    </html>
  );
}
