"use client";

import { useCallback } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { GroupRow, NfrCodeRow } from "@/lib/supabase/types";
import {
  deleteGroupAction,
  defaultActionState,
  type ActionState,
  updateGroupAction,
} from "./actions";

const SubmitButton = ({
  idleLabel,
  pendingLabel,
  variant = "primary",
}: {
  idleLabel: string;
  pendingLabel: string;
  variant?: "primary" | "danger";
}) => {
  const { pending } = useFormStatus();
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70";
  const variantClasses =
    variant === "danger"
      ? "border border-red-500/60 bg-red-500/10 text-red-200 hover:bg-red-500/20"
      : "bg-slate-100 text-slate-900 hover:bg-white";

  return (
    <button type="submit" className={`${baseClasses} ${variantClasses}`} disabled={pending}>
      {pending ? pendingLabel : idleLabel}
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

const formatTimestamp = (value: string | null) => {
  if (!value) {
    return "Never";
  }

  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return value;
  }

  return timestamp.toLocaleString();
};

const GroupCard = ({ group, nfrCodes }: { group: GroupRow; nfrCodes: NfrCodeRow[] }) => {
  const [updateState, updateAction] = useFormState(updateGroupAction, defaultActionState);
  const [deleteState, deleteAction] = useFormState(deleteGroupAction, defaultActionState);

  const handleDelete = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      const confirmed = window.confirm(`Delete group "${group.Group_Title}"?`);
      if (!confirmed) {
        event.preventDefault();
      }
    },
    [group.Group_Title]
  );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40">
      <form action={updateAction} className="space-y-4">
        <input type="hidden" name="id" value={group.id} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor={`Group_Title_${group.id}`}
            >
              Group title
            </label>
            <input
              id={`Group_Title_${group.id}`}
              name="Group_Title"
              defaultValue={group.Group_Title}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor={`SourceName_${group.id}`}
            >
              Source name
            </label>
            <input
              id={`SourceName_${group.id}`}
              name="SourceName"
              defaultValue={group.SourceName ?? ""}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor={`ActivityName_${group.id}`}
            >
              Activity name
            </label>
            <input
              id={`ActivityName_${group.id}`}
              name="ActivityName"
              defaultValue={group.ActivityName ?? ""}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor={`NFRCode_${group.id}`}>
              NFR code
            </label>
            <select
              id={`NFRCode_${group.id}`}
              name="NFRCode"
              defaultValue={group.NFRCode ?? ""}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
            >
              <option value="">Not assigned</option>
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
          <SubmitButton idleLabel="Save changes" pendingLabel="Saving..." />
          <span className="text-xs text-slate-500">
            Last updated: {formatTimestamp(group.updated_at)}
          </span>
          <ActionFeedback state={updateState} />
        </div>
      </form>
      <form action={deleteAction} onSubmit={handleDelete} className="mt-4">
        <input type="hidden" name="id" value={group.id} />
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton idleLabel="Delete" pendingLabel="Deleting..." variant="danger" />
          <ActionFeedback state={deleteState} />
        </div>
      </form>
    </div>
  );
};

export const GroupsList = ({
  groups,
  nfrCodes,
}: {
  groups: GroupRow[];
  nfrCodes: NfrCodeRow[];
}) => {
  if (!groups.length) {
    return (
      <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
        No groups available yet. Create your first group to get started.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} nfrCodes={nfrCodes} />
      ))}
    </div>
  );
};
