import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta'

export const en: NavbarConfig = [
    {
      text: 'Guide',
      link: '/en/guide/',
    },
    {
        text: `v${version}`,
        children: [
          {
            text: 'Changelog',
            link:
              'https://github.com/vuepress/vuepress-next/blob/main/CHANGELOG.md',
          },
          {
            text: 'v1.x',
            link: 'https://v1.vuepress.vuejs.org/zh/',
          },
          {
            text: 'v0.x',
            link: 'https://v0.vuepress.vuejs.org/zh/',
          },
        ],
      },
]