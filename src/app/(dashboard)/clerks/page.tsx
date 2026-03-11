"use client";

import { ClerksTable } from "@/components/clerks-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ClerksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">Clerk Management</h2>
          <p className="text-muted-foreground mt-2">
            View, manage, and activate clerks in the system.
          </p>
        </div>
        <div className="flex shrink-0">
          <Button className="bg-[#d19c3e] hover:bg-[#c38c33] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Invite Clerk
          </Button>
        </div>
      </div>

      <ClerksTable />
    </div>
  );
}
