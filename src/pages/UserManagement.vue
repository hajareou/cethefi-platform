<template>
  <!-- Main page container with padding and light grey background -->
  <q-page class="q-pa-lg bg-grey-1">
    <!-- White card that contains the whole User Management UI -->
    <q-card flat bordered class="bg-white shadow-1">
      <q-card-section class="q-pa-lg">

        <!-- ===== Header row (title + description + Add User button) ===== -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-h6 text-weight-bold text-grey-9">{{ t('users.authorizedUsers') }}</div>
            <div class="text-caption text-grey-6">
              {{ t('users.manageSubtitle') }}
            </div>
          </div>

          <!-- Opens the "Add User" dialog -->
          <q-btn
            unelevated
            no-caps
            icon="person_add"
            :label="t('users.addUser')"
            color="indigo-9"
            class="q-px-md"
            @click="showAddDialog = true"
          />
        </div>

        <!-- ===== Search bar row ===== -->
        <div class="q-mb-mdx">
          <div class="q-mb-md">
            <!-- Text filter used by q-table (:filter="filter") -->
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              :placeholder="t('users.searchPlaceholder')"
              class="q-mb-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <!-- Permission filters (like document status filters) -->
            <div class="row items-center q-gutter-md">
              <q-checkbox v-model="permFilter.isAdmin" :label="t('common.admin')" dense />
              <q-checkbox v-model="permFilter.canEdit" :label="t('users.canModify')" dense />
              <q-checkbox v-model="permFilter.canValidate" :label="t('users.canValidate')" dense />
              <q-checkbox v-model="permFilter.canPublish" :label="t('users.canPublish')" dense />
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
          row-key="identityKey"
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
                :model-value="props.row.isAdmin || props.row.canEdit"
                color="indigo-9"
                :disable="props.row.isAdmin"
                @update:model-value="(value) => (props.row.canEdit = value)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-isAdmin="props">
            <q-td :props="props" class="text-center">
              <q-checkbox
                dense
                v-model="props.row.isAdmin"
                color="negative"
                @update:model-value="handleAdminToggle(props.row)"
              />
            </q-td>
          </template>

          <!-- Custom cell: Can Validate checkbox -->
          <template v-slot:body-cell-canValidate="props">
            <q-td :props="props" class="text-center">
              <q-checkbox
                dense
                :model-value="props.row.isAdmin || props.row.canValidate"
                color="indigo-9"
                :disable="props.row.isAdmin"
                @update:model-value="(value) => (props.row.canValidate = value)"
              />
            </q-td>
          </template>

          <!-- Custom cell: Can Publish checkbox -->
          <template v-slot:body-cell-canPublish="props">
            <q-td :props="props" class="text-center">
              <q-checkbox
                dense
                :model-value="props.row.isAdmin || props.row.canPublish"
                color="indigo-9"
                :disable="props.row.isAdmin"
                @update:model-value="(value) => (props.row.canPublish = value)"
              />
            </q-td>
          </template>

          <!-- Custom cell: Delete and Edit action button -->
           <template v-slot:body-cell-action="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                round
                dense
                icon="more_vert"
                color="grey-8"
              >
                <q-menu>
                  <q-list style="min-width: 160px">

                    <!-- Modify -->
                    <q-item clickable v-close-popup @click="openEditUser(props.row)">
                      <q-item-section avatar>
                        <q-icon name="edit" />
                      </q-item-section>
                      <q-item-section>{{ t('common.modify') }}</q-item-section>
                    </q-item>

                    <q-separator />

                    <!-- Delete -->
                    <q-item clickable v-close-popup @click="confirmDelete(props.row)">
                      <q-item-section avatar>
                        <q-icon name="delete" color="negative" />
                      </q-item-section>
                      <q-item-section class="text-negative">
                        {{ t('common.delete') }}
                      </q-item-section>
                    </q-item>

                  </q-list>
                </q-menu>
              </q-btn>
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
        <div class="text-h6">{{ t('users.addUser') }}</div>
      </q-card-section>

      <!-- Form fields -->
      <q-card-section class="q-gutter-md">
        <!-- User name -->
        <q-input
          v-model="newUser.name"
          :label="t('common.name')"
          outlined
          dense
        />

        <!-- User email -->
        <q-input
          v-model="newUser.email"
          :label="t('common.email')"
          type="email"
          outlined
          dense
        />

        <q-input
          v-model="newUser.githubUsername"
          :label="t('users.githubUsername')"
          outlined
          dense
        />

        <!-- Permission checkboxes -->
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-checkbox
              v-model="newUser.isAdmin"
              :label="t('common.admin')"
              color="negative"
              @update:model-value="handleAdminToggle(newUser)"
            />
          </div>
          <div class="col">
            <q-checkbox v-model="newUser.canEdit" :label="t('users.canModify')" :disable="newUser.isAdmin" />
          </div>
          <div class="col">
            <q-checkbox
              v-model="newUser.canValidate"
              :label="t('users.canValidate')"
              :disable="newUser.isAdmin"
            />
          </div>
          <div class="col">
            <q-checkbox
              v-model="newUser.canPublish"
              :label="t('users.canPublish')"
              :disable="newUser.isAdmin"
            />
          </div>
        </div>
      </q-card-section>

      <!-- Dialog actions -->
      <q-card-actions align="right">
        <!-- Cancel closes the dialog -->
        <q-btn flat :label="t('common.cancel')" color="grey-7" v-close-popup />
        <!-- Add validates the form and pushes a new user to the list -->
        <q-btn unelevated :label="t('common.add')" color="indigo-9" @click="addUser" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- ===== Modify User Dialog ===== -->
  <q-dialog v-model="showEditUserDialog" persistent>
    <q-card style="min-width: 420px">
      <q-card-section>
        <div class="text-h6">{{ t('users.editUser') }}</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input v-model="editUser.name" :label="t('common.name')" outlined dense />
        <q-input v-model="editUser.email" :label="t('common.email')" type="email" outlined dense />
        <q-input v-model="editUser.githubUsername" :label="t('users.githubUsername')" outlined dense />
        <q-checkbox
          v-model="editUser.isAdmin"
          :label="t('common.admin')"
          color="negative"
          @update:model-value="handleAdminToggle(editUser)"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="t('common.cancel')" color="grey-7" v-close-popup />
        <q-btn unelevated :label="t('common.save')" color="indigo-9" @click="saveEditedUser" />
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
import { onBeforeRouteLeave } from 'vue-router'
import { useLocale } from 'src/i18n'

// Users are loaded/saved through backend API routes.
import { loadUsers, saveUsers } from 'src/services/storage'

/**
 * Quasar instance ($q) gives access to:
 * - $q.notify() for toasts
 * - $q.dialog() for confirmation popups
 */
const $q = useQuasar()
const { t } = useLocale()

/**
 * Search filter for q-table.
 * q-table will filter by matching text across visible fields.
 */
const filter = ref('')

// Permission filter checkboxes (all false by default)
const permFilter = ref({
  isAdmin: false,
  canEdit: false,
  canValidate: false,
  canPublish: false,
})

// Filter users by selected permissions:
// - if no permission selected -> show ALL users
// - if some selected -> show users that match ANY selected permission
const filteredUsers = computed(() => {
  const selected = []

  if (permFilter.value.isAdmin) selected.push('isAdmin')
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
const pageSizeKey = 'usersRowsPerPage'

// pagination state (only rowsPerPage is restored from sessionStorage)
const pagination = ref({
  page: 1,
  rowsPerPage: Number(sessionStorage.getItem(pageSizeKey)) || 5,
  sortBy: 'name',
  descending: false,
})

// save only rowsPerPage while staying on this page
watch(
  () => pagination.value.rowsPerPage,
  (val) => sessionStorage.setItem(pageSizeKey, String(val))
)

// clear rowsPerPage when leaving the route
onBeforeRouteLeave(() => {
  sessionStorage.removeItem(pageSizeKey)
})

/**
 * ===== Table columns definition =====
 * - name: internal column id
 * - label: header text
 * - field: which property to display from each row object
 * - sortable: enables sorting on header click
 * - sort: custom comparison (French locale, accent-insensitive)
 */
const columns = computed(() => [
  {
    name: 'name',
    align: 'left',
    label: t('users.user'),
    field: 'name',
    sortable: true,
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  {
    name: 'email',
    align: 'left',
    label: t('common.email'),
    field: 'email',
    sortable: true,
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  {
    name: 'githubUsername',
    align: 'left',
    label: t('common.github'),
    field: 'githubUsername',
    sortable: true,
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  { name: 'isAdmin', align: 'center', label: t('common.admin'), field: 'isAdmin' },
  { name: 'canEdit', align: 'center', label: t('users.canModify'), field: 'canEdit' },
  { name: 'canValidate', align: 'center', label: t('users.canValidate'), field: 'canValidate' },
  { name: 'canPublish', align: 'center', label: t('users.canPublish'), field: 'canPublish' },
  { name: 'action', align: 'center', label: '', field: 'action' },
])

/**
 * Reactive table data and loading state.
 * - users: array of user objects displayed in the table
 * - loading: controls the q-table loading spinner
 */
const users = ref([])
const loading = ref(false)
const hasLoadedUsers = ref(false)

const normalizeIdentity = (value) => String(value || '').trim().toLowerCase()
const normalizeGithubId = (value) => String(value || '').trim()

const buildIdentityKey = (user) =>
  normalizeGithubId(user?.githubId) ||
  normalizeIdentity(user?.email) ||
  normalizeIdentity(user?.githubUsername)

const normalizeUserEntry = (user = {}) => {
  const normalized = {
    ...user,
    githubId: normalizeGithubId(user.githubId),
    email: String(user.email || '').trim(),
    githubUsername: String(user.githubUsername || '').trim(),
    isAdmin: !!user.isAdmin,
    canEdit: !!user.canEdit,
    canValidate: !!user.canValidate,
    canPublish: !!user.canPublish,
  }

  return {
    ...normalized,
    identityKey: buildIdentityKey(normalized),
  }
}

/**
 * Load users when the page is mounted from backend API.
 */
onMounted(async () => {
  loading.value = true
  try {
    users.value = (await loadUsers()).map(normalizeUserEntry)
    hasLoadedUsers.value = true
  } catch (e) {
    $q.notify({ color: 'negative', message: e?.message || t('users.loadFailed') })
  } finally {
    loading.value = false
  }
})

/**
 * Persist users to backend API with debounce to avoid request bursts.
 */
let saveTimer = null
const persistUsers = (val) => {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    try {
      const payload = val.map((entry) => {
        const user = { ...entry }
        delete user.identityKey

        return {
          ...user,
          canEdit: user.isAdmin ? false : user.canEdit,
          canValidate: user.isAdmin ? false : user.canValidate,
          canPublish: user.isAdmin ? false : user.canPublish,
        }
      })
      await saveUsers(payload)
    } catch (e) {
      $q.notify({ color: 'negative', message: e?.message || t('users.saveFailed') })
    }
  }, 250)
}

/**
 * ===== Delete flow =====
 * confirmDelete() opens a confirmation dialog
 * If the user confirms, we call deleteUser() to remove the row.
 */
const confirmDelete = (user) => {
  $q.dialog({
    title: t('users.confirm'),
    message: t('users.deleteConfirm', { name: user.name }),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteUser(user)
  })
}

// Removes a user by email (email is the unique key)
const deleteUser = (user) => {
  users.value = users.value.filter((u) => u.identityKey !== user.identityKey)

  $q.notify({
    color: 'positive',
    message: t('users.userRemoved'),
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
  githubUsername: '',
  isAdmin: false,
  canEdit: false,
  canValidate: false,
  canPublish: false,
})

const handleAdminToggle = (target) => {
  if (!target) return

  if (target.isAdmin) {
    target.canEdit = false
    target.canValidate = false
    target.canPublish = false
  }
}

/**
 * addUser() validates the form, checks duplicates, then pushes the new user
 * into the users list.
 */
const addUser = () => {
  // Basic validation
  if (!newUser.value.name || (!newUser.value.email && !newUser.value.githubUsername)) {
    $q.notify({
      color: 'negative',
      message: t('users.nameOrIdentityRequired'),
    })
    return
  }

  const email = newUser.value.email.trim()
  const githubUsername = newUser.value.githubUsername.trim()

  const duplicate = users.value.some(
    (u) =>
      (email && normalizeIdentity(u.email) === normalizeIdentity(email)) ||
      (githubUsername &&
        normalizeIdentity(u.githubUsername) === normalizeIdentity(githubUsername)),
  )

  if (duplicate) {
    $q.notify({
      color: 'negative',
      message: t('users.emailOrGithubExists'),
    })
    return
  }

  // Add new user to the table data
  users.value.push(normalizeUserEntry({
    ...newUser.value,
    email,
    githubUsername,
  }))

  // Reset the form for next time
  newUser.value = {
    name: '',
    email: '',
    githubUsername: '',
    isAdmin: false,
    canEdit: false,
    canValidate: false,
    canPublish: false,
  }

  // Close the dialog
  showAddDialog.value = false

  $q.notify({
    color: 'positive',
    message: t('users.added'),
  })
}

// Modify user dialogue 
const showEditUserDialog = ref(false)

// keep track of which user is being edited
const editUserOriginalKey = ref(null)

// editable copy

const editUserOriginal = ref({ name: '', email: '', githubUsername: '', isAdmin: false })

const editUser = ref({
  name: '',
  email: '',
  githubUsername: '',
  isAdmin: false,
})

const openEditUser = (row) => {
  editUserOriginalKey.value = row.identityKey

  editUserOriginal.value = {
    name: row.name,
    email: row.email,
    githubUsername: row.githubUsername,
    isAdmin: !!row.isAdmin,
  }

  editUser.value = {
    name: row.name,
    email: row.email,
    githubUsername: row.githubUsername,
    isAdmin: !!row.isAdmin,
  }

  showEditUserDialog.value = true
}


const saveEditedUser = () => {
  const name = editUser.value.name.trim()
  const email = editUser.value.email.trim()
  const githubUsername = editUser.value.githubUsername.trim()
  const isAdmin = !!editUser.value.isAdmin

  if (!name || (!email && !githubUsername)) {
    $q.notify({ color: 'negative', message: t('users.nameOrIdentityRequired') })
    return
  }

  const originalName = (editUserOriginal.value.name || '').trim()
  const originalEmail = (editUserOriginal.value.email || '').trim()
  const originalGithubUsername = (editUserOriginal.value.githubUsername || '').trim()
  const originalIsAdmin = !!editUserOriginal.value.isAdmin

  if (
    name === originalName &&
    email === originalEmail &&
    githubUsername === originalGithubUsername &&
    isAdmin === originalIsAdmin
  ) {
    $q.notify({ color: 'info', message: t('users.noChanges') })
    showEditUserDialog.value = false
    return
  }

  const duplicate = users.value.some((u) => {
    if (u.identityKey === editUserOriginalKey.value) return false

    return (
      (email && normalizeIdentity(u.email) === normalizeIdentity(email)) ||
      (githubUsername &&
        normalizeIdentity(u.githubUsername) === normalizeIdentity(githubUsername))
    )
  })

  if (duplicate) {
    $q.notify({
      color: 'negative',
      message: t('users.emailOrGithubExists'),
    })
    return
  }

  const idx = users.value.findIndex((u) => u.identityKey === editUserOriginalKey.value)
  if (idx === -1) {
    $q.notify({ color: 'negative', message: t('users.userNotFound') })
    return
  }

  users.value[idx] = normalizeUserEntry({
    ...users.value[idx],
    name,
    email,
    githubUsername,
    isAdmin,
  })

  showEditUserDialog.value = false
  $q.notify({ color: 'positive', message: t('users.userUpdated') })
}

// --- Notify when permissions change (debounced) ---
let permToastTimer = null
let prevPermSnapshot = new Map()

// build a snapshot we can compare later
const snapshotPerms = (list) => {
  const m = new Map()
  for (const u of list) {
    m.set(u.identityKey, {
      canEdit: !!u.canEdit,
      canValidate: !!u.canValidate,
      canPublish: !!u.canPublish,
      isAdmin: !!u.isAdmin,
    })
  }
  return m
}

// initialize snapshot once users are loaded (first change will come after load)
watch(
  users,
  (val) => {
    if (!hasLoadedUsers.value) return
    persistUsers(val)

    // If it's the very first time or we don't have a baseline yet, set it and stop
    if (prevPermSnapshot.size === 0) {
      prevPermSnapshot = snapshotPerms(val)
      return
    }

    // Detect if any permission changed
    let changed = false
    for (const u of val) {
      const prev = prevPermSnapshot.get(u.identityKey)
      if (!prev) continue
      if (
        prev.canEdit !== !!u.canEdit ||
        prev.canValidate !== !!u.canValidate ||
        prev.canPublish !== !!u.canPublish ||
        prev.isAdmin !== !!u.isAdmin
      ) {
        changed = true
        break
      }
    }

    // Update snapshot for next comparison
    prevPermSnapshot = snapshotPerms(val)

    if (!changed) return

    // Debounce notifications so you don't get spammed on rapid clicks
    if (permToastTimer) clearTimeout(permToastTimer)
    permToastTimer = setTimeout(() => {
      $q.notify({
        message: t('users.permissionsUpdated'),
        color: 'positive',
      })
    }, 250)
  },
  { deep: true }
)

</script>
