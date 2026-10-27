<script setup lang="ts">
import type { TodoFilter } from '../types/todo'

defineProps<{ modelValue: TodoFilter; counts: Record<TodoFilter, number> }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: TodoFilter): void }>()

const tabs: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'active', label: 'ยังไม่เสร็จ' },
  { value: 'completed', label: 'เสร็จแล้ว' },
]
</script>

<template>
  <div class="flex rounded-xl bg-stone-200/70 p-1" role="tablist" aria-label="กรองรายการ">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      :aria-selected="modelValue === tab.value"
      class="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition"
      :class="modelValue === tab.value ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'"
      @click="emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
      <span
        class="min-w-[1.25rem] rounded-full px-1.5 text-xs tabular-nums"
        :class="modelValue === tab.value ? 'bg-brand-100 text-brand-700' : 'bg-stone-300/60 text-stone-600'"
      >
        {{ counts[tab.value] }}
      </span>
    </button>
  </div>
</template>
