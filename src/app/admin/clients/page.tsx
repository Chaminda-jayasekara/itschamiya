import { createClient } from "@/lib/supabase/server";
import type { Client } from "@/types";
import { saveClient, deleteClient } from "./actions";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("name")
    .returns<Client[]>();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Clients</h1>

      <table className="w-full text-sm mb-12">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-400 border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Logo URL</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {(clients ?? []).map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-3">{c.name}</td>
              <td className="py-3 text-gray-500">{c.logo_url ?? "—"}</td>
              <td className="py-3 text-right">
                <form action={deleteClient} className="inline">
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-xs text-red-600">Delete</button>
                </form>
              </td>
            </tr>
          ))}
          {(!clients || clients.length === 0) && (
            <tr>
              <td colSpan={3} className="py-6 text-gray-500">
                No clients yet — add one below, then select it when creating a project.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
        Add client
      </h2>
      <form action={saveClient} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Client / company name</label>
          <input name="name" required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Logo URL</label>
          <input name="logo_url" placeholder="https://... (upload to Supabase Storage, paste URL here)" className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="border rounded px-5 py-2.5 text-sm font-medium">
          Save client
        </button>
      </form>
    </div>
  );
}
