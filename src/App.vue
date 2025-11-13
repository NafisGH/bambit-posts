<script setup lang="ts">
import { onMounted } from "vue";
import { useAppStore } from "./stores/app";
import { useDataStore } from "./stores/data";
import ThemeToggle from "./components/ThemeToggle.vue";
import SearchBar from "./components/SearchBar.vue";
import PostsTable from "./components/PostsTable.vue";
import Toast from "./components/Toast.vue";

const app = useAppStore();
const data = useDataStore();

onMounted(() => {
  app.initTheme();
  data.initLoad();
});
</script>

<template>
  <main class="min-h-dvh grid place-items-center p-4">
    <section class="w-[600px] h-[600px] flex flex-col">
      <header class="flex items-center justify-between gap-3">
        <SearchBar />
        <ThemeToggle />
      </header>

      <div class="mt-4 flex-1 min-h-0">
        <div
          v-if="data.loading"
          class="rounded border p-6 text-center text-sm opacity-80 border-neutral-300 dark:border-neutral-700"
        >
          Загрузка...
        </div>
        <PostsTable v-else class="h-full" />
      </div>
      <Toast />
    </section>
  </main>
</template>
