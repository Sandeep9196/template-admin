<template>
  <q-card style="margin-left: 0px; box-shadow: none; min-height: 85vh">
    <q-toolbar class="pl-0 text-theme text-center">
      <q-toolbar-title>
        {{ $t(Utils.getKey("Global MLM Level Settings Settings")) }}
      </q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-card-section>
      <div class="row q-pt-md">
        <div class="col-12 col-md-8">
          <div class="row">
            <div class="col-12 col-md-4 q-pr-md">
              <label>{{ $t(Utils.getKey("Level One Commision")) }}</label>
              <q-input
                :autofocus="true"
                v-model="mlm.level_one_commission"
                dense
                outlined
                maxlength="100"
                lazy-rules
                :rules="[
                  (val) => !!val || $t(Utils.getKey('Field is required')),
                  (val) =>
                    Utils.containsOnlyNumbers(val) ||
                    $t(Utils.getKey('only Number')),
                ]"
              />
            </div>
            <div class="col-12 col-md-4 q-pr-md">
              <label>{{ $t(Utils.getKey("Level Two Commision")) }}</label>
              <q-input
                :autofocus="true"
                v-model="mlm.level_two_commission"
                dense
                outlined
                maxlength="100"
                lazy-rules
                :rules="[
                  (val) => !!val || $t(Utils.getKey('Field is required')),
                  (val) =>
                    Utils.containsOnlyNumbers(val) ||
                    $t(Utils.getKey('only Number')),
                ]"
              />
            </div>
            <div class="col-12 col-md-4 q-pr-md">
              <label>{{ $t(Utils.getKey("Level Three Commision")) }}</label>
              <q-input
                :autofocus="true"
                v-model="mlm.level_three_commission"
                dense
                outlined
                maxlength="100"
                lazy-rules
                :rules="[
                  (val) => !!val || $t(Utils.getKey('Field is required')),
                  (val) =>
                    Utils.containsOnlyNumbers(val) ||
                    $t(Utils.getKey('only Number')),
                ]"
              />
            </div>
          </div>
          <!-- row 2 -->
          <div class="row">
            <div class="col-12 col-md-4 q-pr-md">
              <label>{{ $t(Utils.getKey("mlm Status")) }}</label>
              <q-select
                v-model="mlm.level_one_status"
                :options="status"
                outlined
                dense
                emit-value
                map-options
                option-value="name"
                :label="$t(Utils.getKey('MLM L1 Status'))"
                :option-label="(name) => $t(Utils.getKey(name))"
                clearable
                class="input_white"
              />
            </div>
            <div class="col-12 col-md-4 q-pr-md">
              <label>{{ $t(Utils.getKey("mlm Status")) }}</label>
              <q-select
                v-model="mlm.level_two_status"
                :options="status"
                outlined
                dense
                emit-value
                map-options
                option-value="name"
                :label="$t(Utils.getKey('MLM L2 Status'))"
                :option-label="(name) => $t(Utils.getKey(name))"
                clearable
                class="input_white"
              />
            </div>
            <div class="col-12 col-md-4 q-pr-md">
              <label>{{ $t(Utils.getKey("mlm Status")) }}</label>
              <q-select
                v-model="mlm.level_three_status"
                :options="status"
                outlined
                dense
                emit-value
                map-options
                option-value="name"
                :label="$t(Utils.getKey('MLM L3 Status'))"
                :option-label="(name) => $t(Utils.getKey(name))"
                clearable
                class="input_white"
              />
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="text-left q-mt-sm">
      <q-btn
        outline
        color="negative"
        class="q-px-md"
        @click="resetCodeBasic"
        :disable="saving"
        >{{ $t(Utils.getKey("Reset")) }}</q-btn
      >
      <q-btn
        color="accent"
        class="q-px-md q-ml-md green"
        outline
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
    <Loading :loading="loading" />
  </q-card>
</template>

<script setup>
import { inject, ref, onMounted, watch } from "vue";
import useConfiguration from "../../composables/useConfiguration";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
// use=
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
const { t } = useI18n();
const $q = useQuasar();

const currency_id = inject("currency_id");
const locale = inject("locale");
const { loading, mlmGetConfiguration, mlmAddConfiguration } =
  useConfiguration();
const mlm = ref({});
const mlmRes = ref({});
const status = ref(["active", "inactive"]);

onMounted(async () => {
  const res = await mlmGetConfiguration();
  const resData = res.data?.data?.data || mlm.value;
  mlm.value = JSON.parse(resData) || mlm.value;
  mlmRes.value = JSON.parse(resData) || mlm.value;
});

const onSubmit = async () => {
  try {
    if (
      !Utils.containsOnlyNumbers(mlm.value.level_one_commission) ||
      !Utils.containsOnlyNumbers(mlm.value.level_two_commission) ||
      !Utils.containsOnlyNumbers(mlm.value.level_three_commission)
    ) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("commisions values required only number")),
      });
      return false;
    }
    const res = await mlmAddConfiguration(mlm.value);
    const resData = res.data?.data?.data || mlm.value;
    mlm.value = JSON.parse(resData) || mlm.value;
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("Updated successfully")),
    });
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
};

const resetCodeBasic = async () => {
  mlm.value = mlmRes.value;
};
</script>
<style scoped></style>
