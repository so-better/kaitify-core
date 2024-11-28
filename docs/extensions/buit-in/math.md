---
title: math 数学公式
---

# math 数学公式

支持 `Latex` 数学公式的渲染，提供插入数学公式的能力

## Commands 命令

##### getMath()

获取光标所在的数学公式节点

- 类型

  ```ts
  getMath(): KNode | null
  ```

- 详细信息

  该方法可以获取光标所在的唯一数学公式节点，如果光标不在一个数学公式节点内，则返回 `null`

- 示例

  ```ts
  const mathNode = editor.commands.getMath()
  ```

##### hasMath()

判断光标范围内是否有数学公式节点

- 类型

  ```ts
  hasMath(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内是否有数学公式节点，返回 `boolean` 值

- 示例

  ```ts
  const has = editor.commands.hasMath()
  ```

##### setMath()

插入数学公式

- 类型

  ```ts
  setMath(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示插入的数学公式 `Latex` 语法字符串，该方法会向编辑器内插入数学公式节点，在插入完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  需要注意：当光标范围内包含其他的数学公式节点时，无法插入新的数学公式节点

- 示例

  ```ts
  await editor.commands.setMath('\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}')
  ```

##### updateMath()

更新数学公式

- 类型

  ```ts
  updateMath(value: string): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `string`，表示更新的数学公式 `Latex` 语法字符串，该方法更新当前光标所指向的唯一数学公式节点的内容，在更新完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  需要注意：当光标不在同一个数学公式节点内时，此方法无效，因为获取不到唯一的数学公式节点

- 示例

  ```ts
  await editor.commands.updateMath('\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}')
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setMath('\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}')">插入数学公式</button>
  <button class="demo-button" @click="editor?.commands.updateMath('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}')">更新数学公式</button>
</div>
<div ref="editorRef" style="width:100%;height:100px;"></div>

<script lang="ts" setup>
  import { useData } from 'vitepress'
  import { onMounted, watch, ref, onBeforeUnmount} from "vue"
  import { Editor } from "../../../lib/kaitify-core.es.js"

  const { isDark, page } = useData()
  const editorRef = ref<HtmlElement | undefined>()
  const editor = ref<Editor | undefined>()
  
  onMounted(async ()=>{
    editor.value = await Editor.configure({
      el: editorRef.value,
      value: '',
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
