<template>
  <div
    :style="{
      width: props.fullWidth ? undefined : convertToUnit(props.width || 290)
    }"
  >
    <degree-picker-body
      :color="color"
      @input="onInput"
      @change="onChange"
      :step="step || 30"
      :min="0"
      :max="359"
      :value="state.inputDegree"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import degreePickerBody from "./degreePickerBody.vue";
import { convertToUnit } from "./helpers";

const emit = defineEmits<{
  (e: "change", degrees: number): void;
  (e: "update:modelValue", degrees: number): void;
}>();

const props = defineProps<{
  disabled?: boolean;
  min?: string;
  max?: string;
  readonly?: boolean;
  fullWidth?: boolean;
  color?: string;
  modelValue: number;
  width?: number | string;
  step?: number;
}>();

const state = reactive({
  inputDegree: null as number | null,
  lazyInputDegree: null as number | null
});

const onInput = (value: number) => {
  state.inputDegree = value;
  if (value !== null) emit("update:modelValue", value);
};

const onChange = () => {
  if (state.inputDegree === state.lazyInputDegree || state.inputDegree === null)
    return;
  state.lazyInputDegree = state.inputDegree;
  emit("change", state.inputDegree);
};

onMounted(() => (state.inputDegree = props.modelValue));
</script>
