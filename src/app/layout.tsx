import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Taste Journal",
  description: "Personal food logging and palate analysis system.",
  openGraph: {
    title: "The Taste Journal",
    description: "Personal food logging and palate analysis system.",
    url: "https://taste-maker.shellnode.lol",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
