<template>
  <div
    :style="{
      width: props.fullWidth ? undefined : convertToUnit(props.width || 290)
    }"
  >
    <degree-picker-body
      :active-color="activeColor"
      :body-color="bodyColor"
      @input="onInput"
      @change="onChange"
      :step="step || 30"
      :min="0"
      :max="359"
      :value="state.inputDegree"
      :disabled="disabled"
      :readonly="readonly"
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

export interface Props {
  disabled?: boolean;
  min?: string;
  max?: string;
  readonly?: boolean;
  fullWidth?: boolean;
  activeColor?: string;
  bodyColor?: string;
  modelValue: number;
  width?: number | string;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  activeColor: "#567a0d",
  bodyColor: "#eee"
});

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
