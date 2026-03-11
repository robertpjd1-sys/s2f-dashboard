"use client";

import { useState } from "react";
import { KbTable } from "@/components/kb-table";
import { KbUploadModal } from "@/components/kb-upload-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function KnowledgeBasePage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground mt-2">
            Upload and manage training documents for the AI clerk assistant.
          </p>
        </div>
        <div className="flex shrink-0">
          <Button 
            className="bg-[#d19c3e] hover:bg-[#c38c33] text-white"
            onClick={() => setIsUploadOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      <KbTable />
      
      <KbUploadModal open={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </div>
  );
}
