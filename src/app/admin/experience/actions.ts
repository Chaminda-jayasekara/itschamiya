"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveExperience(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;

  const payload = {
    title: formData.get("title") as string,
    company: formData.get("company") as string,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    description: formData.get("description") as string,
  };

  if (id) {
    await supabase.from("experience").update(payload).eq("id", id);
  } else {
    await supabase.from("experience").insert(payload);
  }

  revalidatePath("/admin/experience");
  revalidatePath("/about");
  redirect("/admin/experience");
}

export async function deleteExperience(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("experience").delete().eq("id", id);
  revalidatePath("/admin/experience");
  revalidatePath("/about");
}
