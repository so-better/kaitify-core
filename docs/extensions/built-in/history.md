---
title: history 历史记录
---

# history 历史记录

提供撤销、重做等能力，并且支持快捷键

撤销快捷键：`Ctrl + Z / Command + Z (Mac)`

重做快捷键：`Ctrl + Y / Command + Shift + Z (Mac)`

## Commands 命令

##### canUndo()

是否可以撤销

- 类型

  ```ts
  canUndo(): boolean
  ```

- 详细信息

该方法用来判断当前编辑器是否可以执行撤销操作，返回 `boolean` 值

- 示例

  ```ts
  const canUndo = editor.commands.canUndo()
  ```

##### canRedo()

是否可以重做

- 类型

  ```ts
  canRedo(): boolean
  ```

- 详细信息

该方法用来判断当前编辑器是否可以执行重做操作，返回 `boolean` 值

- 示例

  ```ts
  const canRedo = editor.commands.canRedo()
  ```

##### undo()

执行撤销操作

- 类型

  ```ts
  undo(): Promise<void>
  ```

- 详细信息

  该方法会执行一次撤销操作，并且在操作完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.undo()
  ```

##### redo()

执行重做操作

- 类型

  ```ts
  redo(): Promise<void>
  ```

- 详细信息

  该方法会执行一次重做操作，并且在操作完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.redo()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.undo()">撤销</button>
  <button class="demo-button" @click="editor?.commands.redo()">重做</button>
</div>
<div ref="editorRef" style="width:100%;height:100px;"></div>

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
      value: '我是一段文本，我是一段文本，我是一段文本，我是一段文本，我是一段文本，我是一段文本，我是一段文本，我是一段文本',
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

```

```
