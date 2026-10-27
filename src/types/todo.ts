export interface Todo {
  id: number
  title: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTodoInput {
  title: string
}

export interface UpdateTodoInput {
  title?: string
  isCompleted?: boolean
}

export type TodoFilter = 'all' | 'active' | 'completed'
