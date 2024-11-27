---
title: align 对齐方式
---

# align 对齐方式

设置光标所在的块节点的对齐方式

## Commands 命令

##### isAlign()

光标所在的块节点是否都是符合的对齐方式

- 类型

  ```ts
  isAlign(value: AlignValueType): boolean
  ```

- 详细信息

  提供一个入参，类型为 AlignValueType，可取值为 `left` `right` `center` `justify`，用以判断光标所在的块节点是否都符合指定的对齐方式，返回 `boolean` 值

- 示例

  ```ts
  const isAlignCenter = editor.commands.isAlign('center')
  ```

##### setAlign()

设置光标所在的块节点的对齐方式

- 类型

  ```ts
  setAlign(value: AlignValueType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 AlignValueType，可取值为 `left` `right` `center` `justify`，该方法会设置光标所在的块节点的对齐方式，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.setAlign('center')
  ```

##### unsetAlign()

取消设置光标所在的块节点的指定对齐方式

- 类型

  ```ts
  unsetAlign(value: AlignValueType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 AlignValueType，可取值为 `left` `right` `center` `justify`，该方法会取消光标所在的块节点的指定对齐方式，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.unsetAlign('center')
  ```
