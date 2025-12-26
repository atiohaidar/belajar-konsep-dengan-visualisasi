import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Visualisasi Konsep Programming",
  description: "Pelajari konsep programming seperti HTTP, WebSocket, CORS, Cookie, Session dengan visualisasi interaktif yang mudah dipahami",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-900 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
