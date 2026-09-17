import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Education } from "@/types";
import { saveEducation, deleteEducation } from "./actions";

export default async function AdminEducationPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const supabase = await createClient();
  const { data: education } = await supabase
    .from("education")
    .select("*")
    .order("sort_order")
    .returns<Education[]>();

  const editing = edit ? education?.find((e) => e.id === edit) : undefined;

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
            <tr key={ed.id} className={`border-b ${ed.id === edit ? "bg-yellow-50" : ""}`}>
              <td className="py-3">{ed.institute}</td>
              <td className="py-3">{ed.qualification}</td>
              <td className="py-3">
                {ed.start_date} — {ed.end_date ?? "Ongoing"}
              </td>
              <td className="py-3 text-right space-x-3">
                <Link href={`/admin/education?edit=${ed.id}`} className="text-xs font-medium">
                  Edit
                </Link>
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

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {editing ? `Edit “${editing.institute}”` : "Add education"}
        </h2>
        {editing && (
          <Link href="/admin/education" className="text-xs text-gray-500">
            Cancel edit
          </Link>
        )}
      </div>
      <form action={saveEducation} className="space-y-4 max-w-xl" key={editing?.id ?? "new"}>
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Institute</label>
            <input
              name="institute"
              required
              defaultValue={editing?.institute ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Qualification</label>
            <input
              name="qualification"
              defaultValue={editing?.qualification ?? ""}
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
            <label className="block text-sm mb-1">End date (blank = Ongoing)</label>
            <input
              type="date"
              name="end_date"
              defaultValue={editing?.end_date ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Details</label>
          <textarea
            name="details"
            rows={3}
            defaultValue={editing?.details ?? ""}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="border rounded px-5 py-2.5 text-sm font-medium">
          {editing ? "Update education" : "Save education"}
        </button>
      </form>
    </div>
  );
}
