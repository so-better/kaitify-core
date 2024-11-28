---
title: font-family 字体
---

# font-family 字体

文本字体

## Commands 命令

##### isFontFamily()

判断光标所在文本字体是否与指定值一致

- 类型

  ```ts
  isFontFamily(value: string): boolean
  ```

- 详细信息

提供一个入参，类型为 `string`，该方法用来判断光标所在文本的字体是否指定的值，返回 `boolean` 值

- 示例

  ```ts
  const isFontFamily = editor.commands.isFontFamily('楷体, 楷体-简')
  ```

##### setFontFamily()

设置光标范围内的文本的字体

- 类型

  ```ts
  setFontFamily(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示设置的字体值，该方法会对光标范围内的文本设置该字体，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isFontFamily` 判断光标所在文本都是该字体，则不会继续执行

- 示例

  ```ts
  await editor.commands.setFontFamily('楷体, 楷体-简')
  ```

##### unsetFontFamily()

取消光标范围内的文本的字体

- 类型

  ```ts
  unsetFontFamily(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示取消的字体值，该方法会对光标范围内的文本取消设置该字体，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isFontFamily` 判断光标所在文本不都是该字体，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetFontFamily('楷体, 楷体-简')
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setFontFamily('楷体, 楷体-简')">设置楷体</button>
  <button class="demo-button" @click="editor?.commands.unsetFontFamily('楷体, 楷体-简')">取消楷体</button>
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
