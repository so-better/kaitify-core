<template>
	<div style="padding: 20px">
		<div id="toolbar">
			<button @click="onDelete">删除</button>
			<button @click="onInsertText">插入文本</button>
			<button @click="onInsertNode">插入节点</button>
			<button @click="onInsertDom">直接插入dom</button>
		</div>
		<div id="editor" style="height: 400px;"</div>
	</div>
</template>
<script lang="ts" setup>
import Dap from 'dap-util'
import { onMounted, ref } from 'vue'
import { Editor, KNode,Extension } from '../src'

const editor = ref<Editor | null>(null)

const onDelete = () => {
	editor.value?.delete()
	editor.value?.updateView()
}

const onInsertText = () => {
	editor.value?.insertText('我叫凌凯')
	editor.value?.insertText('我叫KaiLing')
	editor.value?.updateView()
}

const onInsertNode = () => {
	const node = KNode.create({
		type: 'block',
		tag: 'p',
		children: [
			{
				type: 'text',
				textContent: '新插入的节点'
			}
		]
	})
	editor.value?.insertNode(node)
	editor.value?.updateView()
}

const onInsertDom = () => {
	const dom = Dap.element.string2dom('<p><span>333</span>444</p>') as HTMLElement
	editor.value!.$el!.appendChild(dom)
}

onMounted(async () => {
	editor.value = await Editor.configure({
		value: `<h1 style="color:red;">我是一个段落</h1><h2>我是一个段落</h2><h3>我是一个段落</h3><h4>我是一个段落</h4><h5>我是一个段落</h5><h6>我是一个段落</h6><p>我是一个段落</p><p><img src="https://preview.qiantucdn.com/meijing/25/83/17/60y58PICcfEViGqWCsKJ2_PIC2018.jpg!qt_h320_webp" alt="图片" /></p><p><video controls src="https://js.588ku.com/comp/video/images/video_banner_240920.mp4" alt="视频地址" /></p><table><tr><td>333<br>444</td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></table><p><br></p><ol><li>列表1</li><li>列表2</li></ol><p><br/></p>`,
		el: '#editor',
		allowPasteHtml: true,
		onSelectionUpdate: () => {
			//	console.log('selection更新')
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
