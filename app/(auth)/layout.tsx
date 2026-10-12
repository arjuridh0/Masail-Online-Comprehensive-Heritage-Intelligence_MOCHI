import React from "react";
import Navbar from "@/components/layout/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F3EE] flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}