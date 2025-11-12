import type { Post, User } from "./types";

const API = "https://jsonplaceholder.typicode.com";

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchPostsByTitle(query: string): Promise<Post[]> {
  const url = query.trim()
    ? `${API}/posts?title_like=${encodeURIComponent(query)}`
    : `${API}/posts`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}
