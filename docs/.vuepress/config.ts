import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'zh-CN',
  title: 'Hello Elektrobit',
  description: 'Welcome to EB documentation center!',

  themeConfig: {
    logo: 'https://vuejs.org/images/logo.png',
  },
})