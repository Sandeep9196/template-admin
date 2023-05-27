<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Approval Request")) }}</span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section>
      <div>
        <p style="text-transform: capitalize;">
          {{ $t(Utils.getKey('Transaction Requested Amount')) }}: <b>{{ transaction?.currency?.symbol }}{{
            transaction?.amount }}</b>
        </p>
        <p style="text-transform: capitalize;">
          {{ $t(Utils.getKey('Wallet Amount')) }}: <b>{{ getWalletBalance() }}</b>
        </p>
      </div>
    </q-card-section>
    <q-card-section>
      <q-input v-model="transaction.comment" :label="$t(Utils.getKey('comment'))" dense autogrow type="textarea" outlined
        required />
    </q-card-section>
    <q-card-section class="text-right q-mt-md">
      <q-btn flat color="negative" class="q-px-md" @click="onCancel" :disable="saving">{{
        $t(Utils.getKey("Reject"))
      }}</q-btn>
      <q-btn color="accent" class="q-px-md q-ml-md" style="color: var(--q-primary) !important" @click="onSubmit"
        :disable="saving">{{ $t(Utils.getKey("Approve"))
        }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import useTransaction from "src/composables/useTransaction";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onUpdate"]);

const $q = useQuasar();
const props = defineProps({ data: Object });
const { saving, update } = useTransaction();
const transaction = ref({ ...props.data });
const statusValue = ref('Approve');

const onCancel = () => {
  statusValue.value = 'Reject'
  onSubmit()
}

const getWalletBalance = () => {
  let balance = transaction?.value?.customer?.wallets?.amount || 0;
  if(transaction?.value?.currency_id != transaction?.value?.customer?.wallets?.currency_id){
    balance = 0;
  }

  return (transaction?.value?.currency?.symbol+balance)
}

async function onSubmit() {
  try {
    if (transaction.value.comment == "") {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Comment field required")),
      });
      return;
    }
    const FormData = require("form-data");
    const fomrData = new FormData();

    fomrData.append("status", statusValue.value);
    fomrData.append("_method", "patch");
    fomrData.append("transaction_type", transaction.value.transaction_type);
    fomrData.append("comment", transaction.value.comment);

    transaction.value.status = statusValue.value

    await update(transaction.value.id, fomrData);
    emit("onUpdate");
    emit("onClose");
    let message = statusValue.value == 'Approve' ? t(Utils.getKey("Approved successfully")) : t(Utils.getKey("Rejected successfully"))
    let type = statusValue.value == 'Approve' ? "positive" : "negative"
    $q.notify({
      position: "top-right",
      type: type,
      icon: "fas fa-check",
      message: message,
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
</script>


