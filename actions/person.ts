'use server'

import { faker } from '@faker-js/faker'
import type { PaginatedResult, Person } from './types'

// 模拟数据库中的总数据量
const TOTAL_ITEMS = 100

// 生成指定数量的 Person 数据
function generatePerson(): Person {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    age: faker.number.int({ min: 18, max: 80 }),
    visits: faker.number.int({ min: 0, max: 1000 }),
    status: faker.helpers.arrayElement(['Single', 'In Relationship', 'Complicated', 'Married']),
    progress: faker.number.int({ min: 0, max: 100 }),
    city: faker.location.city(),
    country: faker.location.country(),
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    createdAt: faker.date.between({ from: '2023-01-01', to: '2024-12-31' }),
  }
}

// 生成所有数据（实际应用中这应该是数据库查询）
function getAllData(): Person[] {
  faker.seed(123) // 固定种子，保证每次生成的数据一致
  return Array.from({ length: TOTAL_ITEMS }, () => generatePerson())
}

// Server Action: 获取分页数据
export async function getPersons(
  page: number = 1,
  pageSize: number = 10,
  query: string = '',
  statusFilter: string = 'all',
  sortField: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<PaginatedResult<Person>> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  let allData = getAllData()

  // 搜索过滤：firstName 或 lastName 包含搜索词
  if (query) {
    const searchLower = query.toLowerCase()
    allData = allData.filter(
      person =>
        person.firstName.toLowerCase().includes(searchLower) ||
        person.lastName.toLowerCase().includes(searchLower)
    )
  }

  // Status 过滤
  if (statusFilter && statusFilter !== 'all') {
    allData = allData.filter(person => person.status === statusFilter)
  }

  // 排序
  if (sortField && sortOrder) {
    allData = allData.sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date

      // 根据字段类型处理
      if (sortField === 'createdAt') {
        // 日期排序
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        if (sortOrder === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      } else {
        // 数值字段排序
        aValue = a[sortField as keyof Pick<Person, 'age' | 'visits' | 'progress'>] as number
        bValue = b[sortField as keyof Pick<Person, 'age' | 'visits' | 'progress'>] as number
        if (sortOrder === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      }
    })
  }

  const total = allData.length
  const totalPages = Math.ceil(total / pageSize)

  // 确保页码在有效范围内
  const currentPage = Math.max(1, Math.min(page, totalPages || 1))

  // 计算分页数据
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const items = allData.slice(startIndex, endIndex)

  return {
    items,
    total,
    page: currentPage,
    pageSize,
    totalPages: totalPages || 1,
  }
}

