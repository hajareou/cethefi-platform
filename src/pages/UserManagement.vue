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
          />
        </div>

        <q-table
          :rows="users"
          :columns="columns"
          row-key="email"
          flat
          class="text-grey-9"
          :pagination="{ rowsPerPage: 10 }"
          hide-pagination
        >
          <template v-slot:body-cell-canEdit="props">
            <q-td :props="props" class="text-center">
              <q-checkbox dense v-model="props.row.canEdit" color="indigo-9" />
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { loadJson } from 'src/services/dataLoader'

const $q = useQuasar()

const columns = [
  { name: 'name', align: 'left', label: 'User', field: 'name', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'canEdit', align: 'center', label: 'Can Edit', field: 'canEdit' },
  { name: 'canValidate', align: 'center', label: 'Can Validate', field: 'canValidate' },
  { name: 'canPublish', align: 'center', label: 'Can Publish', field: 'canPublish' },
  { name: 'action', align: 'center', label: '', field: 'action' },
]

const users = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    users.value = await loadJson('/data/users.json')
  } catch (e) {
    $q.notify({ color: 'negative', message: e?.message || 'Failed to load users' })
  } finally {
    loading.value = false
  }
})

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
</script>

<style scoped>
/* Petite retouche pour que l'entête du tableau soit bien aligné avec le design */
:deep(.q-table th) {
  font-weight: bold;
  font-size: 0.75rem;
  color: #424242; /* Gris foncé */
}
</style>
