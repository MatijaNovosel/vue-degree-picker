<template>
  <div class="picker__body">
    <div class="degree-picker-clock__container">
      <div
        ref="clock"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mouseleave="(e: MouseEvent) => state.isDragging && onMouseUp(e)"
        @touchstart="onMouseDown"
        @touchend="onMouseUp"
        @mousemove="onDragMove"
        @touchmove="onDragMove"
        class="degree-picker-clock"
        :class="{
          'degree-picker-clock--indeterminate': value == null
        }"
      >
        <div class="degree-picker-clock__inner">
          <div
            class="degree-picker-clock__hand"
            :class="{
              'degree-picker-clock__hand--disabled': props.disabled
            }"
            :style="clockHandStyle"
          />
          <span
            v-for="v in values"
            :key="v"
            class="degree-picker-clock__item"
            :class="{
              'degree-picker-clock__item--active': v === activeLabelValue,
              'degree-picker-clock__item--disabled': props.disabled
            }"
            :style="getTransform(v)"
          >
            <span>{{ v }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";

interface Point {
  x: number;
  y: number;
}

const emit = defineEmits<{
  (e: "input", value: number): void;
  (e: "change", value: number): void;
}>();

const clock = ref<HTMLElement | null>(null);

const props = defineProps<{
  disabled?: boolean;
  readonly?: boolean;
  activeColor?: string;
  bodyColor?: string;
  value: number | null;
  min: number;
  max: number;

  /** labels only */
  step: number;

  /** snapping only */
  snapStep: number;
}>();

const state = reactive({
  inputValue: props.value,
  isDragging: false,
  valueOnMouseDown: null as number | null,
  valueOnMouseUp: null as number | null
});

const isInteractable = computed(() => !(props.readonly || props.disabled));

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

const normalizeStep = (n: number) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return 1;
  return Math.max(1, Math.floor(v));
};

const range = computed(() => Math.max(1, props.max - props.min));

/**
 * Visible values (labels around clock) — uses step only
 */
const values = computed(() => {
  const res: number[] = [];
  const step = normalizeStep(props.step);

  for (let v = props.min; v <= props.max; v += step) res.push(v);
  if (res.length === 0) res.push(props.min);

  return res;
});

const displayedValue = computed(() =>
  props.value == null ? props.min : props.value
);

const valueToAngleDeg = (value: number) => {
  const v = clamp(value, props.min, props.max);
  return ((v - props.min) / range.value) * 360;
};

const degreesToRad = (deg: number) => (deg * Math.PI) / 180;

const clockHandStyle = computed(() => ({
  transform: `rotate(${valueToAngleDeg(displayedValue.value)}deg)`,
  backgroundColor:
    props.value !== null
      ? props.disabled
        ? "#8d7d7d"
        : props.activeColor
      : undefined
}));

const getPosition = (value: number) => {
  const rotateOffsetRad = degreesToRad(1);
  const rad = degreesToRad(valueToAngleDeg(value)) + rotateOffsetRad;

  return {
    x: Math.sin(rad) * 1,
    y: -Math.cos(rad) * 1
  };
};

const getTransform = (v: number) => {
  const { x, y } = getPosition(v);
  return {
    left: `${50 + x * 50}%`,
    top: `${50 + y * 50}%`,
    backgroundColor:
      activeLabelValue.value !== null && v === activeLabelValue.value
        ? props.disabled
          ? "#8d7d7d"
          : props.activeColor
        : undefined
  };
};

const activeLabelValue = computed<number | null>(() => {
  if (props.value == null) return null;
  return values.value.includes(props.value) ? props.value : null;
});

const euclidean = (p0: Point, p1: Point) => {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const angle = (center: Point, p1: Point) => {
  const value =
    2 * Math.atan2(p1.y - center.y - euclidean(center, p1), p1.x - center.x);
  return Math.abs((value * 180) / Math.PI);
};

const angleToSnappedValue = (ang: number) => {
  const snap = normalizeStep(props.snapStep);
  const a = ((ang % 360) + 360) % 360;
  const raw = props.min + (a / 360) * range.value;
  const snapped = props.min + Math.round((raw - props.min) / snap) * snap;
  return clamp(snapped, props.min, props.max);
};

const update = (value: number) => {
  if (state.inputValue !== value) {
    state.inputValue = value;
    emit("input", value);
  }
};

const setMouseDownValue = (value: number) => {
  if (state.valueOnMouseDown === null) state.valueOnMouseDown = value;
  state.valueOnMouseUp = value;
  update(value);
};

const onDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isInteractable.value) return;

  e.preventDefault();
  if ((!state.isDragging && e.type !== "click") || !clock.value) return;

  const { width, top, left } = clock.value.getBoundingClientRect();
  const { clientX, clientY } = "touches" in e ? e.touches[0] : e;

  const center = { x: width / 2, y: -width / 2 };
  const coords = { x: clientX - left, y: top - clientY };

  const handAngle = (Math.round(angle(center, coords)) + 360) % 360;

  const checksCount = 4;
  const stepAngle = 360 / Math.max(12, values.value.length);

  for (let i = 0; i < checksCount; i++) {
    const value = angleToSnappedValue(handAngle + i * stepAngle);
    return setMouseDownValue(value);
  }
};

const onMouseDown = (e: MouseEvent | TouchEvent) => {
  if (!isInteractable.value) return;

  e.preventDefault();
  state.valueOnMouseDown = null;
  state.valueOnMouseUp = null;
  state.isDragging = true;
  onDragMove(e);
};

const onMouseUp = (e: MouseEvent | TouchEvent) => {
  if (!isInteractable.value) return;

  e.stopPropagation();
  state.isDragging = false;
  if (state.valueOnMouseUp !== null) emit("change", state.valueOnMouseUp);
};

watch(
  () => props.value,
  (val) => (state.inputValue = val)
);
</script>

<style scoped>
/* unchanged styles */
.degree-picker-clock {
  font-family: "Roboto";
  background-color: v-bind(bodyColor);
  border-radius: 100%;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  user-select: none;
  width: 100%;
  padding-top: 100%;
  flex: 1 0 auto;
}

.degree-picker-clock__item--disabled {
  color: rgb(177, 160, 160);
}

.degree-picker-clock--indeterminate .degree-picker-clock__hand {
  background-color: #bdbdbd;
}

.degree-picker-clock--indeterminate:after {
  color: yellow;
}

.degree-picker-clock--indeterminate .degree-picker-clock__item--active {
  background-color: #bdbdbd;
}

.degree-picker-clock__container {
  display: flex;
  flex-direction: column;
  flex-basis: 290px;
  justify-content: center;
  padding: 10px;
}

.degree-picker-clock__hand {
  height: calc(50% - 4px);
  width: 2px;
  bottom: 50%;
  left: calc(50% - 1px);
  transform-origin: center bottom;
  position: absolute;
  will-change: transform;
  z-index: 1;
}

.degree-picker-clock__hand:before {
  background: transparent;
  border-width: 2px;
  border-style: solid;
  border-color: v-bind(activeColor);
  border-radius: 100%;
  width: 10px;
  height: 10px;
  content: "";
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translate(-50%, -50%);
}

.degree-picker-clock__hand--disabled:before {
  border-color: #8d7d7d;
}

.degree-picker-clock__hand:after {
  content: "";
  position: absolute;
  height: 8px;
  width: 8px;
  top: 100%;
  left: 50%;
  border-radius: 100%;
  border-style: solid;
  border-color: v-bind(activeColor);
  background-color: v-bind(activeColor);
  transform: translate(-50%, -50%);
}

.degree-picker-clock__hand--disabled:after {
  border-color: #8d7d7d;
  background-color: #8d7d7d;
}

.picker--full-width .degree-picker-clock__container {
  max-width: 290px;
}

.degree-picker-clock__inner {
  position: absolute;
  bottom: 27px;
  left: 27px;
  right: 27px;
  top: 27px;
}

.degree-picker-clock__item {
  align-items: center;
  border-radius: 100%;
  cursor: default;
  display: flex;
  font-size: 16px;
  justify-content: center;
  height: 40px;
  position: absolute;
  text-align: center;
  width: 40px;
  user-select: none;
  transform: translate(-50%, -50%);
}

.degree-picker-clock__item > span {
  z-index: 1;
}

.degree-picker-clock__item:before,
.degree-picker-clock__item:after {
  content: "";
  border-radius: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.degree-picker-clock__item:after,
.degree-picker-clock__item:before {
  height: 40px;
  width: 40px;
}

.degree-picker-clock__item--active {
  color: white;
  cursor: default;
  z-index: 2;
}

.degree-picker-clock__item--disabled {
  pointer-events: none;
}
</style>
