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
              <div class="text-h4 text-weight-bolder text-grey-9">127</div>
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
              <div class="text-h4 text-weight-bolder text-grey-9">18</div>
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
              <div class="text-h4 text-weight-bolder text-grey-9">84</div>
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

            <q-btn outline no-caps icon="code" label="Import from GitHub" color="grey-8" />
            <q-btn unelevated no-caps icon="add" label="New Document" color="primary" />
          </div>
        </div>

        <q-table
          :rows="rows"
          :columns="columns"
          row-key="title"
          flat
          :filter="filter"
          :pagination="{ rowsPerPage: 7 }"
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
import { ref } from 'vue'

const filter = ref('')
const loading = ref(false)

const columns = [
  { name: 'title', align: 'left', label: 'Document Title', field: 'title', sortable: true },
  { name: 'author', align: 'left', label: 'Author', field: 'author', sortable: true },
  {
    name: 'last_modified',
    align: 'left',
    label: 'Last Modified',
    field: 'lastModified',
    sortable: true,
  },
  { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
  { name: 'action', align: 'right', label: 'Action', field: 'action' },
]

const rows = ref([
  {
    title: 'Le Mariage de Figaro',
    author: 'Beaumarchais',
    lastModified: '2025-11-20',
    status: 'Published',
  },
  {
    title: 'Le Barbier de Séville',
    author: 'Beaumarchais',
    lastModified: '2025-11-19',
    status: 'Validated',
  },
  {
    title: 'Le Barbier de Séville',
    author: 'Beaumarchais',
    lastModified: '2025-11-19',
    status: 'Under Review',
  },
])

const getStatusColor = (status) => {
  if (status === 'Published') return { bg: 'green-1', text: 'green-8' }
  if (status === 'Validated') return { bg: 'blue-1', text: 'blue-8' } // Validated est bien là
  if (status === 'Under Review') return { bg: 'orange-1', text: 'orange-9' }
  return { bg: 'grey-2', text: 'grey-8' }
}
</script>
