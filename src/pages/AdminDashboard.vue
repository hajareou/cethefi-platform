<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-white">
          <q-card-section class="row items-center no-wrap">
            <q-avatar
              rounded
              color="blue-1"
              text-color="primary"
              icon="menu_book"
              size="50px"
              font-size="28px"
            />
            <div class="q-ml-md">
              <div class="text-caption text-grey-7 text-weight-medium">Total Documents</div>
              <div class="text-h4 text-weight-bolder text-grey-9">{{ counters.total }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-white">
          <q-card-section class="row items-center no-wrap">
            <q-avatar
              rounded
              color="orange-1"
              text-color="orange-9"
              icon="schedule"
              size="50px"
              font-size="28px"
            />
            <div class="q-ml-md">
              <div class="text-caption text-grey-7 text-weight-medium">Waiting for review</div>
              <div class="text-h4 text-weight-bolder text-grey-9">
                {{ counters.waiting }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-white">
          <q-card-section class="row items-center no-wrap">
            <q-avatar
              rounded
              color="green-1"
              text-color="green-7"
              icon="check_circle"
              size="50px"
              font-size="28px"
            />
            <div class="q-ml-md">
              <div class="text-caption text-grey-7 text-weight-medium">Published</div>
              <div class="text-h4 text-weight-bolder text-grey-9">{{ counters.published }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="bg-white">
      <q-card-section class="q-pa-md">
        <!-- Header row: title left, buttons right -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-h6 text-weight-bold text-grey-9">TEI Documents</div>
            <div class="text-caption text-grey-6">
              Manage and edit theatrical plays from the 18th century
            </div>
          </div>

          <div class="row q-gutter-sm">
            <q-btn
              v-if="!isGuest"
              outline
              no-caps
              :icon="githubIcon"
              label="Import from GitHub"
              color="grey-8"
              @click="fetchGithubData"
            />
            <q-btn
              v-if="!isGuest"
              unelevated
              no-caps
              icon="add"
              label="New Document"
              color="primary"
            />
          </div>
        </div>

        <!-- Second row: search + status filters -->
        <div class="q-mb-md">
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search..."
            class="q-mb-sm"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="row items-center q-gutter-md">
            <q-checkbox v-model="statusFilter.published" label="Published" dense />
            <q-checkbox v-model="statusFilter.reviewed" label="Reviewed" dense />
            <q-checkbox v-model="statusFilter.submitted" label="Submitted for review" dense />
            <q-checkbox v-model="statusFilter.draft" label="Draft" dense />
          </div>
        </div>
        <q-table
          :rows="filteredRows"
          :columns="columns"
          row-key="id"
          flat
          :filter="filter"
          :rows-per-page-options="[5, 10, 20, 50]"
          class="text-grey-9"
          :loading="loading"
          v-model:pagination="pagination"
          @row-click="onRowClick"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props" class="text-center">
              <q-chip
                dense
                flat
                :color="getStatusColor(props.value).bg"
                :text-color="getStatusColor(props.value).text"
                class="text-weight-bold q-px-sm"
              >
                {{ formatStatus(props.value) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round dense icon="more_vert" color="grey-8" @click.stop>
                <q-menu
                  :model-value="openMenuId === props.row.id"
                  @update:model-value="(val) => setMenuOpen(props.row.id, val)"
                >
                  <q-list style="min-width: 200px">
                    <!-- DRAFT -->
                    <q-item
                      v-if="props.row.status === STATUS.DRAFT"
                      clickable
                      v-close-popup
                      @click="editDocument(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="edit" />
                      </q-item-section>
                      <q-item-section>Edit</q-item-section>
                    </q-item>

                    <q-item
                      v-if="props.row.status === STATUS.DRAFT"
                      clickable
                      v-close-popup
                      @click="submitForReview(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="send" />
                      </q-item-section>
                      <q-item-section>Submit for review</q-item-section>
                    </q-item>

                    <!-- SUBMITTED FOR REVIEW -->
                    <q-item
                      v-if="props.row.status === STATUS.SUBMITTED"
                      clickable
                      v-close-popup
                      @click="approveToReviewed(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="task_alt" />
                      </q-item-section>
                      <q-item-section>Approve</q-item-section>
                    </q-item>

                    <q-item
                      v-if="props.row.status === STATUS.SUBMITTED"
                      clickable
                      v-close-popup
                      @click="rejectToDraft(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="undo" />
                      </q-item-section>
                      <q-item-section>Reject</q-item-section>
                    </q-item>

                    <!-- REVIEWED -->
                    <q-item
                      v-if="props.row.status === STATUS.REVIEWED"
                      clickable
                      v-close-popup
                      @click="publishDocument(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="publish" />
                      </q-item-section>
                      <q-item-section>Publish</q-item-section>
                    </q-item>
                    <q-item
                      v-if="props.row.status === STATUS.REVIEWED"
                      clickable
                      v-close-popup
                      @click="editDocument(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="edit" />
                      </q-item-section>
                      <q-item-section>Edit</q-item-section>
                    </q-item>

                    <!-- PUBLISHED -->
                    <q-item
                      v-if="props.row.status === STATUS.PUBLISHED"
                      clickable
                      v-close-popup
                      @click="unpublishDocument(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="visibility_off" />
                      </q-item-section>
                      <q-item-section>Unpublish</q-item-section>
                    </q-item>

                    <q-separator />

                    <!-- DELETE (always available) -->
                    <q-item clickable v-close-popup @click="confirmDeleteDocument(props.row)">
                      <q-item-section avatar>
                        <q-icon name="delete" color="negative" />
                      </q-item-section>
                      <q-item-section class="text-negative"> Delete </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
        </q-table>
        <q-dialog v-model="showDocViewer" full-width full-height>
          <q-card class="bg-white">

            <!-- Header -->
            <q-card-section class="row items-center justify-between">
              <div>
                <div class="text-h6">{{ selectedDoc?.title }}</div>
                <div class="text-caption text-grey-6">
                  Status: {{ formatStatus(selectedDoc?.status) }}
                </div>
              </div>

              <q-btn flat round icon="close" v-close-popup />
            </q-card-section>

            <q-separator />

            <!-- Content (scrollable) -->
            <q-card-section class="q-pa-none">
              <q-inner-loading :showing="docLoading" />

              <q-scroll-area style="height: 70vh;">
                <div class="q-pa-md">
                  <pre style="white-space: pre-wrap; margin: 0;">{{ docText }}</pre>
                </div>
              </q-scroll-area>
            </q-card-section>

            <q-separator />

            <!-- Footer actions -->
            <q-card-actions align="between" class="q-pa-md">

              <!-- Guest: show only login CTA -->
              <div v-if="isGuest" class="row items-center justify-between full-width">
                <div class="text-caption text-grey-6">
                  You are in guest mode. Login to edit.
                </div>

                <q-btn
                  unelevated
                  no-caps
                  color="indigo-9"
                  label="Login to edit"
                  @click="goToLogin"
                />
              </div>

              <!-- Logged-in: show status-based actions -->
              <div v-else class="row items-center justify-between full-width">

                <!-- Left side: main workflow actions -->
                <div class="row q-gutter-sm">

                  <!-- DRAFT -->
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.DRAFT"
                    outline
                    no-caps
                    icon="send"
                    label="Submit for review"
                    color="orange-9"
                    @click="submitForReview(selectedDoc)"
                  />
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.DRAFT"
                    outline
                    no-caps
                    icon="edit"
                    label="Edit"
                    color="grey-8"
                    @click="editDocument(selectedDoc)"
                  />

                  <!-- SUBMITTED -->
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.SUBMITTED"
                    outline
                    no-caps
                    icon="task_alt"
                    label="Approve"
                    color="blue-8"
                    @click="approveToReviewed(selectedDoc)"
                  />
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.SUBMITTED"
                    outline
                    no-caps
                    icon="undo"
                    label="Reject"
                    color="grey-8"
                    @click="rejectToDraft(selectedDoc)"
                  />

                  <!-- REVIEWED -->
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.REVIEWED"
                    unelevated
                    no-caps
                    icon="publish"
                    label="Publish"
                    color="positive"
                    @click="publishDocument(selectedDoc)"
                  />
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.REVIEWED"
                    outline
                    no-caps
                    icon="edit"
                    label="Edit"
                    color="grey-8"
                    @click="editDocument(selectedDoc)"
                  />


                  <!-- PUBLISHED -->
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.PUBLISHED"
                    outline
                    no-caps
                    icon="visibility_off"
                    label="Unpublish"
                    color="negative"
                    @click="unpublishDocument(selectedDoc)"
                  />
                </div>

                <!-- Right side: delete -->
                <q-btn
                  flat
                  no-caps
                  icon="delete"
                  color="negative"
                  label="Delete"
                  @click="confirmDeleteDocument(selectedDoc)"
                />
              </div>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getRepoFileJson, getLastCommit, getRepoFileText } from '../services/githubRepo.js'
import { useQuasar } from 'quasar'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const authMode = ref(localStorage.getItem('authMode') || 'guest')
const isGuest = computed(() => authMode.value === 'guest')

const router = useRouter()

const goToLogin = () => router.push('/login')

// Quasar instance for dialogs and notifications
const $q = useQuasar()

// Main table data
const rows = ref([])

// Loading state for table
const loading = ref(false)

// Text search filter
const filter = ref('')

// GitHub repository configuration
const owner = 'hajareou'
const repo = 'leafwriter-test'
const INDEX_JSON_PATH = 'index.json'

// Centralized status values used across the app
const STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted for review',
  REVIEWED: 'Reviewed',
  PUBLISHED: 'Published',
}

// GitHub SVG icon path
const githubIcon =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'

const pageSizeKey = 'adminDocsRowsPerPage'

// Table pagination state
const pagination = ref({
  page: 1,
  rowsPerPage: Number(sessionStorage.getItem(pageSizeKey)) || 10, // default
  sortBy: 'title',
  descending: false,
})

watch(
  () => pagination.value.rowsPerPage,
  (val) => sessionStorage.setItem(pageSizeKey, String(val))
)

onBeforeRouteLeave(() => {
  sessionStorage.removeItem(pageSizeKey)
})

// Table column definitions
const baseColumns = [
  {
    name: 'title',
    align: 'left',
    label: 'Document Title',
    field: 'title',
    sortable: true,
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  {
    name: 'author',
    align: 'left',
    label: 'Author',
    field: 'author',
    sortable: true,
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  {
    name: 'year',
    label: 'Year',
    field: 'year',
    sortable: true,
    align: 'center',
    sort: (a, b) => a - b,
  },
  {
    name: 'last_modified',
    align: 'center',
    label: 'Last Modified',
    field: 'lastModified',
    sortable: true,
    sort: (a, b) => (Date.parse(a) || 0) - (Date.parse(b) || 0),
  },
  { name: 'status', align: 'center', label: 'Status', field: 'status' },
]
const actionColumn = {
  name: 'action',
  align: 'center',
  label: 'Action',
  field: 'action',
}

const columns = computed(() => {
  return isGuest.value ? baseColumns : [...baseColumns, actionColumn]
})

/*
  Dashboard counters:
  - total: all documents
  - waiting: submitted for review
  - published: published documents
*/
const counters = computed(() => {
  const total = rows.value.length
  const waiting = rows.value.filter((r) => r.status === STATUS.SUBMITTED).length
  const published = rows.value.filter((r) => r.status === STATUS.PUBLISHED).length

  return { total, waiting, published }
})

/*
  Converts internal status to display label
*/
const formatStatus = (status) => {
  if (!status) return 'Unknown'
  if (status === STATUS.DRAFT) return 'Draft'
  if (status === STATUS.REVIEWED) return 'Reviewed'
  if (status === STATUS.PUBLISHED) return 'Published'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

/*
  Normalizes incoming GitHub status values
  so they match the app's STATUS constants
*/
const normalizeStatus = (status) => {
  if (!status) return 'Unknown'
  const value = status.toString().trim().toLowerCase()
  if (value === 'draft' || value === 'drafts') return STATUS.DRAFT
  if (value === 'submitted' || value === 'submitted for review' || value === 'under review') {
    return STATUS.SUBMITTED
  }
  if (value === 'reviewed') return STATUS.REVIEWED
  if (value === 'published') return STATUS.PUBLISHED
  return status
}

/*
  Returns chip colors for each status
*/
const getStatusColor = (status) => {
  if (status === STATUS.PUBLISHED) return { bg: 'green-1', text: 'green-8' }
  if (status === STATUS.REVIEWED) return { bg: 'blue-1', text: 'blue-8' }
  if (status === STATUS.SUBMITTED) return { bg: 'orange-1', text: 'orange-9' }
  if (status === STATUS.DRAFT) return { bg: 'grey-2', text: 'grey-8' }
  return { bg: 'grey-2', text: 'grey-8' }
}

/*
  Loads documents from GitHub index.json
  Then:
  - normalizes data
  - applies local overrides
  - fetches last commit info
*/
async function fetchGithubData() {
  loading.value = true
  try {
    const data = await getRepoFileJson({ owner, repo, path: INDEX_JSON_PATH })
    if (!Array.isArray(data)) {
      rows.value = []
      return
    }

    // Map GitHub data to table rows
    const flat = data.map((doc) => ({
      id: doc?.id ?? doc?.storage_path ?? doc?.title ?? Math.random().toString(36).slice(2),
      title: (doc?.title ?? '').replace(/\.xml$/i, ''),
      author: doc?.author ?? '-',
      year: doc?.year ?? null,
      lastModified: doc?.last_modified ?? null,
      status: normalizeStatus(doc?.status),
      _path: doc?.storage_path ?? null,
    }))

    // Load local status overrides
    const overrides = loadOverrides()

    for (const row of flat) {
      const o = overrides[row.id]
      if (o?.status) row.status = o.status
    }

    // Sort documents
    flat.sort((a, b) =>
      (a.status + a.title).localeCompare(b.status + b.title, 'fr', { sensitivity: 'base' }),
    )

    rows.value = flat

    // Fetch commit metadata
    for (const row of rows.value) {
      if (!row._path) continue
      const commitData = await getLastCommit({ owner, repo, path: row._path })
      const author = commitData?.commit?.author?.name ?? null
      const dateIso = commitData?.commit?.author?.date ?? null
      if (!row.author || row.author === '-') row.author = author ?? '-'
      if (!row.lastModified) row.lastModified = dateIso ? dateIso.split('T')[0] : null
    }

    rows.value = [...rows.value]
  } catch (e) {
    console.error('Error fetching GitHub data:', e)
    rows.value = []
  } finally {
    loading.value = false
  }
}

// Load data on page mount
onMounted(() => {
  fetchGithubData()
})

/*
  Status transition actions
  Each one:
  - updates status
  - saves override locally
  - closes menu
*/
const submitForReview = (doc) => {
  doc.status = STATUS.SUBMITTED
  saveDocOverride(doc)
  closeMenu()
}

const rejectToDraft = (doc) => {
  doc.status = STATUS.DRAFT
  saveDocOverride(doc)
  closeMenu()
}

const approveToReviewed = (doc) => {
  doc.status = STATUS.REVIEWED
  saveDocOverride(doc)
  closeMenu()
}

const publishDocument = (doc) => {
  doc.status = STATUS.PUBLISHED
  saveDocOverride(doc)
  closeMenu()
}

const unpublishDocument = (doc) => {
  doc.status = STATUS.DRAFT
  saveDocOverride(doc)
  closeMenu()
}

/*
  Delete confirmation dialog
*/

  const closeDocViewer = () => {
  showDocViewer.value = false
  selectedDoc.value = null
  docText.value = ''
}

const confirmDeleteDocument = (doc) => {
  $q.dialog({
    title: 'Confirm deletion',
    message: `Are you sure you want to delete "${doc.title}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteDocument(doc)
    closeDocViewer()
  })
}

/*
  Remove document from table
  and from local overrides
*/
const deleteDocument = (doc) => {
  rows.value = rows.value.filter((d) => d.id !== doc.id)

  const overrides = loadOverrides()
  delete overrides[doc.id]
  saveOverrides(overrides)

  $q.notify({
    color: 'negative',
    message: 'Document deleted',
  })
}

/*
  Controls which dropdown menu is open
*/
const openMenuId = ref(null)

const setMenuOpen = (id, val) => {
  if (val) openMenuId.value = id
  else if (openMenuId.value === id) openMenuId.value = null
}

const closeMenu = () => {
  openMenuId.value = null
}

/*
  LocalStorage key for status overrides
*/
const DOC_OVERRIDES_KEY = 'docOverrides'

/*
  Load overrides from localStorage
*/
const loadOverrides = () => {
  try {
    return JSON.parse(localStorage.getItem(DOC_OVERRIDES_KEY) || '{}')
  } catch {
    return {}
  }
}

/*
  Save full overrides object
*/
const saveOverrides = (overrides) => {
  localStorage.setItem(DOC_OVERRIDES_KEY, JSON.stringify(overrides))
}

/*
  Save status for a single document
*/
const saveDocOverride = (doc) => {
  const overrides = loadOverrides()
  overrides[doc.id] = {
    status: doc.status,
  }
  saveOverrides(overrides)
}

/*
  Status checkbox filter state
*/
const statusFilter = ref({
  draft: false,
  submitted: false,
  reviewed: false,
  published: false,
})

/*
  Computed rows filtered by status checkboxes
*/
const filteredRows = computed(() => {
  const selected = []

  if (statusFilter.value.draft) selected.push(STATUS.DRAFT)
  if (statusFilter.value.submitted) selected.push(STATUS.SUBMITTED)
  if (statusFilter.value.reviewed) selected.push(STATUS.REVIEWED)
  if (statusFilter.value.published) selected.push(STATUS.PUBLISHED)

  // If nothing selected -> show ALL documents
  if (selected.length === 0) return rows.value

  // Otherwise show only rows whose status is selected
  return rows.value.filter(r => selected.includes(r.status))
})

const onRowClick = (evt, row) => {
  openDocViewer(row)
}

const showDocViewer = ref(false)
const selectedDoc = ref(null)
const docText = ref('')
const docLoading = ref(false)

const openDocViewer = async (doc) => {
  if (!doc?._path) {
    $q.notify({ color: 'negative', message: 'No file path available for this document' })
    return
  }

  selectedDoc.value = doc
  docText.value = ''
  showDocViewer.value = true
  docLoading.value = true

  try {
    docText.value = await getRepoFileText({
      owner,
      repo,
      path: doc._path,
      ref: 'main', 
    })
  } catch (e) {
    $q.notify({ color: 'negative', message: e?.message || 'Failed to load document' })
  } finally {
    docLoading.value = false
  }
}

</script>
