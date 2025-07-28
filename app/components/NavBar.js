"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-md mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-around sticky top-0 z-40 backdrop-blur bg-opacity-90">
      {/* Logo */}
      <div className="flex items-center gap-2 text-xl font-light tracking-tight text-[#bd9254] mb-2 sm:mb-0">
        <Image src="/pin.png" width={32} height={32} style={{ height: "auto" }} alt="Pin" />
        <Link href="/">Care Concierge</Link>
      </div>
      {/* Menu */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-thin">
        <Link href="/" className="transition hover:text-[#bd9254] px-2 py-1 rounded">
          Accueil
        </Link>
        <Link href="/datas" className="transition hover:text-[#bd9254] px-2 py-1 rounded">
          Upload
        </Link>
        <Link href="/owners" className="transition hover:text-[#bd9254] px-2 py-1 rounded">
          Propriétaires
        </Link>
        <Link href="/properties" className="transition hover:text-[#bd9254] px-2 py-1 rounded">
          Logements
        </Link>
        <Link href="/taxes" className="transition hover:text-[#bd9254] px-2 py-1 rounded">
          Taxes collectées
        </Link>
        <Link href="/versement-cumules" className="transition hover:text-[#bd9254] px-2 py-1 rounded">
          Téléversement Mairies
        </Link>
          <Link href="/login" className="transition hover:text-[#bd9254] px-2 py-1 rounded">
          Login
        </Link>
      </div>
      {/* Auth */}
      <div className="ml-2 flex items-center gap-2">
        {status === "loading" ? (
          <span className="text-xs text-gray-400">Vérification...</span>
        ) : session ? (
          <>
            <span className="text-xs text-gray-600">
              {session.user?.name || session.user?.email}
              {session.user?.role === "admin" && (
                <span className="ml-1 px-2 py-0.5 bg-[#bd9254] text-white rounded text-[10px]">ADMIN</span>
              )}
            </span>
            <button
              onClick={() => signOut()}
              className="ml-2 px-3 py-1 rounded-xl bg-gray-100 text-xs text-gray-700 hover:bg-gray-200"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="ml-2 px-3 py-1 rounded-xl bg-[#bd9254] text-white text-xs font-medium hover:bg-[#a17435]"
          >
            Connexion
          </button>
        )}
      </div>
    </nav>
  );
}
