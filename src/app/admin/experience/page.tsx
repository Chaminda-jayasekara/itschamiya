import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/types";
import { saveExperience, deleteExperience } from "./actions";

export default async function AdminExperiencePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const supabase = await createClient();
  const { data: experience } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order")
    .returns<Experience[]>();

  const editing = edit ? experience?.find((e) => e.id === edit) : undefined;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Experience</h1>

      <table className="w-full text-sm mb-12">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-400 border-b">
            <th className="py-2">Title</th>
            <th className="py-2">Company</th>
            <th className="py-2">Dates</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {(experience ?? []).map((e) => (
            <tr key={e.id} className={`border-b ${e.id === edit ? "bg-yellow-50" : ""}`}>
              <td className="py-3">{e.title}</td>
              <td className="py-3">{e.company}</td>
              <td className="py-3">
                {e.start_date} — {e.end_date ?? "Present"}
              </td>
              <td className="py-3 text-right space-x-3">
                <Link href={`/admin/experience?edit=${e.id}`} className="text-xs font-medium">
                  Edit
                </Link>
                <form action={deleteExperience} className="inline">
                  <input type="hidden" name="id" value={e.id} />
                  <button className="text-xs text-red-600">Delete</button>
                </form>
              </td>
            </tr>
          ))}
          {(!experience || experience.length === 0) && (
            <tr>
              <td colSpan={4} className="py-6 text-gray-500">
                No experience entries yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {editing ? `Edit “${editing.title}”` : "Add experience"}
        </h2>
        {editing && (
          <Link href="/admin/experience" className="text-xs text-gray-500">
            Cancel edit
          </Link>
        )}
      </div>
      <form action={saveExperience} className="space-y-4 max-w-xl" key={editing?.id ?? "new"}>
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Job title</label>
            <input
              name="title"
              required
              defaultValue={editing?.title ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Company</label>
            <input
              name="company"
              required
              defaultValue={editing?.company ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Start date</label>
            <input
              type="date"
              name="start_date"
              required
              defaultValue={editing?.start_date ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">End date (blank = Present)</label>
            <input
              type="date"
              name="end_date"
              defaultValue={editing?.end_date ?? ""}
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
        <button type="submit" className="border rounded px-5 py-2.5 text-sm font-medium">
          {editing ? "Update experience" : "Save experience"}
        </button>
      </form>
    </div>
  );
}
