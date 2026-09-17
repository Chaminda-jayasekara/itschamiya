import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SmartImg } from "@/components/SmartImg";
import type { Project, Client } from "@/types";
import { saveProject, deleteProject } from "./actions";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const supabase = await createClient();

  const [{ data: projects }, { data: clients }] = await Promise.all([
    supabase
      .from("projects")
      .select("*, client:clients(*), images:project_images(*)")
      .order("sort_order")
      .returns<Project[]>(),
    supabase.from("clients").select("*").returns<Client[]>(),
  ]);

  const editing = edit ? projects?.find((p) => p.id === edit) : undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Projects</h1>
      </div>

      <table className="w-full text-sm mb-12">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-400 border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Client</th>
            <th className="py-2">Completed</th>
            <th className="py-2">Status</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {(projects ?? []).map((p) => (
            <tr key={p.id} className={`border-b ${p.id === edit ? "bg-yellow-50" : ""}`}>
              <td className="py-3">{p.name}</td>
              <td className="py-3">{p.client?.name ?? "—"}</td>
              <td className="py-3">{p.completed_date ?? "—"}</td>
              <td className="py-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    p.is_live ? "text-green-700 border-green-300" : "text-gray-500"
                  }`}
                >
                  {p.is_live ? "Live" : "Draft"}
                </span>
              </td>
              <td className="py-3 text-right space-x-3">
                <Link href={`/admin/projects?edit=${p.id}`} className="text-xs font-medium">
                  Edit
                </Link>
                <form action={deleteProject} className="inline">
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-xs text-red-600">Delete</button>
                </form>
              </td>
            </tr>
          ))}
          {(!projects || projects.length === 0) && (
            <tr>
              <td colSpan={5} className="py-6 text-gray-500">
                No projects yet — add your first one below.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {editing ? `Edit “${editing.name}”` : "Add project"}
        </h2>
        {editing && (
          <Link href="/admin/projects" className="text-xs text-gray-500">
            Cancel edit
          </Link>
        )}
      </div>
      <form action={saveProject} className="space-y-4 max-w-xl" key={editing?.id ?? "new"}>
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Project name</label>
            <input
              name="name"
              required
              defaultValue={editing?.name ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <input
              name="category"
              defaultValue={editing?.category ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={editing?.description ?? ""}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Client</label>
            <select
              name="client_id"
              defaultValue={editing?.client_id ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">— select existing —</option>
              {(clients ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              No client yet? Add one from /admin/clients first.
            </p>
          </div>
          <div>
            <label className="block text-sm mb-1">Completed date</label>
            <input
              type="date"
              name="completed_date"
              defaultValue={editing?.completed_date ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Duration</label>
            <input
              name="duration"
              placeholder="e.g. 3 weeks"
              defaultValue={editing?.duration ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Live link</label>
            <input
              name="live_link"
              placeholder="https://"
              defaultValue={editing?.live_link ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Image URLs (one per line — first = cover image)</label>
          <textarea
            name="image_urls"
            rows={3}
            defaultValue={editing?.images?.map((i) => i.url).join("\n") ?? ""}
            placeholder="https://drive.google.com/uc?export=view&id=..."
            className="w-full border rounded px-3 py-2 text-sm font-mono"
          />
          {editing?.images && editing.images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {editing.images.map((img) => (
                <div key={img.id} className="w-16 h-12 rounded overflow-hidden bg-gray-100">
                  <SmartImg src={img.url} alt="" className="w-full h-full" />
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Pasting a Google Drive link? See the README for the exact format
            it needs to be in to actually render.
          </p>
        </div>

        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_live" defaultChecked={editing?.is_live ?? false} /> Live
            (published)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={editing?.featured ?? false} />{" "}
            Featured on homepage
          </label>
        </div>

        <button type="submit" className="border rounded px-5 py-2.5 text-sm font-medium">
          {editing ? "Update project" : "Save project"}
        </button>
      </form>
    </div>
  );
}
