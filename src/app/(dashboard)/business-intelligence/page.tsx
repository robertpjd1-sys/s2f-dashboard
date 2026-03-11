"use client";

import { useState, useMemo } from "react";
import { generateBiData } from "@/lib/dummy-bi-data";
import {
  RevenueBarChart,
  JobsVolumeLineChart,
  ProfitMarginLineChart,
} from "@/components/bi-charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PoundSterling, Briefcase, TrendingUp } from "lucide-react";

export default function BusinessIntelligencePage() {
  const [range, setRange] = useState<"30d" | "3m" | "6m">("6m");

  // Re-generate dummy data when range changes
  const { summary, chartData } = useMemo(() => generateBiData(range), [range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">Business Intelligence</h2>
          <p className="text-muted-foreground mt-2">
            Revenue, volume, and profit overview.
          </p>
        </div>
        <div className="flex shrink-0 w-48">
          <Select 
            value={range} 
            onValueChange={(val) => { if (val) setRange(val as "30d" | "3m" | "6m"); }}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Revenue */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Total Revenue
            </h3>
            <PoundSterling className="h-4 w-4 text-[#d19c3e]" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-slate-900">
              £{summary.revenue.toLocaleString()}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">This month</p>
        </div>

        {/* Total Jobs */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Total Jobs
            </h3>
            <Briefcase className="h-4 w-4 text-[#d19c3e]" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-slate-900">
              {summary.jobs.toLocaleString()}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">This month</p>
        </div>

        {/* Net Profit */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Net Profit
            </h3>
            <TrendingUp className="h-4 w-4 text-[#d19c3e]" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-slate-900">
              £{summary.profit.toLocaleString()}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">This month</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-serif text-lg font-semibold mb-6">Revenue Trend</h3>
          <RevenueBarChart data={chartData} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-semibold mb-6">Jobs Volume</h3>
            <JobsVolumeLineChart data={chartData} />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-semibold mb-6">Profit Margin</h3>
            <ProfitMarginLineChart data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
