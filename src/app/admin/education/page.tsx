import { createClient } from "@/lib/supabase/server";
import type { Education } from "@/types";
import { saveEducation, deleteEducation } from "./actions";

export default async function AdminEducationPage() {
  const supabase = await createClient();
  const { data: education } = await supabase
    .from("education")
    .select("*")
    .order("sort_order")
    .returns<Education[]>();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Education</h1>

      <table className="w-full text-sm mb-12">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-400 border-b">
            <th className="py-2">Institute</th>
            <th className="py-2">Qualification</th>
            <th className="py-2">Dates</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {(education ?? []).map((ed) => (
            <tr key={ed.id} className="border-b">
              <td className="py-3">{ed.institute}</td>
              <td className="py-3">{ed.qualification}</td>
              <td className="py-3">
                {ed.start_date} — {ed.end_date ?? "Ongoing"}
              </td>
              <td className="py-3 text-right">
                <form action={deleteEducation} className="inline">
                  <input type="hidden" name="id" value={ed.id} />
                  <button className="text-xs text-red-600">Delete</button>
                </form>
              </td>
            </tr>
          ))}
          {(!education || education.length === 0) && (
            <tr>
              <td colSpan={4} className="py-6 text-gray-500">
                No education entries yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
        Add education
      </h2>
      <form action={saveEducation} className="space-y-4 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Institute</label>
            <input name="institute" required className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Qualification</label>
            <input name="qualification" className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Start date</label>
            <input type="date" name="start_date" required className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">End date (blank = Ongoing)</label>
            <input type="date" name="end_date" className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Details</label>
          <textarea name="details" rows={3} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="border rounded px-5 py-2.5 text-sm font-medium">
          Save education
        </button>
      </form>
    </div>
  );
}
