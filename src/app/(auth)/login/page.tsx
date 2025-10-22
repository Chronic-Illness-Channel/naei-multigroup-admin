import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "NAEI Admin | Sign in",
  description: "Secure access to the NAEI multigroup administration portal.",
};

export default async function LoginPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/groups");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">NAEI Administration</h1>
        <p className="text-sm text-slate-400">
          Sign in with your Supabase credentials to manage groups and audit activity.
        </p>
      </div>
      <LoginForm />
      <p className="text-center text-xs text-slate-500">
        Need access? Contact the data platform team or review the{" "}
        <Link
          href="https://supabase.com/docs"
          className="underline transition hover:text-slate-300"
        >
          Supabase documentation
        </Link>
        .
      </p>
    </div>
  );
}
