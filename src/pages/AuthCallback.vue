<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
const router = useRouter()
const authStore = useAuthStore()
const API = import.meta.env.VITE_AUTH_API_BASE_URL

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  if (!token) return router.replace('/login')

  const me = await fetch(`${API}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!me.ok) return router.replace('/login')

  const profile = await me.json()
  authStore.setSession({
    token,
    session: profile,
  })
  router.replace('/dashboard')
})
</script>

<template><div class="q-pa-md">Connexion en cours...</div></template>
