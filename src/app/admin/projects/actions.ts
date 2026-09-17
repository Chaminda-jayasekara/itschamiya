"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  let projectId = id;

  if (id) {
    await supabase.from("projects").update(payload).eq("id", id);
  } else {
    const { data } = await supabase.from("projects").insert(payload).select("id").single();
    projectId = data?.id ?? null;
  }

  // Image URLs — one per line, first line becomes the cover image.
  const imageUrlsRaw = (formData.get("image_urls") as string) ?? "";
  const urls = imageUrlsRaw
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  if (projectId) {
    // Replace the full set each save — simplest way to keep this in sync
    // with whatever's currently in the textarea.
    await supabase.from("project_images").delete().eq("project_id", projectId);
    if (urls.length > 0) {
      await supabase.from("project_images").insert(
        urls.map((url, i) => ({
          project_id: projectId,
          url,
          is_cover: i === 0,
          sort_order: i,
        }))
      );
    }
  }

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("projects").delete().eq("id", id);

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}
