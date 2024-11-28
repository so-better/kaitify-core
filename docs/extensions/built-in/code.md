---
title: code 行内代码
---

# code 行内代码

支持行内代码的渲染，提供插入行内代码的能力

## Commands 命令

##### getCode()

获取光标所在的行内代码

- 类型

  ```ts
  getCode(): KNode | null
  ```

- 详细信息

  该方法可以获取光标所在的唯一行内代码节点，如果光标不在一个行内代码节点内，则返回 `null`

- 示例

  ```ts
  const codeNode = editor.commands.getCode()
  ```

##### hasCode()

判断光标范围内是否有行内代码节点

- 类型

  ```ts
  hasCode(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内是否有行内代码节点，返回 `boolean` 值

- 示例

  ```ts
  const hasCode = editor.commands.hasCode()
  ```

##### allCode()

光标范围内是否都是行内代码节点

- 类型

  ```ts
  allCode(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内都是行内代码节点，返回 `boolean` 值

- 示例

  ```ts
  const allCode = editor.commands.allCode()
  ```

##### setCode()

设置行内代码

- 类型

  ```ts
  setCode(): Promise<void>
  ```

- 详细信息

  该方法会在光标所在范围内设置行内代码，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allCode` 判断光标范围内都是行内代码节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.setCode()
  ```

##### unsetCode()

取消行内代码

- 类型

  ```ts
  unsetCode(): Promise<void>
  ```

- 详细信息

  该方法会将光标所在范围内的行内代码全部取消，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allCode` 判断光标范围内不都是行内代码节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetCode()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setCode()">设置行内代码</button>
  <button class="demo-button" @click="editor?.commands.unsetCode()">取消行内代码</button>
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
