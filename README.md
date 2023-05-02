<div align="center">
  <img src="https://user-images.githubusercontent.com/36193643/235635449-37f4efc3-74c4-4750-a39c-e4f2339d5087.png" />
</div>

<h1 align=center>Vue degree picker</h1>
<p align=center>A degree picker component for Vue 3.</p>

## 🚀 Installation

Install using your package manager of choice:

```bash
yarn add degree-picker
```

Register the component inside your `main.ts` file and import the stylesheet:

```ts
import degreePicker from "degree-picker";
import "degree-picker/dist/degree-picker.css";

const app = createApp(App);
app.use(degreePicker);
```

## ⚙️ Usage

```vue
<template>
  <degree-picker color="green" v-model="degrees" />
</template>

<script lang="ts" setup>
import degreePicker from "./components/degreePicker.vue";
import { ref } from "vue";
const degrees = ref(0);
</script>
```

## 📃 Props

| ID          | Type      | Default | Description                                                                          |
| ----------- | --------- | ------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `color`     | `string`  |         | Background color of the active value and clock hand                                  |
| `v-model`   | `number`  |         | Standard two way input                                                               |
| `width`     | `number   | string` |                                                                                      | Sets the width of the element - can be provided as a string like "290px" or "290" or a number, defaults to 290px |
| `fullWidth` | `boolean` |         | Ignores the previous `width` prop and sets the width to 100% of the parent container |
| `disabled`  | `boolean` |         | Makes the component unclickable                                                      |
| `readonly`  | `boolean` |         | Makes the component unclickable, but does not make it seem disabled                  |
