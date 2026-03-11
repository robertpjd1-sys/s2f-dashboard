export type Job = {
  id: string;
  propertyAddress: string;
  clerkName: string;
  date: string;
  status: "Unallocated" | "Assigned" | "In Progress" | "In QA" | "Completed" | "Cancelled";
  amount: number;
};

export const DUMMY_JOBS: Job[] = [
  {
    id: "JOB-1029",
    propertyAddress: "14 Kings Road, London SW1",
    clerkName: "Sarah Jenkins",
    date: "2024-03-24T09:00:00Z",
    status: "Completed",
    amount: 125.00,
  },
  {
    id: "JOB-1030",
    propertyAddress: "22 Baker Street, London NW1",
    clerkName: "Unassigned",
    date: "2024-03-25T14:30:00Z",
    status: "Unallocated",
    amount: 150.00,
  },
  {
    id: "JOB-1031",
    propertyAddress: "5 High Street, Manchester",
    clerkName: "David Chen",
    date: "2024-03-24T11:00:00Z",
    status: "In QA",
    amount: 90.00,
  },
  {
    id: "JOB-1032",
    propertyAddress: "88 Ocean Drive, Brighton",
    clerkName: "Emma Watson",
    date: "2024-03-24T16:00:00Z",
    status: "Assigned",
    amount: 200.00,
  },
  {
    id: "JOB-1033",
    propertyAddress: "12 Maple Court, Leeds",
    clerkName: "John Smith",
    date: "2024-03-23T10:00:00Z",
    status: "In Progress",
    amount: 110.00,
  },
  {
    id: "JOB-1034",
    propertyAddress: "45 Victoria Square, Birmingham",
    clerkName: "Unassigned",
    date: "2024-03-26T09:30:00Z",
    status: "Unallocated",
    amount: 135.00,
  },
];

export type QA_Report = {
  id: string;
  jobId: string;
  clerkName: string;
  submittedAt: string;
  status: "Pending Review" | "Passed" | "Failed";
  score: number | null;
  itemsFlagged: number;
};

export const DUMMY_QA_REPORTS: QA_Report[] = [
  {
    id: "QA-492",
    jobId: "JOB-1031",
    clerkName: "David Chen",
    submittedAt: "2024-03-24T12:05:00Z",
    status: "Pending Review",
    score: null,
    itemsFlagged: 3,
  },
  {
    id: "QA-491",
    jobId: "JOB-1029",
    clerkName: "Sarah Jenkins",
    submittedAt: "2024-03-24T10:30:00Z",
    status: "Passed",
    score: 98,
    itemsFlagged: 0,
  },
  {
    id: "QA-490",
    jobId: "JOB-1028",
    clerkName: "Emma Watson",
    submittedAt: "2024-03-23T17:15:00Z",
    status: "Failed",
    score: 65,
    itemsFlagged: 12,
  },
  {
    id: "QA-489",
    jobId: "JOB-1025",
    clerkName: "John Smith",
    submittedAt: "2024-03-23T14:20:00Z",
    status: "Pending Review",
    score: null,
    itemsFlagged: 1,
  },
];

export const DUMMY_QA_STATS = [
  { name: "Mon", passed: 12, failed: 2 },
  { name: "Tue", passed: 15, failed: 1 },
  { name: "Wed", passed: 10, failed: 4 },
  { name: "Thu", passed: 18, failed: 0 },
  { name: "Fri", passed: 14, failed: 3 },
  { name: "Sat", passed: 5, failed: 1 },
  { name: "Sun", passed: 4, failed: 0 },
];
