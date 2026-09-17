"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveProject(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const payload = {
    name,
    slug,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    client_id: (formData.get("client_id") as string) || null,
    completed_date: (formData.get("completed_date") as string) || null,
    duration: formData.get("duration") as string,
    live_link: formData.get("live_link") as string,
    is_live: formData.get("is_live") === "on",
    featured: formData.get("featured") === "on",
  };

  if (id) {
    await supabase.from("projects").update(payload).eq("id", id);
  } else {
    await supabase.from("projects").insert(payload);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("projects").delete().eq("id", id);

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}
