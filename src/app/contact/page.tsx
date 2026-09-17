import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import { sendContactMessage } from "./actions";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .single<Profile>();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-center mb-2">Get in touch</h1>
      <p className="text-gray-600 text-center mb-10">
        Have a project in mind? Send a message.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <form action={sendContactMessage} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="border rounded px-5 py-2.5 text-sm font-medium"
          >
            Send message
          </button>
        </form>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Contact details
          </h2>
          <p className="text-sm text-gray-700 mb-1">
            {profile?.contact_email}
          </p>
          <p className="text-sm text-gray-700 mb-6">
            {profile?.contact_phone}
          </p>

          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Socials
          </h2>
          <div className="flex gap-3 text-sm text-gray-500">
            {Object.entries(profile?.social_links ?? {}).map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noreferrer">
                {k}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
