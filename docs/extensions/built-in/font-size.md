---
title: font-size 字号
---

# font-size 字号

文本字号

## Commands 命令

##### isFontSize()

判断光标所在文本字号是否与指定值一致

- 类型

  ```ts
  isFontSize(value: string): boolean
  ```

- 详细信息

提供一个入参，类型为 `string`，该方法用来判断光标所在文本的字号是否指定的值，返回 `boolean` 值

- 示例

  ```ts
  const isFontSize = editor.commands.isFontSize('20px')
  ```

##### setFontSize()

设置光标范围内的文本的字号

- 类型

  ```ts
  setFontSize(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示设置的字号，该方法会对光标范围内的文本设置该字号，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isFontSize` 判断光标所在文本都是该字号，则不会继续执行

- 示例

  ```ts
  await editor.commands.setFontSize('20px')
  ```

##### unsetFontSize()

取消光标范围内的文本的字号

- 类型

  ```ts
  unsetFontSize(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示取消的字号，该方法会对光标范围内的文本取消设置该字号，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isFontSize` 判断光标所在文本不都是该字号，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetFontSize('20px')
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setFontSize('20px')">设置字号</button>
  <button class="demo-button" @click="editor?.commands.unsetFontSize('20px')">取消字号</button>
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
