import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "main-layout" | "upload-layouts"
declare module "../../node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}