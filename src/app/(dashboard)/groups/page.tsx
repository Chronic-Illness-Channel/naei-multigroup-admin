import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuditEventRow, GroupRow, NfrCodeRow } from "@/lib/supabase/types";
import { AuditLogList } from "./AuditLogList";
import { GroupCreateForm } from "./GroupCreateForm";
import { GroupsList } from "./GroupsList";
import { SyncGroupsForm } from "./SyncGroupsForm";

const groupsPath = "NAEI_global_t_Group";
const nfrCodesPath = "NAEI_global_t_NFRCode";
const auditEventsPath = "audit_events";

const rpcFunctionName = process.env.NAEI_GROUP_SYNC_FUNCTION ?? "sync_naei_groups";

const mapGroupRows = (rows: GroupRow[] | null) => rows ?? [];
const mapNfrRows = (rows: NfrCodeRow[] | null) => rows ?? [];
const mapAuditRows = (rows: AuditEventRow[] | null) => rows ?? [];

export default async function GroupsPage() {
  const supabase = createSupabaseServerClient();

  const [{ data: groupsData }, { data: codesData }, { data: auditData }] = await Promise.all([
    supabase.from(groupsPath).select().order("updated_at", { ascending: false }),
    supabase.from(nfrCodesPath).select().order("NFRCode"),
    supabase.from(auditEventsPath).select().order("created_at", { ascending: false }).limit(25),
  ]);

  const groups = mapGroupRows(groupsData ?? null);
  const nfrCodes = mapNfrRows(codesData ?? null);
  const auditEvents = mapAuditRows(auditData ?? null);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Groups</h1>
            <p className="text-sm text-slate-400">
              Create, edit, or remove NAEI groups and trigger Supabase sync jobs.
            </p>
          </div>
        </div>
        <GroupCreateForm nfrCodes={nfrCodes} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Existing groups</h2>
          <span className="text-xs text-slate-500">{groups.length} total</span>
        </div>
        <GroupsList groups={groups} nfrCodes={nfrCodes} />
      </section>

      <section id="audit-log" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Trigger group sync</h2>
        </div>
        <SyncGroupsForm defaultRpcName={rpcFunctionName} />
        <AuditLogList events={auditEvents} />
      </section>
    </div>
  );
}
