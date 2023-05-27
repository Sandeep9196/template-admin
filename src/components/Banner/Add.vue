<template>
  <q-card
    id="scrollId"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '1100px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add banner")) }}</span>
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

    <q-card-section class="q-pt-lg pb-0">
      <q-form ref="form">
        <div class="row">
          <div class="col-6 col-md-4 q-pr-md">
            <q-input
              :autofocus="true"
              v-model="banner.slug"
              :label="$t(Utils.getKey('Slug'))"
              dense
              outlined
              maxlength="20"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
            />
          </div>
          <div class="col-6 col-md-4 q-pr-md">
            <q-input
              :autofocus="true"
              v-model="banner.link"
              :label="$t(Utils.getKey('Link'))"
              dense
              outlined
              maxlength="20"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
            />
          </div>
          <div class="col-6 col-md-4 q-pr-md">
            <q-input
              v-model="banner.position"
              :label="$t(Utils.getKey('position'))"
              dense
              type="number"
              outlined
              :oninput="evt => Utils.numberValidation(evt, 3)"
              min="0"
              max="100"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
            />
          </div>
          <div class="col-6 col-md-4 q-pr-md">
            <q-select
              v-model="banner.type"
              :options="['homePage', 'categoryPage']"
              outlined
              :label="$t(Utils.getKey('type'))"
              dense
              emit-value
              option-value="id"
              :option-label="(name) => $t(name)"
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-card-section class="q-pt-none pl-1 pb-0">
      <div class="row">
        <div class="col-12 col-md-12 q-pr-md">
          <q-radio v-model="banner.status" val="active" :label="$t('active')" />
          <q-radio
            v-model="banner.status"
            val="inactive"
            :label="$t('inactive')"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-separator class="q-mb-xs" />
      <div class="row" v-for="lang in languages" :key="lang.id">
        <div class="col-12 col-md-6 q-pr-md q-mt-md">
          <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
          <q-input
            v-model="banner.translations_name[lang.id]"
            :label="$t(Utils.getKey('name'))"
            dense
            autogrow
            type="textarea"
            outlined
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md q-mt-md">
          <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
          <q-input
            v-model="banner.translations_description[lang.id]"
            :label="$t(Utils.getKey('content'))"
            dense
            autogrow
            type="textarea"
            outlined
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-lg">
      <div class="row">
        <div v-for="lang in languages" :key="lang.id" class="col-4 pr-3">
          <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
          <q-separator />
          <div class="py-3 ml-2 mt-2">
            <label class="pa-2 border">
              <i class="fa fa-image"></i> {{ $t("choose_image") }}
              <input
                class="mt-2"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                type="file"
                id="file-input"
                style="display: none"
                @change="uploadChange"
                max="10"
                :name="lang?.id"
              />
            </label>
          </div>

          <div v-if="!cropper[lang.id]" class="box-2 img-result">
            <img
              style="width: 100%"
              class="cropped"
              :src="
                banner.image.filter((img) => img.purpose == lang.id)?.[0]?.path
              "
              alt=""
            />
          </div>
          <div v-show="cropper[lang.id]" class="page">
            <div class="box-2">
              <div
                style="height: 250px; width: 250px"
                :class="'result' + [lang?.id]"
              ></div>
            </div>
          </div>
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
import useBanner from "../../composables/useBanner";
import Utils from "../../helpers/Utils";
import "../../css/crop.css";
import "../../js/croper";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";

const form = ref(null);
const { t } = useI18n();
const props = defineProps({ data: Object, languages: Array });
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, add, getUsing } = useBanner();

const languages = ref(props.languages);
const banner = ref({
  translations_name: {},
  translations_description: {},
  position: "",
  status: "active",
  link: "",
  slug: "",
  image: [],
  type: "",
});
const banner_isusing = ref(false);
const isLoading = ref(false);

const images = ref([]);
const images_url = ref({});
const cropper = ref({});

const uploadChange = (e) => {
  console.log("e");
  let imgName = e.target.name;
  let result = document.querySelector(".result" + imgName);
  if (e.target.files.length) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target.result) {
        let img = document.createElement("img");
        img.id = "image";
        img.src = e.target.result;
        images_url.value[imgName] = img.src;
        result.innerHTML = "";
        result.appendChild(img);
        // cropper.value[imgName] = new Cropper(img);
      }
    };
    cropper.value[imgName] = e.target.files[0];
    console.log("e", images_url.value);
    reader.readAsDataURL(e.target.files[0]);
  }
};

watch(
  () => banner.value.name,
  () => {
    console.log(banner.value.name);
    banner.value.slug = banner.value.name
      .toLocaleLowerCase()
      .replace(/ /g, "-");
  }
);

async function onSubmit() {
  try {
    console.log("banner", banner.value);
    let validation = await form.value.validate();
    if (!validation) {
      document
        .getElementById("scrollId")
        .scroll({ top: 0, left: 0, behavior: "smooth" });
      return;
    }
    const FormData = require("form-data");
    const fomrData = new FormData();
    let allFill = false;
    if (
      banner.value.slug == "" ||
      banner.value.link == "" ||
      banner.value.position == ""
    ) {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("field is required")),
      });
      return;
    }

    // function asyncFunction (item, cb) {
    //     if (cropper.value[item.id] != undefined) {
    //       cropper.value[item.id].getCroppedCanvas().toBlob(async (blob) => {
    //           fomrData.append(`files[${item.id}]`, blob);
    //           console.log(blob);
    //           cb();
    //       });
    //     } else {
    //       cb();
    //     }
    // }

    // let awatBlob = languages.value.reduce((promiseChain, item) => {
    //     return promiseChain.then(() => new Promise((resolve) => {
    //       asyncFunction(item, resolve);
    //     }));
    // }, Promise.resolve());
    // wait finish blob image
    // awatBlob.then( async () =>  {
    languages.value.forEach((lg, index) => {
      if (cropper.value[lg.id] != undefined) {
        fomrData.append(`files[${lg.id}]`, cropper.value[lg.id]);
      }

      // for name column
      if (banner.value.translations_name[lg.id] != "") {
        fomrData.append(`translation_name[${index}][language_id]`, lg.id);
        fomrData.append(`translation_name[${index}][field_name]`, "name");
        fomrData.append(
          `translation_name[${index}][translation]`,
          banner.value.translations_name[lg.id]
        );
      }

      // for description
      if (banner.value.translations_description[lg.id] != "") {
        fomrData.append(`translation_desc[${index}][language_id]`, lg.id);
        fomrData.append(
          `translation_desc[${index}][field_name]`,
          "description"
        );
        fomrData.append(
          `translation_desc[${index}][translation]`,
          banner.value.translations_description[lg.id]
        );
      }
    });
    fomrData.append("status", banner.value.status);
    fomrData.append("type", banner.value.type);
    fomrData.append("link", banner.value.link);
    fomrData.append("position", banner.value.position);
    fomrData.append("slug", banner.value.slug);
    fomrData.append("_method", "post");
    isLoading.value = true;
    await add(fomrData);
    // setTimeout(() => {
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("add successfully")),
    });
    isLoading.value = false;
    emit("onUpdated");
    // }, 1000);
    // })
  } catch (err) {
    $q.notify({
      position: "top",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
    isLoading.value = false;
    document
    .getElementById("scrollId")
    .scroll({ top: 0, left: 0, behavior: "smooth" });
  }
}
onMounted(async () => {
  languages.value.forEach((lg) => {
    banner.value.translations_name[lg.id] = "";
    banner.value.translations_description[lg.id] = "";
  });
});
</script>
