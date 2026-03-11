export type NotificationStatus = "Delivered" | "Pending" | "Failed";

export type OutboundMessage = {
  id: string;
  clerkName: string;
  initials: string;
  preview: string;
  timestamp: string;
  status: NotificationStatus;
};

const clerkNames = [
  "Alice Smith",
  "Bob Johnson",
  "Charlie Brown", 
  "Diana Prince",
  "Eve Davis",
  "Frank Miller",
  "Grace Wilson"
];

const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("");
};

const messagePreviews = [
  "New Job Assignment: Check-out at Flat 4, 10am tomorrow...",
  "Reminder: Self-billing statement for last month is ready...",
  "QA Alert: Please upload missing meter reading photo for...",
  "Compliance Update: EPC rules changing next month...",
  "Welcome! Please complete your phase 1 onboarding...",
  "Job update: Tenant has requested a 30 min delay for...",
  "Weekly Briefing: 5 jobs scheduled this week..."
];

export const dummyOutboundMessages: OutboundMessage[] = Array.from({ length: 20 }).map((_, i) => {
  const name = clerkNames[i % clerkNames.length];
  
  // Mix of statuses, mostly Delivered
  let status: NotificationStatus = "Delivered";
  if (i % 7 === 0) status = "Failed";
  else if (i % 5 === 0) status = "Pending";
  
  // Spread timestamps across today, oldest is latest in array
  const time = new Date();
  time.setMinutes(time.getMinutes() - (i * 24)); // 24 mins apart

  return {
    id: `NT-${4000 + i}`,
    clerkName: name,
    initials: getInitials(name),
    preview: messagePreviews[i % messagePreviews.length],
    timestamp: time.toISOString(),
    status
  };
});
