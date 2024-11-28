---
title: color 字体颜色
---

# color 字体颜色

文本字体颜色

## Commands 命令

##### isColor()

判断光标所在文本的字体颜色是否与指定值一致

- 类型

  ```ts
  isColor(value: string): boolean
  ```

- 详细信息

  提供一个入参，类型为 `string`，用以判断光标所在文本的字体颜色是否与指定值一致

- 示例

  ```ts
  const isRed = editor.commands.isColor('#f30')
  ```

##### setColor()

设置光标所在文本的字体颜色

- 类型

  ```ts
  setColor(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示设置的字体颜色，该方法会设置光标文本为该字体颜色，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isColor` 判断光标所在文本都是该字体颜色，则不会继续执行

- 示例

  ```ts
  await editor.commands.setColor('#f30')
  ```

##### unsetColor()

取消光标所在文本的字体颜色

- 类型

  ```ts
  unsetColor(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示取消的字体颜色，该方法会取消光标文本的该字体颜色，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isColor` 判断光标所在文本不全都是该字体颜色，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetColor('#f30')
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setColor('red')">设置字体颜色</button>
  <button class="demo-button" @click="editor?.commands.unsetColor('red')">取消字体颜色</button>
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
