<script setup lang="ts">
import { computed, onMounted } from 'vue'
import TodoForm from './components/TodoForm.vue'
import TodoItem from './components/TodoItem.vue'
import TodoFilterTabs from './components/TodoFilterTabs.vue'
import { useTodos } from './composables/useTodos'

const {
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
} = useTodos()

onMounted(fetchTodos)

const progress = computed(() => (stats.value.total ? Math.round((stats.value.done / stats.value.total) * 100) : 0))

const counts = computed(() => ({
  all: stats.value.total,
  active: stats.value.active,
  completed: stats.value.done,
}))

const emptyText = computed(() => {
  if (filter.value === 'active') return 'ไม่มีงานค้าง เยี่ยมมาก!'
  if (filter.value === 'completed') return 'ยังไม่มีรายการที่เสร็จ'
  return 'ยังไม่มีรายการ ลองเพิ่มงานแรกดูสิ'
})

const today = new Date().toLocaleDateString('th-TH', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

async function onAdd(title: string, done: (ok: boolean) => void) {
  done(await addTodo(title))
}

function onClearCompleted() {
  if (window.confirm(`ลบรายการที่เสร็จแล้วทั้งหมด ${stats.value.done} รายการ?`)) clearCompleted()
}
</script>

<template>
  <main class="mx-auto min-h-screen w-full max-w-2xl px-4 py-8 sm:py-14">
    <header class="mb-6 sm:mb-8">
      <p class="text-sm font-medium text-brand-600">{{ today }}</p>
      <h1 class="mt-1 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">รายการที่ต้องทำ</h1>

      <div class="mt-5 flex items-center gap-3">
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-stone-200" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
          <div class="h-full rounded-full bg-brand-600 transition-all duration-500" :style="{ width: `${progress}%` }" />
        </div>
        <span class="shrink-0 text-sm tabular-nums text-stone-500">
          เสร็จ {{ stats.done }}/{{ stats.total }}
        </span>
      </div>
    </header>

    <TodoForm @add="onAdd" />

    <div
      v-if="error"
      class="mt-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      <span>{{ error }}</span>
      <button type="button" class="shrink-0 font-semibold underline-offset-2 hover:underline" @click="fetchTodos">
        ลองใหม่
      </button>
    </div>

    <TodoFilterTabs v-model="filter" :counts="counts" class="mt-6" />

    <section class="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div v-if="loading" class="space-y-3 p-5" aria-label="กำลังโหลด">
        <div v-for="n in 3" :key="n" class="flex items-center gap-3">
          <div class="h-6 w-6 animate-pulse rounded-full bg-stone-200" />
          <div class="h-4 flex-1 animate-pulse rounded bg-stone-200" :style="{ maxWidth: `${80 - n * 15}%` }" />
        </div>
      </div>

      <p v-else-if="filteredTodos.length === 0" class="px-5 py-12 text-center text-stone-400">
        {{ emptyText }}
      </p>

      <TransitionGroup v-else tag="ul" name="list" class="divide-y divide-stone-100">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          @toggle="toggleTodo"
          @delete="deleteTodo"
          @rename="renameTodo"
        />
      </TransitionGroup>

      <footer
        v-if="!loading && stats.total > 0"
        class="flex items-center justify-between border-t border-stone-100 bg-stone-50/60 px-5 py-3 text-sm text-stone-500"
      >
        <span>เหลือ {{ stats.active }} รายการ</span>
        <button
          v-if="stats.done > 0"
          type="button"
          class="font-medium text-stone-500 transition hover:text-red-600"
          @click="onClearCompleted"
        >
          ลบที่เสร็จแล้ว
        </button>
      </footer>
    </section>

    <p class="mt-6 hidden text-center text-xs text-stone-400 sm:block">ดับเบิลคลิกที่รายการเพื่อแก้ไข</p>
  </main>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
