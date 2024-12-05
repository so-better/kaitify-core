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

  提供一个入参，类型为 `KNodeCreateOptionType`，具体参数可参阅 [节点构建参数 KNodeCreateOptionType](/guide/knode#节点构建参数-knodecreateoptiontype)，该方法会返回一个 `Knode` 节点实例

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

  提供一个入参，类型为 `ZeroWidthTextKNodeCreateOptionType`，具体参数可参阅 [零宽度无断空白文本节点](/guide/knode#零宽度无断空白文本节点)，该方法会返回一个零宽度无断空白文本节点

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

  判断当前节点是否为空节点，返回一个 `boolean` 值，关于空节点可参阅 [什么是空节点？](/guide/knode#空节点)

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

  判断当前节点是否零宽度无断空白文本节点，返回一个 `boolean` 值，关于零宽度无断空白文本节点可参阅 [什么是零宽度无断空白文本节点？](/guide/knode#零宽度无断空白文本节点)

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

  判断当前节点是否占位符节点，返回一个 `boolean` 值，关于占位符节点可参阅 [什么是占位符节点？](/guide/knode#占位符节点)

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

- 详细信息

  判断当前节点是否不可编辑的，如果是则返回设置了不可编辑的那个节点，否则返回 `null`

- 示例

  ```ts
  //当前节点不可编辑，不一定是这个节点设置了不可编辑，也有可能是父节点或者祖先节点设置了不可编辑的效果
  const uneditableNode = node.getUneditable()
  ```

##### allIsPlaceholder()

当前节点是否只包含占位符

- 类型

  ```ts
  allIsPlaceholder(): boolean
  ```

- 详细信息

  判断当前节点的子节点是否都是占位符，返回 `boolean` 值

- 示例

  ```ts
  const flag = node.allIsPlaceholder()
  ```

##### toEmpty()

设置为空节点

- 类型

  ```ts
    toEmpty(): void
  ```

- 详细信息

  当前节点如果是文本节点，会将 textContent 置为空；当前节点如果是闭合节点，会转为文本节点然后将 textContent 置为空；其他节点会将子节点全部置为空节点

- 示例

  ```ts
  node.toEmpty()
  ```

##### isEqualStyles()

比较当前节点和另一个节点的 `styles` 是否一致

- 类型

  ```ts
  isEqualStyles(node: KNode): boolean
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示目标节点，该方法会判断当前节点和目标节点的样式集合是否一致，返回 `boolean` 值

- 示例

  ```ts
  const node = KNode.create({
    type: 'text',
    styles: {
      fontWeight: 'bold'
    },
    textContent: 'hello，我是node'
  })
  const targetNode = KNode.create({
    type: 'text',
    styles: {
      color: '#f30'
    },
    textContent: 'hello，我是targetNode'
  })
  const isEqualStyles = node.isEqualStyles(targetNode) //false
  ```

##### isEqualMarks()

比较当前节点和另一个节点的 `marks` 是否一致

- 类型

  ```ts
  isEqualMarks(node: KNode): boolean
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示目标节点，该方法会判断当前节点和目标节点的标记集合是否一致，返回 `boolean` 值

- 示例

  ```ts
  const node = KNode.create({
    type: 'text',
    marks: {
      'data-index': '1'
    },
    textContent: 'hello，我是node'
  })
  const targetNode = KNode.create({
    type: 'text',
    marks: {
      'data-index': '2'
    },
    textContent: 'hello，我是targetNode'
  })
  const isEqualMarks = node.isEqualMarks(targetNode) //false
  ```

##### isInCodeBlockStyle()

判断当前节点（包括自身）是否在拥有代码块样式的块级节点内

- 类型

  ```ts
  isInCodeBlockStyle(): KNode | null
  ```

- 详细信息

  代码块样式的节点：节点 `tag` 为 `pre` 或者节点的 `styles` 里包含 `whiteSpace` 属性且值为 `pre` 或者 `pre-wrap`

  当前节点自身如果符合代码块样式，则返回自身，否则向上进行判断，直到找到其父节点/祖先节点中是代码块的节点，没有则返回 `null`

- 示例

  ```ts
  const flag = node.isInCodeBlockStyle()
  ```

##### isEqual()

判断当前节点与另一个节点是否完全相同

- 类型

  ```ts
  isEqual(node: KNode): boolean
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示目标节点，该方法用以判断当前节点与目标节点是否完全相同，返回 `boolean` 值

- 示例

  ```ts
  const same = node.isEqual(targetNode)
  ```

##### isContains()

判断当前节点是否包含指定节点

- 类型

  ```ts
  isContains(node: KNode): boolean
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示目标节点，该方法用以判断当前节点是否包含目标节点，返回 `boolean` 值

  所谓“包含”的意思：即目标节点在当前节点的子孙节点中

- 示例

  ```ts
  const isContains = node.isContains(targetNode)
  ```

##### clone()

克隆节点

- 类型

  ```ts
  clone: (deep?: boolean) => KNode
  ```

- 详细信息

  提供一个入参，类型为 `boolean`，表示是否深度克隆，即在克隆子节点的时候是否克隆其所有后代节点，如果为 `false` 仅会克隆节点自身，默认值为 `true`，需要注意的是克隆的节点与原来的节点不是同一个节点，二者的 `key` 也不一样

- 示例

  ```ts
  const cloneNode = node.clone(false) //仅克隆自身
  ```

##### firstTextClosedInNode()

如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有可聚焦节点中的第一个

- 类型

  ```ts
  firstTextClosedInNode: (node: KNode) => boolean
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示目标节点，返回 `boolean` 值

  该方法仅在当前节点为文本节点或者闭合节点时有效，用以判断当前节点是不是目标节点后代中所有的可聚焦节点中的第一个

- 示例

  ```ts
  const isFirst = node.firstTextClosedInNode(targetNode)
  ```

##### lastTextClosedInNode()

如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有可聚焦节点中的最后一个

- 类型

  ```ts
  lastTextClosedInNode: (node: KNode) => boolean
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示目标节点，返回 `boolean` 值

  该方法仅在当前节点为文本节点或者闭合节点时有效，用以判断当前节点是不是目标节点后代中所有的可聚焦节点中的最后一个

- 示例

  ```ts
  const isFirst = node.lastTextClosedInNode(targetNode)
  ```

##### getPrevious()

获取当前节点在某个节点数组中的前一个非空节点

- 类型

  ```ts
  getPrevious(nodes: KNode[]): KNode | null
  ```

- 详细信息

  提供一个入参，类型为 `KNode[]`，表示指定的节点数组，该方法用以判断当前节点在指定节点数组中的前一个非空兄弟节点，如果该节点是数组中第一个节点，则返回 `null`

  入参一般是当前节点的父节点的子节点数组或者 `editor.stackNodes`

- 示例

  ```ts
  //获取编辑器内该节点的前一个兄弟节点
  const previousNode = node.getPrevious(node.parent ? node.parent.children : editor.stackNodes)
  ```

##### getNext()

获取当前节点在某个节点数组中的后一个非空节点

- 类型

  ```ts
  getNext(nodes: KNode[]): KNode | null
  ```

- 详细信息

  提供一个入参，类型为 `KNode[]`，表示指定的节点数组，该方法用以判断当前节点在指定节点数组中的后一个非空兄弟节点，如果该节点是数组中最后一个节点，则返回 `null`

  入参一般是当前节点的父节点的子节点数组或者 `editor.stackNodes`

- 示例

  ```ts
  //获取编辑器内该节点的后一个兄弟节点
  const nextNode = node.getNext(node.parent ? node.parent.children : editor.stackNodes)
  ```

##### isMatch()

判断当前节点是否符合指定的条件

- 类型

  ```ts
  isMatch(options: KNodeMatchOptionType): boolean
  ```

- 详细信息

  提供一个入参，类型为 `KNodeMatchOptionType`，表示节点的匹配条件，包含 `tag`、`marks`、`styles` 三个属性，同 `KNode` 的同名属性，该方法判断当前节点是否符合匹配条件，返回 `boolean` 值

  > 不同于 KNode 同名属性的是，marks 和 styles 内的属性值可以是 true，此时表示仅判断是否拥有该标记或者该样式

- 示例

  ```ts
  //判断节点是否p标签且拥有fontSize="20px"的样式
  const match = node.isMatch({
    tag: 'p',
    styles: {
      fontSize: '20px'
    }
  })
  //判断节点是否拥有p标签且拥有fontSize样式
  const match = node.isMatch({
    tag: 'p',
    styles: {
      fontSize: true
    }
  })
  ```

##### getMatchNode()

判断当前节点是否存在于符合条件的节点内（包含自身）

- 类型

  ```ts
  getMatchNode(options: KNodeMatchOptionType): KNode | null
  ```

- 详细信息

  提供一个入参，类型为 `KNodeMatchOptionType`，表示节点的匹配条件，包含 `tag`、`marks`、`styles` 三个属性，同 `KNode` 的同名属性，该方法判断当前节点是否是符合匹配条件的节点的后代节点，如果是则返回匹配的节点，如果节点自身符合匹配条件，则返回自身，否则返回 `null`

  > 不同于 KNode 同名属性的是，marks 和 styles 内的属性值可以是 true，此时表示仅判断是否拥有该标记或者该样式

- 示例

  ```ts
  //判断当前节点是否在p节点下，如果是返回这个p节点
  const matchNode = node.getMatchNode({
    tag: 'p'
  })
  ```

##### getFocusNodes()

获取当前节点下的所有可聚焦的节点

- 类型

  ```ts
  getFocusNodes: (type?: "all" | "closed" | "text") => KNode[]
  ```

- 详细信息

  提供一个入参，类型为 `"all" | "closed" | "text"`，表示获取的可聚焦节点的类型，如果是 `closed` 则表示仅获取当前节点下的所有的闭合节点，如果是 `text` 则表示仅获取当前节点下的所有的文本节点，如果是 `all` 则表示获取当前节点下的所有的文本节点和闭合节点，默认值为 `all`

- 示例

  ```ts
  const nodes = node.getFocusNodes('text') // 获取该节点下所有的文本节点
  ```
