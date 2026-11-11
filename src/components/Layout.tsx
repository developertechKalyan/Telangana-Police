import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-navy-950">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
