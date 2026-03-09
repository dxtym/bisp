"use client";

import Hero from "./hero";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Main() {
  return (
    <div className="relative min-h-screen text-foreground">
      <div className="fixed top-[10%] bottom-[10%] left-[20%] right-[20%] -z-10">
        <div
          className="h-full w-full"
          style={{
            backgroundSize: "50px 50px",
            backgroundImage: `
              linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)
            `,
            maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 60%)",
          }}
        />
      </div>
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      <main className="fixed inset-0 flex items-center justify-center">
        <Hero />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 z-50 py-5">
        <Footer />
      </footer>
    </div>
  );
}
