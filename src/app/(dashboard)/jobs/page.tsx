"use client";

import { JobsTable } from "@/components/jobs-table";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">Job Management</h2>
          <p className="text-muted-foreground mt-2">
            Track and allocate property viewing and inspection jobs.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg border bg-white shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold font-serif text-warning">2</div>
          <div className="text-sm font-medium text-muted-foreground mt-1">Unallocated</div>
        </div>
        <div className="p-4 rounded-lg border bg-white shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold font-serif text-primary">1</div>
          <div className="text-sm font-medium text-muted-foreground mt-1">In QA</div>
        </div>
        <div className="p-4 rounded-lg border bg-white shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold font-serif text-foreground">2</div>
          <div className="text-sm font-medium text-muted-foreground mt-1">Assigned & In Progress</div>
        </div>
        <div className="p-4 rounded-lg border bg-white shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold font-serif text-success">1</div>
          <div className="text-sm font-medium text-muted-foreground mt-1">Completed (Today)</div>
        </div>
      </div>

      <JobsTable />
    </div>
  );
}
