import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; company?: string }>;
}) {
  const { category, company } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*, client:clients(*)")
    .eq("is_live", true)
    .order("completed_date", { ascending: false });

  if (category) query = query.eq("category", category);
  if (company) query = query.eq("client_id", company);

  const { data: projects } = await query.returns<Project[]>();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>

      {/* Filters — wire these up to real dropdowns once categories/clients are seeded */}
      <div className="flex flex-wrap gap-3 mb-8 text-sm text-gray-500">
        <span className="border rounded px-3 py-1.5">Date ▾</span>
        <span className="border rounded px-3 py-1.5">Category ▾</span>
        <span className="border rounded px-3 py-1.5">Company ▾</span>
        <span className="border rounded px-3 py-1.5">Live / Not live ▾</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {(projects ?? []).map((p) => (
          <Link
            key={p.id}
            href={`/portfolio/${p.slug}`}
            className="border rounded-lg overflow-hidden hover:shadow-sm transition"
          >
            <div className="aspect-video bg-gray-100" />
            <div className="p-4">
              <h3 className="font-medium">{p.name}</h3>
              {p.category && (
                <span className="inline-block mt-1 text-xs text-gray-500 border rounded-full px-2 py-0.5">
                  {p.category}
                </span>
              )}
            </div>
          </Link>
        ))}
        {(!projects || projects.length === 0) && (
          <p className="text-gray-500 col-span-3">
            No published projects yet — add some from /admin.
          </p>
        )}
      </div>
    </div>
  );
}
