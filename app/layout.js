import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <nav className="bg-white shadow-md mx-auto  px-6 py-3 flex flex-col sm:flex-row items-center justify-around sticky top-0 z-40 backdrop-blur bg-opacity-90 ">
          {/* Logo */}
          <div className="flex items-center gap-2 text-xl font-light tracking-tight text-[#bd9254] mb-2 sm:mb-0">
            <Image
              src="/pin.png"
              alt="Logo Pin"
              width={28}
              height={28}
              className="rounded-full"
              priority
            />
            <Link href="/">Care Concierge</Link>
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
              href="/owners"
              className="transition hover:text-[#bd9254] px-2 py-1 rounded"
            >
              Propriétaires
            </Link>
            <Link
              href="/taxes"
              className="transition hover:text-[#bd9254] px-2 py-1 rounded"
            >
              Taxes collectées
            </Link>
          
            <Link
              href="/versement"
              className="transition hover:text-[#bd9254] px-2 py-1 rounded"
            >
              Téléversement Mairies
            </Link>
          </div>
        </nav>
        <main className="min-w-7xl mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
