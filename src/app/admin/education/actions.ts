"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveEducation(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;

  const payload = {
    institute: formData.get("institute") as string,
    qualification: formData.get("qualification") as string,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    details: formData.get("details") as string,
  };

  if (id) {
    await supabase.from("education").update(payload).eq("id", id);
  } else {
    await supabase.from("education").insert(payload);
  }

  revalidatePath("/admin/education");
  revalidatePath("/about");
  redirect("/admin/education");
}

export async function deleteEducation(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("education").delete().eq("id", id);
  revalidatePath("/admin/education");
  revalidatePath("/about");
}
