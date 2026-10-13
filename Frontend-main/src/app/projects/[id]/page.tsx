"use client";

import React, { use } from "react";
import { useParams } from "next/navigation";
import ProjectDetail from "../../Pages/ProjectDetail";

interface PageProps {
  params?: Promise<{ id: string }> | { id: string };
}

export default function ProjectDetailPage({ params }: PageProps) {
  const navParams = useParams<{ id: string }>();
  let paramId: string | undefined = navParams?.id;

  if (!paramId && params) {
    if (typeof (params as any).then === "function") {
      try {
        const unwrapped = use(params as Promise<{ id: string }>);
        paramId = unwrapped?.id;
      } catch (e) {
        console.warn("Could not unwrap params promise in client:", e);
      }
    } else {
      paramId = (params as { id: string }).id;
    }
  }

  return <ProjectDetail initialProjectId={paramId} />;
}
