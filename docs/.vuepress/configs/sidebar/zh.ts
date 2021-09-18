import type { SidebarConfig } from '@vuepress/theme-default'

export const zh: SidebarConfig = {
    '/zh/eb_corbos_starterkit/': [
      {
        text: 'EB corbos StarterKit 使用手册',
        children: [
          '/zh/eb_corbos_starterkit/introduction.md',
          '/zh/eb_corbos_starterkit/installation.md',
          '/zh/eb_corbos_starterkit/demo_ara_com.md',
        ],
      },
      {
        text: '新建工程',
        children: [
          '/zh/eb_corbos_starterkit/create_project.md',
        ],
      },
      {
        text: '参考',
        children: [
          '/zh/eb_corbos_starterkit/ara_cli.md',
          '/zh/eb_corbos_starterkit/using_gui.md',
          '/zh/eb_corbos_starterkit/trouble_shooting.md',
        ],
      },
    ],
}