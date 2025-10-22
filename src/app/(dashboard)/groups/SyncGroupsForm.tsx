"use client";

import { useFormState, useFormStatus } from "react-dom";
import { defaultActionState, syncGroupsAction, type ActionState } from "./actions";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Triggering..." : "Run sync"}
    </button>
  );
};

const ActionFeedback = ({ state }: { state: ActionState }) => {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  const tone = state.status === "error" ? "text-red-400" : "text-emerald-400";
  return <p className={`text-sm ${tone}`}>{state.message}</p>;
};

export const SyncGroupsForm = ({ defaultRpcName }: { defaultRpcName: string }) => {
  const [state, formAction] = useFormState(syncGroupsAction, defaultActionState);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200" htmlFor="rpc_name">
          RPC function name
        </label>
        <input
          id="rpc_name"
          name="rpc_name"
          defaultValue={defaultRpcName}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
        />
        <p className="text-xs text-slate-500">
          Update only if your Supabase function uses a different identifier.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton />
        <ActionFeedback state={state} />
      </div>
    </form>
  );
};
