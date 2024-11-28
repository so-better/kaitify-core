---
title: indent 缩进
---

# indent 缩进

支持缩进属性的渲染，提供增加缩进、减少缩进的能力

> [!TIP] Tips
> 不建议在代码块样式的块节点内增加缩进或者减少缩进，如果需要与快捷键 `Tab / Shift + Tab` 绑定，你需要好好考虑一下，一般来说代码块内我们按下 Tab 只希望能够插入 2 个或者 4 个空格

## Commands 命令

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
