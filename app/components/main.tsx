"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Main() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="max-w-5xl mx-auto px-5 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="logo"
            width={70}
            height={70}
          />
        </div>
        <nav className="flex items-center gap-4">
          <a className="hidden sm:inline-block text-sm text-slate-600 hover:text-slate-900">Asosiy</a>
          <a className="hidden sm:inline-block text-sm text-slate-600 hover:text-slate-900">Narxlar</a>
          <a className="hidden sm:inline-block text-sm text-slate-600 hover:text-slate-900">Savollar</a>
          <SignUpButton mode="redirect">
            <Button className="rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-gray-800">Kirish</Button>
          </SignUpButton>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto py-20 sm:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">Donishmand</h1>
            <p className="mt-4 text-lg text-slate-600">Siz yozing, biz bajaramiz!</p>
            <div className="mt-8 flex flex-row gap-3">
              <SignUpButton mode="redirect">
                <Button className="rounded-md bg-black text-white px-6 py-3 text-sm hover:bg-slate-800">Boshlash</Button>
              </SignUpButton>
              <SignInButton mode="redirect">
                <Button
                  variant="ghost"
                  className="px-5 py-3 text-sm hover:text-slate-500 hover:bg-white"
                >
                  Kirish
                </Button>
              </SignInButton>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="w-full max-w-md bg-linear-to-br from-[#f8fafc] to-white rounded-2xl shadow-xl border">
              <Image src="/logo.png" alt="app preview" width={560} height={420} className="rounded-lg object-cover" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
