<template>
  <div
    class="h-full overflow-hidden rounded border border-neutral-300 dark:border-neutral-700"
  >
    <div
      class="sticky top-0 z-10 grid grid-cols-[64px_1fr_220px_1fr] gap-0 bg-white p-2 text-sm dark:bg-neutral-900"
    >
      <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
    </div>
    <ul class="divide-y divide-neutral-200 dark:divide-neutral-800">
      <li
        v-for="i in 10"
        :key="i"
        class="grid grid-cols-[64px_1fr_220px_1fr] gap-0 p-3"
      >
        <div
          class="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-10 animate-pulse"
        />
        <div
          class="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"
        />
        <div
          class="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-40 animate-pulse"
        />
        <div
          class="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"
        />
      </li>
    </ul>
  </div>
</template>
