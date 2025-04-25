import type { ReactNode } from "react"

interface Column {
  id: string
  header: ReactNode
  cell: (item: any) => ReactNode
  className?: string
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  emptyMessage?: string
}

export function DataTable({ columns, data, emptyMessage = "No data found." }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <div
        className="grid border-b bg-muted/50 p-3 text-sm font-medium"
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
      >
        {columns.map((column) => (
          <div key={column.id} className={column.className}>
            {column.header}
          </div>
        ))}
      </div>
      <div className="divide-y">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={index}
              className="grid items-center p-3"
              style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
            >
              {columns.map((column) => (
                <div key={column.id} className={column.className}>
                  {column.cell(item)}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">{emptyMessage}</div>
        )}
      </div>
    </div>
  )
}
