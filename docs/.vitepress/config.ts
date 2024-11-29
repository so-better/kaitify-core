import { defineConfig } from 'vitepress'
import path from 'path'
import fs from 'fs'

const getExtensionsList = () => {
  const items = fs.readdirSync(path.resolve(__dirname, '../../src/extensions'))
  const extensionNames: string[] = []
  for (const item of items) {
    const itemPath = path.join(path.resolve(__dirname, '../../src/extensions'), item)
    const stats = fs.statSync(itemPath)
    if (stats.isDirectory()) {
      extensionNames.push(item)
      //创建内置扩展的md文件
      const docPath = path.join(path.resolve(__dirname, '../../docs/extensions/built-in'), `${item}.md`)
      if (!fs.existsSync(docPath)) {
        fs.writeFileSync(docPath, '', { encoding: 'utf-8' })
      }
    }
  }
  return extensionNames
}

export default defineConfig({
  base: '/@kaitify/core/',
  title: 'kaitify',
  description: '一个基于原生JS的富文本编辑器核心库，提供了强大的API和内置扩展，来帮助你快速构建一个富文本编辑器',
  lastUpdated: true,
  head: [['link', { rel: 'icon', type: 'image/png', href: './logo.png' }]],
  themeConfig: {
    logo: {
      src: '/logo.png'
    },
    outline: {
      label: '本页目录',
      level: [2, 5]
    },
    nav: [
      { text: '指南', link: '/guide/introduction', activeMatch: '/guide' },
      { text: 'API', link: '/apis/editor-attrs', activeMatch: '/apis' },
      { text: '扩展', link: '/extensions/introduction', activeMatch: '/extensions' },
      { text: '更新日志', link: '/changelog' }
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
              text: 'Editor 编辑器',
              link: '/guide/editor'
            },
            {
              text: 'KNode 节点',
              link: '/guide/knode'
            },
            {
              text: 'Selection 光标选区',
              link: '/guide/selection'
            },
            {
              text: 'History 历史记录',
              link: '/guide/history'
            }
          ]
        },
        {
          text: '其他',
          items: [
            {
              text: '格式化规则',
              link: '/guide/format-rules'
            },
            {
              text: 'DOM转换规则',
              link: '/guide/dom-parse'
            },
            {
              text: '剪切板操作',
              link: '/guide/clipboard'
            },
            {
              text: '视图渲染',
              link: '/guide/render'
            }
          ]
        }
      ],
      '/apis': [
        {
          text: 'Editor 编辑器',
          items: [
            {
              text: '属性',
              link: '/apis/editor-attrs'
            },
            {
              text: '方法',
              link: '/apis/editor-function'
            }
          ]
        },
        {
          text: 'KNode 节点',
          items: [
            {
              text: '属性',
              link: '/apis/knode-attrs'
            },
            {
              text: '方法',
              link: '/apis/knode-function'
            }
          ]
        }
      ],
      '/extensions': [
        {
          text: '开始使用',
          items: [
            {
              text: '什么是扩展？',
              link: '/extensions/introduction'
            },
            {
              text: '如何自己创建一个扩展？',
              link: '/extensions/custom-extension'
            }
          ]
        },
        {
          text: '内置扩展',
          items: getExtensionsList().map(name => {
            return {
              text: name,
              link: `/extensions/built-in/${name}`
            }
          })
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
    },
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchLabel: '主题风格切换',
    sidebarMenuLabel: '菜单目录',
    returnToTopLabel: '返回顶部',
    externalLinkIcon: true
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
