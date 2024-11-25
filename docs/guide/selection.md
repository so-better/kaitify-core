---
title: Selection
---

# Selection

> kaitify 内部维护了一套基于浏览器 Selection API 而构建的虚拟光标数据，我们也称之为 Selection，它能够更直观地呈现出光标在节点数组中的位置

## 虚拟光标结构

编辑器创建时，会初始化一个 `Selection` 实例，可以通过编辑器实例的 `selection` 属性访问，实例具有以下属性：

##### start <Badge type="danger" text="SelectionPointType" />

虚拟光标的起点，包含 2 个属性：`node` 和 `offset`，其中 `node` 表示起点光标所在的 `KNode` 节点，只能是文本节点或者闭合节点，`offset` 表示光标在节点内的偏移值

##### end <Badge type="danger" text="SelectionPointType" />

虚拟光标的终点，包含 2 个属性：`node` 和 `offset`，其中 `node` 表示起点光标所在的 `KNode` 节点，只能是文本节点或者闭合节点，`offset` 表示光标在节点内的偏移值

> 对于可以作为起点和终点的节点，通常称之为“<b>可以设置为光标点的节点</b>”或者“<b>可聚焦节点</b>”

> 终点所表示的位置必须在起点位置的后面，如果通过修改 editor.selection 去刻意修改 end 导致 end 在 start 前面，可能出现难以预料的错误

## 常用方法

##### focused()

是否已经初始化设置光标位置

- 类型

  ```ts
  focused(): boolean
  ```

- 详细信息

  编辑器创建后，光标未聚焦在编辑器内时，通过编辑器实例访问 `selection` 属性，虽然可以获取到 `start` 和 `end` 属性，但是二者都是 `undefined`，表示编辑器未初始设置光标位置，此时通过该方法判断会返回 `false`

- 示例

  ```ts
  const focused = editor.selection.focused()
  //常用来判断编辑器是否初始设置光标，从而继续下一步操作
  ```

##### collapsed()

光标是否折叠

- 类型

  ```ts
  collapsed(): boolean
  ```

- 详细信息

该方法会判断编辑器内的虚拟光标是否折叠，即光标的起点和终点是否在同一个位置，即 `node` 和 `offset` 都完全一致，如果折叠返回 `true`，否则返回 `false`
