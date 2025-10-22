import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "./actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.email ?? (user.user_metadata as { full_name?: string })?.full_name ?? "Admin";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/groups" className="text-lg font-semibold text-white">
              NAEI Admin
            </Link>
            <nav className="flex items-center gap-3 text-sm text-slate-300">
              <Link href="/groups" className="transition hover:text-white">
                Groups
              </Link>
              <Link href="/groups#audit-log" className="transition hover:text-white">
                Audit Log
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">{displayName}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded border border-slate-700 px-3 py-1 font-medium text-slate-200 transition hover:bg-slate-800"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-6 py-8">{children}</main>
    </div>
  );
}
