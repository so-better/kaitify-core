---
title: align 对齐方式
---

# align 对齐方式

设置光标所在的块节点的对齐方式

## Commands 命令

##### isAlign()

光标所在的块节点是否都是符合的对齐方式

- 类型

  ```ts
  isAlign(value: AlignValueType): boolean
  ```

- 详细信息

  提供一个入参，类型为 AlignValueType，可取值为 `left` `right` `center` `justify`，用以判断光标所在的块节点是否都符合指定的对齐方式，返回 `boolean` 值

- 示例

  ```ts
  const isAlignCenter = editor.commands.isAlign('center')
  ```

##### setAlign()

设置光标所在的块节点的对齐方式

- 类型

  ```ts
  setAlign(value: AlignValueType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 AlignValueType，可取值为 `left` `right` `center` `justify`，该方法会设置光标所在的块节点的对齐方式，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.setAlign('center')
  ```

##### unsetAlign()

取消设置光标所在的块节点的指定对齐方式

- 类型

  ```ts
  unsetAlign(value: AlignValueType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 AlignValueType，可取值为 `left` `right` `center` `justify`，该方法会取消光标所在的块节点的指定对齐方式，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.unsetAlign('center')
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setAlign('left')">左对齐</button>
  <button class="demo-button" @click="editor?.commands.setAlign('center')">居中对齐</button>
  <button class="demo-button" @click="editor?.commands.setAlign('right')">右对齐</button>
  <button class="demo-button" @click="editor?.commands.setAlign('justify')">两端对齐</button>
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
