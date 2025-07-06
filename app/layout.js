import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <nav className="p-4 bg-gray-100 text-black border-b mb-4">
          <Link href="/" className="mr-4 hover:underline">
            Accueil
          </Link>
          <Link href="/datas" className="mr-4 hover:underline">
            Données
          </Link>
          <Link href="/versement" className="mr-4 hover:underline">
            Versement
          </Link>
          <Link href="/logements" className="hover:underline">
            Logements
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
