"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Clock, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/lib/api";

type Task = { id: string; name?: string; title?: string; status?: string; due_date?: string; project_name?: string; assignee_name?: string };
type Project = { id: string; name: string; deadline?: string; status?: string };

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function Schedule() {
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
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const headers: HeadersInit = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      try {
        const [projRes, myTasksRes] = await Promise.all([
          fetch(`${API_BASE}/projects`, { headers }).catch(() => null),
          fetch(`${API_BASE}/tasks/my/tasks`, { headers }).catch(() => null),
        ]);

        let allProjects: Project[] = [];
        if (projRes?.ok) {
          const projData = await projRes.json();
          allProjects = projData.projects || projData.data || [];
          setProjects(allProjects);
        }

        let allTasks: Task[] = [];
        if (isManager && allProjects.length > 0) {
          const taskArrays = await Promise.all(
            allProjects.map(async p => {
              const res = await fetch(`${API_BASE}/tasks/project/${p.id}`, { headers }).catch(() => null);
              if (!res || !res.ok) return [];
              const d = await res.json();
              return (d.tasks || d.data || []).map((t: Task) => ({ ...t, project_name: p.name }));
            })
          );
          allTasks = taskArrays.flat();
        } else if (myTasksRes?.ok) {
          const d = await myTasksRes.json();
          allTasks = (d.tasks || d.data || []).map((t: any) => ({
            ...t,
            project_name: t.project_name || t.project?.name || "Project",
          }));
        }

        setTasks(allTasks);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [router, isManager]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  const tasksOnDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return tasks.filter(t => t.due_date && t.due_date.startsWith(dateStr));
  };

  const projectsOnDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return projects.filter(p => p.deadline && p.deadline.startsWith(dateStr));
  };

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Upcoming events (next 30 days)
  const upcoming = [
    ...tasks.filter(t => t.due_date && daysUntil(t.due_date) >= 0 && daysUntil(t.due_date) <= 14).map(t => ({
      type: "task" as const, name: t.name || t.title || "Task", date: t.due_date!, days: daysUntil(t.due_date!), project: t.project_name, status: t.status,
    })),
    ...projects.filter(p => p.deadline && daysUntil(p.deadline) >= 0 && daysUntil(p.deadline) <= 14).map(p => ({
      type: "project" as const, name: p.name, date: p.deadline!, days: daysUntil(p.deadline!), project: undefined, status: p.status,
    })),
  ].sort((a, b) => a.days - b.days);

  if (loading) return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Timeline</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Schedule</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Deadlines and milestones across your projects.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">{MONTHS[month]} {year}</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const dayTasks = tasksOnDay(day);
                const dayProjects = projectsOnDay(day);
                const hasItems = dayTasks.length > 0 || dayProjects.length > 0;
                const todayCell = isToday(day);
                return (
                  <div
                    key={day}
                    className={`min-h-[60px] p-1.5 rounded-xl transition-colors ${
                      todayCell ? "bg-indigo-600 text-white" : hasItems ? "bg-indigo-50 hover:bg-indigo-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`text-[11px] font-bold block mb-1 ${todayCell ? "text-white" : "text-gray-700"}`}>
                      {day}
                    </span>
                    {dayTasks.slice(0, 2).map(t => (
                      <div key={t.id} className={`text-[9px] font-medium truncate px-1 py-0.5 rounded mb-0.5 ${todayCell ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                        {t.name || t.title}
                      </div>
                    ))}
                    {dayProjects.slice(0, 1).map(p => (
                      <div key={p.id} className={`text-[9px] font-medium truncate px-1 py-0.5 rounded ${todayCell ? "bg-white/20 text-white" : "bg-violet-100 text-violet-700"}`}>
                        📁 {p.name}
                      </div>
                    ))}
                    {(dayTasks.length + dayProjects.length) > 3 && (
                      <div className={`text-[9px] font-medium ${todayCell ? "text-white/70" : "text-gray-400"}`}>
                        +{dayTasks.length + dayProjects.length - 3} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50 flex-shrink-0">
            <Clock size={15} className="text-indigo-500" />
            <h2 className="text-sm font-bold text-gray-900">Next 14 Days</h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-auto">{upcoming.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {upcoming.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">
                <CalendarDays size={32} className="mx-auto mb-2 text-gray-200" />
                No upcoming deadlines
              </div>
            )}
            {upcoming.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.type === "project" ? "bg-violet-100 text-violet-600" : "bg-blue-100 text-blue-600"
                }`}>
                  {item.type === "project" ? <CalendarDays size={13} /> : <CheckCircle2 size={13} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800 truncate">{item.name}</p>
                  {item.project && <p className="text-[11px] text-gray-400">{item.project}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[11px] font-bold ${
                    item.days === 0 ? "text-rose-600" :
                    item.days <= 3 ? "text-amber-600" :
                    "text-gray-400"
                  }`}>
                    {item.days === 0 ? "Today" : `${item.days}d`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
