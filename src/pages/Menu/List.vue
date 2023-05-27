<template>
  <div>
    <q-card
      v-if="!showEdit && !showAdd"
      style="margin-left: 0px; box-shadow: none; min-height: 100vh"
    >
      <q-card-section>
        <q-table
          flat
          color="primary"
          :loading="loading"
          :rows="items"
          row-key="id"
          :columns="columns"
          v-model:pagination="pagination"
          :filter="filters"
          @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
            <q-input
              dense
              outlined
              debounce="300"
              v-model="filters.search"
              :placeholder="$t(Utils.getKey('Search'))"
              style="width: 300px"
            />
            <q-btn
              class="q-mr-sm q-mt-xs"
              dense
              color="primary"
              icon="mdi-filter-remove-outline"
              rounded
              style="margin-left: 10px"
              @click="resetFilters"
            />
            <q-space />

            <add-button
              v-if="Utils.hasPermissions(['Category: Create Category'])"
              :disable="loading"
              @click="showAdd = true"
              tooltip-text="Add"
              color="primary"
            />
          </template>

          <!-- header column -->
          <template v-slot:header-cell="props">
            <q-th :props="props">
              {{
                props.col.label === "#"
                  ? props.col.label
                  : $t(Utils.getKey(props.col.label))
              }}
            </q-th>
          </template>
          <!-- no data -->
          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>
          <template v-slot:body-cell-title="props">
            <q-td>
              {{
                props.row?.translations[locale]?.title?.length > 30
                  ? props.row?.translations[locale]?.title?.substring(0, 30) +
                    "..."
                  : props.row?.translations[locale]?.title
              }}
            </q-td>
          </template>

          <template v-slot:body-cell-type="props">
            <q-td>
              {{
                props.row?.type?.translations[locale]?.name
              }}
            </q-td>
          </template>

          <template v-slot:body-cell-group="props">
            <q-td>
              {{
                props.row?.group?.translations[locale]?.name
              }}
            </q-td>
          </template>

          <template v-slot:body-cell-sl="props">
            <q-td>
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:body-cell-description="props">
            <q-td>
              {{
                props.row.description != "undefined"
                  ? props.row.description
                  : ""
              }}
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td class="text-center">
              <q-chip
                size="sm"
                :label="
                  $t(Utils.getKey(props.row.status.toUpperCase())).toUpperCase()
                "
                :color="getStatusColor(props)"
                :class="'text-white'"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="Utils.hasPermissions(['Category: Edit/Update Category'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="fas fa-pen"
                @click="onEditClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
              </q-btn>

              <!-- <q-btn v-if="Utils.hasPermissions(['Category: Delete Category'])" class="q-mr-sm" size="xs" rounded
              padding="5px" color="negative" icon="fas fa-trash" @click="onDeleteClick(props.row)">
              <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
            </q-btn> -->
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <Loading :loading="isLoading" />
    </q-card>
    <div v-if="showEdit">
      <edit-menu
        :languages="languages"
        :data="selectedCategory"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </div>
    <div v-if="showAdd">
      <add-new
        :languages="languages"
        @onClose="showAdd = false"
        @onAdded="onRefresh"
      />
    </div>

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete this Category"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import useTable from "../../composables/useTable";
import useMenu from "../../composables/useMenu";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
import { store } from "../../store/store";
import AddButton from "../../components/Buttons/AddButton.vue";
import EditMenu from "../../components/Menu/Edit.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import useLanguage from "src/composables/useLanguage";
import AddNew from "src/components/Menu/Add.vue";

const emit = defineEmits(["onClose", "onAdded", "isNew"]);
const locale = inject("locale");
const { all } = useLanguage();
const { loading, columns, items, trash, paginate } = useMenu();
const {
  showAdd,
  showEdit,
  selected,
  showConfirm,
  pagination,
  onDelete,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);
const languages = ref([]);
const tab = ref(locale.value);
const selectedCategory = ref();
const filters = reactive({
  search: "",
});
const isLoading = ref(false)
getData();
async function getData() {
  try {
    isLoading.value = true
    const response = await all();
    languages.value = response.data;
    isLoading.value = false
  } catch (error) {}
}

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "created_at",
    },
    filter: undefined,
  });
});

const onEditClick = (row) => {
  showEdit.value = true;
  selectedCategory.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [row];
};

const getStatusColor = (props) => {
  if (props.row.status === "active") {
    return "positive";
  }

  if (props.row.status === "inactive") {
    return "negative";
  }

  return "gray";
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};
</script>
