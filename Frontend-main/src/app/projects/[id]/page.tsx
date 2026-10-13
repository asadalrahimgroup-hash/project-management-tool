import ProjectDetail from "../../Pages/ProjectDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProjectDetail initialProjectId={resolvedParams.id} />;
}
