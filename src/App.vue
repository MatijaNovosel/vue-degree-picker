<template>
  <degree-picker color="green" v-model="degrees" />
</template>

<script lang="ts" setup>
import degreePicker from "./components/degreePicker.vue";

import { ref } from "vue";

const degrees = ref(0);
</script>
