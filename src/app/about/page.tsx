import { createClient } from "@/lib/supabase/server";
import type { Profile, Experience, Education } from "@/types";

export default async function AboutPage() {
  const supabase = await createClient();

  const [{ data: profile }, { data: experience }, { data: education }] =
    await Promise.all([
      supabase.from("profile").select("*").single<Profile>(),
      supabase
        .from("experience")
        .select("*")
        .order("sort_order")
        .returns<Experience[]>(),
      supabase
        .from("education")
        .select("*")
        .order("sort_order")
        .returns<Education[]>(),
    ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-[220px_1fr] gap-8 mb-12">
        <div className="aspect-square bg-gray-100 rounded-lg" />
        <div>
          <h1 className="text-2xl font-bold mb-3">Who am I</h1>
          <p className="text-gray-700 mb-4">{profile?.bio}</p>
          {profile?.cv_url && (
            <a
              href={profile.cv_url}
              className="inline-block border rounded px-5 py-2.5 text-sm font-medium"
            >
              Download CV
            </a>
          )}
        </div>
      </div>

      {profile?.skills && profile.skills.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span key={s} className="border rounded-full px-3 py-1 text-sm">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-6">
          Experience
        </h2>
        <div className="space-y-6">
          {(experience ?? []).map((e) => (
            <div key={e.id} className="flex gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-800 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium">
                  {e.title} · {e.company}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  {e.start_date} — {e.end_date ?? "Present"}
                </p>
                <p className="text-gray-700 text-sm">{e.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-10">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
            Education
          </h2>
          <div className="space-y-4">
            {(education ?? []).map((ed) => (
              <div key={ed.id}>
                <p className="font-medium">{ed.institute}</p>
                <p className="text-sm text-gray-500">
                  {ed.qualification} · {ed.start_date} —{" "}
                  {ed.end_date ?? "Ongoing"}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
            Contact details
          </h2>
          <p className="text-sm text-gray-700">{profile?.contact_email}</p>
          <p className="text-sm text-gray-700">{profile?.contact_phone}</p>
        </section>
      </div>
    </div>
  );
}
