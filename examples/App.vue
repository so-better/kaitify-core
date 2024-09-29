<template>
  <div style="padding: 20px">
    <div id="toolbar">
      <sup>333</sup>
      <button @click="onClick1">插入图片</button>
      <button @click="onClick2">删除图片</button>
    </div>
    <div id="editor" style="height: 400px;" </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Editor, KNode } from '../src'

const editor = ref<Editor | null>(null)

const onClick1 = () => {
  editor.value!.commands.isColor!('#f30') ? editor.value!.commands.unsetColor!('#f30') : editor.value!.commands.setColor!('#f30')
}

const onClick2 = () => {
  editor.value!.commands.clearFormat!() 
}

onMounted(async () => {
  editor.value = await Editor.configure({
    value: `<h3 style="text-align:right;">我是一个段落</h3><h4><span style="color:rgb(255, 51, 0);">我是一个段落</span></h4><h5 contenteditable="false">我是一个<span style="color:red;">333</span>不可编辑的段落</h5><h6>我是一个段落</h6><p>我是一个段落<code>Kaitify Editor</code></p><p><img src="https://preview.qiantucdn.com/meijing/25/83/17/60y58PICcfEViGqWCsKJ2_PIC2018.jpg!qt_h320_webp" alt="图片" /></p><p><video autoplay loop muted src="https://js.588ku.com/comp/video/images/video_banner_240920.mp4" controls alt="视频地址" /></p><table><tr><td>333<br>444</td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></table><p><br></p><ol><li>列表1</li><li>列表2</li></ol><p><br/></p>`,
    el: '#editor',
    editable: true,
    allowPasteHtml: true,
    onSelectionUpdate(sel) { }
  })
  console.log(editor.value!.stackNodes);

})
</script>
<style lang="less">
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  outline: none;
}

.mvi-text-bold {
  font-size: 40px;
}

#app {
  height: 100%;
  overflow-y: auto;
}

#toolbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 20px;

  button+button {
    margin-left: 10px;
  }
}

button+button {
  margin-left: 10px;
}
</style>
