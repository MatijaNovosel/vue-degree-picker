<template>
  <degree-picker disabled v-model="degrees" />
  {{ degrees }}
</template>

<script lang="ts" setup>
import { ref } from "vue";
import degreePicker from "./components/degreePicker.vue";
const degrees = ref(90);
</script>
