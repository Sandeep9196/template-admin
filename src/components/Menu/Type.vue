<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Type")) }}</span>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        @click="emit('onClose')"
        :disable="saving"
      >
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <q-form ref="myForm">
        <div class="row">
          <div class="col-6 px-2" v-for="lng in props.languages" :key="lng.id">
            <label>{{ $t(lng.locale) }}</label>
            <q-input
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
              v-model="type.name_translations[lng.id]"
              dense
              outlined
              maxlength="30"
              lazy-rules
            />
          </div>
        </div>
      </q-form>
      <div>
        <div class="mt-3">
          <q-table :columns="columns" bordered flat :rows="rows" row-key="name" :rows-per-page-label="$t(Utils.getKey('Records per page'))">
            <template v-slot:body-cell-name="props">
              <q-td>
                {{ props.row?.translations[locale]?.name }}
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td class="text-right">
                <q-btn
                  v-if="Utils.hasPermissions(['Menu: Create Type'])"
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
                <!-- <q-btn
                  v-if="Utils.hasPermissions(['Menu: Create Type'])"
                  class="q-mr-sm"
                  size="xs"
                  rounded
                  padding="5px"
                  color="red"
                  icon="fas fa-trash"
                  @click="onEditClick(props.row)"
                >
                  <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
                </q-btn> -->
              </q-td>
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
          </q-table>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <!-- <q-btn
        flat
        color="negative"
        class="q-px-md"
        @click="emit('onClose')"
        :disable="saving"
        >{{ $t(Utils.getKey("Cancel")) }}</q-btn
      > -->
      <q-btn
        color="accent"
        style="color: var(--q-primary) !important"
        class="q-px-md q-ml-md"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Add")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted, inject } from "vue";
import { useQuasar } from "quasar";
import Utils from "../../helpers/Utils";
import useMenu from "src/composables/useMenu";
import { useI18n } from "vue-i18n";

const locale = inject("locale");
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const props = defineProps({ languages: Array });
const $q = useQuasar();
const myForm = ref(null);
const { getType, getGroup, addType } = useMenu();
const type = ref({
  name: "",
  name_translations: {},
});
const columns = [
  { name: "id", field: (row) => row.id, align: "left", label: "ID" },
  { name: "name", field: (row) => row.name, align: "left", label: "Name" },
  { name: "actions", field: (row) => row, label: " Action" },
];
const rows = ref([]);

const onEditClick = (item) => {
  let objLanuge = {};
  props.languages.forEach((lg) => {
    objLanuge[lg.id] = item.translations[lg.locale]?.name;
  });
  item.name_translations = objLanuge;
  type.value = item;
  console.log("item", item.translations);
};
const onLoadData = async () => {
  let gType = await getType();
  rows.value = gType.data;
  console.log("row value", rows.value);
};
onLoadData();

async function onSubmit() {
  try {
    let validation = await myForm.value.validate();
    if (!validation) {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
      return;
    }
    let nameTranslation = [];
    for (const key in type.value.name_translations) {
      nameTranslation.push({
        language_id: key,
        translation: type.value.name_translations[key],
        field_name: "name",
      });
    }
    let defaulName = props.languages[0] ? props.languages[0].id : 1;
    await addType({
      ...type.value,
      name_translations: nameTranslation,
      name: type.value.name_translations[defaulName],
    });

    props.languages.forEach((lg) => {
      type.value.name_translations[lg.id] = "";
    });
    type.value.id = "";
    onLoadData();
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
}

onMounted(async () => {
  props.languages.forEach((lg) => {
    type.value.name_translations[lg.id] = "";
  });
});
</script>
