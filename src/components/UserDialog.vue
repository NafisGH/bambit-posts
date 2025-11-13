<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useAppStore } from "../stores/app";
import { useDataStore } from "../stores/data";

// props: показываем диалог, и userId ID автора
const props = defineProps<{ open: boolean; userId: number | null }>();
// события: close — закрыть модалку
const emit = defineEmits<{ (e: "close"): void }>();

const data = useDataStore();
const app = useAppStore();

// клик «вне» карточки — закрывает диалог
const cardRef = ref<HTMLElement | null>(null);

const user = computed(() =>
  props.userId != null ? data.users.get(props.userId) : undefined
);
const notFound = computed(() => props.userId != null && !user.value);
// Esc — закрыть
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") emit("close");
}
// Клик по фону/вне карточки — закрыть
function onDocMouseDown(e: MouseEvent) {
  if (!props.open || !cardRef.value) return;
  const target = e.target as Node;
  if (!cardRef.value.contains(target)) emit("close");
}
// Клик по затемнению — закрыть
function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit("close");
}

// если открыли существующего пользователя — помечаем как «просмотренного»
watch(
  () => props.open,
  (o) => {
    if (o && user.value) app.markUserViewed(user.value.id);
  }
);

onMounted(() => {
  document.addEventListener("keydown", onKey);
  document.addEventListener("mousedown", onDocMouseDown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", onKey);
  document.removeEventListener("mousedown", onDocMouseDown);
});
</script>
<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click="onOverlayClick"
    >
      <div
        ref="cardRef"
        class="w-full max-w-md rounded-xl border bg-white p-4 shadow-xl dark:bg-neutral-900 dark:border-neutral-700"
      >
        <header class="mb-3 flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            {{ notFound ? "Пользователь не найден" : "Карточка пользователя" }}
          </h2>
          <button
            class="px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Закрыть"
            @click="emit('close')"
          >
            ✕
          </button>
        </header>

        <div v-if="notFound" class="text-sm opacity-90">
          По данному post.userId данные пользователя отсутствуют.
        </div>

        <div v-else class="space-y-1 text-sm">
          <div><span class="opacity-70">Имя:</span> {{ user?.name }}</div>
          <div><span class="opacity-70">Почта:</span> {{ user?.email }}</div>
          <div><span class="opacity-70">Ник:</span> {{ user?.username }}</div>
          <div><span class="opacity-70">Телефон:</span> {{ user?.phone }}</div>
          <div><span class="opacity-70">Сайт:</span> {{ user?.website }}</div>
          <div v-if="user?.company?.name">
            <span class="opacity-70">Компания:</span> {{ user?.company?.name }}
          </div>
          <div v-if="user?.address?.city">
            <span class="opacity-70">Город:</span> {{ user?.address?.city }}
          </div>
        </div>

        <footer class="mt-4 text-right">
          <button
            class="rounded bg-neutral-900 px-4 py-2 text-white dark:bg-neutral-200 dark:text-neutral-900"
            @click="emit('close')"
          >
            Ок
          </button>
        </footer>
      </div>
    </div>
  </teleport>
</template>
