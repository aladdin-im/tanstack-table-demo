'use client'

import type { PaginatedResult, Person } from "@/actions/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { TableFilters } from "./TableFilters"

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => {
      const fullId = info.getValue()
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-mono text-xs cursor-help">
                {/* {fullId.slice(0, 8)}... */}
                {fullId}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono text-xs">{fullId}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    size: 150,
  }),
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
    size: 120,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    size: 120,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
    size: 200,
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    cell: (info) => info.getValue(),
    size: 150,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    size: 80,
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    size: 80,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 150,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    cell: (info) => (
      <div className="flex items-center gap-2 min-w-[200px]">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${info.getValue()}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 whitespace-nowrap">{info.getValue()}%</span>
      </div>
    ),
    size: 220,
  }),
  columnHelper.accessor('city', {
    header: 'City',
    cell: (info) => info.getValue(),
    size: 150,
  }),
  columnHelper.accessor('country', {
    header: 'Country',
    cell: (info) => info.getValue(),
    size: 150,
  }),
  columnHelper.accessor('company', {
    header: 'Company',
    cell: (info) => info.getValue(),
    size: 180,
  }),
  columnHelper.accessor('jobTitle', {
    header: 'Job Title',
    cell: (info) => info.getValue(),
    size: 180,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => {
      const date = new Date(info.getValue())
      return date.toISOString().split('T')[0] // YYYY-MM-DD 格式
    },
    size: 120,
  }),
]

type DataTableProps = {
  response: PaginatedResult<Person>
}

export function DataTable({ response }: DataTableProps) {
  const { items: data } = response

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // 告诉 TanStack Table 我们手动控制分页
    initialState: {
      columnVisibility: {
        id: false,
        city: false,       // 默认隐藏
        country: false,    // 默认隐藏
        company: false,    // 默认隐藏
        jobTitle: false,   // 默认隐藏
        // createdAt: false,  // 默认隐藏
      },
    },
  })

  // 动态计算可见列的总宽度
  const totalWidth = table.getVisibleFlatColumns().reduce((sum, column) => {
    return sum + column.getSize()
  }, 0)

  return (
    <div className="space-y-4">
      {/* 过滤器 */}
      <TableFilters table={table} />

      {/* 表格 - 添加横向滚动 */}
      <div className="rounded-md border overflow-x-auto w-fit max-w-full">
        <Table style={{ tableLayout: 'fixed', width: `${totalWidth}px` }}>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold"
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
                  <TableCell
                    key={cell.id}
                    style={{ width: `${cell.column.getSize()}px` }}
                    className="truncate"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

