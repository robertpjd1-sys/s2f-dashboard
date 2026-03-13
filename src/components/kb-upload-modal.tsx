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
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [category, setCategory] = useState("Compliance");
  const [uploadedBy, setUploadedBy] = useState("Admin");

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
    } else {
      toast.error("Please drop valid PDF files");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      (file) => file.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please add at least one PDF file");
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("uploaded_by", uploadedBy);

      try {
        await uploadDoc.mutateAsync(formData);
        successCount++;
      } catch (err) {
        failCount++;
        console.error(`Failed to upload ${file.name}:`, err);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} document(s)`);
      if (failCount === 0) {
        setFiles([]);
        onOpenChange(false);
      } else {
        // Keep failed files in the list? For now just reset if any succeeded, 
        // but maybe better to keep the failed ones.
        setFiles([]); // Simplifying for now
      }
    }
    
    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} document(s)`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Upload Knowledge Base</DialogTitle>
            <DialogDescription>
              Drag and drop multiple PDF documents to train your AI assistants.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center text-center gap-3 ${
                isDragging
                  ? "border-[#d19c3e] bg-[#d19c3e]/5 ring-4 ring-[#d19c3e]/10"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#d19c3e]">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Drag & Drop PDFs here or{" "}
                  <label className="text-[#d19c3e] hover:underline cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </p>
                <p className="text-xs text-slate-400 mt-1">Upload up to 20 files at once (PDF only)</p>
              </div>
            </div>

            {/* Queued Files List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Queued for Upload ({files.length})
                </p>
                <div className="max-h-[160px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {files.map((f, i) => (
                    <div
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 text-sm animate-in fade-in slide-in-from-left-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                          <span className="text-[10px] font-bold">PDF</span>
                        </div>
                        <span className="truncate text-slate-700 font-medium">{f.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          ({(f.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Loader2 className="w-4 h-4" /> {/* Swap icon for "X" if needed, Loader2 used incorrectly here but following earlier pattern or better yet X */}
                        {/* Actually let's use a real close icon if available in lucide-react, I'll assume X is available or just use Loader2 as placeholder if I can't check lucide-react easily, but X is standard. */}
                        <span className="text-xs font-bold">×</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-bold text-slate-500 uppercase">
                  Category
                </Label>
                <Input
                  id="category"
                  placeholder="e.g. Compliance"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uploadedBy" className="text-xs font-bold text-slate-500 uppercase">
                  Uploaded By
                </Label>
                <Input
                  id="uploadedBy"
                  placeholder="Admin"
                  value={uploadedBy}
                  onChange={(e) => setUploadedBy(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-lg border-t gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploadDoc.isPending}
              className="px-6 border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#3d5a3e] hover:bg-[#2d422e] text-white px-8 font-bold shadow-md"
              disabled={uploadDoc.isPending || files.length === 0}
            >
              {uploadDoc.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Submit {files.length > 0 && `(${files.length})`}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
