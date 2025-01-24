---
title: attachment 附件
---

# attachment 附件

支持附件的渲染，提供插入附件的能力，在非可编辑状态下点击附件可以直接下载附件

## Commands 命令

##### getAttachment()

获取光标所在的附件节点

- 类型

  ```ts
  getAttachment(): KNode | null
  ```

- 详细信息

  该方法可以获取光标所在的唯一附件节点，如果光标不在一个附件节点内，则返回 `null`

- 示例

  ```ts
  const attachmentNode = editor.commands.getAttachment()
  ```

##### hasAttachment()

判断光标范围内是否有附件节点

- 类型

  ```ts
  hasAttachment(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内是否有附件节点，返回 `boolean` 值

- 示例

  ```ts
  const has = editor.commands.hasAttachment()
  ```

##### setAttachment()

插入附件

- 类型

  ```ts
  setAttachment(options: SetAttachmentOptionType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `SetAttachmentOptionType`，包含 3 个属性：

  - url <Badge type="danger" text="string" />：附件的下载地址
  - text <Badge type="danger" text="string" />：附件的显示名称
  - icon <Badge type="danger" text="string" />：可选，自定义附件图标，这里填写图片地址

  该方法会向编辑器内插入附件节点，在插入完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  需要注意：当光标范围内包含其他的附件节点时，无法插入新的附件节点

- 示例

  ```ts
  await editor.commands.setAttachment({
    url: 'https://xxxxx.png',
    text: '图片'
  })
  ```

##### updateAttachment()

更新附件信息

- 类型

  ```ts
  updateAttachment(options: UpdateAttachmentOptionType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `UpdateAttachmentOptionType`，包含以下 3 个属性：

  - url <Badge type="danger" text="string" />：附件的下载地址，可选，不设置则不更新此属性
  - text <Badge type="danger" text="string" />：附件的显示名称，可选，不设置则不更新此属性
  - icon <Badge type="danger" text="string" />：自定义附件图标，这里填写图片地址，可选，不设置则不更新此属性

  该方法可以自由地更新附件的地址、名称或者图标，并且在更新完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  需要注意：当光标不在同一个附件节点内时，此方法无效，因为获取不到唯一的附件节点

- 示例

  ```ts
  await editor.commands.updateAttachment({
    url: 'www.baidu.com'
  })
  ```

##### getAttachmentInfo()

获取附件的信息

- 类型

  ```ts
  getAttachmentInfo():
    url: string;
    text: string;
    icon: string;
  } | null
  ```

- 详细信息

  当光标不在同一个附件节点内时，返回 `null`，如果光标在同一个附件节点内，返回它的 `url` `text` `icon` 属性集合

## 扩展配置

`attachment` 扩展支持进行配置

```ts
import { AttachmentExtension } from '@kaitify/core'

const editor = await Editor.configure({
  el: '#editor',
  value: '',
  placeholder: '请输入正文...',
  extensions: [AttachmentExtension({ icon: 'xxx.png' })]
})
```

配置项：

##### icon <Badge type="danger" text="string" />

自定义默认的附件图标，当我们使用 setAttachment 方法插入附件时，如果没有设置附件图标，那么会使用该配置的图标，此值若未配置，再用默认的图标

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setAttachment({ url:'https://www.so-better.cn/docs/kaitify-core/logo.png',text:'LOGO'})" :disabled="!editable">插入附件</button>
  <button class="demo-button" @click="updateAttachment" :disabled="!editable">更新附件信息</button>
  <button class="demo-button" @click="getInfo" :disabled="!editable">获取附件信息</button>
  <button class="demo-button" @click="editable=!editable">{{ editable ? '禁用编辑器':'启用编辑器' }}</button>
</div>
<div ref="editorRef" style="width:100%;height:100px;"></div>

<script lang="ts" setup>
  import { useData } from 'vitepress'
  import { onMounted, watch, ref, onBeforeUnmount} from "vue"
  import { Editor } from "../../../lib/kaitify-core.es.js"

  const { isDark, page } = useData()
  const editorRef = ref<HtmlElement | undefined>()
  const editor = ref<Editor | undefined>()
  const editable = ref<boolean>(true)
  
  onMounted(async ()=>{
    editor.value = await Editor.configure({
      el: editorRef.value,
      value: '我是一段文本，我是一段文本，我是一段文本，我是一段文本，我是一段文本，我是一段文本，我是一段文本，我是一段文本',
      dark: isDark.value,
      editable:editable.value,
      placeholder:'请输入正文...'
    })
  })

  onBeforeUnmount(()=>{
    editor.value?.destroy()
  })

  const updateAttachment = ()=>{
    if(!editor.value?.commands.getAttachment()){
      alert('请点击附件')
      return
    }
    editor.value?.commands.updateAttachment({ text:'这是一个logo图片' })
  }

  const getInfo = ()=>{
    if(!editor.value?.commands.getAttachment()){
      alert('请点击附件')
      return
    }
    alert(JSON.stringify(editor.value?.commands.getAttachmentInfo()))
  }

  watch(()=>isDark.value,newVal=>{
    if(editor.value){
        editor.value.setDark(isDark.value)
    }
  })

  watch(()=>editable.value,newVal=>{
    editor.value.setEditable(newVal)
  })
</script>
