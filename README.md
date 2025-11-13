Bambit Posts (Vue 3 + Vite + TS)

Список постов с JSONPlaceholder в таблице 600×600: поиск по title, сортировка, ленивая подгрузка, карточка пользователя.

Демо: https://bambit-posts.netlify.app/

Стек

Vue 3 + <script setup> + TypeScript

Pinia + pinia-plugin-persistedstate

Tailwind CSS

Vite

Node 22.x

Быстрый старт
npm i
npm run dev      # http://localhost:5173

Сборка
npm run build
npm run preview

Функциональность

Автозагрузка users и posts при старте.

Поиск по заголовку (?title_like=). Пусто → все посты.

Таблица 600×600, центр, один внутренний скролл, липкая шапка.

Ленивая подгрузка: первые 30, далее по 30 при доскролле.

Сортировка по клику (2 состояния: asc/desc), стрелки в заголовках.

Колонки: ID, Заголовок, Автор (email), Контент. Длинный текст — ... + title.

Клик по email → модалка пользователя (данные из кэша).
Показ: name, username, email, phone, website (ссылка), company.name, адрес одной строкой.
Закрытие: кнопка, Esc, клик вне.

Тема light/dark, просмотренные email и строка поиска — в localStorage.

Ошибки API → toast: «Сервис временно недоступен…».

Структура (кратко)
src/
  components/ PostsTable.vue, SearchBar.vue, ThemeToggle.vue,
              UserDialog.vue, Toast.vue, SkeletonTable.vue
  stores/     app.ts, data.ts
  utils/      api.ts, types.ts
  App.vue, main.ts, style.css

Проверка ошибки API (быстро)

DevTools → Network → Offline → перезагрузить страницу → появится toast. Верните Online.

Деплой (Netlify)

Build: npm run build • Publish: dist • Node: 22 (рекомендуется).
