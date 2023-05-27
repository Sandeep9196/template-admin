<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Group")) }}</span>
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
    <q-card-section class="">
      <q-form ref="myForm">
        <!-- <label>{{ $t(Utils.getKey("name")) }}</label>
        <q-input
          :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          v-model="group.name"
          dense
          outlined
          maxlength="20"
          lazy-rules

        /> -->
        <label>{{ $t(Utils.getKey("type")) }}</label>
        <q-select
          :options="props.types"
          v-model="group.type_id"
          outlined
          dense
          emit-value
          map-options
          :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          option-value="id"
          option-label="name"
          class="flex-1"
          clearable
        />
      </q-form>

      <div class="row">
        <div
          class="col-12 col-md-6 q-pr-md mt-3"
          v-for="lang in languages"
          :key="lang.locale"
        >
          <label class="text-uppercase">{{ $t(lang.locale) }}</label>
          <q-input
            v-model="group.translation_name[lang.locale]"
            :label="$t(Utils.getKey('name'))"
            dense
            autogrow
            type="textarea"
            outlined
          />
        </div>
      </div>
      <div>
        <div class="mt-3">
          <q-table :columns="columns" bordered flat :rows="rows" row-key="name" :rows-per-page-label="$t(Utils.getKey('Records per page'))">
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
            <template v-slot:body-cell-name="props">
              <q-td>
                {{ props.row?.translations[locale]?.name }}
              </q-td>
            </template>
            <template v-slot:body-cell-type="props">
              <q-td>
                {{ props.row?.type?.translations[locale]?.name }}
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td class="text-right">
                <q-btn
                  v-if="Utils.hasPermissions(['Menu: Create Group'])"
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
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn
        flat
        color="negative"
        class="q-px-md"
        @click="emit('onClose')"
        :disable="saving"
        >{{ $t(Utils.getKey("Cancel")) }}</q-btn
      >
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
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const props = defineProps({ types: Array, languages: Array });
const $q = useQuasar();
const myForm = ref(null);
const { getType, getGroup, addGroup } = useMenu();
const locale = inject("locale");
const group = ref({
  name: "",
  type_id: "",
  translation_name: {},
});
const languages = ref(props.languages);
console.log("languages            ", languages);
const columns = [
  {
    name: "id",
    field: (row) => t(Utils.getKey(row.id)),
    align: "left",
    label: "ID",
  },
  { name: "name", field: (row) => row.name, align: "left", label: "Name" },
  {
    name: "type",
    field: (row) => row,
    align: "left",
    label: "type",
  },
  { name: "actions", field: (row) => row, label: " Action" },
];
const rows = ref([]);

// const onEditClick = (item) => {

//   group.value = item;
// };

const onEditClick = (item) => {
  let tranObj = {};

  languages.value.forEach((lg, index) => {
    tranObj[lg.locale] = item.translations[lg.locale]?.name;
    // currencyData.push(cd);
  });
  item.translation_name = tranObj;
  group.value = item;
};
const onLoadData = async () => {
  let gGroup = await getGroup();
  rows.value = gGroup.data;
};
onLoadData();

async function onSubmit() {
  try {
    let validation = await myForm.value.validate();
    if (!validation) {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
      return;
    }
    let currencyData = [];
    let allFill = false;
    languages.value.forEach((lg, index) => {
      let cd = {};
      if (group.value.translation_name[lg.locale] == "") {
        allFill = true;
      } else {
        cd.language_id = lg.id;
        cd.field_name = "name";
        cd.translation = group.value.translation_name[lg.locale];
      }
      currencyData.push(cd);
    });

    if (allFill == true) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("please fill all translation fileld")),
      });
      return;
    }
    console.log(currencyData);
    await addGroup({ ...group.value, translation_name: currencyData });
    group.value = {
      name: "",
      translation_name: {},
    };
    languages?.value?.forEach((lg) => {
      group.value.translation_name[lg.locale] = "";
    });
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

onMounted(() => {
  languages?.value?.forEach((lg) => {
    group.value.translation_name[lg.locale] = "";
  });
});
</script>


