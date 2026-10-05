import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Fun Souls",
    template: "%s · Fun Souls",
  },
  description:
    "Travel memories with friends — photos, stories, and the crew who made every trip unforgettable.",
  openGraph: {
    title: "Fun Souls",
    description: "Travel memories with friends — island hops, sunsets, and stories worth keeping.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
