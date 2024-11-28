---
title: line-height 行高
---

# line-height 行高

支持行高样式的渲染，提供设置行高的能力

## Commands 命令

##### isLineHeight()

判断光标所在的块节点是否都是符合的行高

- 类型

  ```ts
  isLineHeight(value: string | number): boolean
  ```

- 详细信息

  提供一个入参，类型为 `string | number`，用以判断光标所在的块节点的行高是否都是指定的值，返回 `boolean` 值

- 示例

  ```ts
  const isLineHeight = editor.commands.isLineHeight(3)
  ```

##### setLineHeight()

设置光标所在的块节点的行高

- 类型

  ```ts
  setLineHeight(value: string | number): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string | number`，该方法会设置光标所在的块节点的行高，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isLineHeight` 判断所在块节点都已经是该行高了，则不会继续执行

- 示例

  ```ts
  await editor.commands.setLineHeight(3)
  ```

##### unsetLineHeight()

取消设置光标所在的块节点的行高

- 类型

  ```ts
  unsetLineHeight(value: string | number): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string | number`，该方法会取消光标所在的块节点的指定行高，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isLineHeight` 判断所在块节点都已经不是该行高了，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetLineHeight(3)
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setLineHeight('3')">设置行高</button>
   <button class="demo-button" @click="editor?.commands.unsetLineHeight('3')">取消行高</button>
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
