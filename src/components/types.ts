import type DegreePicker from "./degreePicker.vue";
import type { Props } from "./degreePicker.vue";

export type PluginOptions = Partial<Props>;
export * from "./index";

declare module "vue" {
  interface GlobalComponents {
    DegreePicker: typeof DegreePicker;
  }
}
