---
title: back-color 背景色
---

# back-color 背景色

文本背景色

## Commands 命令

##### isBackColor()

判断光标所在文本的背景色是否与指定值一致

- 类型

  ```ts
  isBackColor(value: string): boolean
  ```

- 详细信息

  提供一个入参，类型为 `string`，用以判断光标所在文本的背景色是否与指定值一致

- 示例

  ```ts
  const isRedBack = editor.commands.isBackColor('#f30')
  ```

##### setBackColor()

设置光标所在文本的背景色

- 类型

  ```ts
  setBackColor(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，该方法会设置光标文本的背景色，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isBackColor` 判断光标所在文本都是该背景色，则不会继续执行

- 示例

  ```ts
  await editor.commands.setBackColor('#f30')
  ```

##### unsetBackColor()

取消光标所在文本的背景色

- 类型

  ```ts
  unsetBackColor(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，该方法会取消光标文本的背景色，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isBackColor` 判断光标所在文本不全都是该背景色，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetBackColor('#f30')
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setBackColor('red')">设置背景色</button>
  <button class="demo-button" @click="editor?.commands.unsetBackColor('red')">取消背景色</button>
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
