---
title: hading 标题
---

# hading 标题

支持标题的渲染，提供插入标题的能力

## Commands 命令

##### getHeading()

获取光标所在的指定等级的标题节点

- 类型

  ```ts
  getHeading(level: HeadingLevelType): KNode | null
  ```

- 详细信息

  提供一个入参，类型为 `HeadingLevelType`，取值范围是 `0,1,2,3,4,5,6`，表示标题的等级，0 代表普通段落，从 1-6 代表 h1-h6，该方法可以获取光标所在的唯一指定的标题节点，如果光标不在一个该指定节点内，则返回 `null`

- 示例

  ```ts
  //获取h1，即一级标题
  const headingNode = editor.commands.getHeading(1)
  ```

##### hasHeading()

判断光标范围内是否有指定等级的标题节点

- 类型

  ```ts
  hasHeading(level: HeadingLevelType): boolean
  ```

- 详细信息

  提供一个入参，类型为 `HeadingLevelType`，取值范围是 `0,1,2,3,4,5,6`，表示标题的等级，0 代表普通段落，从 1-6 代表 h1-h6，该方法用来判断光标范围内是否有指定等级的标题节点，返回 `boolean` 值

- 示例

  ```ts
  //判断光标范围内是否有h1，即一级标题
  const hasHeading = editor.commands.hasHeading(1)
  ```

##### allHeading()

光标范围内是否都是指定等级的标题节点

- 类型

  ```ts
  allHeading(level: HeadingLevelType): boolean
  ```

- 详细信息

  提供一个入参，类型为 `HeadingLevelType`，取值范围是 `0,1,2,3,4,5,6`，表示标题的等级，0 代表普通段落，从 1-6 代表 h1-h6，该方法用来判断光标范围内都是指定等级的标题节点，返回 `boolean` 值

- 示例

  ```ts
  //判断光标范围内是否都是h1，即一级标题
  const allHeading = editor.commands.allHeading(1)
  ```

##### setHeading()

设置标题

- 类型

  ```ts
  setHeading(level: HeadingLevelType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `HeadingLevelType`，取值范围是 `0,1,2,3,4,5,6`，表示标题的等级，0 代表普通段落，从 1-6 代表 h1-h6，该方法会将光标所在的块节点都转为指定等级的标题节点，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allHeading` 判断光标范围内都是该等级的标题节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.setHeading(1)
  ```

##### unsetHeading()

取消标题

- 类型

  ```ts
  unsetHeading(): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `HeadingLevelType`，取值范围是 `0,1,2,3,4,5,6`，表示标题的等级，0 代表普通段落，从 1-6 代表 h1-h6，该方法会将光标所在的指定标题节点都转为段落节点，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allHeading` 判断光标范围内不都是该等级的标题节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetHeading()
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setHeading(1)">设置H1</button>
  <button class="demo-button" @click="editor?.commands.unsetHeading(1)">取消H1</button>
</div>
<div ref="editorRef" style="width:100%;height:200px;"></div>

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
