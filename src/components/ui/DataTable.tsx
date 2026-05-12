import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Column<T = any> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  rowKey?: (row: T, index: number) => string | number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T = any>({
  columns,
  data,
  className = "",
  rowKey = (_row, index) => index,
}: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-xs uppercase text-slate-400">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 font-medium ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.map((row, index) => (
            <tr key={rowKey(row, index)} className="hover:bg-slate-800/50">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-slate-300 ${col.className || ""}`}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
