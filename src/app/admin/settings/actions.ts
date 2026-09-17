"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();

  const skillsRaw = formData.get("skills") as string;
  const skills = skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const social_links = {
    github: (formData.get("github") as string) || "",
    linkedin: (formData.get("linkedin") as string) || "",
  };

  const payload = {
    bio: formData.get("bio") as string,
    photo_url: formData.get("photo_url") as string,
    skills,
    cv_url: formData.get("cv_url") as string,
    contact_email: formData.get("contact_email") as string,
    contact_phone: formData.get("contact_phone") as string,
    social_links,
  };

  await supabase.from("profile").update(payload).eq("id", 1);

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
}
