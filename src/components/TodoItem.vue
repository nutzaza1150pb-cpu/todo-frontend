<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { Todo } from '../types/todo'

const props = defineProps<{ todo: Todo }>()
const emit = defineEmits<{
  (e: 'toggle', todo: Todo): void
  (e: 'delete', todo: Todo): void
  (e: 'rename', todo: Todo, title: string): void
}>()

const editing = ref(false)
const draft = ref('')
const input = ref<HTMLInputElement | null>(null)

async function startEdit() {
  draft.value = props.todo.title
  editing.value = true
  await nextTick()
  input.value?.focus()
  input.value?.select()
}

function saveEdit() {
  if (!editing.value) return
  editing.value = false
  const value = draft.value.trim()
  if (value && value !== props.todo.title) emit('rename', props.todo, value)
}

function cancelEdit() {
  editing.value = false
}

function confirmDelete() {
  if (window.confirm(`ลบ "${props.todo.title}" ใช่ไหม?`)) emit('delete', props.todo)
}
</script>

<template>
  <li class="group flex items-center gap-3 px-4 py-3 transition hover:bg-stone-50 sm:px-5">
    <button
      type="button"
      role="checkbox"
      :aria-checked="todo.isCompleted"
      :aria-label="todo.isCompleted ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'"
      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
      :class="
        todo.isCompleted
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-stone-300 bg-white hover:border-brand-500'
      "
      @click="emit('toggle', todo)"
    >
      <svg v-if="todo.isCompleted" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5 10.5l3 3L15 6.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <input
      v-if="editing"
      ref="input"
      v-model="draft"
      maxlength="255"
      aria-label="แก้ไขรายการ"
      class="min-w-0 flex-1 rounded-lg border border-brand-500 px-2 py-1 outline-none ring-4 ring-brand-100"
      @keydown.enter.prevent="saveEdit"
      @keydown.esc="cancelEdit"
      @blur="saveEdit"
    />
    <span
      v-else
      class="min-w-0 flex-1 cursor-text break-words leading-relaxed transition"
      :class="todo.isCompleted ? 'text-stone-400 line-through' : 'text-stone-800'"
      title="ดับเบิลคลิกเพื่อแก้ไข"
      @dblclick="startEdit"
    >
      {{ todo.title }}
    </span>

    <div
      v-if="!editing"
      class="flex shrink-0 items-center gap-1 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
    >
      <button
        type="button"
        aria-label="แก้ไข"
        class="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
        @click="startEdit"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M13.6 3.4a2 2 0 012.9 2.9l-8.8 8.8-3.7.9.9-3.7 8.7-8.9z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="ลบ"
        class="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
        @click="confirmDelete"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M8 2a1 1 0 00-.9.6L6.4 4H4a1 1 0 000 2h.1l.8 10.1A2 2 0 006.9 18h6.2a2 2 0 002-1.9L15.9 6H16a1 1 0 100-2h-2.4l-.7-1.4A1 1 0 0012 2H8zm0 6a1 1 0 012 0v6a1 1 0 11-2 0V8zm3 0a1 1 0 112 0v6a1 1 0 11-2 0V8z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </li>
</template>
