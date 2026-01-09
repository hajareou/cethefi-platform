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

        <div class="row items-center no-wrap cursor-pointer q-ml-md">
          <q-avatar color="indigo-9" text-color="white" size="40px" font-size="16px">
            {{ user.initials }}
          </q-avatar>

          <div class="q-ml-sm text-right gt-xs line-height-tight">
            <div class="text-weight-bold text-body2 text-grey-9">
              {{ user.name }}
            </div>
            <div class="text-caption text-grey-5" style="line-height: 12px">
              {{ user.role }}
            </div>
          </div>
        </div>
      </q-toolbar>
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
            to="/admin"
            active-class="bg-white text-indigo-9"
            class="q-mb-sm rounded-borders"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section class="text-weight-medium text-size-16"> Dashboard </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin/users"
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
        </q-list>

        <q-space />

        <div class="q-pa-md text-center text-grey-4 text-caption">v1.0.0</div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const user = ref({
  name: 'Françoise Rubellin',
  role: 'Admin',
  initials: 'FR',
})
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
</style>
