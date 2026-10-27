import type { CreateTodoInput, Todo, UpdateTodoInput } from '../types/todo'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3333/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    let message = `เกิดข้อผิดพลาด (${res.status})`
    try {
      const body = await res.json()
      message = body.errors?.[0]?.message ?? body.message ?? message
    } catch {
      /* response ไม่ใช่ JSON */
    }
    throw new Error(message)
  }

  // 204 No Content (เช่น ลบสำเร็จ)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const todoApi = {
  getAll: () => request<Todo[]>('/todos'),

  create: (data: CreateTodoInput) =>
    request<Todo>('/todos', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: UpdateTodoInput) =>
    request<Todo>(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  remove: (id: number) => request<void>(`/todos/${id}`, { method: 'DELETE' }),
}
