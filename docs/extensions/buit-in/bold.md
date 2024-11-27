---
title: bold 加粗
---

# bold 加粗

文本加粗

## Commands 命令

##### isBold()

判断光标所在文本是否加粗

- 类型

  ```ts
  isBold(): boolean
  ```

- 详细信息

该方法用来判断光标所在文本是否加粗，返回 `boolean` 值

- 示例

  ```ts
  const isBold = editor.commands.isBold()
  ```

##### setBold()

光标范围内的文本进行加粗

- 类型

  ```ts
  setBold(): Promise<void>
  ```

- 详细信息

  该方法会将光标范围内的文本都进行加粗，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isBold` 判断光标所在文本都是已加粗的，则不会继续执行

- 示例

  ```ts
  await editor.commands.setBold()
  ```

##### unsetBold()

光标范围内的文本取消加粗

- 类型

  ```ts
  unsetBold(): Promise<void>
  ```

- 详细信息

  该方法会对光标范围内的文本取消加粗，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isBold` 判断光标所在文本不全都是加粗的，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetBold()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setBold()">加粗</button>
  <button class="demo-button" @click="editor?.commands.unsetBold()">取消加粗</button>
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
