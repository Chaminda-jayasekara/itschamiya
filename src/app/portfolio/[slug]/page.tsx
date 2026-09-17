import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SmartImg } from "@/components/SmartImg";
import type { Project } from "@/types";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, client:clients(*), images:project_images(*), reviews(*)")
    .eq("slug", slug)
    .eq("is_live", true)
    .single<Project>();

  if (!project) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <p className="text-sm text-gray-500 mb-2">
        {project.client?.name} · {project.completed_date} · {project.duration}
      </p>
      <h1 className="text-3xl font-bold mb-6">{project.name}</h1>

      <div className="aspect-video bg-gray-100 rounded-lg mb-4">
        <SmartImg
          src={(project.images?.find((i) => i.is_cover) ?? project.images?.[0])?.url}
          alt={project.name}
          className="w-full h-full rounded-lg"
        />
      </div>
      {project.images && project.images.length > 1 && (
        <div className="flex gap-3 mb-10">
          {project.images.map((img) => (
            <div key={img.id} className="w-20 h-14 bg-gray-100 rounded overflow-hidden">
              <SmartImg src={img.url} alt={project.name} className="w-full h-full" />
            </div>
          ))}
        </div>
      )}

      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Description
      </h2>
      <p className="text-gray-700 mb-10 max-w-2xl">{project.description}</p>

      {project.live_link && (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Live preview
          </h2>
          <div className="aspect-video bg-gray-100 rounded-lg mb-4" />
          <a
            href={project.live_link}
            target="_blank"
            rel="noreferrer"
            className="inline-block border rounded px-5 py-2.5 text-sm font-medium mb-10"
          >
            Visit live site ↗
          </a>
        </>
      )}

      {project.reviews && project.reviews.length > 0 && (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Client reviews
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {project.reviews.map((r) => (
              <div key={r.id} className="border rounded-lg p-4">
                <p className="text-gray-700 mb-2">&ldquo;{r.quote}&rdquo;</p>
                <p className="text-sm text-gray-500">— {r.client_name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
