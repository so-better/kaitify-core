import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/@kaitify/core/',
  title: 'kaitify 富文本编辑器',
  description: 'kaitify是一个基于原生JS的富文本编辑器核心库，提供了强大的API和内置拓展，来帮助你快速构建一个富文本编辑器',
  lastUpdated: true,
  themeConfig: {
    outline: {
      label: '本页目录',
      level: 'deep'
    },
    nav: [
      { text: '指南', link: '/guide/introduction', activeMatch: '/guide' },
      { text: 'API', link: '/apis' },
      { text: '拓展', link: '/extensions' }
    ],
    sidebar: {
      '/guide': [
        {
          text: '开始使用',
          items: [
            {
              text: '简介',
              link: '/guide/introduction'
            },
            {
              text: '安装',
              link: '/guide/install'
            },
            {
              text: '快速上手',
              link: '/guide/quick-start'
            }
          ]
        },
        {
          text: '数据结构',
          items: [
            {
              text: 'Editor',
              link: '/guide/editor'
            },
            {
              text: 'KNode',
              link: '/guide/knode'
            },
            {
              text: 'Selection',
              link: '/guide/selection'
            },
            {
              text: 'History',
              link: '/guide/history'
            }
          ]
        },
        {
          text: '规则与渲染',
          items: []
        }
      ]
    },
    socialLinks: [
      { icon: 'npm', link: 'https://www.npmjs.com/package/@kaitify/core' },
      { icon: 'gitee', link: 'https://gitee.com/so-better/kaitify-core' },
      { icon: 'github', link: 'https://github.com/so-better/kaitify-core' }
    ],
    search: { provider: 'local' },
    lastUpdated: {
      text: '上次更新'
    },
    docFooter: {
      prev: 'Prev',
      next: 'Next'
    }
  },
  markdown: {
    image: {
      lazyLoading: true
    },
    theme: {
      dark: 'github-dark',
      light: 'github-light'
    },
    codeCopyButtonTitle: '复制代码'
  },
  vite: {
    server: {
      port: 5400
    }
  }
})
