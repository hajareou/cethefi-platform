<template>
  <!-- Main page container with padding and light grey background -->
  <q-page class="q-pa-lg bg-grey-1">
    <!-- White card that contains the whole User Management UI -->
    <q-card flat bordered class="bg-white shadow-1">
      <q-card-section class="q-pa-lg">

        <!-- ===== Header row (title + description + Add User button) ===== -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-h6 text-weight-bold text-grey-9">Authorized Users</div>
            <div class="text-caption text-grey-6">
              Manage access and permissions via GitHub accounts
            </div>
          </div>

          <!-- Opens the "Add User" dialog -->
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

        <!-- ===== Search bar row ===== -->
        <div class="row items-center q-col-gutter-sm q-mb-md">
          <div class="col-12 col-md-6">
            <!-- Text filter used by q-table (:filter="filter") -->
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search name or email..."
              class="q-mb-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <!-- Permission filters (like document status filters) -->
            <div class="row items-center q-gutter-md">
              <q-checkbox v-model="permFilter.canEdit" label="Can edit" dense />
              <q-checkbox v-model="permFilter.canValidate" label="Can validate" dense />
              <q-checkbox v-model="permFilter.canPublish" label="Can publish" dense />
            </div>
          </div>
        </div>

        <!-- ===== Users table =====
             - rows: the users data
             - columns: column configuration
             - filter: search text
             - pagination: controlled by v-model so we can persist it in localStorage
        -->
        <q-table
          :rows="filteredUsers"
          :columns="columns"
          row-key="email"
          flat
          :filter="filter"
          class="text-grey-9"
          :loading="loading"
          :rows-per-page-options="[5, 10, 20, 50]"
          v-model:pagination="pagination"
        >
          <!-- Custom cell: Can Edit checkbox -->
          <template v-slot:body-cell-canEdit="props">
            <q-td :props="props" class="text-center">
              <!-- v-model binds directly to the row field (reactive) -->
              <q-checkbox 
                dense 
                v-model="props.row.canEdit" 
                color="indigo-9"
              />
            </q-td>
          </template>

          <!-- Custom cell: Can Validate checkbox -->
          <template v-slot:body-cell-canValidate="props">
            <q-td :props="props" class="text-center">
              <q-checkbox dense v-model="props.row.canValidate" color="indigo-9" />
            </q-td>
          </template>

          <!-- Custom cell: Can Publish checkbox -->
          <template v-slot:body-cell-canPublish="props">
            <q-td :props="props" class="text-center">
              <q-checkbox dense v-model="props.row.canPublish" color="indigo-9" />
            </q-td>
          </template>

          <!-- Custom cell: Delete action button -->
          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="text-center">
              <!-- Clicking triggers confirm dialog then deletes -->
              <q-btn
                flat
                round
                dense
                color="grey-8"
                icon="delete_outline"
                size="sm"
                @click="() => { console.log('delete clicked', props.row); confirmDelete(props.row) }"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>

  <!-- ===== Add User Dialog =====
       - Controlled by showAddDialog (v-model)
       - "persistent" prevents closing by clicking outside
  -->
  <q-dialog v-model="showAddDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Add User</div>
      </q-card-section>

      <!-- Form fields -->
      <q-card-section class="q-gutter-md">
        <!-- User name -->
        <q-input
          v-model="newUser.name"
          label="Name"
          outlined
          dense
        />

        <!-- User email -->
        <q-input
          v-model="newUser.email"
          label="Email"
          type="email"
          outlined
          dense
        />

        <!-- Permission checkboxes -->
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

      <!-- Dialog actions -->
      <q-card-actions align="right">
        <!-- Cancel closes the dialog -->
        <q-btn flat label="Cancel" color="grey-7" v-close-popup />
        <!-- Add validates the form and pushes a new user to the list -->
        <q-btn unelevated label="Add" color="indigo-9" @click="addUser" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
/**
 * ===== Imports =====
 * - ref: reactive variables
 * - onMounted: runs code when the component loads
 * - watch: reacts to changes (used for auto-saving)
 */
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar } from 'quasar'

// We load initial users from /public/data/users.json, but we also persist edits to localStorage.
// storage.js handles: loadUsers (JSON + localStorage fallback) and saveUsers (localStorage write).
import { loadUsers, saveUsers } from 'src/services/storage'

/**
 * Quasar instance ($q) gives access to:
 * - $q.notify() for toasts
 * - $q.dialog() for confirmation popups
 */
const $q = useQuasar()

/**
 * Search filter for q-table.
 * q-table will filter by matching text across visible fields.
 */
const filter = ref('')

// Permission filter checkboxes (all false by default)
const permFilter = ref({
  canEdit: false,
  canValidate: false,
  canPublish: false,
})

// Filter users by selected permissions:
// - if no permission selected -> show ALL users
// - if some selected -> show users that match ANY selected permission
const filteredUsers = computed(() => {
  const selected = []

  if (permFilter.value.canEdit) selected.push('canEdit')
  if (permFilter.value.canValidate) selected.push('canValidate')
  if (permFilter.value.canPublish) selected.push('canPublish')

  // Nothing selected => no filtering
  if (selected.length === 0) return users.value

  // Show users that match at least one selected permission
  return users.value.filter((u) => selected.every((key) => u[key] === true))
})

/**
 * ===== Pagination persistence =====
 * We store the q-table pagination state in localStorage so that
 * rows-per-page and sorting stay the same after reload.
 */
const paginationKey = 'usersTablePagination'
const pagination = ref(
  // Read from localStorage if present; otherwise use default config
  JSON.parse(localStorage.getItem(paginationKey) || 'null') || {
    page: 1,
    rowsPerPage: 5, // default value (initial page size)
    sortBy: 'name',
    descending: false,
  }
)

// When pagination changes (page, rowsPerPage, sort), save it to localStorage
watch(
  pagination,
  (val) => localStorage.setItem(paginationKey, JSON.stringify(val)),
  { deep: true }
)

/**
 * ===== Table columns definition =====
 * - name: internal column id
 * - label: header text
 * - field: which property to display from each row object
 * - sortable: enables sorting on header click
 * - sort: custom comparison (French locale, accent-insensitive)
 */
const columns = [
  {
    name: 'name',
    align: 'left',
    label: 'User',
    field: 'name',
    sortable: true,
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
    sortable: true,
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  { name: 'canEdit', align: 'center', label: 'Can Edit', field: 'canEdit' },
  { name: 'canValidate', align: 'center', label: 'Can Validate', field: 'canValidate' },
  { name: 'canPublish', align: 'center', label: 'Can Publish', field: 'canPublish' },
  { name: 'action', align: 'center', label: '', field: 'action' },
]

/**
 * Reactive table data and loading state.
 * - users: array of user objects displayed in the table
 * - loading: controls the q-table loading spinner
 */
const users = ref([])
const loading = ref(false)

/**
 * Load users when the page is mounted.
 * loadUsers() reads from localStorage first (if present), otherwise from /data/users.json.
 */
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

/**
 * Auto-save users to localStorage any time the list changes:
 * - checkbox toggles update permissions
 * - adding/removing users updates the array
 */
watch(
  users,
  (val) => saveUsers(val),
  { deep: true }
)

/**
 * ===== Delete flow =====
 * confirmDelete() opens a confirmation dialog
 * If the user confirms, we call deleteUser() to remove the row.
 */
const confirmDelete = (user) => {
  $q.dialog({
    title: 'Confirm',
    message: `Would you like to remove ${user.name}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteUser(user)
  })
}

// Removes a user by email (email is the unique key)
const deleteUser = (user) => {
  users.value = users.value.filter(u => u.email !== user.email)

  $q.notify({
    color: 'positive',
    message: 'User removed',
  })
}

/**
 * ===== Add User dialog state =====
 * - showAddDialog controls opening/closing of the dialog
 * - newUser contains the form values
 */
const showAddDialog = ref(false)

const newUser = ref({
  name: '',
  email: '',
  canEdit: false,
  canValidate: false,
  canPublish: false,
})

/**
 * addUser() validates the form, checks duplicates, then pushes the new user
 * into the users list.
 */
const addUser = () => {
  // Basic validation
  if (!newUser.value.name || !newUser.value.email) {
    $q.notify({
      color: 'negative',
      message: 'Name and email are required',
    })
    return
  }

  // Prevent duplicates: email should be unique
  if (users.value.some(u => u.email === newUser.value.email)) {
    $q.notify({
      color: 'negative',
      message: 'A user with this email already exists',
    })
    return
  }

  // Add new user to the table data
  users.value.push({ ...newUser.value })

  // Reset the form for next time
  newUser.value = {
    name: '',
    email: '',
    canEdit: false,
    canValidate: false,
    canPublish: false,
  }

  // Close the dialog
  showAddDialog.value = false

  $q.notify({
    color: 'positive',
    message: 'User added',
  })
}
</script>
