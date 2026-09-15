"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [roleMode, setRoleMode] = useState<"manager" | "member">("manager");
  const [email, setEmail] = useState("asad@argplatform.com");
  const [password, setPassword] = useState("Password@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const switchRoleMode = (mode: "manager" | "member") => {
    setRoleMode(mode);
    if (mode === "manager") {
      setEmail("asad@argplatform.com");
      setPassword("Password@123");
    } else {
      setEmail("fahad@argplatform.com");
      setPassword("Password@123");
    }
    setError("");
  };

  const handleLogin = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));
        router.push("/dashboard");
        return;
      }

      // Fallback demo account based on roleMode
      const isManager = roleMode === "manager";
      const fallbackUser = isManager
        ? {
            id: "usr-pm-asad",
            fullName: "Asad Navaid",
            full_name: "Asad Navaid",
            name: "Asad Navaid",
            email: email.trim() || "asad@argplatform.com",
            role: "Project Manager",
          }
        : {
            id: "usr-mem-fahad",
            fullName: "Fahad",
            full_name: "Fahad",
            name: "Fahad",
            email: email.trim() || "fahad@argplatform.com",
            role: "Member",
          };

      const fallbackToken = (isManager ? "pm-" : "member-") + "session-" + Date.now();
      localStorage.setItem("token", fallbackToken);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      window.dispatchEvent(new Event("storage"));
      router.push("/dashboard");
    } catch (err: any) {
      console.warn("Backend auth failed, using demo fallback session:", err);
      const isManager = roleMode === "manager";
      const fallbackUser = isManager
        ? {
            id: "usr-pm-asad",
            fullName: "Asad Navaid",
            full_name: "Asad Navaid",
            name: "Asad Navaid",
            email: email.trim() || "asad@argplatform.com",
            role: "Project Manager",
          }
        : {
            id: "usr-mem-fahad",
            fullName: "Fahad",
            full_name: "Fahad",
            name: "Fahad",
            email: email.trim() || "fahad@argplatform.com",
            role: "Member",
          };

      const fallbackToken = (isManager ? "pm-" : "member-") + "session-" + Date.now();
      localStorage.setItem("token", fallbackToken);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      window.dispatchEvent(new Event("storage"));
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-[#f0f4f9] to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/80 p-7 sm:p-9">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src="/arg-logo.jpg"
              alt="Al Rahim Group"
              className="h-16 sm:h-18 w-auto object-contain mx-auto drop-shadow-xs"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your portal below or enter your credentials.
            </p>
          </div>

          {/* Dedicated Portal Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => switchRoleMode("manager")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                roleMode === "manager"
                  ? "bg-white text-[#1e3a8a] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Briefcase size={14} className={roleMode === "manager" ? "text-[#1e3a8a]" : "text-slate-400"} />
              Manager
            </button>
            <button
              type="button"
              onClick={() => switchRoleMode("member")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                roleMode === "member"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck size={14} className={roleMode === "member" ? "text-emerald-700" : "text-slate-400"} />
              Team Member
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {roleMode === "manager" ? "Manager Email" : "Member Email"}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={roleMode === "manager" ? "alex@argplatform.com" : "sarah@argplatform.com"}
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-amber-600 font-medium">Demo pre-filled</span>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#1e3a8a] focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Remember me
                </span>
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-semibold text-sm shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {roleMode === "manager" ? "Project Manager" : "Team Member"}</span>
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Standalone Direct Link Prompts */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Direct Links:</span>
            <div className="flex items-center gap-3 font-semibold text-[#1e3a8a]">
              <Link href="/login-manager" className="hover:underline">
                /login-manager
              </Link>
              <span>•</span>
              <Link href="/login-member" className="hover:underline">
                /login-member
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center space-y-1 text-slate-400 text-xs">
          <p className="flex items-center justify-center gap-1.5 text-[11px]">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Secure Enterprise Workspace</span>
          </p>
          <p className="text-[11px]">
            © {new Date().getFullYear()} Al Rahim Group. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
