<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '100%',
      maxWidth: '100%',
      boxShadow: 'none',
    }"
    class="mt-3"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Menu")) }}</span>
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
      <q-form ref="myForm">
        <!-- <div class="row q-mt-xs"> -->
        <label class="">{{ $t("slug") }}</label>
        <q-input
          v-model="menu.slug"
          dense
          outlined
          :oninput="(evt) => Utils.onlyLettersAndNumbersandDashEvent(evt)"
          maxlength="255"
          :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          lazy-rules
        />
        <div class="mb-3">
          <q-radio v-model="menu.status"  val="active" :label="$t('active')" />
          <q-radio v-model="menu.status"  val="inactive" :label="$t('inactive')" />
        </div>
        <div class="row">
          <div class="col-6 pr-2">
            <label class="">{{ $t("type") }}</label>
            <div class="flex-1 d-flex">
              <q-select
                :options="types"
                v-model="menu.type_id"
                outlined
                dense
                emit-value
                map-options
                :rules="[
                  (val) => !!val || $t(Utils.getKey('Field is required')),
                ]"
                option-value="id"
                option-label="name"
                class="flex-1"
                clearable
              />
              <q-btn
                class="ml-1"
                style="height: 40px"
                @click="showType = true"
                >{{ $t("new") }}</q-btn
              >
            </div>
          </div>
          <div class="col-6 pl-2">
            <label class="">{{ $t("group") }}</label>
            <div class="d-flex">
              <q-select
                :options="groups"
                outlined
                dense
                class="flex-1"
                v-model="menu.group_id"
                emit-value
                option-value="id"
                option-label="name"
                :rules="[
                  (val) => !!val || $t(Utils.getKey('Field is required')),
                ]"
                map-options
                clearable
              />
              <q-btn
                class="ml-1"
                style="height: 40px"
                @click="showGroup = true"
                >{{ $t("new") }}</q-btn
              >
            </div>
          </div>
        </div>
        <div class="q-mt-lg"></div>
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
            @click="onTabClick(lang)"
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
          <div v-show="tab == lang.locale" style="min-height: 200px">
            <div class="row mt-3">
              <div class="col-12 col-md-12 q-pr-md">
                <label class="">{{ $t("title") }}</label>
                <q-input
                  v-model="menu.title[lang.id]"
                  dense
                  :rules="[
                    (val) => !!val || $t(Utils.getKey('Field is required')),
                  ]"
                  outlined
                  maxlength="225"
                  lazy-rules
                />
              </div>
              <div class="col-12 col-md-12 q-pr-md q-mt-md">
                <label class="">{{ $t("description") }}</label>
                <q-input
                  v-model="menu.description[lang.id]"
                  dense
                  outlined
                  :rules="[
                    (val) => !!val || $t(Utils.getKey('Field is required')),
                  ]"
                  maxlength="500"
                  type="textarea"
                  lazy-rules
                />
              </div>
              <div class="col-12 q-mt-lg col-md-12 q-pr-md">
                <label class="">{{ $t("content") }}</label>
                <q-editor
                  v-model="menu.content[lang.id]"
                  style="min-height: 400px"
                  :dense="$q.screen.lt.md"
                  :definitions="definitions"
                  :toolbar="[
                    [
                      'bold',
                      'italic',
                      'strike',
                      'underline',
                      'subscript',
                      'superscript',
                    ],
                    ['token', 'hr', 'link', 'custom_btn'],
                    ['print', 'fullscreen'],
                    [
                      {
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        list: 'only-icons',
                        options: ['left', 'center', 'right', 'justify'],
                      },
                      {
                        label: $t('formatting'),
                        icon: $q.iconSet.editor.formatting,
                        list: 'no-icons',
                        options: [
                          'p',
                          'h1',
                          'h2',
                          'h3',
                          'h4',
                          'h5',
                          'h6',
                          'code',
                        ],
                      },
                      {
                        label: $t('font_size'),
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'size-1',
                          'size-2',
                          'size-3',
                          'size-4',
                          'size-5',
                          'size-6',
                          'size-7',
                        ],
                      },
                      {
                        label: $t('font_style'),
                        icon: $q.iconSet.editor.font,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'default_font',
                          'arial',
                          'arial_black',
                          'comic_sans',
                          'courier_new',
                          'impact',
                          'lucida_grande',
                          'times_new_roman',
                          'verdana',
                        ],
                      },
                      'removeFormat',
                    ],
                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                    ['undo', 'redo'],
                    ['viewsource'],
                    ['insert_img'],
                  ]"
                  :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana',
                  }"
                ></q-editor>
              </div>
            </div>
          </div>
        </div>
        <!-- </q-tab-panels> -->
        <!-- </div> -->
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

    <q-dialog v-model="showType" persistent>
      <type-list
        :languages="languages"
        @onClose="(showType = false), onLoadData()"
        @onUpdated="onRefresh"
      />
    </q-dialog>
    <q-dialog v-model="showGroup" persistent>
      <group-list
        :type_id="menu.type_id"
        :types="types"
        :languages="languages"
        @onClose="(showGroup = false), onLoadDataGroup()"
        @onUpdated="onRefresh"
      />
    </q-dialog>
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { useQuasar } from "quasar";
import Utils from "../../helpers/Utils";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";
import useMenu from "src/composables/useMenu";
import TypeList from "./Type.vue";
import GroupList from "./Group.vue";

const showGroup = ref(false);
const showType = ref(false);
const { update, getType, getGroup } = useMenu();
const types = ref([]);
const groups = ref([]);
const { t } = useI18n();
const props = defineProps({ data: Object, languages: Array });
const emit = defineEmits(["onClose", "onUpdated"]);
const languages = ref(props.languages);
const locale = inject("locale");
const lang_id = ref(1);
const tab = ref(locale.value);
const $q = useQuasar();
const dataSumbit = ref();
const groupTemp = ref([]);
const defaultValue = {
  title: {},
  content: {},
  description: {},
  status: 'active',
  slug: "",
  type_id: "",
  group_id: "",
};
const menu = ref({ ...props.data, content: {}, description: {}, title: {} });
const definitions = ref({
  insert_img: {
    tip: "Insertar Imagen",
    icon: "photo",
    handler: insertImg, // handler will call insertImg() method
  },
});
const isLoading = ref(false)
const myForm = ref(null);
const onTabClick = (item) => {
  lang_id.value = item.id;
  console.log(lang_id.value);
};
function insertImg() {
  // insertImg method
  // const post = this.post;
  // create an input file element to open file dialog
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".png, .jpg"; // file extensions allowed
  let file;
  input.onchange = (_) => {
    const files = Array.from(input.files);
    file = files[0];

    // lets load the file as dataUrl
    const reader = new FileReader();
    let dataUrl = "";
    reader.onloadend = function () {
      dataUrl = reader.result;

      // append result to the body of your post
      menu.value.content[lang_id.value] +=
        '<div><img src="' + dataUrl + '" /></div>';
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

const onLoadData = async () => {
  let gType = await getType();
  types.value = gType.data.map((typ) => {
    return {
      id: typ.id,
      name: typ?.translations[locale.value]?.name,
    };
  });
};

const onLoadDataGroup = async () => {
  isLoading.value = true;
  let gGroup = await getGroup();
  groupTemp.value = groups.value = gGroup.data.map((g) => {
    return {
      id: g.id,
      name: g?.translations[locale.value]?.name,
      type_id: g?.type_id,
    };
  });
  isLoading.value = false;
};

onLoadData();
onLoadDataGroup();
watch(
  () => locale.value,
  () => {
    onLoadData();
    onLoadDataGroup();
  }
);

watch(
  () => menu.value.type_id,
  () => {
    // console.log("groups.value", groupTemp.value);
    groups.value = groupTemp.value.filter(
      (gp) => gp.type_id == menu.value.type_id
    );
    menu.value.group_id = ''
  }
);

async function onSubmit() {
  try {
    let validation = await myForm.value.validate();
    if (!validation) {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
      if (menu.value.type_id != "" && menu.value.group_id != "" && menu.value.slug != "") {
        $q.notify({
          position: "top",
          type: "negative",
          icon: "fas fa-exclamation-triangle",
          message: t(Utils.getKey("please fill all translation fileld")),
        });
      }
      return;
    }
    dataSumbit.value = menu.value;
    let title_translation = [];
    let content_translation = [];
    let description_translation = [];

    for (const key in menu.value.title) {
      title_translation.push({
        language_id: key,
        translation: menu.value.title[key],
        field_name: "title",
      });
    }
    for (const key in menu.value.description) {
      description_translation.push({
        language_id: key,
        translation: menu.value.description[key],
        field_name: "description",
      });
    }
    for (const key in menu.value.content) {
      if (menu.value.content[key] == '') {
        $q.notify({
          position: "top",
          type: "negative",
          icon: "fas fa-exclamation-triangle",
          message: t(Utils.getKey("please fill all translation fileld")),
        });
        return;
      }
      content_translation.push({
        language_id: key,
        translation: menu.value.content[key],
        field_name: "content",
      });
    }
    // dataSumbit.value.title = title_translation;
    // dataSumbit.value.description = description_translation;
    // dataSumbit.value.content = content_translation;
    await update(dataSumbit.value.id, {...dataSumbit.value, title: title_translation, description: description_translation, content: content_translation});
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
    emit("onClose");
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
onMounted(async () => {

  languages.value.forEach((lg) => {
    menu.value.title[lg.id] = props.data.translations[lg.locale]?.title;
    menu.value.content[lg.id] = props.data.translations[lg.locale]?.content;
    menu.value.description[lg.id] =
      props.data.translations[lg.locale]?.description;
  });

  console.log(menu.value, "menu.value");
});
</script>
