import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <h1 className="text-xl font-bold mb-6">Admin login</h1>
      <form action={login} className="space-y-4">
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
          <label className="block text-sm mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">
            Invalid email or password.
          </p>
        )}
        <button
          type="submit"
          className="w-full border rounded px-5 py-2.5 text-sm font-medium"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
