import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Crushader Tech Solution | Template Catalog",
  description: "Professional website template catalog by Crushader Tech Solution.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}