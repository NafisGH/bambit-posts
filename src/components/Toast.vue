<script setup lang="ts">
import { computed, onUnmounted, watch } from "vue";
import { useDataStore } from "../stores/data";

const data = useDataStore();
const visible = computed(() => data.error === "SERVICE_UNAVAILABLE");

let timer: number | null = null;
const delayMs = 6000;

function close() {
  data.error = "";
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

watch(visible, (v) => {
  if (v) {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(close, delayMs);
  }
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <div
    v-if="visible"
    class="fixed right-4 top-4 max-w-sm rounded-lg border bg-white p-3 shadow-lg dark:bg-neutral-900 dark:border-neutral-700"
    role="status"
    aria-live="polite"
  >
    <p class="text-sm">
      Сервис временно недоступен. Пожалуйста, попробуйте позже.
    </p>
    <div class="mt-2 text-right">
      <button class="text-sm underline" @click="close">Ок</button>
    </div>
  </div>
</template>
