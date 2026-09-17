import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chaminda Jayasekara — Portfolio",
  description: "Web designer & developer — projects, experience, and contact.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <header className="border-b">
          <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold">
              Chaminda Jayasekara
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/portfolio">Portfolio</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t">
          <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-500">
            <span>© {new Date().getFullYear()} Chaminda Jayasekara</span>
            <div className="flex gap-4">
              <a href="#" aria-label="GitHub">GitHub</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
