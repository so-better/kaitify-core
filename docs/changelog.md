---
lastUpdated: false
title: 更新日志
---

# 更新日志

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
