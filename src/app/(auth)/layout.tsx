export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/50">
        {children}
      </div>
    </div>
  );
}
