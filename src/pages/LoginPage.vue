<template>
  <div class="bg-grey-1" style="min-height: 100vh">
    <div class="q-pa-lg">
      <img src="~assets/cethefi-logo.png" alt="Logo CETHEFI" style="width: 180px; height: auto" />
    </div>

    <div class="full-width flex flex-center" style="min-height: calc(100vh - 120px)">
      <q-card flat bordered class="bg-white" style="width: 460px; max-width: 92vw">
        <q-card-section class="q-pa-lg">
          <div class="text-h5 text-weight-bold text-grey-9 q-mb-sm">Welcome to CETHEFI</div>

          <div class="text-body2 text-grey-7 q-mb-lg">
            Manage and edit theatrical plays from the 18th century
          </div>

          <div class="column q-gutter-sm">
            <q-btn
              unelevated
              no-caps
              :icon="githubIcon"
              label="Connect with GitHub"
              color="grey-9"
              class="q-py-sm"
              @click="connectWithGithub"
            />

            <q-btn
              outline
              no-caps
              icon="person_outline"
              label="Continue as a guest"
              color="indigo-9"
              class="q-py-sm"
              @click="continueAsGuest"
            />
          </div>

          <div class="text-caption text-grey-6 q-mt-md">
            Guest mode lets you explore the interface. Editing and publishing may be restricted.
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const githubIcon =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'

const API = import.meta.env.VITE_AUTH_API_BASE_URL

const connectWithGithub = async () => {
  if (!API) {
    $q.notify({ color: 'negative', message: 'VITE_AUTH_API_BASE_URL is not configured' })
    return
  }

  try {
    const health = await fetch(`${API}/health`)
    if (!health.ok) throw new Error('Auth backend is not reachable')

    const redirect = `${window.location.origin}/#/auth/callback`
    window.location.assign(
      `${API}/api/auth/github/start?frontendRedirectUrl=${encodeURIComponent(redirect)}`,
    )
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error?.message || 'Unable to start GitHub login',
    })
  }
}

const continueAsGuest = async () => {
  if (!API) {
    $q.notify({ color: 'negative', message: 'VITE_AUTH_API_BASE_URL is not configured' })
    return
  }

  try {
    const res = await fetch(`${API}/api/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Guest' }),
    })

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}))
      throw new Error(payload?.message || 'Guest login failed')
    }

    const data = await res.json()
    authStore.setSession({
      token: data.token,
      session: {
        ...data,
        type: 'guest',
        provider: 'guest',
      },
    })
    router.push('/dashboard')
  } catch (error) {
    $q.notify({ color: 'negative', message: error?.message || 'Guest login failed' })
  }
}
</script>
