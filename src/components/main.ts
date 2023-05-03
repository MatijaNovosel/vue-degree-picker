import type { App } from "vue";
import DegreePicker from "../components/degreePicker.vue";

export default {
  install: (app: App) => {
    app.component("degree-picker", DegreePicker);
  }
};

export { DegreePicker };
