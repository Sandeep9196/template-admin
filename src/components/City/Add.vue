<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add City")) }}</span>
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
      <q-form ref="refForm">
      <label>{{ $t(Utils.getKey("Country")) }}</label>
      <q-select
        v-model="cities.country_id"
        :options="countryOption"
        outlined
        dense
        emit-value
        map-options
        option-value="id"
        option-label="name"
        clearable
        :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
      />

      <q-select
        v-model="cities.state_id"
        :options="stateOption"
        outlined
        dense
        emit-value
        map-options
        option-value="id"
        :label="$t(Utils.getKey('state'))"
        option-label="state_name"
        clearable
        :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
      />

      <!-- <q-input
        v-model="cities.city_name"
        :label="$t(Utils.getKey('city'))"
        dense
        :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
        outlined
        maxlength="50"
        lazy-rules
      /> -->

        <div class="row">
          <div
            class="col-12 col-md-6 q-pr-md"
            v-for="lang in languages"
            :key="lang.locale"
          >
            <label class="text-uppercase">{{ $t(lang.locale) }}</label>
            <q-input
              v-model="cities.translation_name[lang.locale]"
              :label="$t(Utils.getKey('city name'))"
              dense
              autogrow
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
              lazy-rules
              type="textarea"
              outlined
            />
          </div>
        </div>
        </q-form>
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
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import useCountryStates from "src/composables/useCountryStates";
import useCity from "src/composables/useCity";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const props = defineProps({ country: Array, city: Array, languages: Array });
const $q = useQuasar();
const { saving, add } = useCity();
const countryOption = ref(props.country.data);
const stateOption = ref([]);
const state = useCountryStates();
const cities = ref({
  state_id: "",
  city_name: "",
  country_id: "",
  status: "active",
  city_code: "",
  translation_name: {},
});
const languages = ref(props.languages);

const refForm = ref(false)
const getStateByCountryID = async () => {
  let getState = await state.getByCountryId(cities.value.country_id);
  stateOption.value = getState.data;
};

watch(
  () => cities.value.country_id,
  () => {
    getStateByCountryID();
  }
);

async function onSubmit() {
  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    if (

      cities.value.country_id == ""

    ) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Country field is required")),
      });
      return;
    }
    if (
      cities.value.state_id == ""

    ) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("State field is required")),
      });
      return;
    }
    // if (
    //   cities.value.city_name == ""
    // ) {
    //   $q.notify({
    //     position: "top-right",
    //     type: "negative",
    //     icon: "fas fa-exclamation-triangle",
    //     message: t(Utils.getKey("City field is required")),
    //   });
    //   return;
    // }

    let currencyData = [];
    let allFill = false;
    languages.value.forEach((lg, index) => {
      let cd = {};
      if (cities.value.translation_name[lg.locale] == "") {
        allFill = true;
      } else {
        cd.language_id = lg.id;
        cd.field_name = "name";
        cd.translation = cities.value.translation_name[lg.locale];
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
    //await add(cities.value);
    await add({ ...cities.value, translation_name: currencyData });
    emit("onAdded");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("created successfully")),
    });
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
  languages.value.forEach((lg) => {
    cities.value.translation_name[lg.locale] = "";
  });
});

</script>
