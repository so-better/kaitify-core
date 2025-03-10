---
title: indent 缩进
---

# indent 缩进

支持缩进属性的渲染，提供增加缩进、减少缩进的能力。

> [!TIP] Tips
> 通过 `Tab` 按键可以增加缩进，通过 `Shift + Tab` 按键可以减少缩进，当然前提是必须允许使用缩进功能，即 `canUseIndent` 方法返回的结果为 true 时

## Commands 命令

##### canUseIndent()

是否可以使用缩进功能

- 类型

  ```ts
  canUseIndent(): boolean
  ```

- 详细信息

  该方法返回一个布尔值，根据光标位置判断此刻是否可以使用缩进功能

- 示例

  ```ts
  const canUseIndent = editor.commands.canUseIndent()
  ```

##### setIncreaseIndent()

增加缩进

- 类型

  ```ts
  setIncreaseIndent(): Promise<void>
  ```

- 详细信息

  该方法会使得光标范围内的块节点增加缩进量，并且在操作完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.setIncreaseIndent()
  ```

##### setDecreaseIndent()

减少缩进

- 类型

  ```ts
  setDecreaseIndent(): Promise<void>
  ```

- 详细信息

  该方法会使得光标范围内的块节点减少缩进量，并且在操作完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.setDecreaseIndent()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setIncreaseIndent()">增加缩进</button>
  <button class="demo-button" @click="editor?.commands.setDecreaseIndent()">减少缩进</button>
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
