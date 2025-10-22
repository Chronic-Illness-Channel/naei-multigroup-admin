"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { NfrCodeRow } from "@/lib/supabase/types";
import { createGroupAction, defaultActionState, type ActionState } from "./actions";

const SubmitButton = ({
  defaultLabel,
  pendingLabel,
}: {
  defaultLabel: string;
  pendingLabel: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? pendingLabel : defaultLabel}
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

export const GroupCreateForm = ({ nfrCodes }: { nfrCodes: NfrCodeRow[] }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(createGroupAction, defaultActionState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="Group_Title">
            Group title
          </label>
          <input
            id="Group_Title"
            name="Group_Title"
            required
            placeholder="Road transport"
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="SourceName">
            Source name
          </label>
          <input
            id="SourceName"
            name="SourceName"
            placeholder="NAEI"
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="ActivityName">
            Activity name
          </label>
          <input
            id="ActivityName"
            name="ActivityName"
            placeholder="Fuel combustion"
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="NFRCode">
            NFR code
          </label>
          <select
            id="NFRCode"
            name="NFRCode"
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
            defaultValue=""
          >
            <option value="">Select code (optional)</option>
            {nfrCodes.map((code) => (
              <option key={code.id} value={code.NFRCode}>
                {code.NFRCode}
                {code.Description ? ` - ${code.Description}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton defaultLabel="Create group" pendingLabel="Creating..." />
        <ActionFeedback state={state} />
      </div>
    </form>
  );
};
