---
title: blockquote 引用
---

# blockquote 引用

支持引用的渲染，提供插入引用的能力

## Commands 命令

##### getBlockquote()

获取光标所在的引用节点

- 类型

  ```ts
  getBlockquote(): KNode | null
  ```

- 详细信息

  该方法可以获取光标所在的唯一引用节点，如果光标不在一个引用节点内，则返回 `null`

- 示例

  ```ts
  const blockquoteNode = editor.commands.getBlockquote()
  ```

##### hasBlockquote()

判断光标范围内是否有引用节点

- 类型

  ```ts
  hasBlockquote(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内是否有引用节点，返回 `boolean` 值

- 示例

  ```ts
  const hasBlockquote = editor.commands.hasBlockquote()
  ```

##### allBlockquote()

光标范围内是否都是引用节点

- 类型

  ```ts
  allBlockquote(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内都是引用节点，返回 `boolean` 值

- 示例

  ```ts
  const allBlockquote = editor.commands.allBlockquote()
  ```

##### setBlockquote()

设置引用

- 类型

  ```ts
  setBlockquote(): Promise<void>
  ```

- 详细信息

  该方法会将光标所在的块节点都转为引用节点，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allBlockquote` 判断光标范围内都是引用节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.setBlockquote()
  ```

##### unsetBlockquote()

取消引用

- 类型

  ```ts
  unsetBlockquote(): Promise<void>
  ```

- 详细信息

  该方法会将光标所在的引用节点都转为段落节点，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allBlockquote` 判断光标范围内不都是引用节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetBlockquote()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setBlockquote()">设置引用</button>
  <button class="demo-button" @click="editor?.commands.unsetBlockquote()">取消引用</button>
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
