"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  MessageSquare, 
  Bot, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Eye,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  dummyQueries, 
  dummyAutoFixLogs,
  ClerkQueryStatus,
  AutoFixLogStatus
} from "@/lib/dummy-queries-data";

export default function QueryFeedPage() {
  const [queries] = useState(dummyQueries);
  const [logs] = useState(dummyAutoFixLogs);

  const getQueryBadge = (status: ClerkQueryStatus) => {
    switch (status) {
      case "Auto-Resolved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Auto-Resolved</Badge>;
      case "Escalated":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Escalated</Badge>;
      case "Pending":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">Pending</Badge>;
    }
  };

  const getLogIcon = (status: AutoFixLogStatus) => {
    switch (status) {
      case "Success":
        return <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 shrink-0" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-600 mt-1 shrink-0" />;
    }
  };

  const totalQueries = queries.length;
  const autoResolvedCount = queries.filter(q => q.status === "Auto-Resolved").length;
  const needsAttentionCount = queries.filter(q => q.status === "Escalated" || q.status === "Pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">Query Feed & Auto-Fix</h2>
          <p className="text-muted-foreground mt-2">
            Live clerk queries from Telegram and AI-powered auto-fix workflow.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">
              Total Queries Today
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
              {autoResolvedCount}
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
              {needsAttentionCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        
        {/* Left Column: Live Query Feed */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#d19c3e]" />
            Live Query Feed
          </h3>
          
          <div className="grid gap-4">
            {queries.map((query) => (
              <div key={query.id} className="p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3 transition-all hover:shadow-md">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-slate-200">
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-medium text-xs">
                        {query.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{query.clerkName}</h4>
                      <div className="text-xs text-slate-500">
                        {format(new Date(query.timestamp), "HH:mm")}
                      </div>
                    </div>
                  </div>
                  {getQueryBadge(query.status)}
                </div>
                
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                  "{query.message}"
                </p>

                <div className="flex justify-end mt-1">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[#3d5a3e] hover:text-[#2d422e]">
                    <Eye className="h-3.5 w-3.5" />
                    View Thread
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Auto-Fix Log */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#3d5a3e]" />
            Auto-Fix Log
          </h3>
          
          <div className="rounded-xl border bg-white shadow-sm divide-y">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  {getLogIcon(log.status)}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-medium text-slate-900 text-sm leading-snug">
                        {log.actionTitle}
                      </h4>
                      <Badge variant="secondary" className="shrink-0 bg-slate-100 text-slate-600 font-mono text-xs">
                        {log.confidenceScore}% conf
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Activity className="h-3 w-3" />
                        Triggered by {log.triggeredBy}
                      </div>
                      <span className="text-xs text-slate-400">
                        {format(new Date(log.timestamp), "HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
