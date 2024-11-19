import { defineConfig } from 'vitepress'

export default defineConfig({
  base: './',
  title: 'Kaitify 富文本编辑器',
  description: 'Kaitify是一个基于原生JS的富文本编辑器核心库，提供了强大的API和内置拓展，来帮助你快速构建一个富文本编辑器',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '文档', link: '/' },
      { text: 'API', link: '/apis' },
      { text: '拓展', link: '/extensions' }
    ],
    sidebar: {
      '/': [
        {
          text: '开始使用'
        },
        {
          text: '快速上手'
        }
      ]
    },
    socialLinks: [
      { icon: 'npm', link: 'https://www.npmjs.com/package/@kaitify/core' },
      { icon: 'gitee', link: 'https://gitee.com/so-better/kaitify-core' },
      { icon: 'github', link: 'https://github.com/so-better/kaitify-core' }
    ],
    search: { provider: 'local' }
  }
})
