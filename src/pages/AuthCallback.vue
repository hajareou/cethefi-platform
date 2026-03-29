<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const API = import.meta.env.VITE_AUTH_API_BASE_URL

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')

  if (!token || !API) {
    router.replace('/login')
    return
  }

  try {
    const me = await fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!me.ok) {
      router.replace('/login')
      return
    }

    const profile = await me.json()
    authStore.setSession({
      token,
      session: profile,
    })
    router.replace('/dashboard')
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Impossible de finaliser la connexion. Vérifiez que le backend est démarré.',
    })
    router.replace('/login')
  }
})
</script>

<template><div class="q-pa-md">Connexion en cours...</div></template>
