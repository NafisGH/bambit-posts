import { defineStore } from "pinia";

type Theme = "light" | "dark";

export const useAppStore = defineStore("app", {
  state: () => ({
    theme: null as Theme | null,
    search: "",
    viewedUserIds: [] as number[],
  }),
  actions: {
    initTheme() {
      const ls = (localStorage.getItem("theme") as Theme | null) ?? null;
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const t: Theme = ls ?? (prefersDark ? "dark" : "light");
      this.setTheme(t);
    },
    setTheme(t: Theme) {
      this.theme = t;
      document.documentElement.classList.toggle("dark", t === "dark");
      localStorage.setItem("theme", t);
    },
    toggleTheme() {
      this.setTheme(this.theme === "dark" ? "light" : "dark");
    },
    setSearch(v: string) {
      this.search = v;
    },
    markUserViewed(id: number) {
      if (!this.viewedUserIds.includes(id)) this.viewedUserIds.push(id);
    },
  },
  persist: {
    pick: ["theme", "search", "viewedUserIds"],
  },
});
