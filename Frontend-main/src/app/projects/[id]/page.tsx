"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProjectDetail from "../../Pages/ProjectDetail";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  return <ProjectDetail initialProjectId={id} />;
}

