<script setup lang="ts">
import { useAppStore } from "./stores/app";
import ThemeToggle from "./components/ThemeToggle.vue";
import { onMounted } from "vue";

const app = useAppStore();

onMounted(() => {
  app.initTheme();
});
</script>

<template>
  <main class="min-h-dvh grid place-items-center p-4">
    <section class="w-[600px] h-[600px] flex flex-col">
      <header class="flex items-center justify-end">
        <ThemeToggle />
      </header>

      <!-- заглушка -->
      <div
        class="mt-4 flex-1 min-h-0 rounded border border-neutral-300 dark:border-neutral-700 p-4 text-sm opacity-80"
      >
        Заглушка интерфейса.
      </div>
    </section>
  </main>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
