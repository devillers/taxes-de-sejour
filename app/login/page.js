"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  // Mot de passe en dur pour démo, change le en prod
  const ADMIN_EMAIL = "contact@careconcierge.fr";
  const ADMIN_PWD = "Careconcierge1!"; // à stocker en variable d'env en prod

 function handleLogin(e) {
  e.preventDefault();
  if (email === ADMIN_EMAIL && password === ADMIN_PWD) {
    localStorage.setItem("isLoggedIn", "true");
    // Au lieu de router.push, fais un reload
    window.location.href = "/"; // ou la page à afficher après login
  } else {
    setMsg("Email ou mot de passe incorrect");
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs flex flex-col gap-5 border border-gray-200"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-2 text-[#bd9254]">Connexion</h2>
        <input
          className="border rounded-xl px-4 py-2"
          placeholder="Email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border rounded-xl px-4 py-2"
          placeholder="Mot de passe"
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {msg && <div className="text-red-600 text-xs">{msg}</div>}
        <button
          type="submit"
          className="bg-[#bd9254] text-white py-2 rounded-xl hover:bg-[#a37d44] transition font-bold"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
