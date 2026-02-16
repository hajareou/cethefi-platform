<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-header class="bg-white text-grey-8 shadow-1">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="lt-md q-mr-sm"
        />

        <q-space />

        <!-- If user is guest: show login button -->
        <q-btn
          v-if="isGuest"
          unelevated
          no-caps
          label="Login"
          color="indigo-9"
          @click="goToLogin"
        />

        <!-- If logged in: show avatar + dropdown -->
        <q-btn v-else flat no-caps class="q-ml-md" padding="none">
          <div class="row items-center no-wrap">
            <q-avatar color="indigo-9" text-color="white" size="40px" font-size="16px">
              <img v-if="avatarUrl" :src="avatarUrl" alt="User avatar" />
              <span v-else>{{ initials }}</span>
            </q-avatar>

            <div class="q-ml-sm text-right gt-xs line-height-tight">
              <div class="text-weight-bold text-body2 text-grey-9">
                {{ user.name }}
              </div>
            </div>
          </div>

          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 180px">
              <q-item clickable v-close-popup @click="openEditDialog">
                <q-item-section avatar>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>Edit</q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Log out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <!-- Decorative bar -->
      <div class="header-color-bar">
        <div class="bar bar-top"></div>
        <div class="bar bar-bottom"></div>
      </div>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-white" :width="260">
      <div class="column full-height">
        <div class="q-pa-lg q-mb-md">
          <div class="row justify-center">
            <img
              src="~assets/cethefi-logo.png"
              alt="Logo CETHEFI"
              style="width: 180px; height: auto"
            />
          </div>
        </div>

        <q-list padding class="text-grey-7 q-px-md">
          <q-item
            clickable
            v-ripple
            to="/dashboard"
            active-class="bg-indigo-9 text-white shadow-3"
            class="q-mb-sm rounded-borders"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section class="text-weight-medium text-size-16"> Dashboard </q-item-section>
          </q-item>

          <q-item
            v-if="!isGuest && canManageUsers"
            clickable
            v-ripple
            to="/users"
            active-class="bg-indigo-9 text-white shadow-3"
            class="q-mb-sm rounded-borders"
          >
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section class="text-weight-medium text-size-16">
              User Management
            </q-item-section>
          </q-item>
          <q-separator />

          <q-item
            clickable
            tag="a"
            href="https://github.com/hajareou/cethefi-platform"
            target="_blank"
            rel="noopener"
          >
            <q-item-section avatar>
              <q-icon name="open_in_new" />
            </q-item-section>
            <q-item-section>
              <q-item-label>GitHub Repository</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable tag="a" href="http://cethefi.org/" target="_blank" rel="noopener">
            <q-item-section avatar>
              <q-icon name="public" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cethefi Website</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-space />

        <div class="q-pa-md text-center text-grey-4 text-caption">v1.0.0</div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog v-if="!isGuest" v-model="showEditDialog" persistent>
      <q-card style="min-width: 360px">
        <q-card-section>
          <div class="text-h6">Edit profile</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="editName" label="Name" outlined dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn unelevated label="Save" color="indigo-9" @click="saveProfile" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const isGuest = computed(() => authStore.isGuest)
const grantedPermissions = computed(() =>
  Array.isArray(authStore.permissions) ? authStore.permissions : [],
)
const hasPermission = (permission) =>
  grantedPermissions.value.includes('*') || grantedPermissions.value.includes(permission)
const canManageUsers = computed(() => !isGuest.value && hasPermission('users:manage'))

const leftDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const user = computed(() => authStore.user)

const avatarUrl = computed(() => user.value?.avatarUrl || null)

// Avatar initials derived from the name (so we don't store initials anymore)
const initials = computed(() => {
  const parts = user.value.name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase() || '?'
})

// Edit dialog state
const showEditDialog = ref(false)
const editName = ref('')

const openEditDialog = () => {
  editName.value = user.value.name
  showEditDialog.value = true
}

const saveProfile = () => {
  const name = editName.value.trim()
  if (!name) {
    $q.notify({ color: 'negative', message: 'Name cannot be empty' })
    return
  }

  authStore.updateUser({ name })

  showEditDialog.value = false

  $q.notify({ color: 'positive', message: 'Profile updated' })
}

const logout = () => {
  authStore.clearSession()
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.tracking-wide {
  letter-spacing: 0.5px;
}
.line-height-tight {
  line-height: 1.2;
}
.text-size-16 {
  font-size: 16px;
}

:deep(.q-field--rounded .q-field__control) {
  border-radius: 8px;
}

.header-color-bar {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.bar {
  height: 2px;
  width: 100%;
}

.bar-top {
  background: #0057B7;
}

.bar-bottom {
  background: #FFD700;
}
</style>
