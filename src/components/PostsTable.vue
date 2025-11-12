<script setup lang="ts">
import { useDataStore } from "../stores/data";
import { useAppStore } from "../stores/app";

const data = useDataStore();
const app = useAppStore();

function sortBy(key: "id" | "title" | "author" | "body") {
  data.setSort(key);
}

function isViewedEmail(userId: number) {
  return app.viewedUserIds.includes(userId);
}
</script>

<template>
  <!-- Родитель передает фиксированную высоту, единый внутренний скролл -->
  <div
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

          <!-- На этом шаге это просто текст-кнопка пока без модалки  -->
          <td class="px-3 py-2">
            <button
              class="max-w-full truncate hover:underline"
              :class="
                isViewedEmail(p.userId)
                  ? 'text-blue-600 underline'
                  : 'text-inherit'
              "
              :title="p.authorEmail || '—'"
            >
              {{ p.authorEmail || "—" }}
            </button>
          </td>

          <td class="px-3 py-2 truncate" :title="p.body">{{ p.body }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
