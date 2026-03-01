import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { userRepository } from "@/lib/repository/user"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Barcha maydonlar to'ldirilishi shart" }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" }, { status: 400 })
  }

  const existing = await userRepository.getUserByEmail(email)
  if (existing) {
    return NextResponse.json({ message: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await userRepository.createUserWithCredentials({ name, email, passwordHash })

  return NextResponse.json({ message: "ok" }, { status: 201 })
}
