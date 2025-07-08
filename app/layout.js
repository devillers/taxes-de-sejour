import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <nav className="bg-white shadow-md mx-auto  px-6 py-3 flex flex-col sm:flex-row items-center justify-around sticky top-0 z-40 backdrop-blur bg-opacity-90 ">
          {/* Logo */}
          <div className="text-xl font-bold tracking-tight text-[#bd9254] mb-2 sm:mb-0">
            <Link href="/">CareConcierge</Link>
          </div>
          {/* Menu */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-thin">
            <Link
              href="/"
              className="transition hover:text-[#bd9254] px-2 py-1 rounded"
            >
              Accueil
            </Link>
            <Link
              href="/datas"
              className="transition hover:text-[#bd9254] px-2 py-1 rounded"
            >
              Upload
            </Link>
            <Link
              href="/taxes"
              className="transition hover:text-[#bd9254] px-2 py-1 rounded"
            >
              Taxes de séjour
            </Link>
            <Link
              href="/owners"
              className="transition hover:text-[#bd9254] px-2 py-1 rounded"
            >
              Propriétaires
            </Link>
            <Link
              href="/versement"
              className="transition hover:text-[#bd9254] px-2 py-1 rounded"
            >
              Téléversement
            </Link>
          </div>
        </nav>
        <main className="min-w-7xl mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
