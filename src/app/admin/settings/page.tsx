import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import { saveProfile } from "./actions";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .single<Profile>();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Settings</h1>
      <p className="text-sm text-gray-500 mb-8">
        This is the single profile record used across the Home, About, and
        Contact pages.
      </p>

      <form action={saveProfile} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Profile photo URL</label>
          <input
            name="photo_url"
            defaultValue={profile?.photo_url ?? ""}
            placeholder="https://... (see README for Google Drive link format)"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Used on the Home hero and the About page. See the README for how to
            format a Google Drive link so it actually renders.
          </p>
        </div>

        <div>
          <label className="block text-sm mb-1">Bio</label>
          <textarea
            name="bio"
            rows={4}
            defaultValue={profile?.bio ?? ""}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Skills (comma separated)</label>
          <input
            name="skills"
            defaultValue={profile?.skills?.join(", ") ?? ""}
            placeholder="React, Next.js, Node.js, Figma"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">CV URL</label>
          <input
            name="cv_url"
            defaultValue={profile?.cv_url ?? ""}
            placeholder="https://... (upload to Supabase Storage, paste URL here)"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Contact email</label>
            <input
              name="contact_email"
              type="email"
              defaultValue={profile?.contact_email ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Contact phone</label>
            <input
              name="contact_phone"
              defaultValue={profile?.contact_phone ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">GitHub URL</label>
            <input
              name="github"
              defaultValue={profile?.social_links?.github ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">LinkedIn URL</label>
            <input
              name="linkedin"
              defaultValue={profile?.social_links?.linkedin ?? ""}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button type="submit" className="border rounded px-5 py-2.5 text-sm font-medium">
          Save settings
        </button>
      </form>
    </div>
  );
}
