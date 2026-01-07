'use client'

import type { Person } from "@/actions/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table } from "@tanstack/react-table"
import { Search, Settings2, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

type TableFiltersProps = {
  table?: Table<Person>
}

export function TableFilters({ table }: TableFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const query = searchParams.get('query') || ''
  const status = searchParams.get('status') || 'all'
  const sortField = searchParams.get('sort') || 'createdAt'
  const sortOrder = searchParams.get('order') || 'desc'

  // 本地 state 管理搜索框输入值
  const [searchValue, setSearchValue] = useState(query)

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (searchValue) {
      params.set('query', searchValue)
    } else {
      params.delete('query')
    }

    // 重置为第一页
    params.delete('page')

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== 'all') {
      params.set('status', value)
    } else {
      params.delete('status')
    }

    // 重置为第一页
    params.delete('page')

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const handleSortFieldChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    // 重置为第一页
    params.delete('page')
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const handleSortOrderChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('order', value)
    // 重置为第一页
    params.delete('page')
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClear = () => {
    setSearchValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('query')
    params.delete('page')
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {/* 左侧：搜索框 */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by first name or last name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-9"
            disabled={isPending}
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={isPending}>
          Search
        </Button>
      </div>

      {/* 右侧：过滤器 */}
      <div className="flex items-center gap-2">
        {/* Status 过滤器 */}
        <Select
          value={status}
          onValueChange={handleStatusChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="In Relationship">In Relationship</SelectItem>
            <SelectItem value="Complicated">Complicated</SelectItem>
            <SelectItem value="Married">Married</SelectItem>
          </SelectContent>
        </Select>

        {/* 排序字段选择器 */}
        <Select
          value={sortField}
          onValueChange={handleSortFieldChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="age">Age</SelectItem>
            <SelectItem value="visits">Visits</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
            <SelectItem value="createdAt">Created At</SelectItem>
          </SelectContent>
        </Select>

        {/* 排序方式选择器 */}
        <Select
          value={sortOrder}
          onValueChange={handleSortOrderChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        {/* 列可见性控制 */}
        {table && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

