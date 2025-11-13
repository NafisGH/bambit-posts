<script setup lang="ts">
import { ref } from "vue";
import { useAppStore } from "../stores/app";
import { useDataStore } from "../stores/data";

const app = useAppStore();
const data = useDataStore();

const q = ref(app.search);

function doSearch() {
  app.setSearch(q.value);
  data.searchByTitle(q.value);
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Enter") doSearch();
}
</script>

<template>
  <div class="flex items-center gap-2">
    <input
      class="w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
      type="text"
      placeholder="Поиск по заголовку..."
      v-model="q"
      @keydown="onKey"
    />
    <button
      class="rounded bg-neutral-900 px-4 py-2 text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-60 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:ring-neutral-600"
      :disabled="data.loading"
      @click="doSearch"
    >
      {{ data.loading ? "Поиск..." : "Поиск" }}
    </button>
  </div>
</template>
