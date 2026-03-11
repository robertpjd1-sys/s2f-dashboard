export type ComplianceAlertSeverity = "Critical" | "Warning" | "Info";

export type ComplianceAlert = {
  id: string;
  title: string;
  address: string;
  severity: ComplianceAlertSeverity;
  dateDetected: string;
};

export type RegulatoryChange = {
  id: string;
  title: string;
  description: string;
  date: string;
  source: string;
};

export const dummyComplianceAlerts: ComplianceAlert[] = [
  {
    id: "AL-1001",
    title: "EPC Rating Change Required",
    address: "14a High Street, Leeds, LS1 2AB",
    severity: "Critical",
    dateDetected: "2026-03-10",
  },
  {
    id: "AL-1002",
    title: "Gas Safety Certificate Expiring",
    address: "Flat 4, The Mews, Manchester, M1 4DT",
    severity: "Warning",
    dateDetected: "2026-03-09",
  },
  {
    id: "AL-1003",
    title: "EICR Overdue",
    address: "22 King Road, London, SW19 8PH",
    severity: "Critical",
    dateDetected: "2026-03-08",
  },
  {
    id: "AL-1004",
    title: "HMO License Renewal Needed",
    address: "8 Student Avenue, Sheffield, S10 2TF",
    severity: "Warning",
    dateDetected: "2026-03-05",
  },
  {
    id: "AL-1005",
    title: "Smoke Alarm Battery Low",
    address: "99 Queen Square, Bristol, BS1 4ND",
    severity: "Info",
    dateDetected: "2026-03-01",
  },
];

export const dummyRegulatoryChanges: RegulatoryChange[] = [
  {
    id: "RC-2001",
    title: "MEES Regulations Update 2026",
    description: "New minimum energy efficiency standard requires all rental properties to achieve a rating of C or above by Dec 2026.",
    date: "2026-03-01",
    source: "MEES",
  },
  {
    id: "RC-2002",
    title: "Renters (Reform) Bill Additions",
    description: "Updated grounds for possession implemented regarding periodic tenancies vs fixed-term evictions.",
    date: "2026-02-15",
    source: "UK Govt",
  },
  {
    id: "RC-2003",
    title: "Local Selective Licensing Rollout",
    description: "Selective licensing scheme introduced for properties in the Northern corridor. Registration required by April.",
    date: "2026-02-02",
    source: "Local Council",
  },
  {
    id: "RC-2004",
    title: "HMRC MTD Enforcement",
    description: "Making Tax Digital for Income Tax Self Assessment (ITSA) strict compliance tracking starts next month.",
    date: "2026-01-20",
    source: "HMRC",
  },
  {
    id: "RC-2005",
    title: "Smoke and Carbon Monoxide Rules",
    description: "Revised guidance on the placement and testing frequencies of CO alarms in rooms with fixed combustion appliances.",
    date: "2025-12-10",
    source: "HSE",
  },
];
