<template>
  <q-page :class="!store.leftDrawerOpen ? 'ml-5' : ''">
      <q-card class="pa-3 mt-1">
          <!-- <List @isNew="isAdd = true" v-if="!isAdd"/> -->
          <add-new    @onClose="isAdd = false" @onUpdated="onRefresh" />
      </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import List from "./List.vue";
import AddNew from 'src/components/Layout/Add.vue'
import { store } from "../../store/store";

const isAdd = ref(false)
const tab = ref("All");
</script>
<style scoped>
.q-tabs--dense .q-tab {
  min-height: 40px;
  border: 1px solid #e9e5e5;
  margin: 3px;
}
.q-tab__indicator {
  background-color: #f46932 !important;
}
</style>
