<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");
const error = ref(null);
const isRegister = ref(false); 

async function submit() {
  try {
    const endpoint = isRegister.value ? "/api/register" : "/api/login";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || (isRegister.value ? "Registration failed" : "Login failed"));
    }

    error.value = null;

    if (isRegister.value) {
      isRegister.value = false;
      error.value = "Registration successful. You can now log in.";
    } else {
      location.reload();
    }

  } catch (err) {
    error.value = err.message;
  }
}
</script>

<template>
  <div>
    <h2>{{ isRegister ? "Register" : "Login" }}</h2>

    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />

    <button @click="submit">
      {{ isRegister ? "Register" : "Login" }}
    </button>

    <p v-if="error">{{ error }}</p>

    <p>
      <span v-if="!isRegister">
        No account?
        <button @click="isRegister = true">Register</button>
      </span>
      <span v-else>
        Already have an account?
        <button @click="isRegister = false">Login</button>
      </span>
    </p>
  </div>
</template>