import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { userRepository } from "@/lib/repository/user"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        if (!email || !password) return null
        const user = await userRepository.getUserByEmail(email)
        if (!user || !user.passwordHash) return null
        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null
        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await userRepository.getUserByEmail(user.email)
        if (!existing) {
          const created = await userRepository.createUser({
            name: user.name || "User",
            email: user.email,
            image: user.image || undefined,
          })
          user.id = created.id
        } else {
          user.id = existing.id
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user?.id) token.userId = user.id
      return token
    },
    async session({ session, token }) {
      session.user.id = token.userId as string
      return session
    },
  },
  pages: { signIn: "/sign-in" },
})
