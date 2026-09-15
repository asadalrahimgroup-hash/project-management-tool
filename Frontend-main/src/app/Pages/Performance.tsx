"use client";

import React, { useEffect, useState } from "react";
import { Activity, TrendingUp, CheckCircle2, Users, BarChart3, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/lib/api";

type Task = { id: string; status?: string; assignee_name?: string; assignee_id?: string; due_date?: string; updated_at?: string };
type Project = { id: string; name: string; progress?: number; status?: string };
type TeamMember = { id: string; full_name: string; role: string };

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

const avatarGradients = [
  "from-indigo-400 to-violet-500", "from-blue-400 to-cyan-500", "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500", "from-amber-400 to-orange-500", "from-violet-400 to-purple-500",
];

export default function Performance() {
  const router = useRouter();
  const { user } = useAuth();
  const roleLower = (user?.role || "").toLowerCase();
  const isManager =
    roleLower.includes("manager") ||
    roleLower.includes("administrator") ||
    roleLower.includes("admin") ||
    roleLower.includes("lead");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const headers: HeadersInit = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      try {
        const [projRes, membersRes, myTasksRes] = await Promise.all([
          fetch(`${API_BASE}/projects`, { headers }).catch(() => null),
          fetch(`${API_BASE}/teams/members`, { headers }).catch(() => null),
          fetch(`${API_BASE}/tasks/my/tasks`, { headers }).catch(() => null),
        ]);

        let allProjects: Project[] = [];
        if (projRes?.ok) {
          const projData = await projRes.json();
          allProjects = projData.projects || projData.data || [];
          setProjects(allProjects);
        }

        if (membersRes?.ok) {
          const md = await membersRes.json();
          const list = Array.isArray(md) ? md : (md.members || md.data || md.users || []);
          setMembers(list);
        }

        let allTasks: Task[] = [];
        if (isManager && allProjects.length > 0) {
          const taskArrays = await Promise.all(
            allProjects.map(async p => {
              const res = await fetch(`${API_BASE}/tasks/project/${p.id}`, { headers }).catch(() => null);
              if (!res || !res.ok) return [];
              const d = await res.json();
              return d.tasks || d.data || [];
            })
          );
          allTasks = taskArrays.flat();
        } else if (myTasksRes?.ok) {
          const d = await myTasksRes.json();
          allTasks = d.tasks || d.data || [];
        }

        setTasks(allTasks);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [router, isManager]);

  if (loading) return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  );

  const done = tasks.filter(t => t.status === "Done").length;
  const rate = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
  const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== "Done").length;
  const activeProjects = projects.filter(p => !["completed", "done"].includes((p.status || "").toLowerCase()));

  // Per-member stats
  const memberStats = members.map(m => {
    const mt = tasks.filter(t => t.assignee_id === m.id || t.assignee_name === m.full_name);
    const mDone = mt.filter(t => t.status === "Done").length;
    return { ...m, total: mt.length, done: mDone, rate: mt.length > 0 ? Math.round((mDone / mt.length) * 100) : 0 };
  }).sort((a, b) => b.done - a.done);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Analytics</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Performance</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Team productivity and delivery metrics.</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Completion Rate", value: `${rate}%`, sub: `${done} of ${tasks.length} tasks done`, icon: TrendingUp, color: "text-indigo-600", accent: "bg-indigo-50" },
          { label: "Active Projects", value: activeProjects.length, sub: `${projects.length} total projects`, icon: BarChart3, color: "text-blue-600", accent: "bg-blue-50" },
          { label: "Overdue Tasks", value: overdue, sub: overdue > 0 ? "needs attention" : "all on track", icon: CheckCircle2, color: overdue > 0 ? "text-rose-600" : "text-emerald-600", accent: overdue > 0 ? "bg-rose-50" : "bg-emerald-50" },
          { label: "Team Members", value: members.length, sub: "active collaborators", icon: Users, color: "text-violet-600", accent: "bg-violet-50" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.accent}`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className={`text-sm font-semibold mt-0.5 ${stat.color}`}>{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Member leaderboard */}
      {memberStats.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Award size={15} className="text-amber-500" />
            <h2 className="text-sm font-bold text-gray-900">Team Performance</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {memberStats.slice(0, 10).map((m, i) => (
              <div key={m.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <span className="text-sm font-bold text-gray-300 w-5 flex-shrink-0">#{i + 1}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {getInitials(m.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900">{m.full_name}</p>
                  <p className="text-[11px] text-gray-400">{m.role}</p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-xs font-semibold text-gray-700">{m.done}/{m.total} tasks</p>
                  <p className="text-xs text-gray-400">{m.total > 0 ? "assigned" : "no tasks"}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden lg:block">
                    <div className={`h-full rounded-full transition-all ${m.rate >= 80 ? "bg-emerald-500" : m.rate >= 50 ? "bg-indigo-500" : "bg-amber-400"}`} style={{ width: `${m.rate}%` }} />
                  </div>
                  <span className={`text-xs font-bold w-10 text-right ${m.rate >= 80 ? "text-emerald-600" : m.rate >= 50 ? "text-indigo-600" : "text-amber-600"}`}>
                    {m.rate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
          <Activity size={15} className="text-indigo-500" />
          <h2 className="text-sm font-bold text-gray-900">Project Progress</h2>
        </div>
        <div className="p-6 space-y-4">
          {projects.slice(0, 8).map(p => {
            const prog = p.progress || 0;
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium text-gray-700 truncate max-w-[60%]">{p.name}</span>
                  <span className="text-xs font-bold text-gray-500">{prog}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${prog >= 100 ? "bg-emerald-500" : prog >= 50 ? "bg-indigo-500" : "bg-amber-400"}`}
                    style={{ width: `${prog}%` }}
                  />
                </div>
              </div>
            );
          })}
          {projects.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No project data available.</p>}
        </div>
      </div>
    </div>
  );
}
