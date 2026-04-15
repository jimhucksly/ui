import { App } from "vue"
import { POSITION, TYPE } from "./ts/constants"
import { buildInterface } from "./ts/interface"
import type { PluginOptions } from "./types"

const VueToastificationPlugin = {
  install(app: App, options?: PluginOptions) {
    const inter = buildInterface(options, true)
    app.config.globalProperties.$toasted = inter;
    // version of vue
    const ver = Number(app.version.replace(/\D/g, ''));
    if (ver > 3500) {
      app.onUnmount(() => {
        inter.destroy();
      });
    }
  }
}

export default VueToastificationPlugin

export {
  // Consts
  POSITION, PluginOptions, TYPE,
}

