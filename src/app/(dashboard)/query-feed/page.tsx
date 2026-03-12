"use client";

import { MessageSquare, Bot, AlertCircle } from "lucide-react";
import { useQueriesFeed, useQueryFeedKpis } from "@/lib/queries";
import { QueryFeedTable } from "@/components/query-feed-table";

export default function QueryFeedPage() {
  const { data: kpis } = useQueryFeedKpis();
  const { data: queries, isLoading } = useQueriesFeed();

  const totalQueries = kpis?.totalQueries || 0;
  const resolvedCount = kpis?.resolved || 0;
  const unansweredCount = kpis?.unanswered || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">Query Feed & Auto-Fix</h2>
          <p className="text-muted-foreground mt-2">
            Live clerk queries from Telegram and auto-fix resolutions.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Total
            </h3>
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-slate-900">
              {totalQueries}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Auto-Resolved
            </h3>
            <Bot className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-green-600">
              {resolvedCount}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Needs Attention
            </h3>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-serif font-semibold mt-2 text-amber-600">
              {unansweredCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Layout */}
      <div className="w-full">
        <QueryFeedTable data={queries || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
