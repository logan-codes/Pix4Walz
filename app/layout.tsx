import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Pix4Walz",
  description: "Your destination for stunning polaroids and posters.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />

        <main className="grow container mx-auto px-4 py-6">
          {children}
        </main>

        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
