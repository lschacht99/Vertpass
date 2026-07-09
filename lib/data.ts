import type {
  UserProfile,
  CaseProfile,
  FormItem,
  DocumentItem,
  TimelineItem,
  RiskFlag,
  SourceReference,
  PacketGroup,
} from "./types";

// NOTE: URLs and editions below are placeholders that MUST be verified against
// the live USCIS pages. Every source is marked needs_review: true until an
// admin confirms it on the Source Refresh screen. No fees are hardcoded
// anywhere in this app — fees are always referenced via the G-1055 fee
// schedule and the USCIS Fee Calculator.

const TODAY = "2026-07-09";

export const seedUserProfile: UserProfile = {
  id: "user_1",
  full_name: "Kevin Moise Cohen",
  country_of_birth: "France",
  age: 26,
  address: "Editable — add current U.S. address",
  travel_notes: "Editable — add recent international travel history.",
  work_notes: "Editable — add employment history and work authorization notes.",
  immigration_notes:
    "Editable — entered the U.S. on 2026-01-30, preparing marriage-based Adjustment of Status.",
};

export const seedCaseProfile: CaseProfile = {
  id: "case_1",
  case_type: "Marriage-based Adjustment of Status (AOS)",
  married_to: "U.S. Citizen",
  entered_us: "2026-01-30",
  status_summary:
    "Preparing a concurrently-filed I-130 / I-485 packet as the spouse of a U.S. citizen.",
  current_stage: "forms",
  last_uscis_check: TODAY,
};

export const seedForms: FormItem[] = [
  {
    id: "I-130",
    code: "I-130",
    title: "Petition for Alien Relative",
    purpose:
      "Establishes the qualifying marriage relationship between the U.S. citizen petitioner and the beneficiary spouse.",
    status: "in_progress",
    evidence: [
      { label: "Marriage certificate", done: false },
      { label: "Proof of petitioner's U.S. citizenship", done: false },
      { label: "Bona fide marriage evidence (joint accounts, lease, photos)", done: false },
    ],
    uscis_url: "https://www.uscis.gov/i-130",
    edition: "Verify current edition on USCIS.gov",
    last_checked: TODAY,
    notes: "Filed concurrently with I-485.",
    risks: ["fraud_misrep"],
  },
  {
    id: "I-130A",
    code: "I-130A",
    title: "Supplemental Information for Spouse Beneficiary",
    purpose: "Collects additional biographic and address/employment history for the beneficiary spouse.",
    status: "not_started",
    evidence: [{ label: "Address history (5 years)", done: false }, { label: "Employment history (5 years)", done: false }],
    uscis_url: "https://www.uscis.gov/i-130a",
    edition: "Verify current edition on USCIS.gov",
    last_checked: TODAY,
    notes: "Signed by the beneficiary spouse.",
    risks: [],
  },
  {
    id: "I-485",
    code: "I-485",
    title: "Application to Register Permanent Residence or Adjust Status",
    purpose: "The core adjustment application to become a lawful permanent resident from within the U.S.",
    status: "not_started",
    evidence: [
      { label: "Copy of passport biographic page", done: false },
      { label: "Copy of visa and I-94", done: false },
      { label: "Birth certificate with certified translation", done: false },
      { label: "Two passport-style photos", done: false },
    ],
    uscis_url: "https://www.uscis.gov/i-485",
    edition: "Verify current edition on USCIS.gov",
    last_checked: TODAY,
    notes: "Confirm current edition and check I-485 source before building the packet.",
    risks: ["overstay", "unauthorized_work", "public_charge", "unclear_entry"],
  },
  {
    id: "I-864",
    code: "I-864",
    title: "Affidavit of Support Under Section 213A",
    purpose: "The petitioner sponsor's legally enforceable commitment to financially support the intending immigrant.",
    status: "not_started",
    evidence: [
      { label: "Sponsor's most recent federal tax return / transcript", done: false },
      { label: "Recent pay stubs or employer letter", done: false },
      { label: "Proof of domicile in the U.S.", done: false },
    ],
    uscis_url: "https://www.uscis.gov/i-864",
    edition: "Verify current edition on USCIS.gov",
    last_checked: TODAY,
    notes: "Check current Federal Poverty Guidelines requirement for household size.",
    risks: ["sponsor_income"],
  },
  {
    id: "I-765",
    code: "I-765",
    title: "Application for Employment Authorization (EAD)",
    purpose: "Requests a work permit while the adjustment application is pending.",
    status: "not_started",
    evidence: [{ label: "Two passport-style photos", done: false }, { label: "Copy of I-94", done: false }],
    uscis_url: "https://www.uscis.gov/i-765",
    edition: "Verify current edition on USCIS.gov",
    last_checked: TODAY,
    notes: "Category (c)(9) based on pending I-485. Optional but commonly filed.",
    risks: [],
    optional: true,
  },
  {
    id: "I-131",
    code: "I-131",
    title: "Application for Travel Document (Advance Parole)",
    purpose: "Requests permission to travel abroad while the adjustment application is pending.",
    status: "not_started",
    evidence: [{ label: "Two passport-style photos", done: false }, { label: "Explanation of travel need", done: false }],
    uscis_url: "https://www.uscis.gov/i-131",
    edition: "Verify current edition on USCIS.gov",
    last_checked: TODAY,
    notes: "Optional. Traveling without Advance Parole while I-485 is pending can be risky.",
    risks: [],
    optional: true,
  },
  {
    id: "I-693",
    code: "I-693",
    title: "Report of Immigration Medical Examination and Vaccination Record",
    purpose: "Documents the required medical examination completed by a USCIS-designated civil surgeon.",
    status: "not_started",
    evidence: [{ label: "Completed by civil surgeon in a sealed envelope", done: false }],
    uscis_url: "https://www.uscis.gov/i-693",
    edition: "Verify current edition on USCIS.gov",
    last_checked: TODAY,
    notes: "Check I-693 source and validity guidance before including in the packet. Keep sealed.",
    risks: ["missing_i693"],
  },
  {
    id: "G-1145",
    code: "G-1145",
    title: "E-Notification of Application/Petition Acceptance",
    purpose: "Requests text/email notification when USCIS accepts the filing.",
    status: "not_started",
    evidence: [{ label: "Mobile number and email", done: false }],
    uscis_url: "https://www.uscis.gov/g-1145",
    edition: "Verify current edition on USCIS.gov",
    last_checked: TODAY,
    notes: "Clip to the top of the packet.",
    risks: [],
    optional: true,
  },
];

export const seedDocuments: DocumentItem[] = [
  { id: "doc_passport", name: "Passport (biographic page)", category: "passport_visa_i94", required: true, status: "not_started", expiry: "2029-05-01", notes: "Include a clear copy of the biographic page.", included: false, related_form: "I-485" },
  { id: "doc_i94", name: "I-94 Arrival/Departure Record", category: "passport_visa_i94", required: true, status: "not_started", notes: "Print from CBP I-94 website.", included: false, related_form: "I-485" },
  { id: "doc_visa", name: "Entry visa / admission stamp", category: "passport_visa_i94", required: true, status: "not_started", notes: "Confirms class of admission on 2026-01-30.", included: false, related_form: "I-485" },
  { id: "doc_birth", name: "Birth certificate", category: "identity", required: true, status: "not_started", notes: "Requires certified English translation.", included: false, related_form: "I-485" },
  { id: "doc_birth_translation", name: "Birth certificate — certified translation", category: "translations", required: true, status: "not_started", notes: "Translator's certification of accuracy required.", included: false, related_form: "I-485" },
  { id: "doc_marriage", name: "Marriage certificate", category: "marriage", required: true, status: "not_started", notes: "Certified copy.", included: false, related_form: "I-130" },
  { id: "doc_bonafide", name: "Bona fide marriage evidence", category: "marriage", required: true, status: "not_started", notes: "Joint lease, joint accounts, photos, affidavits.", included: false, related_form: "I-130" },
  { id: "doc_usc_proof", name: "Proof of petitioner U.S. citizenship", category: "sponsor", required: true, status: "not_started", notes: "U.S. passport, birth certificate, or naturalization certificate.", included: false, related_form: "I-130" },
  { id: "doc_tax", name: "Sponsor federal tax return / transcript", category: "sponsor", required: true, status: "not_started", notes: "Most recent year; transcript preferred.", included: false, related_form: "I-864" },
  { id: "doc_income", name: "Sponsor income proof (pay stubs / employer letter)", category: "sponsor", required: true, status: "not_started", notes: "Recent pay stubs or an employer letter.", included: false, related_form: "I-864" },
  { id: "doc_medical", name: "Medical exam (I-693, sealed)", category: "medical", required: true, status: "not_started", notes: "Completed by a USCIS civil surgeon; keep sealed.", included: false, related_form: "I-693" },
  { id: "doc_photos", name: "Passport-style photos", category: "photos", required: true, status: "not_started", notes: "Meet USCIS photo specifications.", included: false, related_form: "I-485" },
  { id: "doc_address", name: "Address history documentation", category: "address", required: false, status: "not_started", notes: "Supports I-130A address history.", included: false, related_form: "I-130A" },
  { id: "doc_travel", name: "Travel history record", category: "travel", required: false, status: "not_started", notes: "Recent international trips.", included: false },
  { id: "doc_work", name: "Employment history / prior authorization", category: "work", required: false, status: "not_started", notes: "Supports work-authorization risk review.", included: false },
];

export const seedTimeline: TimelineItem[] = [
  { id: "tl_setup", key: "setup", title: "Case setup & profile", status: "done", date_or_estimate: "2026-02", notes: "Profile and case type confirmed.", related_items: [] },
  { id: "tl_evidence", key: "evidence", title: "Gather evidence & documents", status: "in_progress", date_or_estimate: "2026-07", notes: "Collecting identity, marriage, and sponsor documents.", reminder: "Chase missing translations", related_items: ["doc_birth_translation", "doc_bonafide"] },
  { id: "tl_medical", key: "medical", title: "Medical exam (I-693)", status: "not_started", date_or_estimate: "TBD", notes: "Schedule with a USCIS civil surgeon.", related_items: ["I-693"] },
  { id: "tl_forms", key: "forms", title: "Complete forms", status: "in_progress", date_or_estimate: "2026-07", notes: "Drafting I-130, I-130A, I-485, I-864.", related_items: ["I-130", "I-485", "I-864"] },
  { id: "tl_review", key: "review", title: "Review packet", status: "not_started", date_or_estimate: "TBD", notes: "Verify editions, fees, and completeness.", related_items: [] },
  { id: "tl_file", key: "file", title: "File with USCIS", status: "not_started", date_or_estimate: "TBD", notes: "Confirm filing address and fees via USCIS.", related_items: [] },
  { id: "tl_receipts", key: "receipts", title: "Receipt notices", status: "not_started", date_or_estimate: "TBD", notes: "Expect I-797C receipts.", related_items: [] },
  { id: "tl_biometrics", key: "biometrics", title: "Biometrics appointment", status: "not_started", date_or_estimate: "TBD", notes: "ASC appointment for fingerprints/photo.", related_items: [] },
  { id: "tl_ead_ap", key: "ead_ap", title: "EAD / Advance Parole", status: "not_started", date_or_estimate: "TBD", notes: "If I-765 / I-131 filed.", related_items: ["I-765", "I-131"] },
  { id: "tl_interview", key: "interview", title: "Interview", status: "not_started", date_or_estimate: "TBD", notes: "Marriage-based AOS interview.", related_items: [] },
  { id: "tl_decision", key: "decision", title: "Decision", status: "not_started", date_or_estimate: "TBD", notes: "Approval / RFE / decision.", related_items: [] },
];

export const seedRiskFlags: RiskFlag[] = [
  { id: "missing_i693", title: "Medical exam (I-693) not yet completed", severity: "watch", detail: "The I-693 may be required for the packet. Confirm timing and validity guidance against the USCIS I-693 page.", active: true },
  { id: "outdated_edition", title: "Form editions not yet verified", severity: "watch", detail: "Filing an outdated form edition can lead to rejection. Verify the current edition of each form on USCIS.gov.", active: true },
  { id: "missing_translation", title: "Foreign-language document needs certified translation", severity: "watch", detail: "The birth certificate requires a certified English translation.", active: true },
  { id: "sponsor_income", title: "Sponsor income not yet documented", severity: "watch", detail: "Confirm the sponsor meets the household-size income requirement per the I-864 instructions.", active: true },
  { id: "unclear_entry", title: "Manner of entry / status affects strategy", severity: "high", detail: "Manner of last entry and status can affect AOS eligibility and strategy.", active: true },
  { id: "overstay", title: "Overstay / period of stay", severity: "info", detail: "Time out of status can affect strategy. Immediate relatives of U.S. citizens have specific rules — confirm with the USCIS Policy Manual.", active: false },
  { id: "unauthorized_work", title: "Unauthorized employment", severity: "info", detail: "Prior unauthorized work can affect some applicants differently. Confirm applicability.", active: false },
  { id: "crime", title: "Criminal history", severity: "info", detail: "Any arrests or charges should be reviewed carefully.", active: false },
  { id: "prior_removal", title: "Prior removal / deportation order", severity: "info", detail: "Prior removal proceedings can significantly affect strategy.", active: false },
  { id: "fraud_misrep", title: "Fraud or misrepresentation concern", severity: "info", detail: "Any past misrepresentation to immigration authorities should be reviewed.", active: false },
  { id: "prior_denial", title: "Prior application denial", severity: "info", detail: "Previous denials can affect the current filing.", active: false },
  { id: "public_charge", title: "Public charge considerations", severity: "info", detail: "Confirm current public charge guidance in the USCIS Policy Manual.", active: false },
  { id: "complex_history", title: "Complex immigration history", severity: "info", detail: "Multiple entries, prior petitions, or status changes add complexity.", active: false },
  { id: "ina_245i", title: "INA 245(i) may apply", severity: "info", detail: "Section 245(i) can affect eligibility for certain applicants. Confirm applicability.", active: false },
];

export const seedSources: SourceReference[] = [
  { id: "src_i485_page", title: "USCIS Form I-485 page", url: "https://www.uscis.gov/i-485", type: "form_page", form: "I-485", last_checked: TODAY, notes: "Confirm current edition and filing guidance.", needs_review: true },
  { id: "src_i485_instr", title: "USCIS I-485 Instructions", url: "https://www.uscis.gov/i-485", type: "instructions", form: "I-485", last_checked: TODAY, notes: "Instructions PDF linked from the form page.", needs_review: true },
  { id: "src_i130", title: "USCIS Form I-130 page", url: "https://www.uscis.gov/i-130", type: "form_page", form: "I-130", last_checked: TODAY, notes: "", needs_review: true },
  { id: "src_i130a", title: "USCIS Form I-130A page", url: "https://www.uscis.gov/i-130a", type: "form_page", form: "I-130A", last_checked: TODAY, notes: "", needs_review: true },
  { id: "src_i864", title: "USCIS Form I-864 page", url: "https://www.uscis.gov/i-864", type: "form_page", form: "I-864", last_checked: TODAY, notes: "Check Federal Poverty Guidelines requirement.", needs_review: true },
  { id: "src_i765", title: "USCIS Form I-765 page", url: "https://www.uscis.gov/i-765", type: "form_page", form: "I-765", last_checked: TODAY, notes: "", needs_review: true },
  { id: "src_i131", title: "USCIS Form I-131 page", url: "https://www.uscis.gov/i-131", type: "form_page", form: "I-131", last_checked: TODAY, notes: "", needs_review: true },
  { id: "src_i693", title: "USCIS Form I-693 page", url: "https://www.uscis.gov/i-693", type: "form_page", form: "I-693", last_checked: TODAY, notes: "Check validity/timing guidance before packet.", needs_review: true },
  { id: "src_g1055", title: "USCIS Fee Schedule (G-1055)", url: "https://www.uscis.gov/g-1055", type: "fee", last_checked: TODAY, notes: "Authoritative source for fees. Do not hardcode fees.", needs_review: true },
  { id: "src_feecalc", title: "USCIS Fee Calculator", url: "https://www.uscis.gov/feecalculator", type: "tool", last_checked: TODAY, notes: "Use to compute current fees.", needs_review: true },
  { id: "src_policy", title: "USCIS Policy Manual", url: "https://www.uscis.gov/policy-manual", type: "policy_manual", last_checked: TODAY, notes: "Authoritative policy source.", needs_review: true },
  { id: "src_casestatus", title: "USCIS Case Status Online", url: "https://egov.uscis.gov/casestatus/landing.do", type: "status", last_checked: TODAY, notes: "Track receipts by receipt number.", needs_review: true },
];

export const packetGroups: PacketGroup[] = [
  { id: "pg_cover", title: "Cover letter", item_ids: [] },
  { id: "pg_payment", title: "Payment (verify fees via G-1055 / Fee Calculator)", item_ids: [] },
  { id: "pg_i130", title: "Form I-130 + evidence", item_ids: ["I-130", "doc_marriage", "doc_usc_proof", "doc_bonafide"] },
  { id: "pg_i130a", title: "Form I-130A", item_ids: ["I-130A", "doc_address"] },
  { id: "pg_i485", title: "Form I-485 + evidence", item_ids: ["I-485", "doc_passport", "doc_i94", "doc_visa", "doc_birth", "doc_birth_translation"] },
  { id: "pg_i864", title: "Form I-864 + financial evidence", item_ids: ["I-864", "doc_tax", "doc_income"] },
  { id: "pg_i765", title: "Form I-765 (optional)", optional: true, item_ids: ["I-765"] },
  { id: "pg_i131", title: "Form I-131 (optional)", optional: true, item_ids: ["I-131"] },
  { id: "pg_i693", title: "Form I-693 sealed medical", item_ids: ["I-693", "doc_medical"] },
  { id: "pg_evidence", title: "Supporting evidence", item_ids: ["doc_bonafide"] },
  { id: "pg_translations", title: "Certified translations", item_ids: ["doc_birth_translation"] },
  { id: "pg_photos", title: "Photos", item_ids: ["doc_photos"] },
];
