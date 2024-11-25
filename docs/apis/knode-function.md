---
title: KNode 方法
---

# KNode 方法

## 类方法

类方法直接通过 `KNode` 来调用

##### searchByKey()

在指定的节点数组中根据 `key` 查找节点

- 类型
  ```ts
  searchByKey(key: string | number, nodes: KNode[]): KNode | null
  ```
- 详细信息

  第一个入参表示 `key` 值，第二入参表示搜索范围，是一个节点数组，如果查找到节点则返回该节点，否则返回 `null`

- 示例

  ```ts
  //在编辑器的节点数组里查找 key=10 的节点
  const node = KNode.searchByKey(10, editor.stackNodes)
  ```

##### flat()

将某个节点数组扁平化处理后返回

- 类型

  ```ts
  flat(nodes: KNode[]): KNode[]
  ```

- 详细信息

  提供一个入参，类型为 `KNode[]`，表示需要扁平化处理的节点数组，该方法会返回处理后的节点数组

- 示例

  ```ts
  const nodes = KNode.flat(editor.stackNodes)
  ```

##### isKNode()

判断是否 `KNode`

- 类型

  ```ts
  isKNode(val: any): boolean
  ```

- 详细信息

  提供一个入参，任意类型，该方法会判断该入参是否 `KNode` 节点类型的数据，返回一个 `boolean` 值

- 示例

  ```ts
  const isNode = KNode.isKNode(3) // false
  ```

##### create()

创建节点

- 类型

  ```ts
  create(options: KNodeCreateOptionType): KNode
  ```

- 详细信息

  提供一个入参，类型为 `KNodeCreateOptionType`，具体参数可参阅 [节点构建参数 KNodeCreateOptionType](/guide/knode.html#节点构建参数-knodecreateoptiontype)，该方法会返回一个 `Knode` 节点实例

- 示例

  ```ts
  const node = KNode.create({
    type: 'block',
    tag: 'p',
    children: [
      {
        type: 'text',
        textContent: 'hello'
      }
    ]
  })
  ```

##### createPlaceholder()

创建占位符

- 类型

  ```ts
  createPlaceholder(): KNode
  ```

- 详细信息

  该方法用于快捷地创建占位符节点，无需任何入参

- 示例

  ```ts
  const node = KNode.createPlaceholder()
  ```

##### createZeroWidthText()

创建零宽度无断空白文本节点

- 类型

  ```ts
  createZeroWidthText(options?: ZeroWidthTextKNodeCreateOptionType): KNode
  ```

- 详细信息

  提供一个入参，类型为 `ZeroWidthTextKNodeCreateOptionType`，具体参数可参阅 [零宽度无断空白文本节点](/guide/knode.html#零宽度无断空白文本节点)，该方法会返回一个零宽度无断空白文本节点

- 示例

  ```ts
  const node = KNode.createZeroWidthText({
    styles: {
      fontSize: '20px'
    }
  })
  ```

## 实例方法

实例方法通过创建的编辑器实例来调用，下述示例中都以 `node` 来表示 `KNode` 实例

##### isBlock()

是否块节点

- 类型

  ```ts
  isBlock(): boolean
  ```

- 详细信息

  判断当前节点是否块节点，返回一个 `boolean` 值

- 示例

  ```ts
  const isBlock = node.isBlock()
  ```

##### isInline()

是否行内节点

- 类型

  ```ts
  isInline(): boolean
  ```

- 详细信息

  判断当前节点是否行内节点，返回一个 `boolean` 值

- 示例

  ```ts
  const isInline = node.isInline()
  ```

##### isClosed()

是否闭合节点

- 类型

  ```ts
  isClosed(): boolean
  ```

- 详细信息

  判断当前节点是否闭合节点，返回一个 `boolean` 值

- 示例

  ```ts
  const isClosed = node.isClosed()
  ```

##### isText()

是否闭合节点

- 类型

  ```ts
  isText(): boolean
  ```

- 详细信息

  判断当前节点是否文本节点，返回一个 `boolean` 值

- 示例

  ```ts
  const isText = node.isText()
  ```

##### getRootBlock()

获取所在的根级块节点

- 类型

  ```ts
  getRootBlock(): KNode
  ```

- 详细信息

  获取当前节点所在的根级块节点，如果当前节点自身就是根级块节点，则返回自身

  所谓的“根级块节点”，指编辑器最顶层不再有父节点的块节点

- 示例

  ```ts
  const rootBlockNode = node.getRootBlock()
  ```

##### getBlock()

获取所在块级节点

- 类型

  ```ts
  getBlock(): KNode
  ```

- 详细信息

  获取当前节点所在的块节点，如果当前节点自身就是块节点，则返回自身

  对于多个块节点嵌套的情况，只返回最靠近当前节点的块节点

- 示例

  ```ts
  const blockNode = node.getBlock()
  ```

##### getInline()

获取所在行内节点

- 类型

  ```ts
  getInline(): KNode | null
  ```

- 详细信息

  获取当前节点所在的行内节点，如果当前节点自身就是行内节点，则返回自身，如果当前节点不在行内节点内则返回 `null`

  对于多个行内节点嵌套的情况，只返回最靠近当前节点的行内节点

- 示例

  ```ts
  const inlineNode = node.getInline()
  ```

##### hasChildren()

判断是否有子节点

- 类型

  ```ts
  hasChildren(): boolean
  ```

- 详细信息

  判断当前节点是否有子节点，返回一个 `boolean` 值

- 示例

  ```ts
  const hasChildren = node.hasChildren()
  ```

##### isEmpty()

判断是否为空节点

- 类型

  ```ts
  isEmpty(): boolean
  ```

- 详细信息

  判断当前节点是否为空节点，返回一个 `boolean` 值，关于空节点可参阅 [什么是空节点？](/guide/knode.html#空节点)

- 示例

  ```ts
  const isEmpty = node.isEmpty()
  ```

##### isZeroWidthText()

是否零宽度无断空白文本节点

- 类型

  ```ts
  isZeroWidthText(): boolean
  ```

- 详细信息

  判断当前节点是否零宽度无断空白文本节点，返回一个 `boolean` 值，关于零宽度无断空白文本节点可参阅 [什么是零宽度无断空白文本节点？](/guide/knode.html#零宽度无断空白文本节点)

- 示例

  ```ts
  const isZero = node.isZeroWidthText()
  ```

##### isPlaceholder()

是否占位符

- 类型

  ```ts
  isPlaceholder(): boolean
  ```

- 详细信息

  判断当前节点是否占位符节点，返回一个 `boolean` 值，关于占位符节点可参阅 [什么是占位符节点？](/guide/knode.html#占位符节点)

- 示例

  ```ts
  const isPlaceholder = node.isPlaceholder()
  ```

##### hasMarks()

是否含有标记

- 类型

  ```ts
  hasMarks(): boolean
  ```

- 详细信息

  判断当前节点是否拥有标记，返回一个 `boolean` 值

- 示例

  ```ts
  const hasMarks = node.hasMarks()
  ```

##### hasStyles()

是否含有样式

- 类型

  ```ts
  hasStyles(): boolean
  ```

- 详细信息

  判断当前节点是否拥有样式，返回一个 `boolean` 值

- 示例

  ```ts
  const hasStyles = node.hasStyles()
  ```

##### getUneditable()

判断节点是否不可编辑的

- 类型

  ```ts
  getUneditable(): KNode | null
  ```
