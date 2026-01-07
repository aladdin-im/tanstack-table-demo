import { getPersons } from "@/actions/person"
import { DataTable } from "@/components/DataTable"
import { TablePagination } from "@/components/TablePagination"

type PageProps = {
  searchParams: Promise<{
    page?: string
    query?: string
    status?: string
    sort?: string
    order?: string
  }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = 10
  const query = params.query || ''
  const status = params.status || 'all'
  const sort = params.sort || 'createdAt'
  const sortOrder = (params.order === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'

  // 在服务端获取数据
  const response = await getPersons(page, pageSize, query, status, sort, sortOrder)

  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">TanStack Table + Server Actions 分页示例</h1>
        <p className="text-gray-600 mt-2">
          使用 faker.js 生成 100 条模拟数据，支持服务端分页、搜索和过滤
        </p>
      </div>
      <DataTable response={response} />
      <TablePagination
        currentPage={response.page}
        totalPages={response.totalPages}
        totalItems={response.total}
      />
    </div>
  )
}
