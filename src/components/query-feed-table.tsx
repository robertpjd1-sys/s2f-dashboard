"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { MessageSquareWarning, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Bot } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { Database } from "@/lib/database.types";
import { useResolveQuery } from "@/lib/mutations";

const stripMarkdown = (str: string | null | undefined) => {
  if (!str) return '';
  return str
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/~~(.*?)~~/g, '$1') // strikethrough
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/^#+\s+/gm, '') // headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // images
    .replace(/^\s*>\s+/gm, ''); // blockquotes
};

type QueryRow = Database["public"]["Tables"]["unanswered_queries"]["Row"];

interface QueryFeedTableProps {
  data: QueryRow[];
  isLoading: boolean;
}

export function QueryFeedTable({ data, isLoading }: QueryFeedTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");
  const { mutate: resolveQuery, isPending: isResolving } = useResolveQuery();

  const handleResolveOpen = (id: string, currentText?: string | null, aiDraft?: string | null) => {
    console.log("handleResolveOpen aiDraft:", aiDraft);
    setResolvingId(id);
    setResolutionText(currentText || aiDraft || "");
  };

  const handleResolveSubmit = () => {
    if (!resolvingId) return;
    resolveQuery(
      { id: resolvingId, resolution: resolutionText },
      {
        onSuccess: () => {
          setResolvingId(null);
          setResolutionText("");
        },
      }
    );
  };

  const currentFilter = (columnFilters.find((f) => f.id === "status")?.value as string) ?? "all";

  const columns: ColumnDef<QueryRow>[] = [
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 max-w-[400px]">
          <span className="font-medium text-slate-900">{row.original.question}</span>
          {row.original.status === "resolved" && row.original.resolution && (
            <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md mt-1 border border-slate-100 flex items-start gap-2">
              <Bot className="h-3.5 w-3.5 mt-0.5 text-green-600 shrink-0" />
              <span>{stripMarkdown(row.original.resolution)}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "asked_by",
      header: "Asked By",
      cell: ({ row }) => (
        <div className="font-medium">@{row.getValue("asked_by")}</div>
      ),
    },
    {
      accessorKey: "asked_at",
      header: "Date",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-slate-500">
            {format(new Date(row.getValue("asked_at")), "MMM d, yyyy HH:mm")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === value;
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        if (status === "resolved") {
          return (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Resolved
            </Badge>
          );
        }
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">
            <MessageSquareWarning className="mr-1 h-3 w-3" />
            Unanswered
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isResolved = row.original.status === "resolved";
        return (
          <div className="flex justify-end pr-4">
            <Button
              variant={isResolved ? "ghost" : "default"}
              size="sm"
              className={isResolved ? "text-slate-500" : "bg-[#3d5a3e] hover:bg-[#2d422e] text-white"}
              onClick={() => handleResolveOpen(row.original.id, row.original.resolution, row.original.ai_draft)}
              disabled={isResolved && !row.original.resolution}
            >
              {isResolved ? (row.original.resolution ? "Edit Note" : "Resolved") : "Resolve"}
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-xl bg-white shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <Button
          variant={currentFilter === "all" ? "default" : "outline"}
          size="sm"
          className={currentFilter === "all" ? "bg-slate-800 hover:bg-slate-700" : ""}
          onClick={() => table.getColumn("status")?.setFilterValue("all")}
        >
          All
        </Button>
        <Button
          variant={currentFilter === "unanswered" ? "default" : "outline"}
          size="sm"
          className={currentFilter === "unanswered" ? "bg-amber-600 hover:bg-amber-700" : ""}
          onClick={() => table.getColumn("status")?.setFilterValue("unanswered")}
        >
          Unanswered
        </Button>
        <Button
          variant={currentFilter === "resolved" ? "default" : "outline"}
          size="sm"
          className={currentFilter === "resolved" ? "bg-green-600 hover:bg-green-700" : ""}
          onClick={() => table.getColumn("status")?.setFilterValue("resolved")}
        >
          Resolved
        </Button>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground p-8">
                  No queries yet — clerk bot queries will appear here.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={!!resolvingId} onOpenChange={(open) => !open && setResolvingId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Resolve Query</DialogTitle>
            <DialogDescription>
              Mark this query as resolved. Optionally, add a note detailing the resolution or auto-fix action taken.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="e.g. Advised the clerk to check the updated tenancy agreement..."
              value={resolutionText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResolutionText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolvingId(null)} disabled={isResolving}>
              Cancel
            </Button>
            <Button onClick={handleResolveSubmit} disabled={isResolving} className="bg-[#3d5a3e] hover:bg-[#2d422e]">
              {isResolving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
