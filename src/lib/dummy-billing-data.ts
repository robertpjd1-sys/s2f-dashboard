export type SelfBillingStatement = {
  id: string;
  clerkName: string;
  jobsCompleted: number;
  totalAmount: number;
  period: string;
  status: "Paid" | "Pending" | "Processing";
};

// Seed random generation for dummy data
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const clerkNames = [
  "Alice Smith",
  "Bob Johnson",
  "Charlie Brown",
  "Diana Prince",
  "Eve Davis",
  "Frank Miller",
  "Grace Wilson",
  "Harry Taylor",
  "Ivy Moore",
  "Jack Anderson"
];

const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

export function generateBillingData(monthFilter?: string, clerkFilter?: string): SelfBillingStatement[] {
  const data: SelfBillingStatement[] = [];
  
  // Generate 20 random statements
  for (let i = 0; i < 20; i++) {
    const jobs = randomBetween(5, 45);
    const amount = jobs * randomBetween(80, 110);
    const statuses: ("Paid" | "Pending" | "Processing")[] = ["Paid", "Pending", "Processing", "Paid", "Paid"];
    
    data.push({
      id: `INV-${1000 + i}`,
      clerkName: clerkNames[i % clerkNames.length],
      jobsCompleted: jobs,
      totalAmount: amount,
      // Mostly current month, some previous months
      period: i < 15 ? currentMonth : "February 2026", 
      status: statuses[randomBetween(0, statuses.length - 1)]
    });
  }

  // Apply filters if provided
  return data.filter(statement => {
    let match = true;
    if (monthFilter && monthFilter !== "all" && statement.period !== monthFilter) {
      match = false;
    }
    if (clerkFilter && clerkFilter !== "all" && statement.clerkName !== clerkFilter) {
      match = false;
    }
    return match;
  });
}
