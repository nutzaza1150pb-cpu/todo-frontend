<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'add', title: string, done: (ok: boolean) => void): void }>()

const title = ref('')
const submitting = ref(false)

function submit() {
  const value = title.value.trim()
  if (!value || submitting.value) return
  submitting.value = true
  emit('add', value, (ok) => {
    submitting.value = false
    if (ok) title.value = ''
  })
}
</script>

<template>
  <form class="flex gap-2" @submit.prevent="submit">
    <label for="new-todo" class="sr-only">เพิ่มรายการใหม่</label>
    <input
      id="new-todo"
      v-model="title"
      type="text"
      maxlength="255"
      placeholder="วันนี้ต้องทำอะไรบ้าง?"
      autocomplete="off"
      class="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
    />
    <button
      type="submit"
      :disabled="!title.trim() || submitting"
      class="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
    >
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
      </svg>
      <span class="hidden sm:inline">เพิ่ม</span>
    </button>
  </form>
</template>
