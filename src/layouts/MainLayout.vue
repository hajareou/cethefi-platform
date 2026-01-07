<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-header class="bg-white text-grey-8 shadow-1" height-hint="64">
      <q-toolbar class="q-px-lg">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="lt-md"
        />

        <q-space />
        <q-space />

        <div class="row items-center no-wrap cursor-pointer">
          <q-avatar color="primary" text-color="white" size="md" font-size="14px">
            {{ user.initials }}
          </q-avatar>

          <div class="q-ml-md text-right gt-xs">
            <div class="text-weight-bold text-caption text-grey-9">
              {{ user.name }}
            </div>
            <div class="text-caption text-grey-6">
              {{ user.role }}
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-white" :width="260">
      <div class="q-pa-md">
        <div class="row items-center q-mb-xl q-mt-sm q-px-sm">
          <q-avatar color="primary" text-color="white" rounded icon="local_library" />
          <span class="q-ml-md text-h6 text-primary text-weight-bold">CETHEFI</span>
        </div>

        <q-list padding class="text-grey-8">
          <q-item clickable v-ripple active-class="bg-primary text-white" to="/admin" exact>
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section class="text-weight-medium">Dashboard</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/admin/users">
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section class="text-weight-medium">User Management</q-item-section>
          </q-item>
        </q-list>
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
  name: 'Hajare Ou',
  role: 'Admin',
  initials: 'HO',
})
</script>
