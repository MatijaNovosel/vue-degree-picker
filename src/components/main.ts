import { DegreePicker } from "@/components";
import type { App } from "vue";

export default {
  install: (app: App) => {
    app.component("degree-picker", DegreePicker);
  }
};

export { DegreePicker };
