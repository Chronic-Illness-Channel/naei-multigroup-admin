import type { AuditEventRow } from "@/lib/supabase/types";

const formatTimestamp = (value: string) => {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return value;
  }
  return timestamp.toLocaleString();
};

const stringifyDetails = (details: AuditEventRow["details"]) => {
  if (!details) {
    return "No details";
  }

  try {
    return JSON.stringify(details, null, 2);
  } catch (error) {
    console.error("Failed to stringify audit payload", error);
    return String(details);
  }
};

export const AuditLogList = ({ events }: { events: AuditEventRow[] }) => {
  if (!events.length) {
    return (
      <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
        No audit events yet. Actions taken through this console will appear here.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <article
          key={event.id}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-medium text-white">{event.event_type}</div>
            <time className="text-xs text-slate-500" dateTime={event.created_at}>
              {formatTimestamp(event.created_at)}
            </time>
          </div>
          <div className="mt-2 grid gap-2 text-xs text-slate-400 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <span className="font-semibold text-slate-300">Actor:</span>{" "}
              {event.actor ?? "Unknown"}
            </div>
            <div>
              <span className="font-semibold text-slate-300">Event ID:</span> {event.id}
            </div>
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-200">
              View payload
            </summary>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950/60 p-3 text-xs text-slate-300">
              {stringifyDetails(event.details)}
            </pre>
          </details>
        </article>
      ))}
    </div>
  );
};
