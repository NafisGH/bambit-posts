import { defineStore } from "pinia";
import type { Post, User } from "../utils/types";
import { fetchUsers, fetchPostsByTitle } from "../utils/api";

type SortKey = "id" | "title" | "author" | "body";
type SortDir = "asc" | "desc" | null;

function humanCompare(a: string, b: string) {
  return a.localeCompare(b, undefined, {
    sensitivity: "accent",
    numeric: true,
  });
}

export const useDataStore = defineStore("data", {
  state: () => ({
    users: new Map<number, User>(), // кэш пользователей
    postsAll: [] as Post[], // посты текущего поиска
    sortKey: null as SortKey | null,
    sortDir: null as SortDir, // два состояния: asc/desc
    visibleCount: 30,
    loading: false,
    error: "",
  }),

  getters: {
    postsEnriched(state): Array<Post & { authorEmail: string }> {
      return state.postsAll.map((p) => ({
        ...p,
        authorEmail: state.users.get(p.userId)?.email ?? "",
      }));
    },

    postsSorted(state): Array<Post & { authorEmail: string }> {
      const arr = [
        ...(this.postsEnriched as Array<Post & { authorEmail: string }>),
      ];

      const { sortKey, sortDir } = state;
      if (!sortKey || !sortDir) return arr;

      const compareMap: Record<SortKey, (a: any, b: any) => number> = {
        id: (a, b) => a.id - b.id,
        title: (a, b) => humanCompare(a.title, b.title),
        author: (a, b) =>
          humanCompare(a.authorEmail || "", b.authorEmail || ""),
        body: (a, b) => humanCompare(a.body, b.body),
      };

      const cmp = compareMap[sortKey];
      arr.sort((a, b) => (sortDir === "asc" ? cmp(a, b) : -cmp(a, b)));
      return arr;
    },

    // отображаем первые 30
    postsVisible(): Array<Post & { authorEmail: string }> {
      return (this.postsSorted as Array<Post & { authorEmail: string }>).slice(
        0,
        this.visibleCount
      );
    },
  },

  actions: {
    async initLoad() {
      this.error = "";
      this.loading = true;
      try {
        const [users, posts] = await Promise.all([
          fetchUsers(),
          fetchPostsByTitle(""),
        ]);
        this.users = new Map(users.map((u) => [u.id, u]));
        this.postsAll = posts;
        this.visibleCount = 30;
      } catch (e) {
        this.error = "SERVICE_UNAVAILABLE";
      } finally {
        this.loading = false;
      }
    },

    async searchByTitle(title: string) {
      this.error = "";
      this.loading = true;
      try {
        const posts = await fetchPostsByTitle(title);
        this.postsAll = posts;
        this.sortKey = null;
        this.sortDir = null;
        this.visibleCount = 30;
      } catch (e) {
        this.error = "SERVICE_UNAVAILABLE";
      } finally {
        this.loading = false;
      }
    },

    setSort(key: SortKey) {
      if (this.sortKey !== key) {
        this.sortKey = key;
        this.sortDir = "asc";
      } else {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      }
      this.visibleCount = 30;
    },
  },
});
