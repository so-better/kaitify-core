---
lastUpdated: false
title: 更新日志
---

# 更新日志

## v0.0.2-beta.20 <Badge type="tip" text='2026.03.30' />

- 闭合节点架构逻辑优化：现在针对闭合节点，其对应的真实dom内允许存在子元素，且真实dom内部被视为黑盒，即编辑器不管理闭合节点对应的真实dom的内部元素。与此同时， `Editor`的 `findNode` 方法进行了适配优化，根据真实光标更新虚拟光标的逻辑也进行了优化处理
- 新增 `formatContenteditableToClosed` 格式化规则：将带有 `contenteditable="false"` 标记的节点统一转为闭合节点，并移除该标记（在渲染阶段会给 `closed` 节点统一加上 `contenteditable="false"` 属性）
- 整个编辑器的不可编辑节点的逻辑判断全部去除，如 `Editor` 中 `insertText`、`insertParagraph`、`insertNode`、`delete` 的 `uneditable` 检测逻辑移除，`KNode.getUneditable()` 方法移除
- 移除 `formatUneditableNoodes` 格式化规则：如果节点是不可编辑的，则查找使其不可编辑的目标节点，针对该目标节点，如果是非块节点且可见，则在两侧加上零宽度空白文本节点，且保证光标始终不在不可编辑的节点内部
- `Editor` 新增实例方法 `isDomInClosedNode`：用于判断某个dom是否在闭合节点内
- `Editor` 新增实例方法 `getClosedNodeBySelection`：用于判断光标是否在某个闭合节点上，是的话返回该闭合节点
- `Editor` 新增实例方法 `hasClosedNodeBySelection`：判断光标范围内是否有闭合节点
- `Attachment` 附件扩展基于新的闭合节点设计进行重构
- `Horizontal` 水平线扩展基于新的闭合节点设计进行重构，新增 `getHorizontal` 和 `hasHorizontal` 方法
- `Image` 图片扩展基于新的闭合节点设计进行重构，同时优化了改变尺寸的拖拽设计
- `Math` 数学公式扩展基于新的闭合节点设计进行重构
- `Video` 视频扩展基于新的闭合节点设计进行重构
- `Table` 表格扩展优化了改变列宽的拖拽设计
- `Task` 待办扩展优化了复选框的结构设计

## v0.0.2-beta.18 <Badge type="tip" text='2026.03.19' />

- 代码块扩展更新：节点数据结构优化，新增 `codeSpan` 和 `codeCopy` 两个区域，非编辑状态下悬浮代码块上时展示复制图标，点击可复制代码
- 代码块扩展更新：扩展新增入参 `handleCopy`，可自定义点击复制的逻辑处理
- `onDeleteComplete` 事件回调机制修改：原来在删除完成最后一步触发，现在在编辑器合并起点和终点之前触发，此时编辑器的终点和起点可能尚未合并，另外起点所在节点可能是空节点，在这里处理光标只需要处理起点即可，因为终点最后会与起点进行合并
- 针对不可编辑的目标节点，如果是不可见的，即节点的 `void` 属性为 `true`，则不会自动在节点两侧添加零宽度空白节点
- 节点合并规则中，目标节点如果是锁定的，即节点的 `locked` 属性为 `true`，则不会进行合并，原先仅判断源节点，没有判断目标节点

## v0.0.2-beta.17 <Badge type="tip" text='2026.03.16' />

- 修复代码块内容高亮处理时可能引起的光标位置bug
- 起点在代码块内时粘贴内容，如果是html粘贴则降级为纯文本粘贴，以保证代码的格式不会丢失
- 文本的格式化规则bug修复

## v0.0.2-beta.13 <Badge type="tip" text='2026.03.04' />

- `insertNode` 方法修复当光标在不可编辑器节点中时处理后重新执行时cover丢失的问题
- `Table` 扩展优化：在onDomParseNode处理中当td中没有子节点或者子节点都是空节点时时创建默认占位符

## v0.0.2-beta.11 <Badge type="tip" text='2026.03.03' />

- 修复 `Table` 在格式化时候的一些bug

## v0.0.2-beta.10 <Badge type="tip" text='2026.02.09' />

- 编辑器构建参数新增 `onRedressSelection` 属性，用于编辑器光标纠正时触发对编辑器虚拟光标进行修改优化
- 扩展新增参数 `onRedressSelection` 属性，同上
- `Table` 扩展进行了优化，解决单元格内容选择时误选中前一个单元格末尾处的体验问题

## v0.0.2-beta.9 <Badge type="tip" text='2026.02.04' />

- 修复代码编写错误

## v0.0.2-beta.8 <Badge type="tip" text='2025.10.27' />

- 优化编辑器的 `destroy` 方法，修复了原来销毁后再创建出现问题的 bug
- 编辑器的主题颜色全部挂载在容器上，而不是 `document` 上，另外编辑器的主题颜色不再受全局影响
- 编辑器的深色模式样式设置从属性 `[kaitify-dark]` 改为样式类 `.kaitify-dark`
- 编辑器构建入参新增 `onCreate` 和 `onCreated` 参数

## v0.0.2-beta.2 <Badge type="tip" text='2025.10.25' />

- 优化编辑器对样式的判断，如果是空字符串则默认无样式
- 优化 `List` 内置扩展的样式

## v0.0.1 <Badge type="tip" text='2025.09.27' />

- `Editor` 所有的构建参数中的函数事件都以 `on` 开头
- 第一个正式版本发布

## v0.0.1-beta.37 <Badge type="tip" text='2025.09.03' />

- 修复了当段落进行缩进时，行内代码、图片、视频、数学公式等样式为 `inline-block` 的元素也进行了缩进的问题

## v0.0.1-beta.36 <Badge type="tip" text='2025.09.03' />

- 优化了 `Attachment` 的样式
- 优化了 `Blockquote` 的样式
- 优化了 `Code` 的样式
- 优化了 `CodeBlock` 的样式
- 优化了 `Link` 的样式
- 优化了 `Math` 的样式
- 优化了 `Table` 的样式
- 引用节点优化：在创建时如果子节点无块节点，会在引用内创建一个段落节点

## v0.0.1-beta.35 <Badge type="tip" text='2025.08.27' />

- `Attachment` `Math` 和 `Horizontal`扩展的表现优化

## v0.0.1-beta.34 <Badge type="tip" text='2025.08.27' />

- `Video` `Image` `Table`等扩展设定可拖拽的边缘大小
- 代码优化

## v0.0.1-beta.33 <Badge type="tip" text='2025.05.23' />

- `getContent` 方法新增两个入参，分别表示是否排除 `\n` 换行符、是否排除零宽度空白字符
- 编辑器格式化处理 `\n` 后面加上零宽度空白字符时，优化了光标的位置更新逻辑
- 代码块换行逻辑优化：代码块内最后一行如果没有内容，此时再进行换行会在整个代码块后进行换行（之前有这个功能，但是在空格逻辑优化后功能需要优化和修改）
- 修复了在代码块内执行撤销偶然导致光标丢失的 bug

## v0.0.1-beta.32 <Badge type="tip" text='2025.04.12' />

- 优化 `getHTML` 方法：对于返回的 `style` 标签内的样式进行了过滤，现在只会返回与编辑器相关的样式；同时新增了 `filterCssText` 参数，用于自定义需要保留的样式
- 优化行内代码的样式
- 修复中文输入没有加入历史记录的 bug
- 重新定义了空格的渲染逻辑，并且针对 `\n` 换行符进行了格式化处理

## v0.0.1-beta.30 <Badge type="tip" text='2025.04.07' />

- 代码细节优化

## v0.0.1-beta.28 <Badge type="tip" text='2025.04.03' />

- `Editor` 新增实例方法 `setDomObserve`，用于监听编辑器内的非法 `dom` 操作
- `Editor` 新增实例方法 `removeDomObserve`，用于取消监听编辑器内的非法 `dom` 操作
- 修复了 `Image` 和 `Video` 扩展内的图片和视频无法拖拽改变大小的 bug

## v0.0.1-beta.27 <Badge type="tip" text='2025.04.02' />

- 优化编辑器对非法 `dom` 插入/删除/更新的处理，以适配 `Grammarly` 等第三方插件对 `dom` 的修改
- 其他代码优化

## v0.0.1-beta.26 <Badge type="tip" text='2025.03.24' />

- 优化 `unicode` 字符删除时的操作逻辑，例如 `emoji` 表情包删除的优化
- 新增 `isSelectionInView` 函数：用以判断光标是否完全在可视范围内

## v0.0.1-beta.24 <Badge type="tip" text='2025.03.15' />

- 待办扩展优化：勾选的动画效果优化和样式优化（现在复选框始终只会显示在待办的顶部，而不是和之前一样居中）
- 优化不可编辑节点的整体逻辑，在删除、换行、插入等操作时都被视为整体进行处理
- 编辑可编辑下单击附件和数学公式会选中附件和数学公式
- 代码块换行逻辑优化：代码块内最后一行如果没有内容，此时再进行换行会在整个代码块后进行换行
- 表格换行逻辑优化：表格最后一行的最后一列内，如果光标所在的块节点是段落且前一个块节点也是段落，则再次换行时会在整个表格后换行
- 表格格式化规则新增对 `td` 内容的处理，如果 `td` 内没有块节点，会默认使用段落进行包裹
- 列表样式优化：解决了在字体较大时列标显示不全的问题

## v0.0.1-beta.22 <Badge type="tip" text='2025.03.11' />

- 修复了一个中文输入的 bug
- `Editor` 新增实例方法 `isEmpty`，用以判断编辑器内容是否为空
- 优化了 `placeholder` 占位内容的显示机制，在输入中文时隐藏 `placeholder`

## v0.0.1-beta.20 <Badge type="tip" text='2025.03.10' />

- 代码优化，解决了 `Grammarly` 插入的问题
- `indent` 扩展新增 `canUseIndent` 指令，用于判断是否可以使用缩进功能
- `indent` 扩展新增键盘事件：`tab` 键按下增加缩进；`shift+tab` 键按下减少缩进

## v0.0.1-beta.19 <Badge type="tip" text='2025.03.08' />

- 对 `KNode` 的实例方法 `clone` `fullClone` `getFocusNodes` 进行了优化
- 对 `KNode` 的类方法 `flat` `searchByKey` 进行了优化
- `KNode` 的实例方法 `firstTextClosedInNode` 更名为 `firstInTargetNode`
- `KNode` 的实例方法 `lastTextClosedInNode` 更名为 `lastInTargetNode`
- `Editor` 的实例方法 `getLastSelectionNodeInChildren` 更名为 `getLastSelectionNode`，并进行了性能的优化
- `Editor` 的实例方法 `getFirstSelectionNodeInChildren` 更名为 `getFirstSelectionNode`，并进行了性能的优化
- 对 `Editor` 的实例方法 `getFocusNodesBySelection` 进行了优化
- `Editor` 的实例方法 `isSelectionInNode` 更名为 `isSelectionInTargetNode`
- 内部的一些方法和逻辑进行了优化
- 修复了格式化过程中将非块级节点转为块节点时的逻辑处理出现的一些问题，这个问题曾导致内存溢出

## v0.0.1-beta.18 <Badge type="tip" text='2025.03.04' />

- 新增 `getHTML` 函数获取编辑器 `html` 内容

## v0.0.1-beta.17 <Badge type="tip" text='2025.01.24' />

- 代码块扩展新增键盘事件：在代码块内按下 `Tab` 键会插入 2 个空格
- 部分代码优化

## v0.0.1-beta.16 <Badge type="tip" text='2025.01.23' />

- 列表优化：现在会给默认的列表节点设置 `listStyleType` 样式
- 列表扩展 `unsetList` 方法问题修复
- 列表扩展新增 `canCreateInnerList` 和 `createInnertList` 命令
- 列表扩展新增键盘事件：在可以生成内嵌列表时，按下 `Tab` 键会执行 `createInnertList` 命令

## v0.0.1-beta.13 <Badge type="tip" text='2025.01.06' />

- 优化列表渲染，序标改为外侧，设置左侧内边距

## v0.0.1-beta.12 <Badge type="tip" text='2024.12.06' />

- kaitify 的第一个发布版本
