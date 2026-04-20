import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const hubLogoFont = Montserrat({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-hub-logo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hub",
  description: "Hub Frontend Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={hubLogoFont.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
