<template>
  <degree-picker v-model="degrees" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import degreePicker from "./components/degreePicker.vue";
const degrees = ref(0);
</script>
