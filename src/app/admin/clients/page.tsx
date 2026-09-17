import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Client } from "@/types";
import { saveClient, deleteClient } from "./actions";

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("name")
    .returns<Client[]>();

  const editing = edit ? clients?.find((c) => c.id === edit) : undefined;

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
            <tr key={c.id} className={`border-b ${c.id === edit ? "bg-yellow-50" : ""}`}>
              <td className="py-3">{c.name}</td>
              <td className="py-3 text-gray-500">{c.logo_url ?? "—"}</td>
              <td className="py-3 text-right space-x-3">
                <Link href={`/admin/clients?edit=${c.id}`} className="text-xs font-medium">
                  Edit
                </Link>
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

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {editing ? `Edit “${editing.name}”` : "Add client"}
        </h2>
        {editing && (
          <Link href="/admin/clients" className="text-xs text-gray-500">
            Cancel edit
          </Link>
        )}
      </div>
      <form action={saveClient} className="space-y-4 max-w-xl" key={editing?.id ?? "new"}>
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <div>
          <label className="block text-sm mb-1">Client / company name</label>
          <input
            name="name"
            required
            defaultValue={editing?.name ?? ""}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Logo URL</label>
          <input
            name="logo_url"
            placeholder="https://... (upload to Supabase Storage, paste URL here)"
            defaultValue={editing?.logo_url ?? ""}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="border rounded px-5 py-2.5 text-sm font-medium">
          {editing ? "Update client" : "Save client"}
        </button>
      </form>
    </div>
  );
}
