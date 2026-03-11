"use client";

import { useDashboardKpis } from "@/lib/queries";
import { KpiCard } from "@/components/kpi-card";
import { Users, UserPlus, FileText, Database, ArrowRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MorningBriefingPage() {
  const { data, isLoading, isError } = useDashboardKpis();

  // Traffic light system simple logic
  const hasAlerts = (data?.pendingClerks || 0) > 0;

  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h2 className="text-xl font-semibold">Failed to load briefing</h2>
        <p className="text-muted-foreground">Please check your connection and try again.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-semibold tracking-tight">Morning Briefing</h2>
        <p className="text-muted-foreground mt-2">
          Your daily overview of operations and alerts.
        </p>
      </div>

      {/* Traffic Light & Alerts Area */}
      {hasAlerts ? (
        <Card className="border-l-4 border-l-warning bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-warning animate-pulse" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {(data?.pendingClerks || 0) > 0 && (
                <div className="flex items-center justify-between text-sm bg-white p-3 rounded-md border shadow-sm">
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-4 w-4 text-warning" />
                    <span className="font-medium">{data?.pendingClerks || 0} clerk(s) pending activation</span>
                  </div>
                  <Link href="/clerks">
                    <Button size="sm" variant="secondary">
                      Manage <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
              {/* Other alerts (Overdue jobs, etc) would go here in Phase 2 */}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-l-4 border-l-success bg-success/5">
           <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="font-medium text-sm">All systems nominal. No immediate actions required today.</span>
            </div>
           </CardContent>
        </Card>
      )}

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Active Clerks"
          value={data?.activeClerks || 0}
          icon={Users}
          description="Fully onboarded clerks"
          isLoading={isLoading}
        />
        <KpiCard
          title="Pending Activations"
          value={data?.pendingClerks || 0}
          icon={UserPlus}
          description="Awaiting your approval"
          isLoading={isLoading}
        />
        <KpiCard
          title="Total Documents"
          value={data?.totalDocuments || 0}
          icon={FileText}
          description="In knowledge base"
          isLoading={isLoading}
        />
        <KpiCard
          title="Knowledge Chunks"
          value={data?.totalChunks || 0}
          icon={Database}
          description="Vector embeddings for AI"
          isLoading={isLoading}
        />
      </div>

      {/* Phase 2 Mock Data sections for structure */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity Overview</CardTitle>
            <CardDescription>
              Jobs completed and QA metrics will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md text-muted-foreground text-sm">
              Chart (Phase 2)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to start your day.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/kb" className="w-full">
              <Button className="w-full justify-start text-left" variant="outline">
                Upload to Knowledge Base
              </Button>
            </Link>
            <Link href="/billing" className="w-full">
              <Button className="w-full justify-start text-left" variant="outline">
                Run Self-Billing Statements
              </Button>
            </Link>
            <Link href="/jobs" className="w-full">
              <Button className="w-full justify-start text-left" variant="outline">
                View Unallocated Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
