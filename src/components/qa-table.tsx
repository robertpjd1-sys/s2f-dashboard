"use client";

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
import { Badge } from "@/components/ui/badge";
import { DUMMY_QA_REPORTS, QA_Report } from "@/lib/dummy-data";
import { formatDistanceToNow } from "date-fns";
import { CopyCheck, FileText, User } from "lucide-react";

export function QaTable() {
  const columns: ColumnDef<QA_Report>[] = [
    {
      accessorKey: "id",
      header: "Report ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-mono text-xs">
          <FileText className="h-3 w-3 text-muted-foreground" />
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "jobId",
      header: "Job Ref",
      cell: ({ row }) => <span className="font-medium">{row.getValue("jobId")}</span>,
    },
    {
      accessorKey: "clerkName",
      header: "Clerk",
      cell: ({ row }) => (
        <div className="flex items-center text-sm">
          <User className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          {row.getValue("clerkName")}
        </div>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: "Submitted",
      cell: ({ row }) => {
        const dateStr = row.getValue("submittedAt") as string;
        return (
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(dateStr), { addSuffix: true })}
          </span>
        );
      },
    },
    {
      accessorKey: "itemsFlagged",
      header: "Flags",
      cell: ({ row }) => {
        const count = row.getValue("itemsFlagged") as number;
        return (
          <Badge variant={count > 0 ? "secondary" : "outline"} className={count > 0 ? "bg-warning/20 text-warning-foreground" : ""}>
            {count} issue{count !== 1 ? "s" : ""}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        if (status === "Passed") return <Badge className="bg-success">{status}</Badge>;
        if (status === "Failed") return <Badge variant="destructive">{status}</Badge>;
        return <Badge variant="outline" className="border-primary text-primary bg-primary/5 hover:bg-primary/10">{status}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isPending = row.original.status === "Pending Review";
        return (
          <div className="flex justify-end gap-2">
            {isPending ? (
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <CopyCheck className="mr-2 h-4 w-4" />
                Review
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                View Report
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: DUMMY_QA_REPORTS,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
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
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No QA reports found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
