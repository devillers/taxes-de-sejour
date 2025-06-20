import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Taxe de s\u00e9jour",
  description: "Application de calcul de la taxe de séjour",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="p-4 bg-gray-100 text-black border-b mb-4">
          <Link href="/" className="mr-4 hover:underline">
            Accueil
          </Link>
          <Link href="/taxe-de-sejour" className="mr-4 hover:underline">
            Taxe de Séjour
          </Link>
          <Link href="/versement" className="hover:underline">
            Versement
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
