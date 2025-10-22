export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Replace these definitions with your generated Supabase types when available.
export interface Database {
  public: {
    Tables: {
      NAEI_global_t_Group: {
        Row: {
          id: number;
          Group_Title: string;
          SourceName: string | null;
          ActivityName: string | null;
          NFRCode: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          Group_Title: string;
          SourceName?: string | null;
          ActivityName?: string | null;
          NFRCode?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          Group_Title?: string;
          SourceName?: string | null;
          ActivityName?: string | null;
          NFRCode?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      NAEI_global_t_NFRCode: {
        Row: {
          id: number;
          NFRCode: string;
          Description: string | null;
        };
        Relationships: [];
      };
      audit_events: {
        Row: {
          id: number;
          event_type: string;
          created_at: string;
          actor: string | null;
          details: Json | null;
        };
        Insert: {
          id?: number;
          event_type: string;
          created_at?: string;
          actor?: string | null;
          details?: Json | null;
        };
        Update: {
          id?: number;
          event_type?: string;
          created_at?: string;
          actor?: string | null;
          details?: Json | null;
        };
        Relationships: [];
      };
    };
  };
}

export type GroupRow = Database["public"]["Tables"]["NAEI_global_t_Group"]["Row"];
export type GroupInsert = Database["public"]["Tables"]["NAEI_global_t_Group"]["Insert"];
export type GroupUpdate = Database["public"]["Tables"]["NAEI_global_t_Group"]["Update"];
export type NfrCodeRow = Database["public"]["Tables"]["NAEI_global_t_NFRCode"]["Row"];
export type AuditEventRow = Database["public"]["Tables"]["audit_events"]["Row"];
export type AuditEventInsert = Database["public"]["Tables"]["audit_events"]["Insert"];
