"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Calendar, Clock, Users, CheckCircle2, AlertCircle,
  Circle, FolderKanban, Zap, TrendingUp, MoreHorizontal,
  ChevronRight, Activity, Flag, User, ExternalLink, Layers,
  UserCheck, UserPlus, Trash2, X, Plus, ShieldCheck
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProgram } from "@/context/ProgramContext";
import { API_BASE } from "@/lib/api";

type Project = {
  id: string; name: string; domain?: string; status?: string;
  priority?: string; start_date?: string; deadline?: string;
  progress?: number; manager_name?: string; about_description?: string;
  about_title?: string;
};
type Task = {
  id: string; name?: string; title?: string; status?: string;
  priority?: string; due_date?: string; assignee_name?: string; assignee_id?: string;
};

// â”€â”€â”€ Shared helpers (duplicated from Projects.tsx to keep pages independent) â”€â”€
const COVER_THEMES = [
  { from: "#4f46e5", to: "#7c3aed", pattern: "dots" },
  { from: "#0891b2", to: "#0e7490", pattern: "lines" },
  { from: "#059669", to: "#047857", pattern: "grid" },
  { from: "#dc2626", to: "#b91c1c", pattern: "dots" },
  { from: "#d97706", to: "#b45309", pattern: "lines" },
  { from: "#7c3aed", to: "#6d28d9", pattern: "grid" },
  { from: "#db2777", to: "#be185d", pattern: "dots" },
  { from: "#2563eb", to: "#1d4ed8", pattern: "lines" },
  { from: "#16a34a", to: "#15803d", pattern: "grid" },
  { from: "#ea580c", to: "#c2410c", pattern: "dots" },
];

function getTheme(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COVER_THEMES[Math.abs(hash) % COVER_THEMES.length];
}

function daysUntil(d?: string | null) {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

const AVATAR_GRADS = [
  "from-indigo-400 to-violet-500", "from-blue-400 to-cyan-500",
  "from-emerald-400 to-teal-500", "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500", "from-violet-400 to-purple-500",
];
function avatarGrad(name: string) {
  return AVATAR_GRADS[name.charCodeAt(0) % AVATAR_GRADS.length];
}

function priorityColor(p?: string) {
  if ((p || "").toLowerCase() === "high") return "#ef4444";
  if ((p || "").toLowerCase() === "low") return "#94a3b8";
  return "#f59e0b";
}

// â”€â”€â”€ SVG Donut â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DonutChart({
  segments, size = 180, stroke = 24, label, sublabel,
}: {
  segments: { value: number; color: string }[];
  size?: number; stroke?: number; label: string; sublabel: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  const arcs = segments.map(seg => {
    const len = (seg.value / total) * circ;
    const arc = { ...seg, dashOffset: circ - len, strokeOffset: offset };
    offset -= len;
    return arc;
  });
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        {arcs.map((arc, i) => (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={arc.color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${circ - arc.dashOffset} ${arc.dashOffset}`}
            strokeDashoffset={arc.strokeOffset}
          />
        ))}
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-black text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}

// â”€â”€â”€ Radial mini ring â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RingProgress({ pct, color, size = 40 }: { pct: number; color: string; size?: number }) {
  const r = (size - 5) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`} />
    </svg>
  );
}

const STATUS_CONFIG: Record<string, { label: string; color: string; badge: string; dot: string }> = {
  "To Do":       { label: "To Do",       color: "#94a3b8", badge: "bg-gray-100 text-gray-600 border-gray-200",       dot: "bg-gray-400" },
  "In Progress": { label: "In Progress", color: "#6366f1", badge: "bg-indigo-50 text-indigo-700 border-indigo-200",   dot: "bg-indigo-500" },
  "Review":      { label: "Review",      color: "#8b5cf6", badge: "bg-violet-50 text-violet-700 border-violet-200",   dot: "bg-violet-500" },
  "Done":        { label: "Done",        color: "#10b981", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const { getProjectProgram } = useProgram();
  const { user } = useAuth();
  const roleLower = (user?.role || "").toLowerCase();
  const isManager =
    roleLower.includes("manager") ||
    roleLower.includes("administrator") ||
    roleLower.includes("admin") ||
    roleLower.includes("lead");

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<any[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [memberRole, setMemberRole] = useState("Contributor");
  const [savingAction, setSavingAction] = useState(false);

  const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token");
    return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  const loadProjectData = async () => {
    if (!projectId) return;
    const headers = getHeaders();
    try {
      const projRes = await fetch(`${API_BASE}/projects`, { headers });
      if (projRes.ok) {
        const projData = await projRes.json();
        const all: Project[] = projData.projects || projData.data || [];
        const found = all.find(p => String(p.id) === String(projectId));
        if (found) setProject(found);
      }

      // Fetch tasks
      const taskRes = await fetch(`${API_BASE}/tasks/project/${projectId}`, { headers });
      if (taskRes.ok) {
        const taskData = await taskRes.json();
        setTasks(taskData.tasks || taskData.data || []);
      }

      // Fetch project members
      const pmRes = await fetch(`${API_BASE}/projects/${projectId}/members`, { headers }).catch(() => null);
      if (pmRes?.ok) {
        const pmData = await pmRes.json();
        setProjectMembers(pmData.members || []);
      }

      // Fetch assignable users
      const usersRes = await fetch(`${API_BASE}/teams/members`, { headers }).catch(() => null);
      if (usersRes?.ok) {
        const ud = await usersRes.json();
        const list = Array.isArray(ud) ? ud : (ud.members || ud.data || []);
        if (list.length > 0) {
          setAssignableUsers(list);
        } else {
          const fallback = await fetch(`${API_BASE}/programs/assignable-users`, { headers }).catch(() => null);
          if (fallback?.ok) {
            const fd = await fallback.json();
            setAssignableUsers(fd.users || []);
          }
        }
      } else {
        const fallback = await fetch(`${API_BASE}/programs/assignable-users`, { headers }).catch(() => null);
        if (fallback?.ok) {
          const fd = await fallback.json();
          setAssignableUsers(fd.users || []);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const handleAssignLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !selectedUserId) return;
    setSavingAction(true);
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/assign`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ userId: selectedUserId, managerId: selectedUserId }),
      });
      if (res.ok) {
        setAssignModalOpen(false);
        setSelectedUserId("");
        loadProjectData();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.message || "Failed to assign project");
      }
    } catch (err: any) {
      alert(err.message || "Failed to assign project");
    } finally {
      setSavingAction(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !selectedUserId) return;
    setSavingAction(true);
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/members`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ userId: selectedUserId, role: memberRole }),
      });
      if (res.ok) {
        setAddMemberModalOpen(false);
        setSelectedUserId("");
        setMemberRole("Contributor");
        loadProjectData();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.message || "Failed to add member to project");
      }
    } catch (err: any) {
      alert(err.message || "Failed to add member");
    } finally {
      setSavingAction(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member from the project?")) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/members/${userId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        loadProjectData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const stats = useMemo(() => {
    const done = tasks.filter(t => t.status === "Done").length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;
    const review = tasks.filter(t => t.status === "Review").length;
    const todo = tasks.filter(t => t.status === "To Do" || !t.status).length;
    const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== "Done").length;
    const rate = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
    const assignees = Array.from(new Set(tasks.filter(t => t.assignee_name).map(t => t.assignee_name!)));
    const highPri = tasks.filter(t => (t.priority || "").toLowerCase() === "high").length;
    return { done, inProgress, review, todo, overdue, rate, assignees, highPri };
  }, [tasks]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  const theme = getTheme(project.name);
  const prog = project.progress || 0;
  const days = daysUntil(project.deadline);
  const isOverdue = days !== null && days < 0;

  return (
    <div className="min-h-screen bg-[#f8f8f7]">
      {/* ── Hero Banner with Branded Gradient & Pattern ── */}
      <div
        className="relative h-56 w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
      >
        {/* Subtle geometric dot pattern */}
        <div className="absolute inset-0 opacity-15">
          <svg width="100%" height="100%">
            <pattern id={`hero-p-${project.name}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#hero-p-${project.name})`} />
          </svg>
        </div>

        {/* Ambient lighting accents */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-black/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 top-1/3 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        {/* Subtle dark gradient overlay for crystal-clear readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/10 pointer-events-none" />

        {/* Back button */}
        <div className="absolute top-5 left-6">
          <Link href="/projects" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-semibold bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <ArrowLeft size={14} /> Projects
          </Link>
        </div>

        {/* Title */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
              <FolderKanban size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-white/95 bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Layers size={11} /> Program: {getProjectProgram(project).name}
                </span>
                <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">{project.domain || "General"}</span>
              </div>
              <h1 className="text-white text-2xl font-black tracking-tight drop-shadow-lg line-clamp-1">{project.name}</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isManager && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUserId("");
                    setAssignModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-gray-900 hover:bg-white/90 shadow-md transition-all cursor-pointer"
                >
                  <UserCheck size={13} className="text-indigo-600" />
                  {project.manager_name && project.status !== "Unassigned" ? "Reassign" : "Assign to Member"}
                </button>
              )}
              {project.status && (
                <span className="hidden sm:flex text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/20">
                  {project.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 space-y-6">

        {/* â”€â”€ Row 1: Key metrics â”€â”€ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Completion", value: `${prog}%`, sub: `${stats.done} of ${tasks.length} tasks`, color: "from-indigo-500 to-violet-600", icon: TrendingUp },
            { label: "In Progress", value: stats.inProgress, sub: `${stats.review} in review`, color: "from-blue-500 to-cyan-500", icon: Activity },
            { label: "Overdue", value: stats.overdue, sub: stats.overdue > 0 ? "needs attention" : "all on track", color: stats.overdue > 0 ? "from-rose-500 to-red-500" : "from-emerald-500 to-teal-500", icon: AlertCircle },
            { label: "Team", value: stats.assignees.length, sub: `${tasks.length} total tasks`, color: "from-amber-500 to-orange-400", icon: Users },
          ].map(m => (
            <div key={m.label} className={`bg-gradient-to-br ${m.color} rounded-2xl p-5 text-white shadow-sm relative overflow-hidden`}>
              <div className="absolute -right-3 -top-3 w-20 h-20 rounded-full bg-white/10" />
              <m.icon size={18} className="text-white/70 mb-3 relative z-10" />
              <p className="text-3xl font-black relative z-10">{m.value}</p>
              <p className="text-sm font-semibold text-white/80 mt-0.5 relative z-10">{m.label}</p>
              <p className="text-xs text-white/50 mt-0.5 relative z-10">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* â”€â”€ Row 2: Donut + Progress + Details â”€â”€ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Donut chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity size={14} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-gray-900">Task Status</h3>
            </div>
            <div className="flex flex-col items-center gap-5">
              <DonutChart
                size={180} stroke={24}
                label={`${stats.rate}%`}
                sublabel="complete"
                segments={[
                  { value: stats.done, color: "#10b981" },
                  { value: stats.inProgress, color: "#6366f1" },
                  { value: stats.review, color: "#8b5cf6" },
                  { value: stats.todo, color: "#e2e8f0" },
                ]}
              />
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 w-full">
                {[
                  { label: "Done", value: stats.done, color: "#10b981" },
                  { label: "In Progress", value: stats.inProgress, color: "#6366f1" },
                  { label: "Review", value: stats.review, color: "#8b5cf6" },
                  { label: "To Do", value: stats.todo, color: "#e2e8f0" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-[11px] text-gray-500 font-medium">{s.label}</span>
                    <span className="text-[12px] font-bold text-gray-800 ml-auto">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overall progress */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={14} className="text-emerald-500" />
              <h3 className="text-sm font-bold text-gray-900">Progress Tracking</h3>
            </div>
            <div className="flex flex-col gap-4">
              {/* Big progress bar */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Overall</span>
                  <span className="text-2xl font-black text-gray-900">{prog}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${prog}%`,
                      background: prog >= 100 ? "#10b981" : `linear-gradient(to right, ${theme.from}, ${theme.to})`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-gray-400">{project.start_date ? new Date(project.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Start"}</span>
                  <span className="text-[10px] text-gray-400">{project.deadline ? new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No deadline"}</span>
                </div>
              </div>

              {/* Per-status segments */}
              <div className="space-y-3 mt-2">
                {[
                  { label: "Done", count: stats.done, color: "#10b981" },
                  { label: "In Progress", count: stats.inProgress, color: "#6366f1" },
                  { label: "Review", count: stats.review, color: "#8b5cf6" },
                  { label: "To Do", count: stats.todo, color: "#e2e8f0" },
                ].map(s => {
                  const pct = tasks.length > 0 ? Math.round((s.count / tasks.length) * 100) : 0;
                  return (
                    <div key={s.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                          <span className="text-[12px] font-semibold text-gray-600">{s.label}</span>
                        </div>
                        <span className="text-[12px] font-bold text-gray-700">{s.count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Project details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Flag size={14} className="text-amber-500" />
              <h3 className="text-sm font-bold text-gray-900">Project Details</h3>
            </div>
            <div className="space-y-4">
              {project.about_description && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">About</p>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{project.about_description}</p>
                </div>
              )}
              <div className="space-y-3 pt-2">
                {[
                  { icon: Layers, label: "Program", value: getProjectProgram(project).name },
                  { icon: Flag, label: "Priority", value: project.priority || "Medium", badge: true },
                  { icon: Calendar, label: "Start Date", value: project.start_date ? new Date(project.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Not set" },
                  {
                    icon: Clock, label: "Deadline",
                    value: project.deadline ? new Date(project.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Not set",
                    highlight: isOverdue ? "text-rose-600" : (days !== null && days <= 7 ? "text-amber-600" : undefined),
                  },
                  { icon: User, label: "Manager", value: project.manager_name || "Unassigned" },
                  { icon: FolderKanban, label: "Domain", value: project.domain || "General" },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <row.icon size={13} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{row.label}</p>
                      <p className={`text-[13px] font-semibold truncate ${(row as any).highlight || "text-gray-800"}`}>{row.value}</p>
                    </div>
                    {days !== null && row.label === "Deadline" && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${isOverdue ? "bg-rose-100 text-rose-700" : days <= 7 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                        {isOverdue ? `${Math.abs(days)}d late` : `${days}d left`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Team Members */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-indigo-600" />
                <h3 className="text-sm font-bold text-gray-900">Project Team</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5">
                  {projectMembers.length}
                </span>
              </div>
              {isManager && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUserId("");
                    setMemberRole("Contributor");
                    setAddMemberModalOpen(true);
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus size={12} /> Add Member
                </button>
              )}
            </div>

            {projectMembers.length === 0 ? (
              <div className="py-6 text-center text-gray-400 text-xs">
                No team members assigned yet.
                {isManager && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUserId("");
                      setAssignModalOpen(true);
                    }}
                    className="block mx-auto mt-2 text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    Assign to Member
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {projectMembers.map((m: any) => (
                  <div key={m.id || m.user_id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGrad(m.full_name || "M")} text-white font-bold flex items-center justify-center text-xs flex-shrink-0`}>
                        {getInitials(m.full_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{m.full_name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{m.job_title || m.system_role || "Member"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                        {m.project_role || "Contributor"}
                      </span>
                      {isManager && m.user_id !== user?.id && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.user_id)}
                          className="p-1 text-gray-300 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove from project"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* â”€â”€ Row 3: Tasks list â”€â”€ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-gray-900">Tasks</h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5">{tasks.length}</span>
            </div>
          </div>

          {/* Kanban-style column summary */}
          <div className="grid grid-cols-4 border-b border-gray-50">
            {(["To Do", "In Progress", "Review", "Done"] as const).map(col => {
              const cfg = STATUS_CONFIG[col];
              const count = tasks.filter(t => (t.status || "To Do") === col).length;
              return (
                <div key={col} className="py-3 px-4 text-center border-r last:border-r-0 border-gray-50">
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${cfg.dot}`} />
                  <p className="text-xl font-black text-gray-900">{count}</p>
                  <p className="text-[10px] font-semibold text-gray-400">{col}</p>
                </div>
              );
            })}
          </div>

          {/* Task rows */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100">
                  <th className="text-left py-2.5 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">Task</th>
                  <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">Priority</th>
                  <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Assignee</th>
                  <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                      No tasks yet. Add tasks from the Tasks page.
                    </td>
                  </tr>
                ) : tasks.map(t => {
                  const st = t.status || "To Do";
                  const cfg = STATUS_CONFIG[st] || STATUS_CONFIG["To Do"];
                  const days = daysUntil(t.due_date);
                  const isLate = days !== null && days < 0 && st !== "Done";
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-6">
                        <p className={`text-[13px] font-medium ${st === "Done" ? "line-through text-gray-400" : "text-gray-800"}`}>
                          {t.name || t.title}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${cfg.badge}`}>{st}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: priorityColor(t.priority) }} />
                          <span className="text-xs text-gray-600 font-medium">{t.priority || "Medium"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        {t.assignee_name ? (
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarGrad(t.assignee_name)} flex items-center justify-center text-white text-[9px] font-bold`}>
                              {getInitials(t.assignee_name)}
                            </div>
                            <span className="text-xs text-gray-600">{t.assignee_name}</span>
                          </div>
                        ) : <span className="text-xs text-gray-300">Unassigned</span>}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {t.due_date ? (
                          <span className={`text-xs font-semibold ${isLate ? "text-rose-600" : days !== null && days <= 3 ? "text-amber-600" : "text-gray-400"}`}>
                            {isLate ? `${Math.abs(days!)}d overdue` : new Date(t.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        ) : <span className="text-gray-300 text-xs">â€”</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* â”€â”€ Row 4: Team members â”€â”€ */}
        {stats.assignees.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users size={15} className="text-violet-500" />
              <h3 className="text-sm font-bold text-gray-900">Team on this Project</h3>
              <span className="text-xs font-bold text-violet-600 bg-violet-50 rounded-full px-2 py-0.5">{stats.assignees.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {stats.assignees.map(name => {
                const mt = tasks.filter(t => t.assignee_name === name);
                const done = mt.filter(t => t.status === "Done").length;
                const rate = mt.length > 0 ? Math.round((done / mt.length) * 100) : 0;
                return (
                  <div key={name} className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="relative mb-2">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarGrad(name)} flex items-center justify-center text-white text-sm font-bold`}>
                        {getInitials(name)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <RingProgress pct={rate} color="#6366f1" size={22} />
                      </div>
                    </div>
                    <p className="text-[12px] font-bold text-gray-800 leading-tight line-clamp-1">{name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{done}/{mt.length} done</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── ASSIGN PROJECT LEAD / MEMBER MODAL ── */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Assign Project Lead / Member</h3>
                <p className="text-xs text-gray-500 mt-0.5">{project.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAssignLead} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  Select Team Member *
                </label>
                <select
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  required
                >
                  <option value="">Choose a member...</option>
                  {assignableUsers.map((u: any) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.role || u.system_role || "Member"})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  The selected member will be designated as lead, added to project contributors, and project status updated.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAction || !selectedUserId}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {savingAction ? "Saving..." : <><UserCheck size={14} /> Confirm</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD CONTRIBUTOR MODAL ── */}
      {addMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Add Team Contributor</h3>
                <p className="text-xs text-gray-500 mt-0.5">{project.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setAddMemberModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  Select Team Member *
                </label>
                <select
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  required
                >
                  <option value="">Choose a member...</option>
                  {assignableUsers.map((u: any) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.role || u.system_role || "Member"})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  Project Role
                </label>
                <select
                  value={memberRole}
                  onChange={e => setMemberRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="Contributor">Contributor</option>
                  <option value="Lead Contributor">Lead Contributor</option>
                  <option value="Technical Specialist">Technical Specialist</option>
                  <option value="QA / Reviewer">QA / Reviewer</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddMemberModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAction || !selectedUserId}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {savingAction ? "Adding..." : <><UserPlus size={14} /> Add Contributor</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
