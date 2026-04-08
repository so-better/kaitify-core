<div align="center">

# @kaitify/core

**基于原生 JavaScript 构建的富文本编辑器核心库**

[![npm version](https://img.shields.io/npm/v/@kaitify/core)](https://www.npmjs.com/package/@kaitify/core)
[![license](https://img.shields.io/npm/l/@kaitify/core)](https://github.com/so-better/kaitify-core/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/@kaitify/core)](https://www.npmjs.com/package/@kaitify/core)

[官方文档](https://www.so-better.cn/docs/kaitify-core/) · [GitHub](https://github.com/so-better/kaitify-core) · [更新日志](./docs/changelog.md)

</div>

---

## 简介

`kaitify`（发音：/ˈkeɪtɪfaɪ/）是一款**无 UI** 的富文本编辑器核心库。它不提供开箱即用的编辑器界面，而是提供构建编辑器所需的底层 API 和配置，让开发者在此之上灵活封装，满足高度定制化的需求。

- **框架无关**：不依赖 React、Vue 等任何前端框架，完全由原生 JavaScript 编写，可与任意技术栈整合
- **内置丰富扩展**：内置大量开箱即用的扩展（`Extension`），覆盖常见富文本功能，足以快速搭建功能完整的编辑器
- **高可扩展性**：提供完整的扩展机制，允许开发者自定义扩展实现任意功能
- **TypeScript 支持**：完整的类型定义，提供良好的开发体验

---

## 安装

### npm / yarn / pnpm

```bash
# npm
npm install @kaitify/core

# yarn
yarn add @kaitify/core

# pnpm
pnpm add @kaitify/core
```

### CDN

```html
<!-- UMD 版本（全局变量方式） -->
<script src="https://unpkg.com/@kaitify/core/lib/kaitify-core.umd.js"></script>

<!-- ES Module 版本 -->
<script type="module">
  import { Editor } from 'https://unpkg.com/@kaitify/core/lib/kaitify-core.es.js'
</script>
```

---

## 快速上手

### 构建一个编辑器

编辑器的创建和渲染是异步的，需要通过 `await` 等待实例返回。

```html
<div id="editor" style="width:500px;height:300px;"></div>
```

```ts
import { Editor } from '@kaitify/core'

const editor = await Editor.configure({
  el: '#editor',
  value: '<p>hello kaitify</p>',
  placeholder: '请输入正文...'
})
```

### 创建节点并更新编辑器

```ts
import { Editor, KNode } from '@kaitify/core'

const editor = await Editor.configure({
  el: '#editor',
  value: '<p>hello</p>'
})

const paragraph = KNode.create({
  type: 'block',
  tag: 'p',
  children: [{ type: 'text', textContent: '我是一个段落' }]
})

// 直接赋值 stackNodes 会替换编辑器全部内容
editor.stackNodes = [paragraph]
// 调用 updateView 才会更新视图
editor.updateView()
```

### 监听编辑器事件

```ts
const editor = await Editor.configure({
  el: '#editor',
  value: '',
  onChange(newVal, oldVal) {
    console.log('内容变化：', newVal)
  },
  onSelectionUpdate(selection) {
    console.log('光标变化：', selection)
  },
  onFocus(event) {
    console.log('编辑器聚焦')
  },
  onBlur(event) {
    console.log('编辑器失焦')
  }
})
```

---

## 核心概念

### Editor

`Editor` 是 kaitify 最核心的对象，通过静态方法 `Editor.configure` 创建编辑器实例。

**构建参数（部分常用）：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `el` | `HTMLElement \| string` | — | 编辑器挂载的 DOM 或选择器 |
| `value` | `string` | — | 初始 HTML 内容 |
| `editable` | `boolean` | `true` | 是否可编辑 |
| `autofocus` | `boolean` | `false` | 是否自动聚焦 |
| `placeholder` | `string` | — | 占位文字 |
| `dark` | `boolean` | `false` | 深色模式 |
| `allowCopy` | `boolean` | `true` | 是否允许复制 |
| `allowPaste` | `boolean` | `true` | 是否允许粘贴 |
| `allowCut` | `boolean` | `true` | 是否允许剪切 |
| `allowPasteHtml` | `boolean` | `false` | 粘贴时是否保留样式 |
| `priorityPasteFiles` | `boolean` | `false` | 剪贴板同时有文件和文本时是否优先粘贴文件 |
| `textRenderTag` | `string` | `"span"` | 文本节点渲染标签 |
| `blockRenderTag` | `string` | `"p"` | 默认块级节点渲染标签 |
| `emptyRenderTags` | `string[]` | — | 需要置空的标签 |
| `extraKeepTags` | `string[]` | — | 额外保留的标签 |
| `extensions` | `Extension[]` | — | 扩展数组 |
| `formatRules` | `RuleFunctionType[]` | — | 自定义格式化规则 |

**事件回调（部分常用）：**

| 参数 | 说明 |
|------|------|
| `onChange` | 内容改变时触发，参数为新值和旧值 |
| `onSelectionUpdate` | 光标变化时触发 |
| `onFocus` | 编辑器聚焦时触发 |
| `onBlur` | 编辑器失焦时触发 |
| `onKeydown` | 键盘按下时触发 |
| `onKeyup` | 键盘松开时触发 |
| `onInsertParagraph` | 换行时触发，参数为换行后光标所在块节点 |
| `onDeleteComplete` | 删除完成时触发 |
| `onPasteText` | 粘贴纯文本时触发，返回 `false` 可阻止默认行为 |
| `onPasteHtml` | 粘贴 HTML 时触发，返回 `false` 可阻止默认行为 |
| `onPasteImage` | 粘贴图片时触发，返回 `false` 可阻止默认行为 |
| `onPasteVideo` | 粘贴视频时触发，返回 `false` 可阻止默认行为 |
| `onPasteFile` | 粘贴其他文件时触发 |
| `onPasteKeepMarks` | 粘贴 HTML 时自定义保留节点标记 |
| `onPasteKeepStyles` | 粘贴 HTML 时自定义保留节点样式 |
| `onCreate` | 编辑器创建时触发 |
| `onCreated` | 编辑器创建完成后触发 |
| `onBeforeUpdateView` | 视图更新前触发 |
| `onAfterUpdateView` | 视图更新后触发 |
| `onUpdateView` | 视图渲染时触发，返回 `false` 可自定义渲染逻辑 |
| `onDomParseNode` | DOM 转节点时的后置处理 |
| `onRedressSelection` | 光标纠正时触发 |
| `onDetachMentBlockFromParent` | 块节点从父节点抽离时触发，返回 `false` 可自定义处理 |
| `onBeforePatchNodeToFormat` | 节点被格式化前触发 |

**常用实例方法：**

```ts
// 获取编辑器 HTML 内容
editor.getHTML()

// 获取编辑器纯文本内容
editor.getContent()

// 判断编辑器内容是否为空
editor.isEmpty()

// 向选区插入文本
editor.insertText('hello')

// 向选区插入节点
editor.insertNode(node)

// 向选区进行换行
editor.insertParagraph()

// 对选区进行删除
editor.delete()

// 更新编辑器视图
await editor.updateView()

// 重新渲染编辑器视图
await editor.review('<p>new content</p>')

// 设置是否可编辑
editor.setEditable(false)

// 设置深色模式
editor.setDark(true)

// 销毁编辑器
editor.destroy()
```

### KNode

`KNode` 是编辑器内容的基础数据类型，编辑器内所有 HTML 内容都被表示为节点树，挂载在 `editor.stackNodes` 下。

**节点类型：**

| 类型 | 说明 |
|------|------|
| `block` | 块节点，`stackNodes` 中的顶层节点均为块节点 |
| `inline` | 行内节点，必须包含子节点，子节点可以是 `text`、`closed`、`inline` |
| `closed` | 闭合节点，无子节点，对应的真实 DOM 内部视为黑盒，如图片、视频等 |
| `text` | 文本节点，存储文本内容，无 `tag`，无子节点 |

**创建节点：**

```ts
// 创建普通节点
const node = KNode.create({
  type: 'block',
  tag: 'p',
  children: [{ type: 'text', textContent: '这是一段文字' }]
})

// 创建零宽度空白文本节点
const zeroNode = KNode.createZeroWidthText()

// 创建占位符节点（<br />）
const placeholder = KNode.createPlaceholder()
```

**常用实例方法：**

```ts
node.isBlock()       // 是否块节点
node.isInline()      // 是否行内节点
node.isClosed()      // 是否闭合节点
node.isText()        // 是否文本节点
node.isEmpty()       // 是否空节点
node.isPlaceholder() // 是否占位符节点
node.isZeroWidthText() // 是否零宽度空白文本节点
node.hasMarks()      // 是否含有标记
node.hasStyles()     // 是否含有样式
node.getBlock()      // 获取所在块级节点
node.getRootBlock()  // 获取所在根级块节点
node.getInline()     // 获取所在行内节点
node.clone()         // 复制节点
```

---

## 内置扩展

kaitify 内置了覆盖常见场景的扩展，无需额外配置即可使用，通过 `editor.commands` 调用扩展提供的命令。

**文本格式：**

```ts
editor.commands.setBold()           // 设置加粗
editor.commands.unsetBold()         // 取消加粗
editor.commands.isBold()            // 是否加粗

editor.commands.setItalic()         // 设置斜体
editor.commands.setUnderline()      // 设置下划线
editor.commands.setStrikethrough()  // 设置删除线
editor.commands.setSuperscript()    // 设置上标
editor.commands.setSubscript()      // 设置下标
editor.commands.setCode()           // 设置行内代码
editor.commands.unsetCode()         // 取消行内代码
```

**字体与颜色：**

```ts
editor.commands.setFontSize('18px')   // 设置字号
editor.commands.setFontFamily('Arial') // 设置字体
editor.commands.setColor('#ff0000')   // 设置文字颜色
editor.commands.setBackColor('#ffff00') // 设置背景颜色
```

**段落与对齐：**

```ts
// level: 0 表示普通段落，1~6 对应 h1~h6
editor.commands.setHeading(1)        // 设置一级标题
editor.commands.unsetHeading(1)      // 取消一级标题
editor.commands.setAlign('center')   // 设置对齐：left / center / right / justify
editor.commands.setLineHeight(1.8)   // 设置行高
editor.commands.setIncreaseIndent()  // 增加缩进
editor.commands.setDecreaseIndent()  // 减少缩进
```

**列表与引用：**

```ts
editor.commands.setList({ ordered: true })   // 设置有序列表
editor.commands.setList({ ordered: false })  // 设置无序列表
editor.commands.unsetList({ ordered: true }) // 取消有序列表
editor.commands.setBlockquote()      // 设置引用块
editor.commands.unsetBlockquote()    // 取消引用块
editor.commands.setTask()            // 设置待办列表
editor.commands.unsetTask()          // 取消待办列表
```

**媒体与嵌入：**

```ts
// 插入图片
editor.commands.setImage({ src: 'https://example.com/image.jpg', alt: '图片描述', width: '100%' })

// 插入视频
editor.commands.setVideo({ src: 'https://example.com/video.mp4', autoplay: false })

// 插入超链接（光标折叠时需提供 text；有选区时以选区内容作为链接文字）
editor.commands.setLink({ href: 'https://example.com', text: '链接文字', newOpen: true })

// 插入水平分割线
editor.commands.setHorizontal()

// 插入数学公式（KaTeX 语法）
editor.commands.setMath('x^2 + y^2 = z^2')

// 插入代码块
editor.commands.setCodeBlock()

// 插入表格（3 行 4 列）
editor.commands.setTable({ rows: 3, columns: 4 })
```

**历史记录：**

```ts
editor.commands.undo()   // 撤销
editor.commands.redo()   // 重做
editor.commands.canUndo() // 是否可撤销
editor.commands.canRedo() // 是否可重做
```

**使用需要配置参数的扩展：**

部分扩展支持通过入参进行配置，需将扩展函数调用结果传入 `extensions`：

```ts
import { Editor, AttachmentExtension, CodeBlockExtension } from '@kaitify/core'

const editor = await Editor.configure({
  el: '#editor',
  value: '',
  extensions: [
    AttachmentExtension({ icon: 'path/to/icon.png' }),
    CodeBlockExtension({
      handleCopy: (code) => {
        // 自定义点击复制的逻辑
      }
    })
  ]
})
```

---

## 自定义扩展

通过 `Extension.create` 创建自定义扩展，将格式化规则、事件回调和命令集中管理：

```ts
import { Editor, Extension } from '@kaitify/core'

const myExtension = Extension.create({
  name: 'myExtension',
  // 自定义格式化规则
  formatRules: [
    ({ editor, node }) => {
      if (node.isBlock() && node.tag === editor.blockRenderTag) {
        node.styles = { ...node.styles, color: 'red' }
      }
    }
  ],
  // 自定义命令
  addCommands() {
    return {
      insertCustomText: async (text: string) => {
        this.insertText(text)
        await this.updateView()
      }
    }
  }
})

const editor = await Editor.configure({
  el: '#editor',
  value: '',
  extensions: [myExtension]
})

editor.commands.insertCustomText('Hello!')
```

---

## 自定义样式

编辑器样式通过 CSS 变量管理，覆盖 `.kaitify` 下的变量即可修改主题：

```css
.kaitify {
  --kaitify-theme: #308af3;
  --kaitify-font-color: #505050;
  --kaitify-border-color: #dedede;
  --kaitify-background-color: #fff;
  --kaitify-line-height: 1.5;
  --kaitify-font-size: 14px;
  --kaitify-border-radius: 3px;
  --kaitify-font-family: PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 深色模式 */
.kaitify.kaitify-dark {
  --kaitify-font-color: #f5f5f5;
  --kaitify-border-color: #3b3b3b;
  --kaitify-background-color: #1b1b1f;
}
```

---

## 与前端框架集成

kaitify 不依赖任何框架，以 Vue3 为例：

```html
<template>
  <div ref="editorEl" style="width:100%;height:300px;" />
</template>
```

```ts
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Editor } from '@kaitify/core'

const editorEl = ref<HTMLElement>()
let editor: Editor | undefined

onMounted(async () => {
  editor = await Editor.configure({
    el: editorEl.value!,
    value: '',
    placeholder: '请输入内容...'
  })
})

onBeforeUnmount(() => {
  editor?.destroy()
})
```

---

## 更多内容

完整的 API 文档、扩展详情、进阶用法等内容，请访问[官方文档](https://www.so-better.cn/docs/kaitify-core/)。

---

## 更新日志

查看[更新日志](./docs/changelog.md)

---

## License

[MIT](./LICENSE) © [so-better](https://github.com/so-better)
