<div align="center">
  <img src="https://user-images.githubusercontent.com/36193643/235878084-9d2a7f8e-591a-4599-bc9c-b1336bc881f1.png" />
</div>

<h1 align=center>Vue degree picker</h1>
<p align=center>A degree picker component for Vue 3.</p>

## 🚀 Installation

Install using your package manager of choice:

```bash
yarn add degree-picker
```

## 📺 Demo

https://matija-components.vercel.app/degree-picker

## ⚙️ Usage

Import the component locally or define it globally and include the css file:

```vue
<template>
  <degree-picker active-color="green" v-model="degrees" />
</template>

<script lang="ts" setup>
import { DegreePicker } from "degree-picker";
import { ref } from "vue";
import "degree-picker/dist/style.css";

const degrees = ref(0);
</script>
```

## 📃 Props

| Name           | Type            | Default | Description                                                                                                      |
| -------------- | --------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `active-color` | `string`        | #567a0d | Background color of the active value and clock hand                                                              |
| `body-color`   | `string`        | #eee    | Background color of the picker body                                                                              |
| `v-model`      | `number`        |         | Standard two way input                                                                                           |
| `step`         | `number`        | 30      | The step used for displaying the degrees (30 will be [0, 30, 60, 90, 120 etc.])                                  |
| `snap-step`    | `number`        | 15      | The step used for selecting the degrees (will step from 0 to 15 to 30 to 45 etc)                                 |
| `min`          | `number/string` | 0       | Minimum allowed value of the picker                                                                              |
| `max`          | `number/string` | 359     | Maximum allowed value of the picker                                                                              |
| `width`        | `number/string` | 290px   | Sets the width of the element - can be provided as a string like "290px" or "290" or a number, defaults to 290px |
| `full-width`   | `boolean`       | false   | Ignores the previous `width` prop and sets the width to 100% of the parent container                             |
| `disabled`     | `boolean`       | false   | Makes the component unclickable                                                                                  |
| `readonly`     | `boolean`       | false   | Makes the component unclickable, but does not make it seem disabled                                              |
