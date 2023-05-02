<template>
  <degree-picker color="green" v-model="degrees" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import degreePicker from "./components/degreePicker/degreePicker.vue";

const degrees = ref(0);
</script>
