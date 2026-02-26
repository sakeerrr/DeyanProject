<script setup>
import { ref, onMounted } from 'vue'

const logged = ref(false)
const username = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('/api/is-logged', {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Not logged in')
    }

    const data = await response.json()

    logged.value = data.logged
    username.value = data.username

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <p v-if="loading">Checking session...</p>

    <p v-else-if="logged">
      Logged in as {{ username }}
    </p>

    <p v-else>
      Not logged in
    </p>

    <p v-if="error">{{ error }}</p>
  </div>
</template>