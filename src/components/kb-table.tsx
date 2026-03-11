"use client";

import { useState } from "react";
import { useKnowledgeBaseDocs, KbDocument } from "@/lib/queries";
import { useDeleteKbDoc } from "@/lib/mutations";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { FileText, Loader2, Trash2, FolderOpen } from "lucide-react";
import { toast } from "sonner";

function formatFileSize(bytes: number): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function KbTable() {
  const { data: docs, isLoading, isError } = useKnowledgeBaseDocs();
  const deleteDoc = useDeleteKbDoc();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const confirmDelete = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const executeDelete = () => {
    if (!deleteId) return;
    deleteDoc.mutate({ doc_id: deleteId }, {
      onSuccess: () => {
        toast.success("Document deleted");
        setDeleteId(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete document");
        setDeleteId(null);
      },
    });
  };

  const columns: ColumnDef<KbDocument>[] = [
    {
      accessorKey: "filename",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center font-medium">
          <FileText className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate max-w-[300px]" title={row.getValue("filename")}>
            {row.getValue("filename")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "file_size",
      header: "Size",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatFileSize(row.getValue("file_size"))}
        </span>
      ),
    },
    {
      accessorKey: "uploaded_at",
      header: "Date Added",
      cell: ({ row }) => {
        const dateStr = row.getValue("uploaded_at") as string;
        if (!dateStr) return <span className="text-muted-foreground">-</span>;
        return (
          <span className="text-sm text-muted-foreground">
            {format(new Date(dateStr), "MMM d, yyyy")}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const doc = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              size="sm"
              className="h-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-transparent"
              onClick={() => confirmDelete(String(doc.id), doc.filename)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: docs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive border rounded-md bg-destructive/5">
        Failed to load knowledge base documents. Check the API configuration.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-muted-foreground border rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-[#d19c3e] mb-4" />
        <p>Loading documents...</p>
      </div>
    );
  }

  if (docs && docs.length === 0) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-center border rounded-md bg-white border-dashed">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-serif font-medium text-foreground mb-1">
          No documents uploaded yet.
        </h3>
        <p className="text-sm text-muted-foreground">
          Click Upload Document to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{deleteName}</span>?
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteDoc.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={executeDelete}
              disabled={deleteDoc.isPending}
            >
              {deleteDoc.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
