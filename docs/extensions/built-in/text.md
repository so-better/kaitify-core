---
title: text 文本
---

# text 文本

支持文本的渲染，包括设置样式和设置标记

## Commands 命令

##### isTextStyle()

判断光标所在文本是否具有某个样式

- 类型

  ```ts
  isTextStyle(styleName: string, styleValue?: string | number): boolean
  ```

- 详细信息

  第一个入参表示样式名称，第二个入参表示样式的值，该方法用来判断光标所在文本是否具有某个样式，且样式值是否符合，返回 `boolean` 值

  如果第二个参数不设置，则会判断光标所在的文本是否具有指定的样式，而不关心这个样式的值是什么

- 示例

  ```ts
  const isTextStyle = editor.commands.isTextStyle('fontSize', '16px')
  ```

##### isTextMark()

判断光标所在文本是否具有某个标记

- 类型

  ```ts
  isTextMark(markName: string, markValue?: string | number): boolean
  ```

- 详细信息

  第一个入参表示标记名称，第二个入参表示标记的值，该方法用来判断光标所在文本是否具有某个标记，且标记值是否符合，返回 `boolean` 值

  如果第二个参数不设置，则会判断光标所在的文本是否具有指定的标记，而不关心这个标记的值是什么

- 示例

  ```ts
  const isTextMark = editor.commands.isTextMark('data-span', '1')
  ```

##### setTextStyle()

设置光标范围内的文本的样式

- 类型

  ```ts
  setTextStyle(styles: KNodeStylesType, updateView?: boolean): Promise<void>
  ```

- 详细信息

  第一个入参表示设置的样式集合，第二个参数表示是否更新视图，该方法会对光标范围内的文本设置样式

  如果第二个参数为 `false`，则在设置完毕后不会更新视图和光标的渲染，需要你主动 `updateView`，如果为 `true` 则会不需要主动 `updateView`，该参数默认为 `true`

- 示例

  ```ts
  await editor.commands.setTextStyle({
    fontSize: '20px'
  })
  ```

##### setTextMark()

设置光标范围内的文本的标记

- 类型

  ```ts
  setTextMark(marks: KNodeMarksType, updateView?: boolean): Promise<void>
  ```

- 详细信息

  第一个入参表示设置的标记集合，第二个参数表示是否更新视图，该方法会对光标范围内的文本设置标记

  如果第二个参数为 `false`，则在设置完毕后不会更新视图和光标的渲染，需要你主动 `updateView`，如果为 `true` 则会不需要主动 `updateView`，该参数默认为 `true`

- 示例

  ```ts
  await editor.commands.setTextMark({
    'data-span': '1'
  })
  ```

##### removeTextStyle()

取消光标范围内的文本的样式

- 类型

  ```ts
  removeTextStyle(styleNames?: string[], updateView?: boolean): Promise<void>
  ```

- 详细信息

  第一个入参表示要取消的样式名称数组，第二个参数表示是否更新视图，该方法会对光标范围内的文本取消指定的样式

  如果第二个参数为 `false`，则在设置完毕后不会更新视图和光标的渲染，需要你主动 `updateView`，如果为 `true` 则会不需要主动 `updateView`，该参数默认为 `true`

- 示例

  ```ts
  await editor.commands.removeTextStyle(['fontSize'])
  ```

##### removeTextMark()

取消光标范围内的文本的标记

- 类型

  ```ts
  removeTextMark(markNames?: string[], updateView?: boolean): Promise<void>
  ```

- 详细信息

  第一个入参表示要取消的标记名称数组，第二个参数表示是否更新视图，该方法会对光标范围内的文本取消指定的标记

  如果第二个参数为 `false`，则在设置完毕后不会更新视图和光标的渲染，需要你主动 `updateView`，如果为 `true` 则会不需要主动 `updateView`，该参数默认为 `true`

- 示例

  ```ts
  await editor.commands.removeTextMark(['data-span'])
  ```

##### clearFormat()

清除格式

- 类型

  ```ts
  clearFormat(): Promise<void>
  ```

- 详细信息

该方法会将光标范围内的文本的所有样式和标记都清除，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.clearFormat()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setTextStyle({
    background:'#000',
    color:'#fff',
    padding:'10px',
    lineHeight:3
  })">设置样式</button>
  <button class="demo-button" @click="editor?.commands.removeTextStyle(['background','color','padding','lineHeight'])">取消样式</button>
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
