<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick, computed } from "vue";
import { useDataStore } from "../stores/data";
import { useAppStore } from "../stores/app";
import UserDialog from "./UserDialog.vue";

const data = useDataStore();
const app = useAppStore();

const scroller = ref<HTMLElement | null>(null);

const sentinel = ref<HTMLElement | null>(null);

const activeKey = computed(() => data.sortKey);
const dir = computed(() => data.sortDir);

let io: IntersectionObserver | null = null;

// состояние модалки
const dialogOpen = ref(false);
const dialogUserId = ref<number | null>(null);

function indicatorFor(key: "id" | "title" | "author" | "body"): string {
  return activeKey.value === key ? (dir.value === "asc" ? "▲" : "▼") : "↕";
}
function thClass(key: "id" | "title" | "author" | "body"): string {
  return activeKey.value === key
    ? "font-semibold"
    : "text-neutral-700 dark:text-neutral-300";
}
function ariaSort(
  key: "id" | "title" | "author" | "body"
): "none" | "ascending" | "descending" {
  if (activeKey.value !== key || !dir.value) return "none";
  return dir.value === "asc" ? "ascending" : "descending";
}

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
    <table class="w-full table-fixed border-separate border-spacing-0">
      <thead>
        <tr class="text-left text-sm">
          <th
            class="sticky-th px-3 py-2 cursor-pointer w-[64px]"
            :class="thClass('id')"
            :aria-sort="ariaSort('id')"
            @click="sortBy('id')"
            title="Сортировать по ID"
          >
            <span class="inline-flex items-center gap-1">
              ID <span>{{ indicatorFor("id") }}</span>
            </span>
          </th>

          <th
            class="sticky-th px-3 py-2 cursor-pointer"
            :class="thClass('title')"
            :aria-sort="ariaSort('title')"
            @click="sortBy('title')"
            title="Сортировать по заголовку"
          >
            <span class="inline-flex items-center gap-1">
              Заголовок <span>{{ indicatorFor("title") }}</span>
            </span>
          </th>

          <th
            class="sticky-th px-3 py-2 cursor-pointer w-[220px]"
            :class="thClass('author')"
            :aria-sort="ariaSort('author')"
            @click="sortBy('author')"
            title="Сортировать по автору"
          >
            <span class="inline-flex items-center gap-1">
              Автор <span>{{ indicatorFor("author") }}</span>
            </span>
          </th>

          <th
            class="sticky-th px-3 py-2 cursor-pointer"
            :class="thClass('body')"
            :aria-sort="ariaSort('body')"
            @click="sortBy('body')"
            title="Сортировать по контенту"
          >
            <span class="inline-flex items-center gap-1">
              Контент <span>{{ indicatorFor("body") }}</span>
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="p in data.postsVisible"
          :key="p.id"
          class="border-t border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
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
