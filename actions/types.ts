export interface ActionResponse<T = any> {
    success: boolean
    data?: T
    error?: string
}

export interface PaginatedResult<T = any> {
    items: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

// Person 相关类型
export type Person = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    age: number
    visits: number
    status: string
    progress: number
    city: string
    country: string
    company: string
    jobTitle: string
    createdAt: Date
}