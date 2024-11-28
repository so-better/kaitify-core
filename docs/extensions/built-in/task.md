---
title: task 待办
---

# task 待办

支持待办的渲染，提供插入待办的能力

## Commands 命令

##### getTask()

获取光标所在的待办节点

- 类型

  ```ts
  getTask(): KNode | null
  ```

- 详细信息

  该方法可以获取光标所在的唯一待办节点，如果光标不在一个待办节点内，则返回 `null`

- 示例

  ```ts
  const taskNode = editor.commands.getTask()
  ```

##### hasTask()

判断光标范围内是否有待办节点

- 类型

  ```ts
  hasTask(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内是否有待办节点，返回 `boolean` 值

- 示例

  ```ts
  const hasTask = editor.commands.hasTask()
  ```

##### allTask()

光标范围内是否都是待办节点

- 类型

  ```ts
  allTask(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内都是待办节点，返回 `boolean` 值

- 示例

  ```ts
  const allTask = editor.commands.allTask()
  ```

##### setTask()

设置待办

- 类型

  ```ts
  setTask(): Promise<void>
  ```

- 详细信息

  该方法会将光标所在的块节点都转为待办节点，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allTask` 判断光标范围内都是待办节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.setTask()
  ```

##### unsetTask()

取消待办

- 类型

  ```ts
  unsetTask(): Promise<void>
  ```

- 详细信息

  该方法会将光标所在的待办节点都转为段落节点，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allTask` 判断光标范围内不都是待办节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetTask()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setTask()">设置待办</button>
  <button class="demo-button" @click="editor?.commands.unsetTask()">取消待办</button>
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
