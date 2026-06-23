import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Cooking Kitchen by Afsana — Live Bakery",
  description: "Home-baked cakes, delivered fresh in Dhaka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-cream text-cocoa font-body">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
