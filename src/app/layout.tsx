import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientClerkProvider from '@/components/ClientClerkProvider';
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Full-Stack Blog Platform",
  description: "A modern blogging platform built with Next.js 15, TypeScript, tRPC, and PostgreSQL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientClerkProvider>
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </ClientClerkProvider>
      </body>
    </html>
  );
}