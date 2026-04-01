import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Import the new Footer

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Surrey Capital Research | University of Surrey",
  description: "Student-led equity, M&A, quantitative, and economic research.",
};

import { getSiteSettings } from "@/actions/settings";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settingsResult = await getSiteSettings();
  const settings = (settingsResult.success ? settingsResult.data : null) as any;

  return (
    <html lang="en">
      {/* Added antialiased for cleaner text rendering */}
      <body className={`${roboto.className} antialiased min-h-screen flex flex-col`}>
        <Navbar settings={settings} />
        
        {/* The flex-grow on <main> ensures that if a page has very little content, 
          the Footer is still pushed to the bottom of the viewport.
        */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer settings={settings} />
      </body>
    </html>
  );
}