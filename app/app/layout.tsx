import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme"
import Main from "@/components/main";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SignedOut>
              <Main />
            </SignedOut>
            <SignedIn>
              {children}
            </SignedIn>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
