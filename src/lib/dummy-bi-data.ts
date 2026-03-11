import { subDays, format, startOfMonth, startOfWeek } from "date-fns";

export type BiDataPoint = {
  date: string;       // Formatted string for X-axis
  revenue: number;    // £
  jobs: number;       // Count
  profitMargin: number; // Percentage 0-100
};

export type BiSummary = {
  revenue: number;
  jobs: number;
  profit: number; // Net profit £
};

export type BiDataset = {
  summary: BiSummary;
  chartData: BiDataPoint[];
};

// Seed random generation for dummy data stability
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export function generateBiData(range: "30d" | "3m" | "6m"): BiDataset {
  const dataPoints = [];
  let numItems = 0;
  let summary = { revenue: 0, jobs: 0, profit: 0 };
  let dateScale: "daily" | "weekly" | "monthly" = "monthly";

  if (range === "30d") {
    numItems = 30;
    dateScale = "daily";
  } else if (range === "3m") {
    numItems = 12; // 12 weeks
    dateScale = "weekly";
  } else if (range === "6m") {
    numItems = 6;  // 6 months
    dateScale = "monthly";
  }

  const today = new Date();

  for (let i = numItems - 1; i >= 0; i--) {
    let pointDate = new Date();
    let dateFormat = "";

    if (dateScale === "daily") {
      pointDate = subDays(today, i);
      dateFormat = format(pointDate, "MMM dd");
    } else if (dateScale === "weekly") {
      pointDate = subDays(startOfWeek(today), i * 7);
      dateFormat = format(pointDate, "MMM dd"); // week of
    } else if (dateScale === "monthly") {
      pointDate = startOfMonth(subDays(today, i * 30));
      dateFormat = format(pointDate, "MMM yyyy");
    }

    const jobs = dateScale === "daily" ? randomBetween(5, 20) : dateScale === "weekly" ? randomBetween(35, 140) : randomBetween(150, 600);
    const revenue = jobs * randomBetween(80, 120); // Average £100 per job
    const profitMargin = randomBetween(25, 45); // 25-45% profit margin

    dataPoints.push({
      date: dateFormat,
      revenue,
      jobs,
      profitMargin,
    });
  }

  // Summary is just for "this month" conceptually as per requirements
  // To keep it simple, we'll generate realistic "Current Month" stats regardless of range, 
  // or aggregate the most recent period to represent "this month"
  summary = {
    revenue: randomBetween(35000, 50000),
    jobs: randomBetween(300, 450),
    profit: randomBetween(12000, 20000),
  };

  return {
    summary,
    chartData: dataPoints,
  };
}
