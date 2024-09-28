<template>
	<div style="padding: 20px">
		<div id="toolbar">
			<button @click="onClick1">插入图片</button>
      <button @click="onClick2">删除图片</button>
		</div>
		<div id="editor" style="height: 400px;"</div>
	</div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Editor } from '../src'

const editor = ref<Editor | null>(null)

const onClick1 = () => {
  editor.value?.commands.setVideo!({src:'https://js.588ku.com/comp/video/images/video_banner_240920.mp4',width:'30%'})
}

const onClick2 = () => {
    editor.value!.commands.allCode!() ? editor.value!.commands.unsetCode!():editor.value!.commands.setCode!()
}

onMounted(async () => {
	editor.value = await Editor.configure({
		value: `<p><code>第一个文本<span data-k>第二个文本<span style="color:red;">红色文本</span>第四个文本</span>iling</code></p><p><font face="楷体-简">这是楷体</font><code>kai <img src="#"/>ling</code><b><span>33<b>Jiacu</b>3</span><span style="color:red;">红色加粗</span></b></p><pre>const a = b</pre></pre><h1 style="color:red;">我是一个段落</h1><h2><span contenteditable="false">我是一个不可编辑的文本</span></h2><h3 style="text-align:right;">我是一个段落</h3><h4>我是一个段落</h4><h5 contenteditable="false">我是一个<span style="color:red;">333</span>不可编辑的段落</h5><h6>我是一个段落</h6><p>我是一个段落</p><p><img src="https://preview.qiantucdn.com/meijing/25/83/17/60y58PICcfEViGqWCsKJ2_PIC2018.jpg!qt_h320_webp" alt="图片" /></p><p><video autoplay loop muted src="https://js.588ku.com/comp/video/images/video_banner_240920.mp4" alt="视频地址" /></p><table><tr><td>333<br>444</td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></table><p><br></p><ol><li>列表1</li><li>列表2</li></ol><p><br/></p>`,
		el: '#editor',
		allowPasteHtml: true,
    onSelectionUpdate(sel){
     console.log(sel);
     
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
