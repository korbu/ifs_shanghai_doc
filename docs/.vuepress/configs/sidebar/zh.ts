import type { SidebarConfig } from '@vuepress/theme-default'

export const zh: SidebarConfig = {
    '/zh/eb_corbos_starterkit/': [
      {
        text: 'EB corbos StarterKit使用手册',
        children: [
          '/zh/eb_corbos_starterkit/introduction.md',
          '/zh/eb_corbos_starterkit/installation.md',
          '/zh/eb_corbos_starterkit/demo_ara_com.md',
        ],
      },
    ],
}