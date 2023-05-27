<template>
  <el-config-provider :locale="elLocale">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { provide, computed, ref } from "vue";
import { useMeta, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { ElConfigProvider } from "element-plus";
import auth from "./store/auth";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import km from "element-plus/dist/locale/km.mjs";
import Utils from "./helpers/Utils";

import useLanguage from "src/composables/useLanguage";
const { all } = useLanguage();
const { t, locale } = useI18n({ useScope: "global" });
const languages = ref([])

const elLocale = computed(() => {
  switch (locale.value) {
    case "en":
      return en;
    case "ch":
      return zhCn;
    case "kh":
      return km;
    default:
      return en;
  }
});
 const $q = useQuasar()

const onCheckTheme = async () => {
  let darkTheme = await localStorage.getItem('isDark') ;
  $q.dark.set(darkTheme == 'true' ? true : false)
}


Promise.all([getLanguage(), onCheckTheme()])
async function getLanguage() {
  try {
    const response = await all();
    languages.value = response.data;
  } catch (error) { }
}

const title = computed(() =>
  t(Utils.getKey("Ecommerce"))
);

useMeta(() => {
  return {
    title: title.value,
  };
});
const localKey = computed(() => {
  return  languages.value.filter(lg => lg.locale_web == locale.value)[0]?.locale
});
console.log(localKey, 'local');
provide("auth", auth);
provide("locale", localKey);
provide("currency_id", 1);
provide('leftDrawerOpen', 'homeee')
</script>
<style>

</style>
