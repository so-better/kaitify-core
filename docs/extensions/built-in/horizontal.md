---
title: horizontal 水平线
---

# horizontal 水平线

支持水平线的渲染，提供插入水平线的能力

## Commands 命令

##### getHorizontal()

获取光标所在的水平线节点

- 类型

  ```ts
  getHorizontal(): KNode | null
  ```

- 详细信息

  仅当光标恰好选中了一个水平线节点（起点和终点分别位于该节点的两侧）时，返回该节点，否则返回 `null`

- 示例

  ```ts
  const node = editor.commands.getHorizontal()
  ```

##### hasHorizontal()

判断光标范围内是否包含水平线节点

- 类型

  ```ts
  hasHorizontal(): boolean
  ```

- 详细信息

  返回一个布尔值，表示当前光标范围内是否存在被完整包含的水平线节点

- 示例

  ```ts
  const flag = editor.commands.hasHorizontal()
  ```

##### setHorizontal()

在光标内插入水平线

- 类型

  ```ts
  setHorizontal(): Promise<void>
  ```

- 详细信息

  该方法会向光标所在处插入一个水平线，插入完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.setHorizontal()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setHorizontal()">插入水平线</button>
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
