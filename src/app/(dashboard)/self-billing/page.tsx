"use client";

import { useState, useMemo, useEffect } from "react";
import { generateBillingData } from "@/lib/dummy-billing-data";
import { SelfBillingTable } from "@/components/self-billing-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DownloadCloud, PoundSterling, FileText, Users } from "lucide-react";
import { toast } from "sonner";

export default function SelfBillingPage() {
  const currentMonthStr = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const [month, setMonth] = useState<string>(currentMonthStr);
  const [clerk, setClerk] = useState<string>("all");
  
  // Seed random data consistently via useEffect state so it only runs once per render
  // In a real app this would just be a React Query hook reading from Supabase
  const [rawDbData, setRawDbData] = useState(generateBillingData("all", "all"));

  useEffect(() => {
    // Regenerate once client-side to ensure hydration matches and to grab current month
    setRawDbData(generateBillingData("all", "all"));
  }, []);

  // Compute filtered table data
  const statements = useMemo(() => {
    return rawDbData.filter(stmt => {
      let matchesMonth = true;
      let matchesClerk = true;
      
      if (month !== "all" && stmt.period !== month) matchesMonth = false;
      if (clerk !== "all" && stmt.clerkName !== clerk) matchesClerk = false;

      return matchesMonth && matchesClerk;
    });
  }, [rawDbData, month, clerk]);

  // Derived summaries based on filtered or unfiltered base
  const summary = useMemo(() => {
    const currentMonthData = rawDbData.filter(s => s.period === currentMonthStr);
    const paidThisMonth = currentMonthData
      .filter(s => s.status === "Paid")
      .reduce((sum, item) => sum + item.totalAmount, 0);
    
    const pendingTotal = rawDbData.filter(s => s.status === "Pending").length;
    const activeClerksThisMonth = new Set(currentMonthData.map(s => s.clerkName)).size;

    return {
      paidThisMonth,
      pendingTotal,
      activeClerksThisMonth
    };
  }, [rawDbData, currentMonthStr]);

  // Unique lists for Select filters
  const availableMonths = useMemo(() => {
    const months = new Set(rawDbData.map(s => s.period));
    return Array.from(months);
  }, [rawDbData]);
  
  const availableClerks = useMemo(() => {
    const clerks = new Set(rawDbData.map(s => s.clerkName));
    return Array.from(clerks).sort();
  }, [rawDbData]);

  const handleExportCsv = () => {
    toast.success("Exporting filtered statements to CSV...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">Self-Billing</h2>
          <p className="text-muted-foreground mt-2">
            Generate and manage self-billing statements for clerks.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Paid This Month */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Total Paid This Month
            </h3>
            <PoundSterling className="h-4 w-4 text-[#3d5a3e]" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-slate-900">
              £{summary.paidThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Pending Statements */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Pending Statements
            </h3>
            <FileText className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-slate-900">
              {summary.pendingTotal}
            </div>
          </div>
        </div>

        {/* Clerks Active This Month */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Clerks Active This Month
            </h3>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-slate-900">
              {summary.activeClerksThisMonth}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-muted/40 p-4 rounded-xl border">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={month} onValueChange={(v) => { if(v) setMonth(v); }}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              {availableMonths.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={clerk} onValueChange={(v) => { if(v) setClerk(v); }}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="All Clerks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clerks</SelectItem>
              {availableClerks.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="bg-[#d19c3e] hover:bg-[#c38c33] text-white"
          onClick={handleExportCsv}
        >
          <DownloadCloud className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Main Data Table */}
      <SelfBillingTable data={statements} />

    </div>
  );
}
