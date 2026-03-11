"use client";

import { useState } from "react";
import { useUploadKbDoc } from "@/lib/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";

interface KbUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KbUploadModal({ open, onOpenChange }: KbUploadModalProps) {
  const uploadDoc = useUploadKbDoc();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }
    if (!category.trim() || !uploadedBy.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("uploaded_by", uploadedBy);

    uploadDoc.mutate(formData, {
      onSuccess: () => {
        toast.success("Document uploaded successfully");
        setFile(null);
        setCategory("");
        setUploadedBy("");
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to upload document");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Upload Document</DialogTitle>
            <DialogDescription>
              Upload a training or compliance PDF for the AI assistant to learn from.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File (PDF)
              </Label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                className="col-span-3 cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={uploadDoc.isPending}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                placeholder="e.g. Compliance, SOP"
                className="col-span-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={uploadDoc.isPending}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="uploadedBy" className="text-right">
                Uploaded By
              </Label>
              <Input
                id="uploadedBy"
                placeholder="Manager Name"
                className="col-span-3"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                disabled={uploadDoc.isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploadDoc.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#d19c3e] hover:bg-[#c38c33] text-white"
              disabled={uploadDoc.isPending}
            >
              {uploadDoc.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
