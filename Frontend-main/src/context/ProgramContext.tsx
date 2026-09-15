"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE } from "@/lib/api";

export type Program = {
  id: string;
  name: string;
  code?: string;
  description: string;
  domain: string;
  status: "Active" | "Paused" | "Completed";
  projectIds?: string[];
};

export const DEFAULT_PROGRAMS: Program[] = [
  {
    id: "prog-qarc",
    name: "QUANTUM AGENTIC RESEARCH CENTER",
    code: "QARC",
    description: "Advanced AI agent research, multimodal pipelines, edge intelligence, and autonomous enterprise systems.",
    domain: "Agentic AI & Edge Intelligence",
    status: "Active",
  },
  {
    id: "prog-core-fintech",
    name: "Fintech & Banking Ecosystem",
    code: "FIN",
    description: "Core banking platform, payment gateways, and regulatory ledger services.",
    domain: "Financial Services",
    status: "Active",
  },
  {
    id: "prog-ai-intelligence",
    name: "AI & Platform Intelligence",
    code: "AI",
    description: "Enterprise machine learning models, analytics copilot, and data pipelines.",
    domain: "Artificial Intelligence",
    status: "Active",
  },
  {
    id: "prog-customer-cx",
    name: "Customer Experience & Mobile",
    code: "CX",
    description: "Next-generation iOS & Android apps, onboarding flows, and customer journey.",
    domain: "Mobile & Product",
    status: "Active",
  },
  {
    id: "prog-cloud-infra",
    name: "Cloud & DevSecOps Infrastructure",
    code: "OPS",
    description: "Zero-trust network, high-throughput microservices, and multi-region failover.",
    domain: "Infrastructure",
    status: "Active",
  }
];

type ProgramContextType = {
  programs: Program[];
  selectedProgram: Program | null; // null = "All Programs / Global View" (manager only)
  selectProgram: (programId: string | "all") => void;
  addProgram: (program: Omit<Program, "id">) => void;
  getProjectProgram: (project: { id?: string; name?: string; domain?: string; program_id?: string; programId?: string }) => Program;
  isManager: boolean;
};

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export function ProgramProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [programs, setPrograms] = useState<Program[]>([DEFAULT_PROGRAMS[0]]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("prog-qarc");

  const checkIsManager = (userObj: any) => {
    const role = (userObj?.role || "").toLowerCase();
    return (
      role.includes("manager") ||
      role.includes("administrator") ||
      role.includes("admin") ||
      role.includes("lead")
    );
  };

  const isManager = checkIsManager(currentUser);

  // Sync user and fetch programs
  const syncUserAndPrograms = useCallback(async () => {
    let userObj: any = null;
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined") {
        userObj = JSON.parse(stored);
        setCurrentUser(userObj);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error(e);
    }

    const userIsMgr = checkIsManager(userObj);
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    if (!token) {
      setPrograms(userIsMgr ? DEFAULT_PROGRAMS : [DEFAULT_PROGRAMS[0]]);
      setSelectedProgramId(userIsMgr ? "all" : "prog-qarc");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/programs`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.programs) && data.programs.length > 0) {
          const apiPrograms: Program[] = data.programs.map((p: any) => ({
            id: p.id,
            name: p.name,
            code: p.code || p.name.substring(0, 4).toUpperCase(),
            description: p.description || "",
            domain: p.domain || "",
            status: (p.status === "Active" || p.status === "Paused" || p.status === "Completed") ? p.status : "Active",
          }));

          setPrograms(apiPrograms);

          if (!userIsMgr) {
            // Member: strictly select their assigned program
            setSelectedProgramId(apiPrograms[0].id);
            localStorage.setItem("arg_selected_program", apiPrograms[0].id);
          } else {
            // Manager: restore selection or keep "all"
            const storedSelected = localStorage.getItem("arg_selected_program");
            if (storedSelected && (storedSelected === "all" || apiPrograms.some(p => p.id === storedSelected))) {
              setSelectedProgramId(storedSelected);
            } else {
              setSelectedProgramId("all");
            }
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch programs from API, using fallback:", err);
    }

    // Fallback logic
    if (!userIsMgr) {
      setPrograms([DEFAULT_PROGRAMS[0]]);
      setSelectedProgramId("prog-qarc");
      localStorage.setItem("arg_selected_program", "prog-qarc");
    } else {
      setPrograms(DEFAULT_PROGRAMS);
      const storedSelected = localStorage.getItem("arg_selected_program") || "all";
      setSelectedProgramId(storedSelected);
    }
  }, []);

  useEffect(() => {
    syncUserAndPrograms();
    window.addEventListener("storage", syncUserAndPrograms);
    return () => window.removeEventListener("storage", syncUserAndPrograms);
  }, [syncUserAndPrograms]);

  const selectProgram = (programId: string | "all") => {
    // Member cannot select "all" or other programs
    if (!isManager) {
      const memberProg = programs[0]?.id || "prog-qarc";
      setSelectedProgramId(memberProg);
      localStorage.setItem("arg_selected_program", memberProg);
      return;
    }

    setSelectedProgramId(programId);
    try {
      localStorage.setItem("arg_selected_program", programId);
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error(e);
    }
  };

  const addProgram = (newP: Omit<Program, "id">) => {
    const created: Program = {
      ...newP,
      id: `prog-${Date.now()}`,
      code: (newP.code || newP.name.substring(0, 3)).toUpperCase(),
    };
    const updated = [...programs, created];
    setPrograms(updated);
    try {
      localStorage.setItem("arg_programs", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to map a project to its program
  const getProjectProgram = (project: { id?: string; name?: string; domain?: string; program_id?: string; programId?: string }): Program => {
    const qarcProg = programs.find(p => p.id === "prog-qarc") || programs[0] || DEFAULT_PROGRAMS[0];

    // Priority 1: Direct database program association
    const directProgramId = project.program_id || project.programId;
    if (directProgramId) {
      if (directProgramId === "prog-qarc") return qarcProg;
      const matched = programs.find(p => p.id === directProgramId);
      if (matched) return matched;
    }

    const pid = (project.id || "").toLowerCase();
    const nameLower = (project.name || "").toLowerCase();

    // Priority 2: QARC Projects matching (all 12 QARC initiatives)
    if (
      pid.includes("voicescribe") || nameLower.includes("voicescribe") ||
      pid.includes("fishery") || nameLower.includes("fishery") ||
      pid.includes("hr-agent") || nameLower.includes("hr agent") ||
      pid.includes("freight") || nameLower.includes("freight") ||
      pid.includes("ai-tutor") || nameLower.includes("ai tutor") || nameLower.includes("tutor") ||
      pid.includes("uae-voice") || nameLower.includes("uae voice") ||
      pid.includes("axiom") || nameLower.includes("axiom") ||
      pid.includes("ecommerce") || nameLower.includes("ecommerce") ||
      pid.includes("embassy") || nameLower.includes("embassy") ||
      pid.includes("retina") || nameLower.includes("retina") ||
      pid.includes("fmd") || nameLower.includes("fmd") || nameLower.includes("foot mouth") ||
      pid.includes("marketing") || nameLower.includes("marketing agent")
    ) {
      return qarcProg;
    }

    const domainLower = (project.domain || "").toLowerCase();

    if (domainLower.includes("fin") || domainLower.includes("bank") || nameLower.includes("pay") || nameLower.includes("finance")) {
      return programs.find(p => p.id === "prog-core-fintech") || qarcProg;
    }
    if (domainLower.includes("intel") || (domainLower.includes("ai") && !domainLower.includes("speech") && !domainLower.includes("medical")) || nameLower.includes("data pipeline")) {
      return programs.find(p => p.id === "prog-ai-intelligence") || qarcProg;
    }
    if (domainLower.includes("mobile") || domainLower.includes("app") || nameLower.includes("redesign") || nameLower.includes("ui") || domainLower.includes("design")) {
      return programs.find(p => p.id === "prog-customer-cx") || qarcProg;
    }
    if (domainLower.includes("infra") || domainLower.includes("devops") || domainLower.includes("cloud") || domainLower.includes("security")) {
      return programs.find(p => p.id === "prog-cloud-infra") || qarcProg;
    }

    return qarcProg;
  };

  // Active program: for a member, if selectedProgramId isn't found, default to their only program
  const activeProgram =
    selectedProgramId === "all"
      ? null
      : programs.find(p => p.id === selectedProgramId) || (!isManager ? programs[0] : null);

  return (
    <ProgramContext.Provider
      value={{
        programs,
        selectedProgram: activeProgram,
        selectProgram,
        addProgram,
        getProjectProgram,
        isManager,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
}

export function useProgram() {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
}
