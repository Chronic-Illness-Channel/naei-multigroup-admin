"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import type { AuditEventInsert, GroupInsert, GroupUpdate, Json } from "@/lib/supabase/types";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const defaultActionState: ActionState = {
  status: "idle",
  message: null,
};

const groupsPath = "/groups";

const rpcFunctionName = process.env.NAEI_GROUP_SYNC_FUNCTION ?? "sync_naei_groups";

const requiredString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  throw new Error(`Missing required field: ${key}`);
};

const optionalString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return null;
};

const parseId = (formData: FormData) => {
  const idValue = formData.get("id");
  const parsed = typeof idValue === "string" ? Number(idValue) : NaN;
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  throw new Error("Invalid group id");
};

const logAudit = async (eventType: string, actor: string | null, details: Json) => {
  try {
    const serviceClient = createSupabaseServiceRoleClient();
    const entry: AuditEventInsert = {
      event_type: eventType,
      actor,
      details,
    };
    const { error } = await serviceClient.from("audit_events").insert([entry]);

    if (error) {
      console.error("Failed to append audit event", error);
    }
  } catch (error) {
    console.error("Audit logging failed", error);
  }
};

export const createGroupAction = async (
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        status: "error",
        message: "You must be signed in to create groups.",
      };
    }

    const payload: GroupInsert = {
      Group_Title: requiredString(formData, "Group_Title"),
      SourceName: optionalString(formData, "SourceName"),
      ActivityName: optionalString(formData, "ActivityName"),
      NFRCode: optionalString(formData, "NFRCode"),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("NAEI_global_t_Group")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    await logAudit("group.created", user.email ?? user.id, {
      groupId: data?.id ?? null,
      payload,
    });

    revalidatePath(groupsPath);

    return {
      status: "success",
      message: "Group created successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unexpected error",
    };
  }
};

export const updateGroupAction = async (
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        status: "error",
        message: "You must be signed in to update groups.",
      };
    }

    const id = parseId(formData);
    const payload: GroupUpdate = {
      Group_Title: requiredString(formData, "Group_Title"),
      SourceName: optionalString(formData, "SourceName"),
      ActivityName: optionalString(formData, "ActivityName"),
      NFRCode: optionalString(formData, "NFRCode"),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("NAEI_global_t_Group").update(payload).eq("id", id);

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    await logAudit("group.updated", user.email ?? user.id, {
      groupId: id,
      payload,
    });

    revalidatePath(groupsPath);

    return {
      status: "success",
      message: "Group updated successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unexpected error",
    };
  }
};

export const deleteGroupAction = async (
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        status: "error",
        message: "You must be signed in to delete groups.",
      };
    }

    const id = parseId(formData);

    const { error } = await supabase.from("NAEI_global_t_Group").delete().eq("id", id);

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    await logAudit("group.deleted", user.email ?? user.id, {
      groupId: id,
    });

    revalidatePath(groupsPath);

    return {
      status: "success",
      message: "Group deleted successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unexpected error",
    };
  }
};

export const syncGroupsAction = async (
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        status: "error",
        message: "You must be signed in to run the sync.",
      };
    }

    const override = formData.get("rpc_name");
    const rpcName =
      typeof override === "string" && override.trim() ? override.trim() : rpcFunctionName;

    const { error } = await supabase.rpc(rpcName);

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    await logAudit("group.sync_triggered", user.email ?? user.id, {
      rpcName,
    });

    revalidatePath(groupsPath);

    return {
      status: "success",
      message: "Sync triggered successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unexpected error",
    };
  }
};
