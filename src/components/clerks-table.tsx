"use client";

import { useState } from "react";
import { useClerks } from "@/lib/queries";
import { useActivateClerk } from "@/lib/mutations";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Database } from "@/lib/database.types";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown, Mail, CheckCircle, Clock } from "lucide-react";

type Clerk = Database["public"]["Tables"]["clerks"]["Row"];

export function ClerksTable() {
  const { data: clerks, isLoading, isError } = useClerks();
  const activateMutation = useActivateClerk();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const handleActivate = (clerk: Clerk) => {
    toast.promise(
      activateMutation.mutateAsync({ id: clerk.id, email: clerk.email }),
      {
        loading: `Sending activation email to ${clerk.full_name}...`,
        success: `Activation logic triggered for ${clerk.full_name}`,
        error: "Failed to activate clerk. Please try again.",
      }
    );
  };

  const columns: ColumnDef<Clerk>[] = [
    {
      accessorKey: "full_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-transparent"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.getValue("full_name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center text-muted-foreground">
          <Mail className="mr-2 h-3.5 w-3.5" />
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => row.getValue("location") || <span className="text-muted-foreground italic">Not set</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        if (status === "Active") return <Badge className="bg-success">{status}</Badge>;
        if (status === "Pending Registration") return <Badge variant="secondary" className="bg-warning/20 text-warning-foreground border-warning/30 hover:bg-warning/30">{status}</Badge>;
        if (status === "Activation Sent") return <Badge variant="outline" className="text-primary border-primary">{status}</Badge>;
        if (status === "Deactivated") return <Badge variant="destructive">{status}</Badge>;
        return <Badge variant="outline">{status}</Badge>;
      },
    },
    {
      accessorKey: "last_active",
      header: "Last Active",
      cell: ({ row }) => {
        const date = row.getValue("last_active") as string | null;
        if (!date) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const clerk = row.original;
        const isPending = clerk.status === "Pending Registration";
        
        return (
          <div className="flex justify-end gap-2">
            {isPending ? (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleActivate(clerk)}
                disabled={activateMutation.isPending}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable<Clerk>({
    data: clerks || ([] as Clerk[]),
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

  if (isError) {
    return <div className="p-4 rounded-md border text-destructive">Failed to load clerks table.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search clerks..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        {/* Bulk actions / column toggles would go here */}
      </div>
      
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((c, j) => (
                    <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
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
                  No clerks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
}
