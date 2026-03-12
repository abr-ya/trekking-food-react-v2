import type { PropsWithChildren } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

export const Layout = ({ children }: PropsWithChildren) => (
  <div className="bg-linear-to-br from-background to-muted">
    <Header />
    <main className="min-h-[calc(100vh-140px)] container mx-auto px-4 py-8">{children}</main>
    <Footer />
  </div>
);
