"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
import { SelfBillingStatement } from "@/lib/dummy-billing-data";
import { DownloadCloud, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

interface SelfBillingTableProps {
  data: SelfBillingStatement[];
}

export function SelfBillingTable({ data }: SelfBillingTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const handleDownloadPdf = (id: string, clerkName: string) => {
    toast.success(`Downloading PDF statement for ${clerkName}...`);
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Invoice ID",
      cell: ({ row }: any) => (
        <span className="font-mono text-xs font-medium text-slate-500">
          {row.getValue("id")}
        </span>
      ),
    },
    {
      accessorKey: "clerkName",
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent text-sm font-semibold"
        >
          Clerk Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: any) => (
        <span className="font-medium text-slate-900">
          {row.getValue("clerkName")}
        </span>
      ),
    },
    {
      accessorKey: "period",
      header: "Period",
    },
    {
      accessorKey: "jobsCompleted",
      header: "Jobs Completed",
      cell: ({ row }: any) => (
        <span className="font-medium text-slate-700">
          {row.getValue("jobsCompleted")}
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: () => <div className="text-right">Total Amount</div>,
      cell: ({ row }: any) => {
        const amount = parseFloat(row.getValue("totalAmount")).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return <div className="text-right font-medium">£{amount}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") as string;
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        let colorClass = "";

        if (status === "Paid") {
          variant = "default";
          colorClass = "bg-green-100 text-green-700 hover:bg-green-200 border-none";
        } else if (status === "Pending") {
          variant = "secondary";
          colorClass = "bg-amber-100 text-amber-700 hover:bg-amber-200 border-none";
        } else {
          variant = "outline";
          colorClass = "bg-blue-50 text-blue-700 border-blue-200";
        }

        return (
          <Badge variant={variant} className={colorClass}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const doc = row.original;
        return (
          <div className="flex justify-end pr-4">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => handleDownloadPdf(doc.id, doc.clerkName)}
            >
              <DownloadCloud className="h-3.5 w-3.5" />
              PDF
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
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  if (!data || data.length === 0) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-center border rounded-md bg-white border-dashed">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-serif font-medium text-foreground mb-1">
          No statements found.
        </h3>
        <p className="text-sm text-muted-foreground">
          There are no billing records matching the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
      
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} statements
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// Temporary icon import fallback
import { FileText } from "lucide-react";
