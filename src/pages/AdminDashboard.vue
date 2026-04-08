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
              <div class="text-caption text-grey-7 text-weight-medium">{{ t('common.totalDocuments') }}</div>
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
              <div class="text-caption text-grey-7 text-weight-medium">{{ t('common.submittedForReview') }}</div>
              <div class="text-h4 text-weight-bolder text-grey-9">
                {{ counters.submitted }}
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
              <div class="text-caption text-grey-7 text-weight-medium">{{ t('common.published') }}</div>
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
            <div class="text-h6 text-weight-bold text-grey-9">{{ t('dashboard.tableTitle') }}</div>
            <div class="text-caption text-grey-6">
              {{ t('dashboard.manageSubtitle') }}
            </div>
          </div>
        </div>

        <!-- Second row: search + status filters -->
        <div class="q-mb-md">
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            :placeholder="t('common.search')"
            class="q-mb-sm"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="row items-center q-gutter-md">
            <q-checkbox v-model="statusFilter.published" :label="t('common.published')" dense />
            <q-checkbox v-model="statusFilter.reviewed" :label="t('common.reviewed')" dense />
            <q-checkbox v-model="statusFilter.submitted" :label="t('common.submittedForReview')" dense />
            <q-checkbox v-model="statusFilter.draft" :label="t('common.draft')" dense />
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
          <template v-slot:body-cell-title="props">
            <q-td :props="props" class="text-left">
              <span class="dashboard-title cursor-help">
                {{ props.value }}
                <q-tooltip v-if="hasFullTitleTooltip(props.value)">
                  {{ props.value }}
                </q-tooltip>
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props" class="text-center">
              <q-chip
                dense
                flat
                square
                class="status-chip-minimal"
                :style="getStatusStyle(props.value)"
              >
                {{ formatStatus(props.value) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-author="props">
            <q-td :props="props" class="text-left">
              <span class="cursor-help">
                {{ props.value }}
                <q-tooltip v-if="hasFullAuthorTooltip(props.value)">
                  {{ props.value }}
                </q-tooltip>
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-edit="props">
            <q-td :props="props" class="text-center">
              <q-btn
                v-if="canRowEdit(props.row)"
                outline
                dense
                no-caps
                color="grey-8"
                :label="t('common.modify')"
                class="compact-action-btn"
                @click.stop="editDocument(props.row)"
              />
              <span v-else class="action-placeholder">-</span>
            </q-td>
          </template>

          <template v-slot:body-cell-submit="props">
            <q-td :props="props" class="text-center">
              <q-btn
                v-if="canRowSubmit(props.row)"
                outline
                dense
                no-caps
                color="orange-9"
                :label="t('common.submit')"
                class="compact-action-btn"
                @click.stop="submitForReview(props.row)"
              />
              <span v-else class="action-placeholder">-</span>
            </q-td>
          </template>

          <template v-slot:body-cell-approve="props">
            <q-td :props="props" class="text-center">
              <q-btn
                v-if="canRowApprove(props.row)"
                outline
                dense
                no-caps
                color="blue-8"
                :label="t('common.approve')"
                class="compact-action-btn"
                @click.stop="approveToReviewed(props.row)"
              />
              <span v-else class="action-placeholder">-</span>
            </q-td>
          </template>

          <template v-slot:body-cell-publish="props">
            <q-td :props="props" class="text-center">
              <q-btn
                v-if="canRowPublish(props.row)"
                dense
                no-caps
                :outline="props.row.status === STATUS.PUBLISHED"
                :color="props.row.status === STATUS.PUBLISHED ? 'negative' : 'positive'"
                :label="props.row.status === STATUS.PUBLISHED ? t('common.unpublish') : t('common.publish')"
                class="compact-action-btn"
                @click.stop="
                  props.row.status === STATUS.PUBLISHED
                    ? unpublishDocument(props.row)
                    : publishDocument(props.row)
                "
              />
              <span v-else class="action-placeholder">-</span>
            </q-td>
          </template>

          <template v-slot:body-cell-reject="props">
            <q-td :props="props" class="text-center">
              <q-btn
                v-if="canRowReject(props.row)"
                outline
                dense
                no-caps
                color="warning"
                :label="t('common.reject')"
                class="compact-action-btn"
                @click.stop="rejectToDraft(props.row)"
              />
              <span v-else class="action-placeholder">-</span>
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
                  {{ t('common.status') }}: {{ formatStatus(selectedDoc?.status) }}
                </div>
              </div>

              <q-btn flat round icon="close" v-close-popup />
            </q-card-section>

            <q-separator />

            <!-- Content (scrollable) -->
            <q-card-section class="q-pa-none">
              <q-inner-loading :showing="docLoading" />

              <q-scroll-area style="height: 70vh">
                <div class="q-pa-md">
                  <div ref="teiContainer" class="tei-container"></div>
                </div>
              </q-scroll-area>
            </q-card-section>

            <q-separator />

            <!-- Footer actions -->
            <q-card-actions align="between" class="q-pa-md">
              <!-- Guest: show only login CTA -->
              <div v-if="isGuest" class="row items-center justify-between full-width">
                <div class="text-caption text-grey-6">{{ t('dashboard.guestModifyHint') }}</div>

                <q-btn
                  unelevated
                  no-caps
                  color="indigo-9"
                  :label="t('dashboard.loginToModify')"
                  @click="goToLogin"
                />
              </div>

              <!-- Logged-in: show status-based actions -->
              <div v-else class="row items-center justify-between full-width">
                <!-- Left side: main workflow actions -->
                <div class="row q-gutter-sm">
                  <!-- DRAFT -->
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.DRAFT && canEdit"
                    outline
                    no-caps
                    icon="send"
                    :label="t('common.submittedForReview')"
                    color="orange-9"
                    @click="submitForReview(selectedDoc)"
                  />
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.DRAFT && canEdit"
                    outline
                    no-caps
                    icon="edit"
                    :label="t('common.modify')"
                    color="grey-8"
                    @click="editDocument(selectedDoc)"
                  />

                  <!-- SUBMITTED -->
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.SUBMITTED && canValidate"
                    outline
                    no-caps
                    icon="task_alt"
                    :label="t('common.approve')"
                    color="blue-8"
                    @click="approveToReviewed(selectedDoc)"
                  />
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.SUBMITTED && canEdit"
                    outline
                    no-caps
                    icon="edit"
                    :label="t('common.modify')"
                    color="grey-8"
                    @click="editDocument(selectedDoc)"
                  />
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.SUBMITTED && canValidate"
                    outline
                    no-caps
                    icon="undo"
                    :label="t('common.reject')"
                    color="warning"
                    @click="rejectToDraft(selectedDoc)"
                  />

                  <!-- REVIEWED -->
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.REVIEWED && canPublish"
                    unelevated
                    no-caps
                    icon="publish"
                    :label="t('common.publish')"
                    color="positive"
                    @click="publishDocument(selectedDoc)"
                  />
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.REVIEWED && canEdit"
                    outline
                    no-caps
                    icon="edit"
                    :label="t('common.modify')"
                    color="grey-8"
                    @click="editDocument(selectedDoc)"
                  />

                  <!-- PUBLISHED -->
                  <q-btn
                    v-if="selectedDoc?.status === STATUS.PUBLISHED && canPublish"
                    outline
                    no-caps
                    icon="visibility_off"
                    :label="t('common.unpublish')"
                    color="negative"
                    @click="unpublishDocument(selectedDoc)"
                  />
                </div>
              </div>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { getRepoFileJson, getRepoFileText } from '../services/githubRepo.js'
import { useQuasar } from 'quasar'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useLocale } from 'src/i18n'
import { useAuthStore } from 'src/stores/auth'
import CETEI from 'CETEIcean'

const authStore = useAuthStore()
const { t } = useLocale()
const isGuest = computed(() => authStore.isGuest)
const grantedPermissions = computed(() =>
  Array.isArray(authStore.permissions) ? authStore.permissions : [],
)
const hasPermission = (permission) =>
  grantedPermissions.value.includes('*') || grantedPermissions.value.includes(permission)
const canEdit = computed(() => !isGuest.value && hasPermission('documents:edit'))
const canValidate = computed(() => !isGuest.value && hasPermission('documents:validate'))
const canPublish = computed(() => !isGuest.value && hasPermission('documents:publish'))
const canUseActions = computed(
  () => !isGuest.value && (canEdit.value || canValidate.value || canPublish.value),
)

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
const owner = import.meta.env.VITE_GITHUB_OWNER
const ownerType = import.meta.env.VITE_GITHUB_OWNER_TYPE
const repo = import.meta.env.VITE_GITHUB_REPO
const INDEX_JSON_PATH = 'index.json'
const LEAFWRITER_URL = import.meta.env.VITE_LEAFWRITER_URL
// Centralized status values used across the app
const STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted for review',
  REVIEWED: 'Reviewed',
  PUBLISHED: 'Published',
}

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
  (val) => sessionStorage.setItem(pageSizeKey, String(val)),
)

onBeforeRouteLeave(() => {
  sessionStorage.removeItem(pageSizeKey)
})

// Table column definitions
const getBaseColumns = () => [
  {
    name: 'title',
    align: 'left',
    label: t('dashboard.title'),
    field: 'title',
    sortable: true,
    classes: 'cell-wrap title-column',
    style: 'width: 240px; max-width: 240px',
    headerStyle: 'width: 240px; max-width: 240px',
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  {
    name: 'author',
    align: 'left',
    label: t('common.author'),
    field: 'author',
    sortable: true,
    classes: 'cell-wrap author-column',
    style: 'width: 88px; max-width: 88px',
    headerStyle: 'width: 88px; max-width: 88px',
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  {
    name: 'year',
    label: t('common.year'),
    field: 'year',
    sortable: true,
    align: 'center',
    style: 'width: 76px; max-width: 76px',
    headerStyle: 'width: 76px; max-width: 76px',
  },
  {
    name: 'last_modified',
    align: 'center',
    label: t('dashboard.lastModified'),
    field: 'lastModified',
    sortable: true,
    style: 'width: 132px; max-width: 132px',
    headerStyle: 'width: 132px; max-width: 132px',
    sort: (a, b) => (Date.parse(a) || 0) - (Date.parse(b) || 0),
  },
  {
    name: 'status',
    align: 'center',
    label: t('common.status'),
    field: 'status',
    style: 'width: 172px; max-width: 172px',
    headerStyle: 'width: 172px; max-width: 172px',
  },
]

const makeActionColumn = (name, label, width = 100) => ({
  name,
  align: 'center',
  label,
  field: name,
  sortable: false,
  style: `width: ${width}px; max-width: ${width}px`,
  headerStyle: `width: ${width}px; max-width: ${width}px`,
})

const columns = computed(() => {
  const baseColumns = getBaseColumns()
  if (isGuest.value) return baseColumns
  if (!canUseActions.value) return baseColumns

  const actionColumns = []

  if (canEdit.value) {
    actionColumns.push(makeActionColumn('edit', t('common.modify'), 90))
    actionColumns.push(makeActionColumn('submit', t('common.submit'), 100))
  }

  if (canValidate.value) {
    actionColumns.push(makeActionColumn('approve', t('common.approve'), 104))
    actionColumns.push(makeActionColumn('reject', t('common.reject'), 96))
  }

  if (canPublish.value) {
    actionColumns.push(makeActionColumn('publish', t('common.publish'), 112))
  }

  return [...baseColumns, ...actionColumns]
})

/*
  Dashboard counters:
  - total: all documents
  - submitted: submitted for review
  - published: published documents
*/
const counters = computed(() => {
  const total = rows.value.length
  const submitted = rows.value.filter((r) => r.status === STATUS.SUBMITTED).length
  const published = rows.value.filter((r) => r.status === STATUS.PUBLISHED).length

  return { total, submitted, published }
})

/*
  Converts internal status to display label
*/
const formatStatus = (status) => {
  if (!status) return t('dashboard.statusUnknown')
  if (status === STATUS.DRAFT) return t('common.draft')
  if (status === STATUS.REVIEWED) return t('common.reviewed')
  if (status === STATUS.PUBLISHED) return t('common.published')
  if (status === STATUS.SUBMITTED) return t('common.submittedForReview')
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
const getStatusStyle = (status) => {
  if (status === STATUS.PUBLISHED) {
    return { backgroundColor: '#E8F5E9', color: '#2E7D32' }
  }
  if (status === STATUS.REVIEWED) {
    return { backgroundColor: '#E3F2FD', color: '#1565C0' }
  }
  if (status === STATUS.SUBMITTED) {
    return { backgroundColor: '#FFF3E0', color: '#EF6C00' }
  }
  if (status === STATUS.DRAFT) {
    return { backgroundColor: '#F5F5F5', color: '#616161' }
  }
  return { backgroundColor: '#F5F5F5', color: '#616161' }
}

const canRowEdit = (doc) =>
  canEdit.value &&
  [STATUS.DRAFT, STATUS.SUBMITTED, STATUS.REVIEWED].includes(doc?.status)

const canRowSubmit = (doc) => canEdit.value && doc?.status === STATUS.DRAFT

const canRowApprove = (doc) => canValidate.value && doc?.status === STATUS.SUBMITTED

const canRowReject = (doc) => canValidate.value && doc?.status === STATUS.SUBMITTED

const canRowPublish = (doc) =>
  canPublish.value && [STATUS.REVIEWED, STATUS.PUBLISHED].includes(doc?.status)

const hasFullAuthorTooltip = (author) => {
  const normalized = String(author ?? '').trim()
  return normalized.length > 3
}

const hasFullTitleTooltip = (title) => {
  const normalized = String(title ?? '').trim()
  return normalized.length > 28
}

/*
  Loads documents from GitHub index.json
  Then:
  - normalizes data
  - applies local overrides
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
      title: doc.title,
      author: doc.author,
      year: doc.year,
      lastModified: doc.last_modified,
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
  if (!canEdit.value) return
  doc.status = STATUS.SUBMITTED
  saveDocOverride(doc)
  showNotify({
    color: 'info',
    message: t('dashboard.submittedMessage'),
    icon: 'send',
  })
}

const rejectToDraft = (doc) => {
  if (!canValidate.value) return
  doc.status = STATUS.DRAFT
  saveDocOverride(doc)
  showNotify({
    color: 'warning',
    message: t('dashboard.rejectedMessage'),
    icon: 'undo',
  })
}

const approveToReviewed = (doc) => {
  if (!canValidate.value) return
  doc.status = STATUS.REVIEWED
  saveDocOverride(doc)
  showNotify({
    color: 'positive',
    message: t('dashboard.approveDocument'),
    icon: 'send',
  })
}

const publishDocument = (doc) => {
  if (!canPublish.value) return
  doc.status = STATUS.PUBLISHED
  saveDocOverride(doc)
  showNotify({
    color: 'positive',
    message: t('dashboard.publishedMessage'),
    icon: 'send',
  })
}

const unpublishDocument = (doc) => {
  if (!canPublish.value) return
  doc.status = STATUS.DRAFT
  saveDocOverride(doc)
  showNotify({
    color: 'warning',
    message: t('dashboard.unpublishedMessage'),
    icon: 'undo',
  })
}

/*
  Clean notifications before shoving new
*/

let currentNotify = null

const showNotify = (opts) => {
  // If a notification is already visible, close it
  if (currentNotify) {
    currentNotify()
  }

  // Show new notification and store its dismiss function
  currentNotify = $q.notify(opts)
}

/*
  Delete confirmation dialog
*/

const closeDocViewer = () => {
  showDocViewer.value = false
  selectedDoc.value = null
  docText.value = ''
}

const editDocument = (doc) => {
  if (!canEdit.value) return
  if (!doc?._path) {
    $q.notify({ color: 'negative', message: t('dashboard.filePathMissing') })
    return
  }

  const normalizedPath = doc._path.replace(/^\/+/, '')
  const segments = normalizedPath.split('/').filter(Boolean)
  const filename = segments.pop()
  const path = segments.join('/')

  if (!filename) {
    $q.notify({ color: 'negative', message: t('dashboard.invalidDocumentPath') })
    return
  }

  const params = new URLSearchParams({
    provider: 'github',
    owner,
    ownerType,
    repo,
    filename,
  })
  if (path) params.set('path', path)

  const sessionToken = localStorage.getItem('authToken')
  if (sessionToken) params.set('sessionToken', sessionToken)

  closeDocViewer()

  window.location.href = `${LEAFWRITER_URL}/edit?${params.toString()}`
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
  return rows.value.filter((r) => selected.includes(r.status))
})

const onRowClick = (evt, row) => {
  openDocViewer(row)
}

const showDocViewer = ref(false)
const selectedDoc = ref(null)
const docText = ref('')
const docLoading = ref(false)

// Inject formatted TEI HTML
const teiContainer = ref(null)

// Create one CETEI instance
const cetei = new CETEI()

const openDocViewer = async (doc) => {
  if (!doc?._path) {
    $q.notify({ color: 'negative', message: t('dashboard.noFilePath') })
    return
  }

  selectedDoc.value = doc
  docText.value = ''
  showDocViewer.value = true
  docLoading.value = true

  try {
    // 1) fetch raw TEI XML
    docText.value = await getRepoFileText({
      owner,
      repo,
      path: doc._path,
      ref: 'main',
    })

    // 2) wait for dialog DOM to exist
    await nextTick()

    // 3) clear previous render
    if (teiContainer.value) teiContainer.value.innerHTML = ''

    // 4) render TEI -> HTML and append to container
    const dom = await cetei.makeHTML5(docText.value)
    if (teiContainer.value) teiContainer.value.appendChild(dom)
  } catch (e) {
    $q.notify({ color: 'negative', message: e?.message || t('dashboard.loadFailed') })
  } finally {
    docLoading.value = false
  }
}
</script>

<style scoped>
.dashboard-title {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

.status-chip-minimal {
  font-size: inherit;
  font-weight: normal;
  line-height: inherit;
  padding: 2px 6px;
  border-radius: 6px;
}

.compact-action-btn {
  min-width: 72px;
  padding: 0 8px;
  font-size: 12px;
}

.action-placeholder {
  color: #9e9e9e;
  font-weight: 500;
}
</style>
