import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Crushader Tech Solution | Template Catalog",
  description: "Professional website template catalog by Crushader Tech Solution.",
  icons: {
    icon: "/logos2.png",
    shortcut: "/logos2.png",
    apple: "/logos2.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}