<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLocale } from 'src/i18n'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const { t } = useLocale()
const API = import.meta.env.VITE_AUTH_API_BASE_URL

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')

  // Remove token from URL immediately to prevent it from being visible or stored in browser history
  window.history.replaceState({}, document.title, window.location.pathname + window.location.hash)

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
      message: t('auth.callbackError'),
    })
    router.replace('/login')
  }
})
</script>

<template><div class="q-pa-md">{{ t('auth.signingIn') }}</div></template>
