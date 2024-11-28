---
title: list 列表
---

# list 列表

支持有序列表和无序列表的渲染，提供插入有序列表和无序列表的能力

## Commands 命令

##### getList()

获取光标所在的有序列表或者无序列表

- 类型

  ```ts
  getList(options: ListOptionsType): KNode | null
  ```

- 详细信息

  提供一个入参，类型为 `ListOptionsType`，包含 2 个属性：

  - ordered <Badge type="danger" text="boolean" />：是否有序列表
  - listType <Badge type="danger" text="OrderedListType | UnorderListType" />：列表序标类型，如果是有序列表，取值范围是 `decimal` `lower-alpha` `upper-alpha` `lower-roman` `upper-roman` `lower-greek` `cjk-ideographic`，如果是无序列表，可取值是 `disc` `circle` `square`

  该方法可以获取光标所在的唯一指定的列表节点，如果光标不在一个该指定节点内，则返回 `null`

- 示例

  ```ts
  //获取序标值为lower-alpha的有序列表
  const listNode = editor.commands.getList({
    ordered: true,
    listType: 'lower-alpha'
  })
  ```

##### hasList()

判断光标范围内是否有指定的列表

- 类型

  ```ts
  hasList(options: ListOptionsType): boolean
  ```

- 详细信息

  提供一个入参，类型为 `ListOptionsType`，包含 2 个属性：

  - ordered <Badge type="danger" text="boolean" />：是否有序列表
  - listType <Badge type="danger" text="OrderedListType | UnorderListType" />：列表序标类型，如果是有序列表，取值范围是 `decimal` `lower-alpha` `upper-alpha` `lower-roman` `upper-roman` `lower-greek` `cjk-ideographic`，如果是无序列表，可取值是 `disc` `circle` `square`

  该方法用来判断光标范围内是否有指定的列表节点，返回 `boolean` 值

- 示例

  ```ts
  //判断是否有序标值为lower-alpha的有序列表
  const hasList = editor.commands.hasList({
    ordered: true,
    listType: 'lower-alpha'
  })
  ```

##### allList()

光标范围内是否都是指定的列表节点

- 类型

  ```ts
  allList(options: ListOptionsType): boolean
  ```

- 详细信息

  提供一个入参，类型为 `ListOptionsType`，包含 2 个属性：

  - ordered <Badge type="danger" text="boolean" />：是否有序列表
  - listType <Badge type="danger" text="OrderedListType | UnorderListType" />：列表序标类型，如果是有序列表，取值范围是 `decimal` `lower-alpha` `upper-alpha` `lower-roman` `upper-roman` `lower-greek` `cjk-ideographic`，如果是无序列表，可取值是 `disc` `circle` `square`

  该方法用来判断光标范围内都是指定的列表节点，返回 `boolean` 值

- 示例

  ```ts
  //判断是否都是序标值为lower-alpha的有序列表
  const allList = editor.commands.allList({
    ordered: true,
    listType: 'lower-alpha'
  })
  ```

##### setList()

设置列表

- 类型

  ```ts
  setList(options: ListOptionsType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `ListOptionsType`，包含 2 个属性：

  - ordered <Badge type="danger" text="boolean" />：是否有序列表
  - listType <Badge type="danger" text="OrderedListType | UnorderListType" />：列表序标类型，如果是有序列表，取值范围是 `decimal` `lower-alpha` `upper-alpha` `lower-roman` `upper-roman` `lower-greek` `cjk-ideographic`，如果是无序列表，可取值是 `disc` `circle` `square`

  该方法会将光标所在的块节点都转为指定的列表节点，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allList` 判断光标范围内都是同样的列表节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.setList({
    ordered: true,
    listType: 'lower-alpha'
  })
  ```

##### unsetList()

取消列表

- 类型

  ```ts
  unsetList(options: ListOptionsType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `ListOptionsType`，包含 2 个属性：

  - ordered <Badge type="danger" text="boolean" />：是否有序列表
  - listType <Badge type="danger" text="OrderedListType | UnorderListType" />：列表序标类型，如果是有序列表，取值范围是 `decimal` `lower-alpha` `upper-alpha` `lower-roman` `upper-roman` `lower-greek` `cjk-ideographic`，如果是无序列表，可取值是 `disc` `circle` `square`

  该方法会将光标所在的指定的列表都转为段落，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allList` 判断光标范围内不全是该类型的列表节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetList({
    ordered: true,
    listType: 'lower-alpha'
  })
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setList({ ordered: true })">插入有序列表</button>
  <button class="demo-button" @click="editor?.commands.setList({ ordered: false })">插入无序列表</button>
  <button class="demo-button" @click="editor?.commands.unsetList({ ordered: true })">取消有序列表</button>
  <button class="demo-button" @click="editor?.commands.unsetList({ ordered: false })">取消无序列表</button>
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
