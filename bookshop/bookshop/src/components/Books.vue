<script setup>
import { ref, onMounted } from "vue";

const books = ref([]);
const error = ref(null);

onMounted(async () => {
  try {
    const res = await fetch("api/books", {
      credentials: "include" // send session cookie
    });

    if (!res.ok) throw new Error("Failed to fetch books");

    books.value = await res.json();
  } catch (err) {
    error.value = err.message;
  }
});
</script>

<template>
  <div>
    <h2>Books</h2>

    <p v-if="error">{{ error }}</p>

    <ul v-else>
      <li v-for="book in books" :key="book.id">
        <strong>{{ book.title }}</strong> by {{ book.author }} — ${{ book.price }}
      </li>
    </ul>
  </div>
</template>