---
title: superscript 上标
---

# superscript 上标

文本上标

## Commands 命令

##### isSuperscript()

判断光标所在文本是否上标

- 类型

  ```ts
  isSuperscript(): boolean
  ```

- 详细信息

该方法用来判断光标所在文本是否上标，返回 `boolean` 值

- 示例

  ```ts
  const isSuperscript = editor.commands.isSuperscript()
  ```

##### setSuperscript()

光标范围内的文本设置上标

- 类型

  ```ts
  setSuperscript(): Promise<void>
  ```

- 详细信息

  该方法会将光标范围内的文本都设置上标，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isSuperscript` 判断光标所在文本都是已设置上标，则不会继续执行

- 示例

  ```ts
  await editor.commands.setSuperscript()
  ```

##### unsetSuperscript()

光标范围内的文本取消上标

- 类型

  ```ts
  unsetSuperscript(): Promise<void>
  ```

- 详细信息

  该方法会对光标范围内的文本取消上标，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `isSuperscript` 判断光标所在文本不全都是上标，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetSuperscript()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setSuperscript()">设置上标</button>
  <button class="demo-button" @click="editor?.commands.unsetSuperscript()">取消上标</button>
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
