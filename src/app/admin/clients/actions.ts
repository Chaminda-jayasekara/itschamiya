"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveClient(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;

  const payload = {
    name: formData.get("name") as string,
    logo_url: formData.get("logo_url") as string,
  };

  if (id) {
    await supabase.from("clients").update(payload).eq("id", id);
  } else {
    await supabase.from("clients").insert(payload);
  }

  revalidatePath("/admin/clients");
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function deleteClient(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("clients").delete().eq("id", id);
  revalidatePath("/admin/clients");
  revalidatePath("/admin/projects");
  revalidatePath("/");
}
