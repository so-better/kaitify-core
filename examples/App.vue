<template>
	<div style="padding: 20px">
		<div id="toolbar">
			<button @click="onClick1">设置样式</button>
      <button @click="onClick2">移除样式</button>
		</div>
		<div id="editor" style="height: 400px;"</div>
	</div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Editor, setTextStyle,removeTextStyle,isTextStyle } from '../src'

const editor = ref<Editor | null>(null)

const onClick1 = () => {
	setTextStyle(editor.value!,{
    'color':'red'
  })
	editor.value?.updateView()
}

const onClick2 = () => {
	removeTextStyle(editor.value!,['color'])
	editor.value?.updateView()
}

onMounted(async () => {
	editor.value = await Editor.configure({
		value: `<h1 style="color:red;">我是一个段落</h1><h2>我是一个段落</h2><h3>我是一个段落</h3><h4>我是一个段落</h4><h5>我是一个段落</h5><h6>我是一个段落</h6><p>我是一个段落</p><p><img src="https://preview.qiantucdn.com/meijing/25/83/17/60y58PICcfEViGqWCsKJ2_PIC2018.jpg!qt_h320_webp" alt="图片" /></p><p><video controls src="https://js.588ku.com/comp/video/images/video_banner_240920.mp4" alt="视频地址" /></p><table><tr><td>333<br>444</td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></table><p><br></p><ol><li>列表1</li><li>列表2</li></ol><p><br/></p>`,
		el: '#editor',
		allowPasteHtml: true,
    onSelectionUpdate(){
      console.log(isTextStyle(this,'color'));
    }
	})
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

	button + button {
		margin-left: 10px;
	}
}

button + button {
	margin-left: 10px;
}
</style>
