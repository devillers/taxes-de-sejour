// /app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@email.com" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        // Ici tu vérifies l'email et le mot de passe, exemple simple :
        if (
          credentials.email === "contact@careconcierge.fr" &&
          credentials.password === "123456"
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "contact@careconcierge.fr",
            role: "admin", // rôle admin !
          };
        }
        // Ajoute d'autres comptes si besoin, ou connecte à ta BDD
        return null; // Refuse si mauvais
      }
    })
  ],
  session: {
    strategy: "jwt", // recommandé pour Next.js 13/14/15
  },
  callbacks: {
    async session({ session, token }) {
      // Ajoute le rôle à la session pour le front
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login", // Tu peux personnaliser la page de connexion
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
