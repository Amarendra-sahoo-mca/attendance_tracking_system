import { useState } from "react";
import {flexRender,getCoreRowModel,useReactTable,getSortedRowModel,SortingState,ColumnDef,
} from "@tanstack/react-table";

type TableComponentProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  sortable?: boolean; // Enable/Disable sorting
  navigateTo?: (row: T) => string | null; // Function to return navigation path
};

import { useRouter } from "next/navigation";

function TableComponent<T>({ data, columns, sortable = true, navigateTo }: TableComponentProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter(); // ✅ use Next.js router

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={sortable ? header.column.getToggleSortingHandler() : undefined}
                    className={`px-4 py-1 text-center font-semibold text-white capitalize ${
                      sortable ? "cursor-pointer hover:bg-gray-200 hover:text-black transition-all" : ""
                    }`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {sortable && (header.column.getIsSorted() === "asc" ? " 🔼" : "")}
                    {sortable && (header.column.getIsSorted() === "desc" ? " 🔽" : "")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const navigatePath = navigateTo ? navigateTo(row.original) : null;

              return (
                <tr
                  key={row.id}
                  className={`border-b transition-all duration-200 text-center ${
                    navigatePath ? "cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (navigatePath) {
                      router.push(navigatePath); // ✅ navigate on click
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-1 text-gray-700 dark:text-white">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default TableComponent;
