<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '100%',
      maxWidth: '100%',
    }"
    class="mt-3"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Layout Setting")) }}</span>
      <q-space />
      <!-- <q-btn
        dense
        flat
        icon="fas fa-times"
        @click="emit('onClose')"
        :disable="saving"
      >
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn> -->
    </q-bar>

    <q-card-section class="q-pt-lg pb-0">
      <q-form ref="myForm">
        <p class="red" v-if="templateRequired">
          {{ $t("template_id_is_required") }}
        </p>
        <div class="row">
          <div
            class="col-12 col-sm-6 col-md-3 q-pr-md mt-2"
            v-for="temp in templates"
            :key="temp"
          >
            <p>{{ temp.name }}</p>
            <q-card
              flat
              bordered
              class="pointer"
              @click="
                (templateDetail.template_id = temp.id),
                  (templateRequired = false)
              "
              :class="
                templateDetail.template_id == temp.id
                  ? 'active_border'
                  : templateRequired
                  ? 'border_red'
                  : ''
              "
              style="min-height: 200px"
            >
              <q-icon
                @click="viewAllImage(temp)"
                class="ml-2"
                name="mdi-image-text"
                size="lg"
              />
              <img
                style="height: 220px; margin: auto; width: auto"
                class="mt-3"
                :src="temp.image[0].path"
              />
            </q-card>
          </div>
        </div>

        <!-- ui setting -->

        <p class="mt-6 font_18 text-bold">{{ $t("template setting") }}</p>
        <q-separator />
        <div class="row mt-3">
          <div class="col-12 col-md-3 col-lg-2 q-pr-md">
            <p class="text-bold">{{ $t("primary") }}</p>
            <q-separator />
            <label>{{ $t("main") }}</label>
            <div class="mb-3">
              <q-btn
                push
                style="width: 100%"
                :style="{
                  'background-color': templateDetail.theme.primary.main,
                }"
                :label="templateDetail.theme.primary.main"
              >
                <q-popup-proxy>
                  <q-color v-model="templateDetail.theme.primary.main" />
                </q-popup-proxy>
              </q-btn>
            </div>
            <label>{{ $t("light") }}</label>
            <div class="mb-3">
              <q-btn
                push
                style="width: 100%"
                :style="{
                  'background-color': templateDetail.theme?.primary?.light,
                }"
                :label="templateDetail.theme?.primary?.light"
              >
                <q-popup-proxy>
                  <q-color v-model="templateDetail.theme.primary.light" />
                </q-popup-proxy>
              </q-btn>
            </div>
            <label>{{ $t("dark") }}</label>
            <div class="mb-3">
              <q-btn
                push
                style="width: 100%"
                :style="{
                  'background-color': templateDetail.theme?.primary?.dark,
                }"
                :label="templateDetail.theme?.primary?.dark"
              >
                <q-popup-proxy>
                  <q-color v-model="templateDetail.theme.primary.dark" />
                </q-popup-proxy>
              </q-btn>
            </div>

            <!-- <q-color v-model="templateDetail.theme.main" class="my-picker" />
          <q-color v-model="templateDetail.theme.light" class="my-picker" />
          <q-color v-model="templateDetail.theme.dark" class="my-picker" /> -->
          </div>
          <div class="col-12 col-md-3 col-lg-2 q-pr-md">
            <p class="text-bold">{{ $t("secondary") }}</p>
            <q-separator />
            <label>{{ $t("main") }}</label>
            <div class="mb-3">
              <q-btn
                push
                style="width: 100%"
                :style="{
                  'background-color': templateDetail.theme.secondary.main,
                }"
                :label="templateDetail.theme.secondary.main"
              >
                <q-popup-proxy>
                  <q-color v-model="templateDetail.theme.secondary.main" />
                </q-popup-proxy>
              </q-btn>
            </div>

            <label>{{ $t("light") }}</label>
            <div class="mb-3">
              <q-btn
                push
                style="width: 100%"
                :style="{
                  'background-color': templateDetail.theme.secondary.light,
                }"
                :label="templateDetail.theme.secondary.light"
              >
                <q-popup-proxy>
                  <q-color v-model="templateDetail.theme.secondary.light" />
                </q-popup-proxy>
              </q-btn>
            </div>

            <label>{{ $t("dark") }}</label>
            <div class="mb-3">
              <q-btn
                push
                style="width: 100%"
                :style="{
                  'background-color': templateDetail.theme.secondary.dark,
                }"
                :label="templateDetail.theme.secondary.dark"
              >
                <q-popup-proxy>
                  <q-color v-model="templateDetail.theme.secondary.dark" />
                </q-popup-proxy>
              </q-btn>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-8 q-pr-md">
            <div class="mt-3 row">
              <div class="col-6 col-sm-4">
                <label class="">{{ $t("website_logo") }}</label>
                <div class="mt-3">
                  <label
                    class="pa-2 border"
                    :class="!imageLogoRequired ? 'border' : 'border_red'"
                  >
                    <i class="fa fa-image"></i> {{ $t("choose_image") }}
                    <input
                      class="mt-2"
                      style="display: none"
                      accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                      type="file"
                      id="file-input"
                      @change="uploadChange"
                      max="10"
                      name="image"
                    />
                  </label>
                  <p v-if="imageLogoRequired" class="red mt-3">
                    {{ $t("image_is_required") }}
                  </p>
                  <div>
                    <img style="height: 90px" class="mt-3" :src="images_url" />
                  </div>
                </div>
              </div>
              <div class="col-6 col-sm-4">
                <label class="">{{ $t("h5_logo") }}</label>
                <div class="mt-3">
                  <label
                    class="pa-2"
                    :class="!imageLogoRequiredH5 ? 'border' : 'border_red'"
                  >
                    <i class="fa fa-image"></i> {{ $t("choose_image") }}
                    <input
                      class="mt-2"
                      style="display: none"
                      accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                      type="file"
                      id="file-imageH5"
                      @change="uploadChangeH5"
                      max="10"
                      name="imageH5"
                    />
                  </label>
                  <p v-if="imageLogoRequiredH5" class="red mt-3">
                    {{ $t("image_is_required") }}
                  </p>
                  <div>
                    <img
                      style="height: 90px"
                      class="mt-3"
                      :src="images_url_h5"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <label class="">{{ $t("banner_style") }}</label>
              <div class="">
                <q-select
                  v-model="templateDetail.banner_style"
                  :options="['slider', 'line']"
                  outlined
                  dense
                  emit-value
                  map-options
                  :rules="[
                    (val) => !!val || $t(Utils.getKey('Field is required')),
                  ]"
                  lazy-rules
                  :option-label="(name) => $t(Utils.getKey(name))"
                  clearable
                />
              </div>
            </div>
          </div>
        </div>
        <!-- contact setting -->

        <p class="mt-6 font_18 text-bold">{{ $t("info") }}</p>
        <q-separator />

        <!-- tab -->
        <div>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="white"
            indicator-color="primary"
            align="left"
          >
            <q-tab
              v-for="lang in languages"
              :key="lang.locale"
              :name="lang.locale"
              :label="$t(lang.locale)"
            ></q-tab>
          </q-tabs>
          <q-separator />
          <div
            class="mt-1"
            style="display: block"
            v-for="lang in languages"
            :name="lang.locale"
            :key="lang.locale"
          >
            <div v-show="tab == lang.locale" style="min-height: 170px">
              <div class="row mt-3">
                <div class="col-12 col-md-4 q-pr-md">
                  <label class="">{{ $t("company_name") }}</label>
                  <q-input
                    v-model="translation.company_name[lang.id]"
                    dense
                    outlined
                    :rules="[
                      (val) => !!val || $t(Utils.getKey('Field is required')),
                    ]"
                    maxlength="40"
                    lazy-rules
                  />
                </div>
                <div class="col-12 col-md-4 q-pr-md">
                  <label class="">{{ $t("webite_title") }}</label>
                  <q-input
                    v-model="translation.website_title[lang.id]"
                    dense
                    :rules="[
                      (val) => !!val || $t(Utils.getKey('Field is required')),
                    ]"
                    outlined
                    maxlength="300"
                    lazy-rules
                  />
                </div>
                <div class="col-12 col-md-4 q-pr-md">
                  <label class="">{{ $t("webite_description") }}</label>
                  <q-input
                    v-model="translation.website_description[lang.id]"
                    dense
                    :rules="[
                      (val) => !!val || $t(Utils.getKey('Field is required')),
                    ]"
                    outlined
                    maxlength="1000"
                    lazy-rules
                  />
                </div>
                <div class="col-6 col-md-4 q-pr-md">
                  <label class="">{{ $t("ccopy_right") }}</label>
                  <q-input
                    :autofocus="true"
                    v-model="translation.copy_right[lang.id]"
                    dense
                    outlined
                    maxlength="220"
                  />
                </div>
                <div class="col-6 col-md-4 q-pr-md">
                  <label class="">{{ $t("address_line") }}</label>
                  <q-input
                    v-model="translation.address_line[lang.id]"
                    dense
                    outlined
                    lazy-rules
                    maxlength="255"
                  />
                </div>
                <div class="col-6 col-md-4 q-pr-md">
                  <label class="">{{ $t("address_line_2") }}</label>
                  <q-input
                    v-model="translation.address_line_2[lang.id]"
                    dense
                    outlined
                    lazy-rules
                    maxlength="255"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- contact information -->
        <q-separator />
        <div class="row mt-3">
          <div class="col-6 col-md-2 q-pr-md mt-1">
            <label class="">{{ $t("info_email") }}</label>
            <q-input
              :autofocus="true"
              v-model="templateDetail.company_info.info_email"
              dense
              :rules="[
                (val) => val.length > 0 ?  (Utils.onlyEmail(val)  || $t('invalid_email_address')) : true,
              ]"
              outlined
              maxlength="40"
            />
          </div>
          <div class="col-6 col-md-2 q-pr-md mt-1">
            <label class="">{{ $t("support_email") }}</label>
            <q-input
              v-model="templateDetail.company_info.support_email"
              dense
              :rules="[
                (val) => val.length > 0 ?  (Utils.onlyEmail(val)  || $t('invalid_email_address')) : true,
              ]"
              outlined
              maxlength="30"
              lazy-rules
            />
          </div>
          <div class="col-6 col-md-2 q-pr-md mt-1">
            <label class="">{{ $t("contact_number") }}</label>
            <q-input
              v-model="templateDetail.company_info.contact_number"
              dense
              outlined
              maxlength="30"
              lazy-rules
            />
          </div>

          <div class="col-6 col-md-2 q-pr-md mt-1">
            <label class="">{{ $t("country") }}</label>

            <q-select
              v-model="address.country_id"
              :options="countryOption"
              outlined
              dense
              emit-value
              map-options
              option-value="id"
              option-label="name"
              clearable
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
              lazy-rules
            />
          </div>
          <div class="col-6 col-md-2 q-pr-md mt-1">
            <label class="">{{ $t("state") }}</label>
            <q-select
              v-model="address.state_id"
              :options="stateOption"
              outlined
              dense
              emit-value
              map-options
              option-value="id"
              :label="$t(Utils.getKey('state'))"
              option-label="state_name"
              clearable
            />
          </div>
          <div class="col-6 col-md-2 q-pr-md mt-1">
            <label class="">{{ $t("city") }}</label>
            <q-select
              v-model="address.city_id"
              :options="cityOption"
              outlined
              dense
              emit-value
              map-options
              option-value="id"
              option-label="city_name"
              clearable
            />
          </div>

          <div class="col-6 col-md-2 q-pr-md mt-1">
            <label class="">{{ $t("zipcode") }}</label>
            <q-input v-model="address.zipcode" dense outlined lazy-rules />
          </div>
        </div>

        <p class="mt-6 font_18 text-bold">{{ $t("socail_media") }}</p>
        <q-separator />

        <div class="row q-mt-md">
          <div
            class="col-6 col-sm-2 col-md-2 q-pr-md q-pb-md"
            v-for="(v, k, index) in socail"
            :key="index"
          >
            <div class="mt-3">
              <div class="d-flex">
              <label class="pa-2 border">
                <i class="fa fa-image"></i> {{ $t(socail[k].name) }}
                <input
                  class="mt-2"
                  style="display: none"
                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                  type="file"
                  @change="onChangeImage"
                  :id="socail[k].name"
                  :name="socail[k].name"
                />
              </label>
              <q-toggle
                v-if="socail[k].url_image != ''"
                v-model="socail[k].status"
                checked-icon="check"
                class="pl-0"
                color="orange"
                unchecked-icon="clear"
              />
            </div>
              <div class="tran_bg">
                <img
                  style="height: 90px"
                  class="mt-3"
                  :src="socail[k].url_image"
                />
              </div>
              <div>
                <q-input
                  v-model="socail[k].url"
                  :label="$t('url')"
                  dense
                  maxlength="40"
                  lazy-rules
                />
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>
    <!-- footer action -->
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
        class="q-px-md q-ml-md"
        @click="onSubmit"
        style="color: var(--q-primary) !important"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
    <Loading :loading="isLoading" />
    <q-dialog v-model="isView" position="top">
      <div class="row mt-3" style="min-width: 220px">
        <div class="col-12">
          <div class="row" v-viewer>
            <div v-for="(img, index) in viewImage" :key="index" class="ml-2">
              <div class="card_img">
                <img
                  :src="img.path + '?resulotion=100'"
                  style="width: 146px; height: 140px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { useQuasar } from "quasar";
import Utils from "../../helpers/Utils";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";
import useTemplate from "../../composables/useTemplate";
import useCountry from "../../composables/useCountry";
import useCountryStates from "src/composables/useCountryStates";
import useCity from "../../composables/useCity";
import useLanguage from "src/composables/useLanguage";

const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);
const { all, getTemplateDetail, addTemplateDetail, updateTemplateDetail } =
  useTemplate();

const locale = inject("locale");
const $q = useQuasar();
const lang = useLanguage();
const languages = ref([]);
const countryInst = useCountry();
const state = useCountryStates();
const { getByStateId } = useCity();
const setting_isusing = ref(false);
const isLoading = ref(true);
const templates = ref({});
const address = ref({
  city_id: "",
  state_id: "",
  country_id: "",
  zipcode: "",
});
const translation = ref({
  company_name: {},
  copy_right: {},
  website_description: {},
  website_title: {},
  address_line: {},
  address_line_2: {},
});
const templateDetail = ref({
  // primary_colour: "",
  // secondary_colour: "",
  theme: {
    primary: {
      main: "",
      light: "",
      dark: "",
    },
    secondary: {
      main: "",
      light: "",
      dark: "",
    },
  },
  template_id: "",
  website_description: "",
  website_title: "",
  banner_style: "",
  website_logo: "",
  h5_logo: "",
  company_info: {
    company_name: "",
    copy_right: "",
    info_email: "",
    support_email: "",
    contact_number: "",
    address: address.value,
  },
});

const socail = ref({
  facebook: {
    image: "",
    url: "",
    url_image: "",
    purpose: 4,
    name: "facebook",
    status: true,
  },
  twitter: {
    image: "",
    url: "",
    url_image: "",
    purpose: 2,
    name: "twitter",
    status: true,
  },
  pinterest: {
    image: "",
    url: "",
    url_image: "",
    purpose: 3,
    name: "pinterest",
    status: true,
  },
  youtube: {
    image: "",
    url: "",
    url_image: "",
    purpose: 5,
    name: "youtube",
    status: true,
  },
  instagram: {
    image: "",
    url: "",
    url_image: "",
    purpose: 6,
    name: "instagram",
    status: true,
  },
  qq: {
    image: "",
    url: "",
    url_image: "",
    purpose: 7,
    name: "qq",
    status: true,
  },
  skype: {
    image: "",
    url: "",
    url_image: "",
    purpose: 8,
    name: "skype",
    status: true,
  },
  telegram: {
    image: "",
    url: "",
    url_image: "",
    purpose: 9,
    name: "telegram",
    status: true,
  },
  whatapp: {
    image: "",
    url: "",
    url_image: "",
    purpose: 10,
    name: "whatapp",
    status: true,
  },
});

const countryOption = ref([]);
const stateOption = ref([]);
const cityOption = ref([]);
const images = ref([]);
const viewImage = ref([]);
const isView = ref(false);
const myForm = ref(null);
const imageLogo = ref("");
const imageLogoRequired = ref(false);
const imageLogoRequiredH5 = ref(false);
const templateRequired = ref(false);
const images_url = ref("");
const imageLogoH5 = ref("");
const images_url_h5 = ref("");
const load_local = ref("en");
const tab = ref(locale.value ? locale.value : load_local.value);
// console.log("tab", tab.value);

const uploadChange = (e) => {
  imageLogoRequired.value = false;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target.result) {
      images_url.value = e.target.result;
    }
  };
  imageLogo.value = e.target.files[0];

  reader.readAsDataURL(e.target.files[0]);
};

const onChangeImage = (e) => {
  // console.log(e.target.name);
  let file_name = e.target.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target.result) {
      socail.value[file_name].url_image = e.target.result;
    }
  };
  socail.value[file_name].image = e.target.files[0];
  reader.readAsDataURL(e.target.files[0]);
};

const uploadChangeH5 = (e) => {
  imageLogoRequiredH5.value = false;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target.result) {
      images_url_h5.value = e.target.result;
    }
  };
  imageLogoH5.value = e.target.files[0];

  reader.readAsDataURL(e.target.files[0]);
};

const getStateByCountryID = async (id) => {
  let getState = await state.getByCountryId(id);
  stateOption.value = getState.data;
};

const getCityByStateId = async (id) => {
  let getState = await getByStateId(id);
  cityOption.value = getState.data;
};

watch(
  () => address.value.state_id,
  () => {
    getCityByStateId(address.value.state_id);
    // address.value.city_id = "";
  }
);

watch(
  () => address.value.country_id,
  () => {
    getStateByCountryID(address.value.country_id);
    // address.value.state_id = "";
    // address.value.city_id = "";
  }
);

const viewAllImage = (item) => {
  isView.value = true;
  viewImage.value = item.image;
  // console.log(item, "viewAllImage");
};

async function onSubmit() {
  try {
    if (templateDetail.value.template_id == "") {
      templateRequired.value = true;
      window.scroll({ top: 12, left: 0, behavior: "smooth" });
      return;
    }
    let requireField = [];
    if (
      (imageLogo.value == "" || imageLogoH5.value == "") &&
      !templateDetail.value.id
    ) {
      if (imageLogo.value == "") {
        imageLogoRequired.value = true;
      }
      if (imageLogoH5.value == "") {
        imageLogoRequiredH5.value = true;
      }
      window.scroll({ top: 120, left: 0, behavior: "smooth" });
      return;
    }

    const FormData = require("form-data");
    const formData = new FormData();
    for (const key in templateDetail.value) {
      if (key != "company_info") {
        if (
          templateDetail.value[key] === "" ||
          templateDetail.value[key] == null
        ) {
          if (key != "website_logo" && key != "h5_logo") requireField.push(key);
        }
        formData.append(
          `${key}`,
          key == "theme"
            ? JSON.stringify(templateDetail.value[key])
            : templateDetail.value[key]
        );
      }
    }
    // if (requireField.length > 0) {
    //   requireField.forEach((field) => {
    //     $q.notify({
    //       position: "top-right",
    //       type: "negative",
    //       icon: "fas fa-exclamation-triangle",
    //       message: t(`${field}_is_required`),
    //     });
    //   });
    //   return;
    // }
    let validation = await myForm.value.validate();

    let index1 = 0,
      index2 = 0,
      index3 = 0,
      index4 = 0,
      index5 = 0,
      index6 = 0,
      index7 = 0;
    for (const keyLng in translation.value.company_name) {
      formData.append(
        `company_info[company_name][${index1}][language_id]`,
        keyLng
      );
      formData.append(
        `company_info[company_name][${index1}][translation]`,
        translation.value.company_name[keyLng]
      );
      formData.append(
        `company_info[company_name][${index1}][field_name]`,
        "company_name"
      );
      index1++;
      // for table validation
      console.log(
        translation.value.company_name[keyLng],
        "translation.value.company_name[keyLng]"
      );
      if (
        translation.value.company_name[keyLng] == "" ||
        translation.value.website_title[keyLng] == "" ||
        translation.value.website_description[keyLng] == "" ||
        translation.value.company_name[keyLng] == undefined ||
        translation.value.website_title[keyLng] == undefined ||
        translation.value.website_description[keyLng] == undefined
      ) {
        tab.value = languages.value.filter((lg) => lg.id == keyLng)[0]?.locale;
        console.log(tab.value, "tab value");
        window.scroll({ top: 520, left: 0, behavior: "smooth" });
        return;
      }
    }

    for (const keyLng in translation.value.copy_right) {
      formData.append(
        `company_info[copy_right][${index2}][language_id]`,
        keyLng
      );
      formData.append(
        `company_info[copy_right][${index2}][translation]`,
        translation.value.copy_right[keyLng]
      );
      formData.append(
        `company_info[copy_right][${index2}][field_name]`,
        "copy_right"
      );
      index2++;
    }

    for (const keyLng in translation.value.website_title) {
      formData.append(`website_title[${index3}][language_id]`, keyLng);
      formData.append(
        `website_title[${index3}][translation]`,
        translation.value.website_title[keyLng]
      );
      formData.append(`website_title[${index3}][field_name]`, "website_title");
      index3++;
    }

    for (const keyLng in translation.value.website_description) {
      formData.append(`website_description[${index4}][language_id]`, keyLng);
      formData.append(
        `website_description[${index4}][translation]`,
        translation.value.website_description[keyLng]
      );
      formData.append(
        `website_description[${index4}][field_name]`,
        "website_description"
      );
      index4++;
    }

    for (const keyLng in translation.value.address_line) {
      formData.append(
        `company_info[address][address_line][${index5}][language_id]`,
        keyLng
      );
      formData.append(
        `company_info[address][address_line][${index5}][translation]`,
        translation.value.address_line[keyLng]
      );
      formData.append(
        `company_info[address][address_line][${index5}][field_name]`,
        "address_line"
      );
      index5++;
    }

    for (const keyLng in translation.value.address_line_2) {
      formData.append(
        `company_info[address][address_line_2][${index6}][language_id]`,
        keyLng
      );
      formData.append(
        `company_info[address][address_line_2][${index6}][translation]`,
        translation.value.address_line_2[keyLng]
      );
      formData.append(
        `company_info[address][address_line_2][${index6}][field_name]`,
        "address_line_2"
      );
      index6++;
    }

    if (!validation) {
      console.log(tab.value, "tab value 3");
      window.scroll({ top: 350, left: 0, behavior: "smooth" });
      return;
    }

    // socal icon medai
    let index_icon = 0;
    for (const icon_key in socail.value) {
      if (socail.value[icon_key].image != "") {
        formData.append(
          `social[${index_icon}][image]`,
          socail.value[icon_key]?.image
        );
      }
      formData.append(
        `social[${index_icon}][status]`,
        socail.value[icon_key]?.status ? "active" : "inactive"
      );
      formData.append(
        `social[${index_icon}][purpose]`,
        socail.value[icon_key]?.purpose
      );
      formData.append(
        `social[${index_icon}][name]`,
        socail.value[icon_key]?.name
      );
      formData.append(
        `social[${index_icon}][url]`,
        socail.value[icon_key]?.url
      );

      index_icon++;
    }

    formData.append(
      `company_info[info_email]`,
      templateDetail.value.company_info.info_email
    );
    formData.append(
      `company_info[support_email]`,
      templateDetail.value.company_info.support_email
    );
    formData.append(
      `company_info[contact_number]`,
      templateDetail.value.company_info.contact_number
    );
    for (const adk in address.value) {
      formData.append(`company_info[address][${adk}]`, address.value[adk]);
    }

    // console.log("translation", translation.value);

    // console.log(templateDetail.value.id);
    if (templateDetail.value.id) {
      formData.delete("website_logo");
      if (templateDetail.value.city_id == null) {
        formData.delete("company_info[address][city_id]");
        formData.append(
          "company_info[address][city_id]",
          address.value.city_id || ""
        );
      }
      if (templateDetail.value.state_id == null) {
        formData.delete("company_info[address][state_id]");
        formData.append(
          "company_info[address][state_id]",
          address.value.state_id || ""
        );
      }
      if (imageLogo.value) {
        formData.append(`website_logo`, imageLogo.value);
      } else {
        formData.append(`website_logo`, "");
      }
      if (imageLogoH5.value) {
        formData.append(`h5_logo`, imageLogoH5.value);
      } else {
        formData.append(`h5_logo`, "");
      }
      // formData.append(`id`, templateDetail.value.id);
      await updateTemplateDetail(templateDetail.value.id, formData);
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("updated successfully")),
      });
    } else {
      formData.append(`website_logo`, imageLogo.value);
      formData.append(`h5_logo`, imageLogoH5.value);
      await addTemplateDetail(formData);
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("add successfully")),
      });
    }
    getData();
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
}

const getTemplates = async () => {
  let getTemp = await all();
  templates.value = getTemp.data;
  // console.log(getTemp);
};
const getData = async () => {
  isLoading.value = true;
  let tempDetail = await getTemplateDetail();
  if (tempDetail.data.data) {
    templateDetail.value = tempDetail.data.data;
    templateDetail.value["company_info"] = tempDetail.data?.data?.company_info;
    address.value = tempDetail.data?.data?.company_info?.address;
    if (address.value.state_id) {
      getStateByCountryID(address.value.country_id);
    }
  }
  images_url.value = tempDetail.data?.data?.website_logo?.path;
  images_url_h5.value = tempDetail.data?.data?.h5_logo?.path;
  languages.value.forEach((lg) => {
    translation.value.company_name[lg.id] =
      tempDetail.data?.data?.company_info?.translations[lg.locale]
        ?.company_name != "undefined"
        ? tempDetail.data?.data?.company_info?.translations[lg.locale]
            ?.company_name
        : "";
    translation.value.copy_right[lg.id] =
      tempDetail.data?.data?.company_info?.translations[lg.locale]
        ?.copy_right != "undefined"
        ? tempDetail.data?.data?.company_info?.translations[lg.locale]
            ?.copy_right
        : "";
    translation.value.address_line[lg.id] =
      tempDetail.data?.data?.company_info?.address?.translations[lg.locale]
        ?.address_line != "undefined"
        ? tempDetail.data?.data?.company_info?.address?.translations[lg.locale]
            ?.address_line
        : "";
    translation.value.address_line_2[lg.id] =
      tempDetail.data?.data?.company_info?.address?.translations[lg.locale]
        ?.address_line_2 != "undefined"
        ? tempDetail.data?.data?.company_info?.address?.translations[lg.locale]
            ?.address_line_2
        : "";
    translation.value.website_title[lg.id] =
      tempDetail.data?.data?.translations[lg.locale]?.website_title !=
      "undefined"
        ? tempDetail.data?.data?.translations[lg.locale]?.website_title
        : "";
    translation.value.website_description[lg.id] =
      tempDetail.data?.data?.translations[lg.locale]?.website_description !=
      "undefined"
        ? tempDetail.data?.data?.translations[lg.locale]?.website_description
        : "";
    // for images
  });

  console.log(translation.value, "translation.value");
  let temp_config =
    tempDetail.data?.data?.template_configuration.length > 0
      ? JSON.parse(tempDetail.data?.data?.template_configuration[0].data)
      : [];
  tempDetail.data?.data?.social_logo.forEach((sol) => {
    for (const key in socail.value) {
      if (sol.purpose == socail.value[key].purpose) {
        let geConfig = temp_config.filter(
          (tmConfi) => tmConfi.purpose == socail.value[key].purpose
        );
        socail.value[key].url_image = sol.path;
        socail.value[key].url = geConfig.length > 0 ? geConfig[0].url : "";
        socail.value[key].status =
          geConfig.length > 0
            ? geConfig[0].status == "active"
              ? true
              : false
            : true;
      }
    }
  });
  isLoading.value = false;
};

async function getLang() {
  const response = await lang.all();
  languages.value = response.data;
  if (languages.value.length > 0) {
    load_local.value = languages.value[0].locale;
  }
  // console.log(languages.value);
  getData();
}
Promise.all([getLang()]);
onMounted(async () => {
  getTemplates();
  countryOption.value = await (await countryInst.all()).data;
});
</script>
