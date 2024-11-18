import { createRequire } from 'module'
const require = createRequire(import.meta.url)
export const collections = {
  'ci': () => require('@iconify-json/ci/icons.json'),
  'mdi': () => require('@iconify-json/mdi/icons.json'),
  'ri': () => require('@iconify-json/ri/icons.json'),
}