import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/types";
import { saveExperience, deleteExperience } from "./actions";

export default async function AdminExperiencePage() {
  const supabase = await createClient();
  const { data: experience } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order")
    .returns<Experience[]>();

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
            <tr key={e.id} className="border-b">
              <td className="py-3">{e.title}</td>
              <td className="py-3">{e.company}</td>
              <td className="py-3">
                {e.start_date} — {e.end_date ?? "Present"}
              </td>
              <td className="py-3 text-right">
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

      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
        Add experience
      </h2>
      <form action={saveExperience} className="space-y-4 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Job title</label>
            <input name="title" required className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Company</label>
            <input name="company" required className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Start date</label>
            <input type="date" name="start_date" required className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">End date (blank = Present)</label>
            <input type="date" name="end_date" className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea name="description" rows={3} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="border rounded px-5 py-2.5 text-sm font-medium">
          Save experience
        </button>
      </form>
    </div>
  );
}
