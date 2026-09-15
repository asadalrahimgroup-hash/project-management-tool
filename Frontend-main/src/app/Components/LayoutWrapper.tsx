"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ChatbotButton from "./ChatbotButton";
import { ProgramProvider } from "@/context/ProgramContext";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage =
    pathname === "/login" ||
    pathname === "/login-manager" ||
    pathname === "/login-member" ||
    pathname.includes("login");

  if (isLoginPage) return <main>{children}</main>;

  return (
    <ProgramProvider>
      <div className="flex h-screen bg-[#f8f8f7] overflow-hidden">
        <Sidebar />
        <div
          className="flex flex-col flex-1 overflow-hidden md:ml-[240px]"
        >
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <ChatbotButton />
      </div>
    </ProgramProvider>
  );
}
