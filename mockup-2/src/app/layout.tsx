import type { Metadata } from "next";
import { EB_Garamond, Merriweather, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/actions/settings";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Surrey Capital Research | University of Surrey",
  description:
    "Surrey Capital Research — the University of Surrey's premier student-led financial organisation producing rigorous equity, M&A, quantitative and economic research.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settingsResult = await getSiteSettings();
  const settings = (settingsResult.success ? settingsResult.data : null) as any;

  return (
    <html lang="en" className={`${ebGaramond.variable} ${merriweather.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Dynamic brand overrides from admin */}
        {settings && (
          <style
            dangerouslySetInnerHTML={{
              __html: `
              :root {
                --color-surrey-blue:  ${settings.primaryColor    || "#3D5A80"};
                --color-surrey-gold:  ${settings.accentColor     || "#B8963E"};
                --color-surrey-light: ${settings.backgroundColor || "#FFFFFF"};
                --color-surrey-beige: ${settings.secondaryBgColor|| "#F7F8FA"};
                --color-surrey-grey:  ${settings.borderColor     || "#EBF0F5"};
                --color-text-muted:   ${settings.mutedColor      || "#6B7F94"};
                --font-heading: '${settings.headingFont || "EB Garamond"}', serif;
                --font-body:    '${settings.bodyFont    || "Merriweather"}', serif;
              }
            `,
            }}
          />
        )}
        {/* Load dynamic Google Fonts if admin overrides set */}
        {settings?.headingFont && settings?.bodyFont && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${settings.headingFont.replace(/ /g, "+")}:wght@400;700&family=${settings.bodyFont.replace(/ /g, "+")}:wght@400;700&display=swap`}
            rel="stylesheet"
          />
        )}
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen flex flex-col"
      >
        <Navbar settings={settings} />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}