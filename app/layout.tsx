import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kasi — Operating System for Social Commerce",
  description:
    "Automate your DMs. Answer every WhatsApp, Instagram and Telegram customer, negotiate, take payment, and push orders to delivery automatically.",
  icons: {
    icon: "/brand/kasi-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} font-sans bg-paper text-ink min-h-screen antialiased selection:bg-lime selection:text-ink overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
