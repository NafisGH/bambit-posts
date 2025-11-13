<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from "vue";
import { useDataStore } from "../stores/data";
import { useAppStore } from "../stores/app";
import UserDialog from "./UserDialog.vue";

const data = useDataStore();
const app = useAppStore();

const scroller = ref<HTMLElement | null>(null);

const sentinel = ref<HTMLElement | null>(null);
// наблюдатель
let io: IntersectionObserver | null = null;

// состояние модалки
const dialogOpen = ref(false);
const dialogUserId = ref<number | null>(null);

// смена сортировки
function sortBy(key: "id" | "title" | "author" | "body") {
  data.setSort(key);
}

// подсветка «просмотренных» e-mail
function isViewedEmail(userId: number) {
  return app.viewedUserIds.includes(userId);
}

// открыть модалку по клику по email
function openUser(userId: number) {
  dialogUserId.value = userId;
  dialogOpen.value = true;
}

function setupIO() {
  if (!scroller.value || !sentinel.value) return;

  io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry || !entry.isIntersecting) return;

      const total = data.postsSorted.length;
      const visible = data.postsVisible.length;
      if (visible < total) data.visibleCount += 30;
    },
    {
      root: scroller.value,
      threshold: 1.0,
    }
  );

  io.observe(sentinel.value);
}

onMounted(() => setupIO());
onUnmounted(() => {
  io?.disconnect();
  io = null;
});

// при смене набора (поиск/сортировка) пересоздаём наблюдатель
watch(
  () => data.postsSorted.length,
  async () => {
    io?.disconnect();
    io = null;
    await nextTick();
    setupIO();
  }
);
</script>

<template>
  <div
    ref="scroller"
    class="h-full overflow-y-auto rounded border border-neutral-300 dark:border-neutral-700"
  >
    <table class="w-full table-fixed border-collapse">
      <thead>
        <tr class="text-left text-sm font-medium">
          <th
            class="sticky-th px-3 py-2 cursor-pointer w-[64px]"
            @click="sortBy('id')"
            title="Сортировать по ID"
          >
            ID
          </th>
          <th
            class="sticky-th px-3 py-2 cursor-pointer"
            @click="sortBy('title')"
            title="Сортировать по заголовку"
          >
            Заголовок
          </th>
          <th
            class="sticky-th px-3 py-2 cursor-pointer w-[220px]"
            @click="sortBy('author')"
            title="Сортировать по автору"
          >
            Автор
          </th>
          <th
            class="sticky-th px-3 py-2 cursor-pointer"
            @click="sortBy('body')"
            title="Сортировать по контенту"
          >
            Контент
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="p in data.postsVisible"
          :key="p.id"
          class="border-t border-neutral-200 dark:border-neutral-800"
        >
          <td class="px-3 py-2 truncate" :title="String(p.id)">{{ p.id }}</td>
          <td class="px-3 py-2 truncate" :title="p.title">{{ p.title }}</td>
          <td class="px-3 py-2">
            <button
              class="max-w-full truncate hover:underline"
              :class="
                isViewedEmail(p.userId)
                  ? 'text-blue-600 underline'
                  : 'text-inherit'
              "
              :title="p.authorEmail || '—'"
              @click="openUser(p.userId)"
            >
              {{ p.authorEmail || "—" }}
            </button>
          </td>
          <td class="px-3 py-2 truncate" :title="p.body">{{ p.body }}</td>
        </tr>
      </tbody>
    </table>

    <div ref="sentinel" class="h-2"></div>
  </div>

  <!-- модалка -->
  <UserDialog
    :open="dialogOpen"
    :userId="dialogUserId"
    @close="dialogOpen = false"
  />
</template>
