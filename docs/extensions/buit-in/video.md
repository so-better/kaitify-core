---
title: video 视频
---

# video 视频

支持视频的渲染，提供插入视频的能力，并且支持拖拽视频的右侧边缘可修改大小

## Commands 命令

##### getVideo()

获取光标所在的视频节点

- 类型

  ```ts
  getVideo(): KNode | null
  ```

- 详细信息

  该方法可以获取光标所在的唯一视频节点，如果光标不在一个视频节点内，则返回 `null`

- 示例

  ```ts
  const videoNode = editor.commands.getVideo()
  ```

##### hasVideo()

判断光标范围内是否有视频节点

- 类型

  ```ts
  hasVideo(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内是否有视频节点，返回 `boolean` 值

- 示例

  ```ts
  const hasVideo = editor.commands.hasVideo()
  ```

##### setVideo()

插入视频

- 类型

  ```ts
  setVideo(options: SetVideoOptionType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `SetVideoOptionType`，包含 3 个属性：

  - src <Badge type="danger" text="string" />：视频的链接地址
  - autoplay <Badge type="danger" text="boolean" />：视频加载完成是否自动播放
  - width <Badge type="danger" text="string" />：视频的初始宽度

  该方法会向编辑器内插入视频节点，在插入完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.setVideo({
    src: 'https://xxxxx.mp4',
    autoplay: true
  })
  ```

##### updateVideo()

更新视频信息

- 类型

  ```ts
  updateVideo(options: UpdateVideoOptionType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `UpdateVideoOptionType`，包含以下 3 个属性：

  - controls <Badge type="danger" text="boolean" />：视频是否显示控制器，不设置则不更新此属性
  - muted <Badge type="danger" text="boolean" />：视频是否静音，不设置则不更新此属性
  - loop <Badge type="danger" text="boolean" />：视频是否循环，不设置则不更新此属性

  该方法可以更新视频相关的设定，并且在更新完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

- 示例

  ```ts
  await editor.commands.updateVideo({
    loop: true
  })
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setVideo({ src:'https://bpic.588ku.com/video_listen/588ku_preview/24/11/19/09/17/09/video673be7151b5b9.mp4',width:'200px',autoplay:true})">插入视频</button>
  <button class="demo-button" @click="updateVideo">更新视频</button>
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

  const updateVideo = ()=>{
    if(!editor.value?.commands.getVideo()){
      alert('请点击视频')
      return
    }
    editor.value?.commands.updateVideo({ controls:true,loop:true,muted:false })
  }

  watch(()=>isDark.value,newVal=>{
    if(editor.value){
        editor.value.setDark(isDark.value)
    }
  })
</script>
