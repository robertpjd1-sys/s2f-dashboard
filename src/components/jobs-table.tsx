"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DUMMY_JOBS, Job } from "@/lib/dummy-data";
import { format } from "date-fns";
import { ArrowUpDown, MapPin, Calendar, PoundSterling } from "lucide-react";

export function JobsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "id",
      header: "Job ID",
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "propertyAddress",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-transparent"
          >
            Property
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center font-medium">
          <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate max-w-[200px]">{row.getValue("propertyAddress")}</span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("date") as string;
        return (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-3.5 w-3.5" />
            {format(new Date(dateStr), "MMM d, yyyy HH:mm")}
          </div>
        );
      },
    },
    {
      accessorKey: "clerkName",
      header: "Assigned To",
      cell: ({ row }) => {
        const name = row.getValue("clerkName") as string;
        if (name === "Unassigned") return <span className="text-muted-foreground italic">Unassigned</span>;
        return name;
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        return (
          <div className="flex items-center">
            <PoundSterling className="mr-1 h-3 w-3 text-muted-foreground" />
            {(amount).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        if (status === "Completed") return <Badge className="bg-success">{status}</Badge>;
        if (status === "Unallocated") return <Badge variant="secondary" className="bg-warning/20 border-warning/30 text-warning-foreground">{status}</Badge>;
        if (status === "In QA") return <Badge variant="outline" className="border-primary text-primary">{status}</Badge>;
        if (status === "In Progress") return <Badge className="bg-primary/80">{status}</Badge>;
        if (status === "Assigned") return <Badge variant="secondary">{status}</Badge>;
        if (status === "Cancelled") return <Badge variant="destructive">{status}</Badge>;
        return <Badge variant="outline">{status}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isUnassigned = row.original.clerkName === "Unassigned";
        return (
          <div className="flex justify-end gap-2">
            {isUnassigned ? (
              <Button size="sm" className="bg-[#d19c3e] hover:bg-[#c38c33] text-white">
                Assign
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                Details
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: DUMMY_JOBS,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search properties or clerks..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm bg-white"
        />
      </div>
      
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
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
