<template>
  <q-page class="q-pa-lg bg-grey-1">
    <q-card flat bordered class="bg-white shadow-1">
      <q-card-section class="q-pa-lg">
        <div class="row items-center justify-between q-mb-xl">
          <div>
            <div class="text-h6 text-weight-bold text-grey-9">Authorized Users</div>
            <div class="text-caption text-grey-6">
              Manage access and permissions via GitHub accounts
            </div>
          </div>
          <q-btn
            unelevated
            no-caps
            icon="person_add"
            label="Add User"
            color="indigo-9"
            class="q-px-md"
            @click="showAddDialog = true"
          />
        </div>

        <div class="row items-center q-col-gutter-sm q-mb-md">
        <div class="col-12 col-md-6">
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search name or email..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>

        <q-table
          :rows="users"
          :columns="columns"
          row-key="email"
          flat
          :filter="filter"
          class="text-grey-9"
          :loading="loading"
          :rows-per-page-options="[5, 10, 20, 50]"
          v-model:pagination="pagination"
        >
          <template v-slot:body-cell-canEdit="props">
            <q-td :props="props" class="text-center">
              <q-checkbox 
              dense 
              v-model="props.row.canEdit" 
              color="indigo-9" />
            </q-td>
          </template>

          <template v-slot:body-cell-canValidate="props">
            <q-td :props="props" class="text-center">
              <q-checkbox dense v-model="props.row.canValidate" color="indigo-9" />
            </q-td>
          </template>

          <template v-slot:body-cell-canPublish="props">
            <q-td :props="props" class="text-center">
              <q-checkbox dense v-model="props.row.canPublish" color="indigo-9" />
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                round
                dense
                color="grey-8"
                icon="delete_outline"
                size="sm"
                @click="deleteUser(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
  <q-dialog v-model="showAddDialog" persistent>
  <q-card style="min-width: 400px">
    <q-card-section>
      <div class="text-h6">Add User</div>
    </q-card-section>

    <q-card-section class="q-gutter-md">
      <q-input
        v-model="newUser.name"
        label="Name"
        outlined
        dense
      />

      <q-input
        v-model="newUser.email"
        label="Email"
        type="email"
        outlined
        dense
      />

      <div class="row q-col-gutter-sm">
        <div class="col">
          <q-checkbox v-model="newUser.canEdit" label="Can edit" />
        </div>
        <div class="col">
          <q-checkbox v-model="newUser.canValidate" label="Can validate" />
        </div>
        <div class="col">
          <q-checkbox v-model="newUser.canPublish" label="Can publish" />
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancel" color="grey-7" v-close-popup />
      <q-btn unelevated label="Add" color="indigo-9" @click="addUser" />
    </q-card-actions>
  </q-card>
</q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
//import { loadJson } from 'src/services/dataLoader'
import { loadUsers, saveUsers } from 'src/services/storage'

const $q = useQuasar()

const filter = ref('')

const paginationKey = 'usersTablePagination'
const pagination = ref(
  JSON.parse(localStorage.getItem(paginationKey) || 'null') || {
    page: 1,
    rowsPerPage: 5, // default value
    sortBy: 'name',
    descending: false,
  })

watch(
  pagination,
  (val) => localStorage.setItem(paginationKey, JSON.stringify(val)),
  { deep: true }
)

const columns = [
  { name: 'name', 
    align: 'left', 
    label: 'User', 
    field: 'name', 
    sortable: true, 
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  { name: 'email', 
    align: 'left', 
    label: 'Email', 
    field: 'email', 
    sortable: true, 
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  { name: 'canEdit', 
    align: 'center', 
    label: 'Can Edit', 
    field: 'canEdit', 
  },
  { name: 'canValidate', 
    align: 'center', 
    label: 'Can Validate', 
    field: 'canValidate', 
  },
  { name: 'canPublish', 
    align: 'center', 
    label: 'Can Publish', 
    field: 'canPublish', 
  },
  { name: 'action', 
    align: 'center', 
    label: '', 
    field: 'action', 
  },
]

const users = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    users.value = await loadUsers('/data/users.json')
  } catch (e) {
    $q.notify({ color: 'negative', message: e?.message || 'Failed to load users' })
  } finally {
    loading.value = false
  }
})

watch(
  users,
  (val) => saveUsers(val),
  { deep: true }
)

// Fonction simple pour supprimer (simulation)
const deleteUser = (row) => {
  $q.dialog({
    title: 'Confirm',
    message: `Would you like to remove ${row.name}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    users.value = users.value.filter((u) => u.email !== row.email)
    $q.notify({ color: 'positive', message: 'User removed' })
  })
}

const showAddDialog = ref(false)

const newUser = ref({
  name: '',
  email: '',
  canEdit: false,
  canValidate: false,
  canPublish: false,
})

const addUser = () => {
  if (!newUser.value.name || !newUser.value.email) {
    $q.notify({
      color: 'negative',
      message: 'Name and email are required',
    })
    return
  }

  // prevent duplicate emails
  if (users.value.some(u => u.email === newUser.value.email)) {
    $q.notify({
      color: 'negative',
      message: 'A user with this email already exists',
    })
    return
  }

  users.value.push({ ...newUser.value })

  // reset form
  newUser.value = {
    name: '',
    email: '',
    canEdit: false,
    canValidate: false,
    canPublish: false,
  }

  showAddDialog.value = false

  $q.notify({
    color: 'positive',
    message: 'User added',
  })
}
</script>

<style scoped>
/* Petite retouche pour que l'entête du tableau soit bien aligné avec le design */
:deep(.q-table th) {
  font-weight: bold;
  font-size: 0.75rem;
  color: #424242; /* Gris foncé */
}
</style>
