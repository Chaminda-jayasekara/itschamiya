"use server";

// Wire this up to Resend, a Supabase Edge Function, or a "messages" table —
// whichever you prefer for handling inbound contact form submissions.
export async function sendContactMessage(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // TODO: send email / insert into a `messages` table in Supabase
  console.log({ name, email, message });
}
