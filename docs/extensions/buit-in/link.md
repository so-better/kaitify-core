---
title: link 链接
---

# link 链接

支持链接的渲染，提供插入链接的能力

## Commands 命令

##### getLink()

获取光标所在的链接节点

- 类型

  ```ts
  getLink(): KNode | null
  ```

- 详细信息

  该方法可以获取光标所在的唯一链接节点，如果光标不在一个链接节点内，则返回 `null`

- 示例

  ```ts
  const linkNode = editor.commands.getLink()
  ```

##### hasLink()

判断光标范围内是否有链接节点

- 类型

  ```ts
  hasLink(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内是否有链接节点，返回 `boolean` 值

- 示例

  ```ts
  const has = editor.commands.hasLink()
  ```

##### setLink()

插入链接

- 类型

  ```ts
  setLink(options: SetLinkOptionType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `SetLinkOptionType`，包含 3 个属性：

  - href <Badge type="danger" text="string" />：链接的地址
  - text <Badge type="danger" text="string" />：链接的文本，如果光标选择了一段内容，则使用光标选择的内容
  - newOpen <Badge type="danger" text="boolean" />：链接是否新窗口打开

  该方法会向编辑器内插入链接节点，在插入完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  需要注意：当光标范围内包含其他的链接节点时，无法插入新的链接节点

- 示例

  ```ts
  await editor.commands.setLink({
    href: 'https://www.baidu.com',
    text: '百度一下，你就知道'
  })
  ```

##### unsetLink()

取消链接

- 类型

  ```ts
  unsetLink(): Promise<void>
  ```

- 详细信息

  该方法会取消当前光标所在的唯一链接，在取消完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.setLink({
    href: 'https://www.baidu.com',
    text: '百度一下，你就知道'
  })
  ```

##### updateLink()

更新链接信息

- 类型

  ```ts
  updateLink(options: UpdateLinkOptionType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `UpdateLinkOptionType`，包含以下 2 个属性：

  - href <Badge type="danger" text="string" />：链接的地址，可选，不设置则不更新此属性
  - newOpen <Badge type="danger" text="string" />：链接是否新窗口打开，可选，不设置则不更新此属性

  该方法可以自由地更新链接的地址、文本等，并且在更新完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  需要注意：当光标不在同一个链接节点内时，此方法无效，因为获取不到唯一的链接节点

- 示例

  ```ts
  await editor.commands.updateLink({
    href: 'www.baidu.com'
  })
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setLink({ href:'https://www.baidu.com',text:'百度一下，你就知道',newOpen:true})">插入链接</button>
  <button class="demo-button" @click="editor?.commands.unsetLink()">取消链接</button>
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
