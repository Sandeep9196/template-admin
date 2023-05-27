<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '720px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Template")) }}</span>
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
      <q-form ref="refForm">
        <div class="row">
          <div class="col-12 mb-2">
            <label class="text-uppercase">{{ $t("name") }}</label>
            <q-input
              v-model="template.name"
              :label="$t(Utils.getKey('name'))"
              dense
              outlined
            />
          </div>
          <div class="col-12 mt-3">
            <label class="pa-2 border">
              <i class="fa fa-image"></i> {{ $t("choose_image") }}
              <input
                class="mt-2"
                style="display: none"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                type="file"
                id="file-input"
                @change="uploadChange"
                max="10"
                name="image[]"
                multiple
              />
            </label>
            <div class="row">
              <div
                v-for="(im, index) in template.image"
                :key="index"
                class="col-12 col-md-3 q-pr-xs"
              >
                <div class="card_img">
                  <img :src="im.path" style="width: 100%; height: 200px" />
                </div>
              </div>
            </div>
            <div class="row">
              <div
                v-for="(im, index) in images_url"
                :key="index"
                class="col-12 col-md-3 q-pr-xs"
              >
                <div class="card_img">
                  <img :src="im" style="width: 100%; height: 200px" />
                </div>
              </div>
            </div>
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
        class="q-px-md q-ml-md"
        @click="onSubmit"
        style="color: var(--q-primary) !important"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
    <Loading :loading="isLoading" />
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import useTemplate from "../../composables/useTemplate";
import Utils from "../../helpers/Utils";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";

const { t } = useI18n();
const props = defineProps({ data: Object, languages: Array });
const emit = defineEmits(["onClose", "onUpdated"]);
const $q = useQuasar();
const { saving, update, getUsing } = useTemplate();
const refForm = ref(null);
const languages = ref(props.languages);
const template = ref({
  ...props.data,
});
console.log(template);
const images = ref([]);
const isLoading = ref(false);

const images_url = ref([]);
const uploadChange = (e) => {
  template.value.image = [];
  for (var i = 0; i < e.target.files.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target.result) {
        images_url.value.push(e.target.result);
      }
    };
    images.value.push(e.target.files[i]);

    reader.readAsDataURL(e.target.files[i]);
  }
};

async function onSubmit() {
  try {

    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }

    if (template.value.name == "") {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("field is required")),
      });
      return;
    }

    const FormData = require("form-data");
    const fomrData = new FormData();
    images.value?.forEach((img, index) => {
      fomrData.append(`image[${index}]`, img);
    });
    fomrData.append("name", template.value.name);
    isLoading.value = true;
    await update(template.value.id, fomrData);
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
    isLoading.value = false;
    emit("onUpdated");
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
}
onMounted(async () => {});
</script>
