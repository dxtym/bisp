"use client";

import Hero from "./hero";
import Navbar from "./navbar";
import Footer from "./footer";
import GridBackground from "./grid-background";

export default function Main() {
  return (
    <div className="relative min-h-screen text-foreground">
      <GridBackground />
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
