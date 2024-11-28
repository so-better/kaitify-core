---
title: image 图片
---

# image 图片

支持图片的渲染，提供插入图片的能力，并且支持拖拽图片的右侧边缘可修改大小

## Commands 命令

##### getImage()

获取光标所在的图片节点

- 类型

  ```ts
  getImage(): KNode | null
  ```

- 详细信息

  该方法可以获取光标所在的唯一图片节点，如果光标不在一个图片节点内，则返回 `null`

- 示例

  ```ts
  const imageNode = editor.commands.getImage()
  ```

##### hasImage()

判断光标范围内是否有图片节点

- 类型

  ```ts
  hasImage(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内是否有图片节点，返回 `boolean` 值

- 示例

  ```ts
  const has = editor.commands.hasImage()
  ```

##### setImage()

插入图片

- 类型

  ```ts
  setImage(options: SetImageOptionType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `SetImageOptionType`，包含 3 个属性：

  - src <Badge type="danger" text="string" />：图片的链接地址
  - alt <Badge type="danger" text="string" />：图片加载失败显示的值
  - width <Badge type="danger" text="string" />：图片的初始宽度

  该方法会向编辑器内插入图片节点，在插入完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.setImage({
    src: 'https://xxxxx.png',
    alt: '图片加载失败'
  })
  ```

##### updateAttachment()

更新附件信息

- 类型

  ```ts
  updateImage(options: UpdateImageOptionType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `UpdateImageOptionType`，包含以下 3 个属性：

  - src <Badge type="danger" text="string" />：图片的链接地址，可选，不设置则不更新此属性
  - alt <Badge type="danger" text="string" />：图片加载失败显示的值，不设置或者设置为空值则移除此属性

  该方法可以更新图片信息，并且在更新完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.updateImage({
    src: 'www.baidu.com'
  })
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setImage({ src:'https://www.so-better.cn/static/attachments/QM6cgjq8GPzY1_c2Ol1GIS68.jpg',alt:'一张风景图',width:'200px'})">插入图片</button>
  <button class="demo-button" @click="updateImage">更新图片</button>
</div>
<div ref="editorRef" style="width:100%;height:200px;"></div>

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

  const updateImage = ()=>{
    if(!editor.value?.commands.getImage()){
      alert('请点击图片')
      return
    }
    editor.value?.commands.updateImage({ src:'https://www.so-better.cn/static/attachments/h9PNcA0uJkWOZx971URJzLvn.jpg' })
  }

  watch(()=>isDark.value,newVal=>{
    if(editor.value){
        editor.value.setDark(isDark.value)
    }
  })
</script>
