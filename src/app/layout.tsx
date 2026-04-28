import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoteSmart 26 - Smart Election Assistant",
  description: "Interactive AI assistant to understand the 2026 election process.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-gray-100 border-t border-gray-200 mt-12 py-8 text-center text-gray-500 text-sm">
          <p>Powered by Gemini 1.5 & Google Developer Hackathon (Promptwar)</p>
          <p className="mt-2">This is a concept app. Information should be verified with official .gov sources.</p>
        </footer>
      </body>
    </html>
  );
}
