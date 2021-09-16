import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from '@vuepress/theme-default'
import { navbar } from './configs'

export default defineUserConfig<DefaultThemeOptions>({
  base: '/ifs_shanghai_doc/',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Elektrobit Documentation Center',
      description: 'Find whatever you want to read from Elektrobit!',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Elektrobit 文档中心',
      description: '这里有所有你希望阅读到的Elektrobit公开文档o(*￣▽￣*)ブ',
    },
  },

  themeConfig: {
    logo: 'https://vuejs.org/images/logo.png',

    docsDir: 'docs',

    locales: {
      '/': {
        navbar: navbar.en,
        editLinkText: 'Edit this page on GitHub',
      },
      '/zh/': {
        navbar: navbar.zh,
        selectLanguageName: '简体中文',
        selectLanguageText: '选择语言',
        selectLanguageAriaLabel: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        contributorsText: '贡献者',
      }
    }
  },

  plugins: [
    [
      'redirect',
      {
        //TODO: Not work!
        locales: true,
      },
    ],
  ],
})