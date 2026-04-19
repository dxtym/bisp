import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { userRepository } from "@/lib/repository/user"
import { ok, fail } from "@/lib/api/response"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return fail("Barcha maydonlar to'ldirilishi shart", 400)
  }

  if (password.length < 8) {
    return fail("Parol kamida 8 ta belgidan iborat bo'lishi kerak", 400)
  }

  const existing = await userRepository.getUserByEmail(email)
  if (existing) {
    return fail("Bu email allaqachon ro'yxatdan o'tgan", 409)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await userRepository.createUser({ name, email, passwordHash })

  return ok(null, 201)
}
