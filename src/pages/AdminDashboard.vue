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
              <div class="text-caption text-grey-7 text-weight-medium">Total Plays</div>
              <div class="text-h4 text-weight-bolder text-grey-9">{{ totalPlays }}</div>
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
              <div class="text-caption text-grey-7 text-weight-medium">Pending Approval</div>
              <div class="text-h4 text-weight-bolder text-grey-9">{{ pendingApproval }}</div>
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
              <div class="text-h4 text-weight-bolder text-grey-9">{{ publishedCount }}</div>
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

            <q-btn outline no-caps :icon="githubIcon" label="Import from GitHub" color="grey-8" />
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
          class="text-grey-8"
          :loading="loading"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                dense
                flat
                :color="getStatusColor(props.value).bg"
                :text-color="getStatusColor(props.value).text"
                class="text-weight-bold q-px-sm"
              >
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="text-right">
              <q-btn
                v-if="props.row.status === 'Published'"
                flat
                dense
                no-caps
                size="sm"
                label="Unpublish"
                color="negative"
                class="bg-red-1 q-px-md"
              />
              <q-btn
                v-else-if="props.row.status === 'Under Review'"
                flat
                dense
                no-caps
                size="sm"
                label="Edit"
                color="warning"
                class="bg-amber-1 q-px-md"
              />
              <q-btn
                v-else
                flat
                dense
                no-caps
                size="sm"
                label="Publish"
                color="positive"
                class="bg-green-1 q-px-md"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const filter = ref('')
const loading = ref(false)
const githubIcon =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'

const columns = [
  { name: 'title', 
    align: 'left', 
    label: 'Document Title', 
    field: 'title', 
    sortable: true,
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  { name: 'author', 
    align: 'left', 
    label: 'Author', 
    field: 'author', 
    sortable: true, 
    sort: (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  },
  {
    name: 'last_modified',
    align: 'left',
    label: 'Last Modified',
    field: 'lastModified',
    sortable: true,
    sort: (a, b) => new Date(a).getTime() - new Date(b).getTime()
  },
  { name: 'status', 
    align: 'left', 
    label: 'Status', 
    field: 'status', 
    sortable: true 
  },
  { name: 'action', 
    align: 'right', 
    label: 'Action', 
    field: 'action' 
  },
]

const rows = ref([
  {
    id: 1,
    title: 'Le Mariage de Figaro',
    author: 'Beaumarchais',
    lastModified: '2025-11-20',
    status: 'Published',
  },
  {
    id: 2,
    title: 'Le Barbier de Séville',
    author: 'Beaumarchais',
    lastModified: '2025-11-21',
    status: 'Validated',
  },
  {
    id: 3,
    title: 'Le Barbier de Séville',
    author: 'Beaumarchais',
    lastModified: '2025-11-7',
    status: 'Under Review',
  },
  {
    id: 4,
    title: 'La Mère coupable',
    author: 'Beaumarchais',
    lastModified: '2025-11-19',
    status: 'Validated',
  },
])

const totalPlays = computed(() => rows.value.length)

const pendingApproval = computed(() =>
  rows.value.filter(r => r.status === 'Under Review').length
)

const publishedCount = computed(() =>
  rows.value.filter(r => r.status === 'Published').length
)

const getStatusColor = (status) => {
  if (status === 'Published') return { bg: 'green-1', text: 'green-8' }
  if (status === 'Validated') return { bg: 'blue-1', text: 'blue-8' } // Validated est bien là
  if (status === 'Under Review') return { bg: 'orange-1', text: 'orange-9' }
  return { bg: 'grey-2', text: 'grey-8' }
}
</script>
