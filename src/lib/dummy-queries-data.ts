export type ClerkQueryStatus = "Auto-Resolved" | "Pending" | "Escalated";

export type ClerkQuery = {
  id: string;
  clerkName: string;
  initials: string;
  message: string;
  timestamp: string;
  status: ClerkQueryStatus;
};

export type AutoFixLogStatus = "Success" | "Failed";

export type AutoFixLog = {
  id: string;
  actionTitle: string;
  triggeredBy: string;
  confidenceScore: number;
  timestamp: string;
  status: AutoFixLogStatus;
};

const clerkNames = [
  "Alice Smith",
  "Bob Johnson",
  "Charlie Brown", 
  "Diana Prince",
  "Frank Miller"
];

const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("");
};

const queryMessages = [
  "How do I record extensive damp in the master bedroom?",
  "What condition rating should I use for heavily scuffed hallway walls?",
  "The smart meter is locked inside a cupboard, how to proceed?",
  "Tenant is present during check-out but refusing to sign, advice?",
  "Can't locate the stopcock in this apartment block.",
  "Do I need to test every single smoke alarm if there are 10?",
  "Oven is professionally cleaned but has burnt-on carbon on the top rack.",
  "There's a strong smell of pets but no visible damage, how to word this?",
  "Unable to access the shed, padlock is rusted shut."
];

export const dummyQueries: ClerkQuery[] = Array.from({ length: 15 }).map((_, i) => {
  const name = clerkNames[i % clerkNames.length];
  const statuses: ClerkQueryStatus[] = ["Auto-Resolved", "Auto-Resolved", "Pending", "Escalated", "Auto-Resolved"];
  
  // Spread timestamps across today
  const time = new Date();
  time.setMinutes(time.getMinutes() - (i * 22));

  return {
    id: `QY-${5000 + i}`,
    clerkName: name,
    initials: getInitials(name),
    message: queryMessages[i % queryMessages.length],
    timestamp: time.toISOString(),
    status: statuses[i % statuses.length]
  };
});

const actionTitles = [
  "Sent 'Damp & Mould Assessment Guide' PDF",
  "Recommended Condition Rating 4 (Fair/Poor)",
  "Escalated to human supervisor",
  "Sent 'Dispute Resolution Protocol' snippet",
  "Searched previous property reports for stopcock location",
  "Sent 'Compliance Testing Checklist' PDF",
  "Drafted suggested wording for carbon buildup",
  "Drafted suggested wording for pet odors without damage",
  "Logged access issue and notified property manager automatically"
];

export const dummyAutoFixLogs: AutoFixLog[] = Array.from({ length: 10 }).map((_, i) => {
  const name = clerkNames[(i + 1) % clerkNames.length];
  const statuses: AutoFixLogStatus[] = ["Success", "Success", "Success", "Failed", "Success"];
  
  // Spread timestamps across today
  const time = new Date();
  time.setMinutes(time.getMinutes() - (i * 35));

  return {
    id: `AF-${8000 + i}`,
    actionTitle: actionTitles[i % actionTitles.length],
    triggeredBy: name,
    confidenceScore: Math.floor(Math.random() * (98 - 75 + 1) + 75), // 75% to 98%
    timestamp: time.toISOString(),
    status: statuses[i % statuses.length]
  };
});
