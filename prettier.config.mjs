import base from '@smart-care/config/prettier'

/** @type {import('prettier').Config} */
export default {
  ...base,
  tailwindStylesheet: './apps/web/src/app/(frontend)/globals.css',
}
