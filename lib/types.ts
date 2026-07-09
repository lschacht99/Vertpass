// Domain model for the Green Card Command Center (Marriage AOS).
// Shapes mirror the intended Supabase tables so the mock store can be
// swapped for a Supabase client with no changes to consumers.

export type Status = "not_started" | "in_progress" | "ready" | "blocked" | "done";
export type Confidence = "high" | "medium" | "low";
export type RiskSeverity = "info" | "watch" | "high";

export interface UserProfile {
  id: string;
  full_name: string;
  country_of_birth: string;
  age: number;
  address: string;
  travel_notes: string;
  work_notes: string;
  immigration_notes: string;
}

export interface CaseProfile {
  id: string;
  case_type: string; // e.g. "Marriage-based Adjustment of Status (AOS)"
  married_to: string; // "U.S. Citizen"
  entered_us: string; // ISO date
  status_summary: string;
  current_stage: string; // matches a TimelineItem key
  last_uscis_check: string; // ISO date
}

export interface EvidenceItem {
  label: string;
  done: boolean;
}

export interface FormItem {
  id: string; // e.g. "I-485"
  code: string;
  title: string;
  purpose: string;
  status: Status;
  evidence: EvidenceItem[];
  uscis_url: string;
  edition: string; // edition date string
  last_checked: string; // ISO date
  notes: string;
  risks: string[]; // risk_flag ids referenced
  optional?: boolean;
}

export type DocCategory =
  | "identity"
  | "passport_visa_i94"
  | "marriage"
  | "sponsor"
  | "medical"
  | "photos"
  | "translations"
  | "address"
  | "travel"
  | "work"
  | "other";

export interface DocumentItem {
  id: string;
  name: string;
  category: DocCategory;
  required: boolean;
  status: Status;
  expiry?: string; // ISO date if applicable
  notes: string;
  included: boolean; // included in packet
  related_form?: string; // FormItem id
  source?: string; // where the doc comes from
}

export interface TimelineItem {
  id: string;
  key: string; // stable stage key
  title: string;
  status: Status;
  date_or_estimate: string;
  notes: string;
  reminder?: string;
  related_items: string[]; // form/doc ids
}

export interface RiskFlag {
  id: string;
  title: string;
  severity: RiskSeverity;
  detail: string;
  active: boolean;
}

export interface SourceReference {
  id: string;
  title: string;
  url: string;
  type: "form_page" | "instructions" | "policy_manual" | "fee" | "tool" | "status";
  form?: string; // related FormItem id
  last_checked: string; // ISO date
  notes: string;
  needs_review: boolean;
}

export interface AiSourceCard {
  title: string;
  url: string;
  last_checked: string;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: Confidence;
  sources?: AiSourceCard[];
  source_warning?: boolean; // true when no cited source available
  created_at: string;
}

export interface PacketGroup {
  id: string;
  title: string;
  optional?: boolean;
  item_ids: string[]; // form/doc ids belonging to this group
}
