---
title: History
---

# History

> kaitify 内部维护了一套历史记录缓存的机制，在编辑器渲染后的每一次视图更新的操作，都会使得编辑器的内容和光标信息被编辑器内部记录并缓存，通过这样的一个机制，可以实现撤销和重做

## 历史记录结构

编辑器创建时，会初始化一个 `History` 实例，可以通过编辑器实例的 `history` 属性访问，实例具有以下属性：

##### records <Badge type="danger" text="HistoryRecordType[]" />

存放历史记录的堆栈，数组里的每一项元素都包含 `nodes` 和 `selection` 属性，表示每一次记录的编辑器节点内容和光标信息，在初始化编辑器，该数组只存在一个记录，所以我们可以通过判断该属性的长度来判断是否可以进行撤销操作

```ts
const canUndo = editor.history.records.length > 1
```

##### redoRecords <Badge type="danger" text="HistoryRecordType[]" />

存放撤销记录的堆栈，数组里的每一项元素都包含 `nodes` 和 `selection` 属性，表示每一次撤销记录的编辑器节点内容和光标信息，当我们没有执行过撤销时，该数组长度为 0，因此可以通过判断该属性的长度来判断是否可以进行重做操作

```ts
const canRedo = editor.history.redoRecords.length > 0
```

## 常用方法

##### setState()

保存新的记录

- 类型

  ```ts
  setState(nodes: KNode[], selection: Selection): void
  ```

- 详细信息

  第一个入参表示需要保存的节点数组，第二个参数表示需要保存的虚拟光标信息，该方法会向 `records` 历史记录堆栈加入新的记录，同时清空撤销记录堆栈

- 示例

  ```ts
  editor.history.setState(editor.stackNodes, editor.selection)
  ```

##### setUndo()

撤销操作：返回上一个历史记录

- 类型

  ```ts
  setUndo(): HistoryRecordType | null
  ```

- 详细信息

  该方法会返回上一个历史记录数据，如果不可撤销，则返回 `null`，我们只需要将该历史记录数据更新到编辑器当前视图即可

- 示例

  ```ts
  //取出上一个历史记录
  const record = editor.history.setUndo()
  //存在历史记录表示可以撤销
  if (record) {
    //更新到编辑器
    editor.stackNodes = record.nodes
    editor.selection = record.selection
    //渲染到视图，但是不加入历史记录
    await editor.updateView(true, true)
  }
  ```

##### setRedo()

重做操作：返回下一个历史记录

- 类型

  ```ts
  setRedo(): HistoryRecordType | null
  ```

- 详细信息

  该方法会返回下一个历史记录数据，如果不可重做，则返回 `null`，我们只需要将该历史记录数据更新到编辑器当前视图即可

- 示例

  ```ts
  //取出下一个历史记录
  const record = editor.history.setRedo()
  //可以重做
  if (record) {
    //更新到编辑器
    editor.stackNodes = record.nodes
    editor.selection = record.selection
    //更新到视图，但是不加入历史记录
    await editor.updateView(true, true)
  }
  ```

##### updateSelection()

仅更新当前记录的光标信息

- 类型

  ```ts
  updateSelection(selection: Selection): void
  ```

- 详细信息

  提供一个入参，类型为虚拟光标 `Selection`，该方法会将光标信息更新到当前的记录中去

- 示例

  ```ts
  editor.history.updateSelection(editor.selection)
  ```
