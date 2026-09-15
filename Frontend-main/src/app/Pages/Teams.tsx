"use client";

import React, { useEffect, useState } from "react";
import { Users, Mail, Shield, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

type Member = { id: string; full_name: string; email?: string; role: string; team_name?: string };

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

const ROLE_COLORS: Record<string, string> = {
  "Project Manager": "bg-blue-50 text-blue-700 border-blue-200",
  "Developer": "bg-violet-50 text-violet-700 border-violet-200",
  "Designer": "bg-pink-50 text-pink-700 border-pink-200",
  "QA Engineer": "bg-amber-50 text-amber-700 border-amber-200",
  "System Administrator": "bg-rose-50 text-rose-700 border-rose-200",
  "Executive Manager": "bg-indigo-50 text-indigo-700 border-indigo-200",
};

function roleColor(role: string) {
  return ROLE_COLORS[role] || "bg-gray-100 text-gray-600 border-gray-200";
}

function avatarGradient(name: string) {
  const gradients = [
    "from-indigo-400 to-violet-500",
    "from-blue-400 to-cyan-500",
    "from-emerald-400 to-teal-500",
    "from-rose-400 to-pink-500",
    "from-amber-400 to-orange-500",
    "from-violet-400 to-purple-500",
  ];
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx];
}

export default function Teams() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const headers: HeadersInit = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      try {
        const res = await fetch(`${API_BASE}/teams/members`, { headers });
        if (res.ok) {
          const d = await res.json();
          const list = Array.isArray(d) ? d : (d.members || d.data || d.users || []);
          setMembers(list);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [router]);

  const filtered = members.filter(m =>
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const roles = Array.from(new Set(members.map(m => m.role)));

  if (loading) return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Organization</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Team</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">{members.length} members across {roles.length} roles</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {roles.slice(0, 4).map(role => (
          <div key={role} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{members.filter(m => m.role === role).length}</p>
            <p className="text-xs font-semibold text-gray-500 mt-1 truncate">{role}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search team members..."
        className="w-full max-w-sm px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all shadow-sm"
      />

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col items-center text-center group">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGradient(m.full_name)} flex items-center justify-center text-white text-lg font-bold mb-3 shadow-sm`}>
              {getInitials(m.full_name)}
            </div>
            <p className="text-[14px] font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{m.full_name}</p>
            {m.email && (
              <p className="text-xs text-gray-400 mt-0.5 truncate w-full max-w-[160px]">{m.email}</p>
            )}
            <span className={`mt-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${roleColor(m.role)}`}>
              {m.role}
            </span>
            {m.team_name && (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Briefcase size={10} /> {m.team_name}
              </p>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Users size={22} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-600">No members found</p>
          </div>
        )}
      </div>
    </div>
  );
}
