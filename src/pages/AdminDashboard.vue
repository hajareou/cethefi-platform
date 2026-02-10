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
              <div class="text-caption text-grey-7 text-weight-medium">
                Waiting for review
              </div>
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
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-h6 text-weight-bold text-grey-9">TEI Documents</div>
            <div class="text-caption text-grey-6">
              Manage and edit theatrical plays from the 18th century
            </div>
          </div>

          <div class="row q-gutter-sm">
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search..."
              class="q-mr-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-btn
              outline
              no-caps
              :icon="githubIcon"
              label="Import from GitHub"
              color="grey-8"
              @click="fetchGithubData"
            />
            <q-btn unelevated no-caps icon="add" label="New Document" color="primary" />
          </div>
        </div>

        <q-table
          :rows="rows"
          :columns="columns"
          row-key="id"
          flat
          :filter="filter"
          :rows-per-page-options="[5, 10, 20, 50]"
          class="text-grey-9"
          :loading="loading"
          v-model:pagination="pagination"
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
              <q-btn
                flat
                round
                dense
                icon="more_vert"
                color="grey-8"
              >
                <q-menu
                  :model-value="openMenuId === props.row.id"
                  @update:model-value="val => setMenuOpen(props.row.id, val)"
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
                    <q-item
                      clickable
                      v-close-popup
                      @click="confirmDeleteDocument(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="delete" color="negative" />
                      </q-item-section>
                      <q-item-section class="text-negative">
                        Delete
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getRepoFileJson, getLastCommit } from '../services/githubRepo.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const rows = ref([])
const loading = ref(false)
const filter = ref('')

const owner = 'hajareou'
const repo = 'leafwriter-test'

const INDEX_JSON_PATH = 'index.json'
const STATUS = {
  DRAFT: 'drafts',
  REVIEWED: 'reviewed',
  PUBLISHED: 'published',
}

const githubIcon =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'

const pagination = ref({
  page: 1,
  rowsPerPage: 10,     // default
  sortBy: 'title',
  descending: false,
})

const columns = [
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
    align: 'left',
    sort: (a, b) => a - b
  },
  {
    name: 'last_modified',
    align: 'center',
    label: 'Last Modified',
    field: 'lastModified',
    sortable: true,
    sort: (a, b) => new Date(a).getTime() - new Date(b).getTime()
  },
  { name: 'status', 
    align: 'center', 
    label: 'Status', 
    field: 'status', 
    sortable: true 
  },
  { name: 'action', 
    align: 'center', 
    label: 'Action', 
    field: 'action'   
},
]

const counters = computed(() => {
  const total = rows.value.length
  const waiting = rows.value.filter(
    r => r.status === STATUS.DRAFT
  ).length
  const published = rows.value.filter(
    r => r.status === STATUS.PUBLISHED
  ).length

  return { total, waiting, published }
})

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  if (status === STATUS.DRAFT) return 'Draft'
  if (status === STATUS.REVIEWED) return 'Reviewed'
  if (status === STATUS.PUBLISHED) return 'Published'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusColor = (status) => {
  if (status === STATUS.PUBLISHED) return { bg: 'green-1', text: 'green-8' }
  if (status === STATUS.REVIEWED) return { bg: 'blue-1', text: 'blue-8' }
  if (status === STATUS.DRAFT) return { bg: 'orange-1', text: 'orange-9' }
  return { bg: 'grey-2', text: 'grey-8' }
}

async function fetchGithubData() {
  loading.value = true
  try {
    const data = await getRepoFileJson({ owner, repo, path: INDEX_JSON_PATH })
    if (!Array.isArray(data)) {
      rows.value = []
      return
    }

    const flat = data.map((doc) => ({
      id: doc?.id ?? doc?.storage_path ?? doc?.title ?? Math.random().toString(36).slice(2),
      title: (doc?.title ?? '').replace(/\.xml$/i, ''),
      author: doc?.author ?? '-',
      year: doc?.year ?? null,
      lastModified: doc?.last_modified ?? null,
      status: doc?.status ?? 'unknown',
      _path: doc?.storage_path ?? null,
    }))

    flat.sort((a, b) =>
      (a.status + a.title).localeCompare(b.status + b.title, 'fr', { sensitivity: 'base' }),
    )

    rows.value = flat

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

onMounted(() => {
  fetchGithubData()
})

const submitForReview = (doc) => {
  doc.status = STATUS.REVIEWED
  closeMenu()
}

const publishDocument = (doc) => {
  doc.status = STATUS.PUBLISHED
  closeMenu()
}

const unpublishDocument = (doc) => {
  doc.status = STATUS.REVIEWED
  closeMenu()
}

const confirmDeleteDocument = (doc) => {
  $q.dialog({
    title: 'Confirm deletion',
    message: `Are you sure you want to delete "${doc.title}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteDocument(doc)
  })
}

const deleteDocument = (doc) => {
  rows.value = rows.value.filter(d => d.id !== doc.id)

  $q.notify({
    color: 'positive',
    message: 'Document deleted',
  })
}

const openMenuId = ref(null)

const setMenuOpen = (id, val) => {
  if (val) openMenuId.value = id
  else if (openMenuId.value === id) openMenuId.value = null
}

const closeMenu = () => {
  openMenuId.value = null
}

</script>
