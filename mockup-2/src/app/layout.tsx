import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Configure Roboto with the specific weights we need
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Surrey Capital Research | University of Surrey",
  description: "Student-led equity, M&A, quantitative, and economic research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} min-h-screen flex flex-col`}>
        <Navbar />
        {/* Main content wrapper */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}