<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");
const error = ref(null);

async function login() {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: username.value, password: password.value })
    });
    if (!res.ok) throw new Error("Login failed");
    error.value = null;
    location.reload(); // after login, Books component will work
  } catch (err) {
    error.value = err.message;
  }
}
</script>

<template>
  <div>
    <h2>Login</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>