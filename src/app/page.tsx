import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project, Client, Profile } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: profile }, { data: featuredProjects }, { data: clients }] =
    await Promise.all([
      supabase.from("profile").select("*").single<Profile>(),
      supabase
        .from("projects")
        .select("*, client:clients(*)")
        .eq("is_live", true)
        .eq("featured", true)
        .order("sort_order")
        .limit(3)
        .returns<Project[]>(),
      supabase.from("clients").select("*").returns<Client[]>(),
    ]);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Hi, I&apos;m Chaminda — I design and build for the web.
          </h1>
          <p className="text-gray-600 mb-6">
            {profile?.bio ?? "Freelance web designer & developer."}
          </p>
          <Link
            href="/contact"
            className="inline-block border rounded px-5 py-2.5 text-sm font-medium"
          >
            Get in touch
          </Link>
        </div>
        <div className="aspect-square bg-gray-100 rounded-lg" />
      </section>

      {/* Who am I */}
      <section className="max-w-5xl mx-auto px-6 py-10 border-t">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
          Who am I
        </h2>
        <p className="text-gray-700 max-w-2xl mb-3">{profile?.bio}</p>
        <Link href="/about" className="text-sm font-medium underline">
          More about me →
        </Link>
      </section>

      {/* Companies */}
      {clients && clients.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-10 border-t">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-5">
            Companies I&apos;ve worked with
          </h2>
          <div className="flex flex-wrap gap-6 items-center">
            {clients.map((c) => (
              <span key={c.id} className="text-gray-400 text-sm">
                {c.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Featured projects */}
      <section className="max-w-5xl mx-auto px-6 py-10 border-t">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-5">
          Projects I&apos;ve done
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(featuredProjects ?? []).map((p) => (
            <Link
              key={p.id}
              href={`/portfolio/${p.slug}`}
              className="border rounded-lg overflow-hidden hover:shadow-sm transition"
            >
              <div className="aspect-video bg-gray-100" />
              <div className="p-4">
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {p.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/portfolio"
          className="inline-block mt-6 border rounded px-5 py-2.5 text-sm font-medium"
        >
          View all projects
        </Link>
      </section>
    </div>
  );
}
