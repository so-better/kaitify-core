---
title: table 表格
---

# table 表格

支持表格的渲染，提供插入表格的能力，并且表格除了最后一列的每列的右侧都可以拖拽改变列宽

## Commands 命令

##### getTable()

获取光标所在的表格节点

- 类型

  ```ts
  getTable(): KNode | null
  ```

- 详细信息

  该方法可以获取光标所在的唯一表格节点，如果光标不在一个表格节点内，则返回 `null`

- 示例

  ```ts
  const tableNode = editor.commands.getTable()
  ```

##### hasTable()

判断光标范围内是否有表格节点

- 类型

  ```ts
  hasTable(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内是否有表格节点，返回 `boolean` 值

- 示例

  ```ts
  const hasTable = editor.commands.hasTable()
  ```

##### canMergeTableCells()

判断表格是否可以进行合并单元格操作

- 类型

  ```ts
  canMergeTableCells(direction: TableCellsMergeDirectionType): boolean
  ```

- 详细信息

  提供一个入参，类型为 `TableCellsMergeDirectionType`，表示单元格合并的方向，可取值为 `left` `top` `right` `bottom`，该方法用来判断光标所在的唯一单元格是否可以向指定方向与相邻单元格进行合并，返回 `boolean` 值

  需要注意，如果光标所在的不是表格且不是表格内的某个单元格，则返回 `false`

- 示例

  ```ts
  const canMergeTableCell = editor.commands.canMergeTableCells('right')
  ```

##### setTable()

插入表格

- 类型

  ```ts
  setTable(options: { rows: number; columns: number }): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `{ rows: number; columns: number }`，其中 `rows` 表示插入的表格行数，`columns` 表示插入的表格列数，该方法会向光标区域插入一个指定规格的表格，在插入完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  需要注意，如果光标范围内包含表格，则无法插入一个新的表格

- 示例

  ```ts
  await editor.commands.setTable({ rows: 5, columns: 5 })
  ```

##### unsetTable()

删除表格

- 类型

  ```ts
  unsetTable(): Promise<void>
  ```

- 详细信息

  该方法会将光标所在的唯一表格节点移除，在移除完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.unsetTable()
  ```

##### mergeTableCell()

合并单元格

- 类型

  ```ts
  mergeTableCell(direction: TableCellsMergeDirectionType): boolean
  ```

- 详细信息

  提供一个入参，类型为 `TableCellsMergeDirectionType`，表示单元格合并的方向，可取值为 `left` `top` `right` `bottom`，该方法用来将当前光标所指向的唯一单元格与指定方向的相邻单元格进行合并，在合并完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `canMergeTableCells` 判断无法进行单元格合并，则不会继续执行

- 示例

  ```ts
  await editor.commands.mergeTableCell('right')
  ```

##### addTableRow()

表格添加行

- 类型

  ```ts
  addTableRow(direction: "top" | "bottom"): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `top | bottom`，表示是向上添加行还是向下添加行，该方法会在当前光标所指向的唯一单元格所在的行之前或者之后添加一行，在添加完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.addTableRow('top')
  ```

##### deleteTableRow()

表格删除行

- 类型

  ```ts
  deleteTableRow(): Promise<void>
  ```

- 详细信息

  该方法会删除当前光标所指向的唯一单元格所在的行，在删除完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.deleteTableRow()
  ```

##### addTableColumn()

表格添加列

- 类型

  ```ts
  addTableColumn(direction: "left" | "right"): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `left | right`，表示是向左添加列还是向右添加行，该方法会在当前光标所指向的唯一单元格所在的列之前或者之后添加一列，在添加完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.addTableColumn('left')
  ```

##### deleteTableColumn()

表格删除列

- 类型

  ```ts
  deleteTableColumn(): Promise<void>
  ```

- 详细信息

  该方法会删除当前光标所指向的唯一单元格所在的列，在删除完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.deleteTableColumn()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setTable({ rows: 5, columns: 5 })">插入表格</button>
  <button class="demo-button" @click="editor?.commands.addTableRow('top')">添加行</button>
  <button class="demo-button" @click="editor?.commands.deleteTableRow()">删除行</button>
  <button class="demo-button" @click="editor?.commands.addTableColumn('left')">添加列</button>
  <button class="demo-button" @click="editor?.commands.deleteTableColumn()">删除列</button>
  <button class="demo-button" @click="editor?.commands.unsetTable()">取消表格</button>
</div>
<div ref="editorRef" style="width:100%;height:300px;"></div>

<script lang="ts" setup>
  import { useData } from 'vitepress'
  import { onMounted, watch, ref, onBeforeUnmount } from "vue"
  import { Editor } from "../../../lib/kaitify-core.es.js"

  const { isDark } = useData()
  const editorRef = ref<HtmlElement | undefined>()
  const editor = ref<Editor | undefined>()

  onMounted(async ()=>{
    editor.value = await Editor.configure({
      el: editorRef.value,
      value: '',
      dark: isDark.value,
      placeholder:'请输入正文...'
    })
  })

  onBeforeUnmount(()=>{
    editor.value?.destroy()
  })

  watch(()=>isDark.value,newVal=>{
    if(editor.value){
        editor.value.setDark(isDark.value)
    }
  })
</script>
