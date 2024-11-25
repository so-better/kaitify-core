---
title: Editor 方法
---

# Editor 方法

## 类方法

类方法直接通过 `Editor` 来调用

##### configure()

创建一个编辑器，返回编辑器实例

- 类型
  ```ts
  Editor.configure(options: EditorConfigureOptionType): Promise<Editor>
  ```
- 详细信息

  提供一个入参，TS 类型为 `EditorConfigureOptionType`，用以对创建的编辑器进行配置，具体可参考 [编辑器构建参数](/guide/editor.html#编辑器构建参数)

- 示例

  ```ts
  const editor = await Editor.configure({
    el: '#editor',
    value: '<p>hello</p>'
  })
  ```

## 实例方法

实例方法通过创建的编辑器实例来调用，下述示例中都以 `editor` 来表示编辑器实例

##### scrollViewToSelection()

滚动编辑器到光标可视范围

- 类型

  ```ts
  scrollViewToSelection(): void
  ```

- 详细信息

  该方法仅在编辑器内存在滚动条时生效，会将编辑器的滚动条设置到光标可视范围内

- 示例

  ```ts
  editor.scrollViewToSelection()
  ```

##### findNode()

根据 `dom` 查找到编辑内的对应节点

- 类型

  ```ts
  findNode(dom: HTMLElement): KNode
  ```

- 详细信息

  提供一个入参，类型是 `HTMLElement`，返回编辑器内的对应的节点，如果根据入参查找不到对应的节点，则会抛出异常

- 示例

  ```ts
  //在编辑器内查找id为el的元素对应的节点
  const node = editor.findNode(document.getElementById('el'))
  ```

##### findDom()

根据编辑器内的节点查找真实 `dom`

- 类型

  ```ts
  findDom(node: KNode): HTMLElement
  ```

- 详细信息
  提供一个入参，类型是 `KNode`，返回该节点对应的真实 `dom`，如果根据入参查找不到对应的 `dom`，则会抛出异常

- 示例

  ```ts
  const dom = editor.findDom(node)
  ```

##### setEditable()

设置编辑器是否可编辑

- 类型

  ```ts
  setEditable(editable: boolean): void
  ```

- 详细信息
  提供一个入参，类型是 `boolean`，如果为 `true` 值则编辑器设为可编辑状态，如果为 `false` 值则编辑器设为不可编辑状态

- 示例

  ```ts
  //通过该方法可以达到禁用编辑器的效果
  editor.setEditable(false)
  ```

##### isEditable()

判断编辑器是否可以编辑

- 类型

  ```ts
  isEditable(): boolean
  ```

- 详细信息

  返回一个 `boolean` 值，如果为 `true` 值则编辑器是可编辑状态，如果为 `false` 值则编辑器是不可编辑状态

- 示例

  ```ts
  const isEditable = editor.isEditable()
  ```

##### setDark()

设置编辑器是否深色风格

- 类型

  ```ts
  setDark(dark: boolean): void
  ```

- 详细信息

  提供一个入参，类型是 `boolean`，如果为 `true` 值则编辑器设为深色风格，如果为 `false` 值则编辑器设为浅色风格

- 示例

  ```ts
  //设置深色风格
  editor.setDark(true)
  ```

##### isDark()

判断编辑器是否深色风格

- 类型

  ```ts
  isDark(): boolean
  ```

- 详细信息

  返回一个 `boolean` 值，如果为 `true` 值则编辑器是深色风格，如果为 `false` 值则编辑器是浅色风格

- 示例

  ```ts
  const isDark = editor.isDark()
  ```

##### domParseNode()

将 `dom` 转为 `KNode` 节点

- 类型

  ```ts
  domParseNode(dom: Node): KNode
  ```

- 详细信息

  提供一个入参，类型为 `Node`，表示浏览器的 `dom` 元素，经过方法内部处理，返回一个 `KNode` 节点

- 示例

  ```ts
  const div = document.createElement('div')
  div.innerText = '我是一个div'
  //输出一个KNode
  const node = editor.domParseNode(div)
  ```

##### htmlParseNode()

将 `html`内容 转为 `KNode` 节点数组

- 类型

  ```ts
  htmlParseNode(html: string): KNode[]
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示一段 `html` 内容，经过方法内部处理，返回一个 `KNode` 节点数组

- 示例

  ```ts
  const html = '<p>段落1</p><p>段落2</p>'
  //输出一个KNode数组
  const nodes = editor.htmlParseNode(html)
  ```

##### toParagraph()

将指定节点所在的块节点转为段落

- 类型

  ```ts
  toParagraph(node: KNode): void
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示指定的节点，该方法会将该节点所在的块节点（如果自身是块节点则处理自身），转为段落。

  > 所谓的“段落”指的是节点 tag 值为 `editor.blockRenderTag`，没有任何 marks 和 styles，且 fixed、nested、locked 都是 `false` 的块节点

- 示例

  ```ts
  editor.toParagraph(node)
  ```

##### isParagraph()

指定的块节点是否是一个段落

- 类型

  ```ts
  isParagraph(node: KNode): boolean
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示指定的节点，用以判断该节点是否为段落节点

- 示例

  ```ts
  const isParagraph = editor.isParagraph(node)
  ```

##### addNode()

将指定节点添加到某个节点的子节点数组里

- 类型

  ```ts
  addNode(node: KNode, parentNode: KNode, index?: number): void
  ```

- 详细信息

  第一个入参表示指定的节点，第二个入参表示目标节点，指定节点会被添加到目标节点的子节点数组里，第三个入参表示添加到子节点数组内的序列，默认值为 0

  > 该方法一般用来将新创建的节点加入到编辑器内，如果指定的节点已经是编辑器内的了，需要注意要将它从原先的位置移除

##### addNodeBefore()

将指定节点添加到某个节点前面

- 类型

  ```ts
  addNodeBefore(node: KNode, target: KNode): void
  ```

- 详细信息

  第一个入参表示指定的节点，第二个入参表示目标节点，指定节点会被添加到目标节点的前面

  > 该方法一般用来将新创建的节点加入到编辑器内，如果指定的节点已经是编辑器内的了，需要注意要将它从原先的位置移除

- 示例

  ```ts
  //假设node是编辑器内已知的一个节点，这里将新创建的节点添加到它前面
  const newNode = KNode.create({
    type: 'text',
    textContent: '新节点'
  })
  editor.addNodeBefore(newNode, node)
  ```

##### addNodeAfter()

将指定节点添加到某个节点后面

- 类型

  ```ts
  addNodeAfter(node: KNode, target: KNode): void
  ```

- 详细信息

  第一个入参表示指定的节点，第二个入参表示目标节点，指定节点会被添加到目标节点的后面

  > 该方法一般用来将新创建的节点加入到编辑器内，如果指定的节点已经是编辑器内的了，需要注意要将它从原先的位置移除

- 示例

  ```ts
  //假设node是编辑器内已知的一个节点，这里将新创建的节点添加到它前面
  const newNode = KNode.create({
    type: 'text',
    textContent: '新节点'
  })
  editor.addNodeAfter(newNode, node)
  ```

##### getLastSelectionNodeInChildren()

获取某个节点（包括自身）内的最后一个可以设置光标点的节点

- 类型

  ```ts
  getLastSelectionNodeInChildren(node: KNode): KNode | null
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示指定的节点，该方法会在该节点终查找最后一个可以设置为光标的节点，如果该节点本身就是文本节点或者闭合节点，则直接返回自身，如果该节点是空节点或者不可见节点，则返回 `null`

- 示例

  ```ts
  const node = editor.getLastSelectionNodeInChildren(targetNode)
  ```

##### getFirstSelectionNodeInChildren()

获取某个节点（包括自身）内的第一个可以设置光标点的节点

- 类型

  ```ts
  getFirstSelectionNodeInChildren(node: KNode): KNode | null
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示指定的节点，该方法会在该节点终查找第一个可以设置为光标的节点，如果该节点本身就是文本节点或者闭合节点，则直接返回自身，如果该节点是空节点或者不可见节点，则返回 `null`

- 示例

  ```ts
  const node = editor.getLastSelectionNodeInChildren(targetNode)
  ```

##### getPreviousSelectionNode()

查找指定节点（不包括自身）之前可以设置为光标点的非空节点

- 类型

  ```ts
  getPreviousSelectionNode(node: KNode): KNode | null
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示指定的节点，该方法会以在该节点为起点，向前查找可以设置为光标的节点，如果没有查找到则返回 `null`

- 示例

  ```ts
  const node = editor.getPreviousSelectionNode(targetNode)
  ```

##### getNextSelectionNode()

查找指定节点（不包括自身）之后可以设置为光标点的非空节点

- 类型

  ```ts
  getNextSelectionNode(node: KNode): KNode | null
  ```

- 详细信息

  提供一个入参，类型为 `KNode`，表示指定的节点，该方法会以在该节点为起点，向后查找可以设置为光标的节点，如果没有查找到则返回 `null`

- 示例

  ```ts
  const node = editor.getNextSelectionNode(targetNode)
  ```

##### setSelectionBefore()

设置光标到指定节点或者编辑器的起始处

- 类型

  ```ts
  setSelectionBefore(node?: KNode, type?: "all" | "start" | "end"): void
  ```

- 详细信息

第一个入参表示指定的节点，如果设置了此参数，会将光标移动到该节点内的起始处，否则会将光标移动到编辑器的起始处；第二个入参表示操作类型，`all` 表示光标的起点和终点都移动，`start` 表示只移动光标的起点，`end` 表示只移动光标的终点，默认值为 `all`

- 示例

  ```ts
  editor.setSelectionBefore(node, 'start')
  ```

##### setSelectionAfter()

设置光标到指定节点或者编辑器的末尾处

- 类型

  ```ts
  setSelectionAfter(node?: KNode, type?: "all" | "start" | "end"): void
  ```

- 详细信息

第一个入参表示指定的节点，如果设置了此参数，会将光标移动到该节点内的末尾处，否则会将光标移动到编辑器的末尾处；第二个入参表示操作类型，`all` 表示光标的起点和终点都移动，`start` 表示只移动光标的起点，`end` 表示只移动光标的终点，默认值为 `all`

- 示例

  ```ts
  editor.setSelectionAfter(node, 'end')
  ```

##### updateSelectionRecently()

更新指定光标到离当前光标点最近的节点上

- 类型

  ```ts
  updateSelectionRecently(type?: "all" | "start" | "end"): void
  ```

- 详细信息

  提供一个入参，表示更新的光标类型，`all` 表示光标的起点和终点都更新，`start` 表示只更新光标的起点，`end` 表示只更新光标的终点，默认值为 `all`

- 示例

  ```ts
  editor.updateSelectionRecently('start')
  ```

##### isSelectionInNode()

判断光标是否在某个节点内

- 类型

  ```ts
  isSelectionInNode(node: KNode, type?: "all" | "start" | "end"): boolean
  ```

- 详细信息

  第一个入参表示指定的节点，该方法会判断光标是否在该节点内；第二个入参表示光标的类型，`all` 表示判断整个光标包括起点和终点是否都在该节点内，`start` 表示只判断光标起点是否在该节点内，`end` 表示只判断光标终点是否在该节点内，默认值为 `all`

- 示例

  ```ts
  //判断光标起点是否在node节点内
  const flag = editor.isSelectionInNode(node, 'start')
  ```

##### getSelectedNodes()

获取光标选区内的节点数据

- 类型

  ```ts
  getSelectedNodes(): EditorSelectedType[]
  ```

- 详细信息

  该方法会通过判断虚拟光标的起点和终点的位置，获取位于两个光标点之间的节点。返回的结果是一个数组，数组中每个元素都包含两个属性 `node` 和 ` offset`

  `node ` 表示节点，`offset` 表示节点是否完全在选区内

  > offset 的值是数值数组或者 false， 为 false 时表示元素完全在选区内，为数组时表示不完全在选区内，此时 offset[0]和 offset[1]表示元素在选区内的部分），通常是文本元素

- 示例

  ```ts
  const selectedNodes = editor.getSelectedNodes()
  ```

##### getMatchNodeBySelection()

判断光标范围内的可聚焦节点是否全都在同一个符合条件节点内

- 类型

  ```ts
  getMatchNodeBySelection(options: KNodeMatchOptionType): KNode | null
  ```

- 详细信息

  提供一个入参，类型为 `KNodeMatchOptionType`，表示节点的匹配条件，包含 `tag`、`marks`、`styles` 三个属性，同 `KNode` 的同名属性，该方法判断光标是否都在符合条件的同一节点内，如果是返回该节点，如果不是返回 `null`

  > 不同于 KNode 同名属性的是，marks 和 styles 内的属性值可以是 true，此时表示仅判断是否拥有该标记或者该样式

- 示例

  ```ts
  //判断光标是否都在同一个节点tag为p，且标记data-p的值是p1的节点内
  const node = editor.getMatchNodeBySelection({
    tag: 'p',
    marks: {
      'data-p': 'p1'
    }
  })
  ```

  ```ts
  //判断光标是否都在同一个节点tag为p，且拥有data-p标记的节点内
  const node = editor.getMatchNodeBySelection({
    tag: 'p',
    marks: {
      'data-p': true
    }
  })
  ```

##### isSelectionNodesAllMatch()

判断光标范围内的可聚焦节点是否全都在符合条件的（不一定是同一个）节点内

- 类型

  ```ts
  isSelectionNodesAllMatch(options: KNodeMatchOptionType): boolean
  ```

- 详细信息

  提供一个入参，类型为 `KNodeMatchOptionType`，表示节点的匹配条件，包含 `tag`、`marks`、`styles` 三个属性，同 `KNode` 的同名属性，该方法判断光标是否都在符合这个条件的节点内，符合条件的节点不一定是同一个节点

  > 不同于 KNode 同名属性的是，marks 和 styles 内的属性值可以是 true，此时表示仅判断是否拥有该标记或者该样式

- 示例

  ```ts
  //判断光标是否都在节点tag为p，且标记data-p的值是p1的节点内
  const flag = editor.isSelectionNodesAllMatch({
    tag: 'p',
    marks: {
      'data-p': 'p1'
    }
  })
  ```

  ```ts
  //判断光标是否都在节点tag为p，且拥有data-p标记的节点内
  const flag = editor.isSelectionNodesAllMatch({
    tag: 'p',
    marks: {
      'data-p': true
    }
  })
  ```

##### isSelectionNodesSomeMatch()

判断光标范围内是否有可聚焦节点在符合条件的节点内

- 类型

  ```ts
  isSelectionNodesSomeMatch(options: KNodeMatchOptionType): boolean
  ```

- 详细信息

  提供一个入参，类型为 `KNodeMatchOptionType`，表示节点的匹配条件，包含 `tag`、`marks`、`styles` 三个属性，同 `KNode` 的同名属性，该方法判断光标范围内的节点是否有在符合这个条件的节点内的情况

  > 不同于 KNode 同名属性的是，marks 和 styles 内的属性值可以是 true，此时表示仅判断是否拥有该标记或者该样式

- 示例

  ```ts
  //判断光标范围内的节点是否有在tag为p，且标记data-p的值是p1的节点内的
  const flag = editor.isSelectionNodesSomeMatch({
    tag: 'p',
    marks: {
      'data-p': 'p1'
    }
  })
  ```

  ```ts
  //判断光标范围内的节点是否有在tag为p，且拥有data-p标记的节点内的
  const flag = editor.isSelectionNodesSomeMatch({
    tag: 'p',
    marks: {
      'data-p': true
    }
  })
  ```

##### getFocusNodesBySelection()

获取所有在光标范围内的可聚焦节点

- 类型

  ```ts
  getFocusNodesBySelection(type?: "all" | "closed" | "text"): KNode[]
  ```

- 详细信息

  提供一个入参，类型为 `"all" | "closed" | "text"`，表示获取的可聚焦节点的类型，如果是 `closed` 则表示仅获取光标范围内的闭合节点，如果是 `text` 则表示仅获取光标范围内的文本节点，如果是 `all` 则表示获取光标范围内的文本节点和闭合节点，默认值为 `all`

  > 该方法拿到的文本节点可能部分区域不在光标范围内，即只有部分内容在光标范围内

- 示例

  ```ts
  //获取光标范围内的文本节点
  const textNodes = editor.getFocusNodesBySelection('text')
  ```

##### getFocusSplitNodesBySelection()

获取所有在光标范围内的可聚焦节点

- 类型

  ```ts
  getFocusSplitNodesBySelection(type?: "all" | "closed" | "text"): KNode[]
  ```

- 详细信息

  提供一个入参，类型为 `"all" | "closed" | "text"`，表示获取的可聚焦节点的类型，如果是 `closed` 则表示仅获取光标范围内的闭合节点，如果是 `text` 则表示仅获取光标范围内的文本节点，如果是 `all` 则表示获取光标范围内的文本节点和闭合节点，默认值为 `all`

  > 该方法可能会切割部分文本节点，摒弃其不在光标范围内的部分，所以也可能会更新光标的位置

- 示例

  ```ts
  //获取光标范围内的文本节点，如果文本节点只有部分在光标内，则会分割该文本节点
  const textNodes = editor.getFocusSplitNodesBySelection('text')
  ```

##### insertText()

向选区插入文本

- 类型

  ```ts
  insertText(text: string): void
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示需要插入到编辑器内的文本值

- 示例

  ```ts
  editor.insertText('插入的文本')
  editor.updateView() //调用此方法视图才会更新
  ```

##### insertParagraph()

对虚拟光标所在位置进行换行操作

- 类型

  ```ts
  insertParagraph(): void
  ```

- 详细信息

  对光标所在选区进行换行操作，如果光标所在块节点只有占位符并且块节点不是段落则会转为段落

- 示例

  ```ts
  editor.insertParagraph()
  editor.updateView() //调用此方法视图才会更新
  ```

##### insertNode()

向虚拟光标所在位置插入节点

- 类型

  ```ts
  insertNode(node: KNode, cover?: boolean): void
  ```

- 详细信息

  第一个入参表示需要插入的节点，第二个入参表示当向某个只有占位符的非 `fixed` 块节点插入另一个非 `fixed` 块节点时是否覆盖此节点，而不是直接插入进去

- 示例

```ts
const node = KNode.create({
  type: 'text',
  textContent: '插入的节点'
})
editor.insertNode(node)
editor.updateView() //调用此方法视图才会更新
```

##### delete()

对虚拟光标所在位置执行删除操作

- 类型

  ```ts
  delete(): void
  ```

- 详细信息

如果虚拟光标是折叠状态，执行此方法，相当于按了一次删除按键，会删除光标之前的一个字符或者一个图片等；如果虚拟光标不是折叠状态，则会对光标选中的范围内的节点进行删除

- 示例

  ```ts
  editor.delete()
  editor.updateView() //调用此方法视图才会更新
  ```

##### updateView()

更新编辑器视图

- 类型

  ```ts
  updateView(updateRealSelection?: boolean, unPushHistory?: boolean): Promise<void>
  ```

- 详细信息

  第一个入参表示在更新编辑器视图后是否根据虚拟光标渲染真实的光标，默认为 `true`；第二个入参表示在更新视图后如果编辑器内容发生了变化，是否加入到历史记录中去，如果是 `true` 则表示不加入到历史记录，是 `false` 则表示加入历史记录

- 示例

  ```ts
  editor.updateView()
  ```

  ```ts
  //如果需要在更新视图后进行某些处理，需要等待视图更新完成
  await editor.updateView()
  //to do
  ```

##### updateRealSelection()

根据 `selection` 更新编辑器真实光标

- 类型

  ```ts
  updateRealSelection(): Promise<void>
  ```

- 详细信息

  该方法仅根据虚拟光标来渲染真实的浏览器光标，而不会改动视图，当我们直接或间接修改了 `editor.selection` 的内容后可以调用此方法更新编辑器内的真实光标

- 示例

  ```ts
  editor.updateRealSelection()
  ```

  ```ts
  //如果需要在更新真实光标后进行某些处理，需要等待光标更新完成
  await editor.updateRealSelection()
  //to do
  ```

##### review()

重新渲染编辑器的内容视图

- 类型

  ```ts
  review(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示一段富文本内容，该方法会将编辑器的内容重置成该富文本内容，重新进行视图渲染，需要注意的是，该方法不会触发 `onChange`

- 示例

  ```ts
  const html = '<p>我是新的内容</p>'
  await editor.review(html)
  ```

##### destroy()

销毁编辑器

- 类型

  ```ts
  destroy(): void
  ```

- 详细信息

  该方法会移除可编辑的效果，并且移除相关监听事件

- 示例

  ```ts
  editor.destroy()
  ```

##### getText()

获取编辑器的纯文本内容

- 类型

  ```ts
  getText(): string
  ```

- 详细信息

  该方法会返回当前编辑器的纯文本内容

- 示例

  ```ts
  const text = editor.getText()
  ```
