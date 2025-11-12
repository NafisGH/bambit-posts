<script setup lang="ts">
import { useAppStore } from "../stores/app";
const app = useAppStore();
</script>

<template>
  <button
    class="px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
    @click="app.toggleTheme()"
    :aria-label="
      app.theme === 'dark' ? 'Тёмная тема включена' : 'Светлая тема включена'
    "
  >
    {{ app.theme === "dark" ? "🌙" : "☀️" }}
  </button>
</template>
