import { computed, ref } from 'vue'
import { todoApi } from '../services/todoApi'
import type { Todo, TodoFilter } from '../types/todo'

export function useTodos() {
  const todos = ref<Todo[]>([])
  const filter = ref<TodoFilter>('all')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredTodos = computed(() => {
    if (filter.value === 'active') return todos.value.filter((t) => !t.isCompleted)
    if (filter.value === 'completed') return todos.value.filter((t) => t.isCompleted)
    return todos.value
  })

  const stats = computed(() => {
    const total = todos.value.length
    const done = todos.value.filter((t) => t.isCompleted).length
    return { total, done, active: total - done }
  })

  /** ห่อทุกคำสั่งให้จัดการ error ที่เดียว */
  async function run<T>(action: () => Promise<T>): Promise<T | undefined> {
    error.value = null
    try {
      return await action()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'
      return undefined
    }
  }

  async function fetchTodos() {
    loading.value = true
    const data = await run(() => todoApi.getAll())
    if (data) todos.value = data
    loading.value = false
  }

  async function addTodo(title: string) {
    const created = await run(() => todoApi.create({ title }))
    if (created) todos.value.unshift(created)
    return Boolean(created)
  }

  async function toggleTodo(todo: Todo) {
    const updated = await run(() => todoApi.update(todo.id, { isCompleted: !todo.isCompleted }))
    if (updated) replace(updated)
  }

  async function renameTodo(todo: Todo, title: string) {
    const updated = await run(() => todoApi.update(todo.id, { title }))
    if (updated) replace(updated)
    return Boolean(updated)
  }

  async function deleteTodo(todo: Todo) {
    const ok = await run(async () => {
      await todoApi.remove(todo.id)
      return true
    })
    if (ok) todos.value = todos.value.filter((t) => t.id !== todo.id)
  }

  async function clearCompleted() {
    const done = todos.value.filter((t) => t.isCompleted)
    await Promise.all(done.map((t) => deleteTodo(t)))
  }

  function replace(updated: Todo) {
    const i = todos.value.findIndex((t) => t.id === updated.id)
    if (i !== -1) todos.value[i] = updated
  }

  return {
    todos,
    filter,
    filteredTodos,
    stats,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    renameTodo,
    deleteTodo,
    clearCompleted,
  }
}
