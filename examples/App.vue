<template>
	<div style="padding: 20px">
		<div id="toolbar">
			<button @click="onDelete">删除</button>
			<button @click="onInsertText">插入文本</button>
			<button @click="onInsertNode">插入节点</button>
			<button @click="onInsertDom">直接插入dom</button>
		</div>
		<div id="editor"></div>
	</div>
</template>
<script lang="ts" setup>
import Dap from 'dap-util'
import { onMounted, ref } from 'vue'
import { Editor, KNode } from '../src'

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
		value: `<p data-kaitify-node="ss" style="line-height:20px;">天苍苍，水茫茫</p><ol><li>hello</li><li>我的名字是凌凯</li></ol><p style="line-height:20px;">一行白鹭上青天</p><table><tr><td>333<br>444</td><td><br></td><td><br></td></tr><tr><td style="background:red;"><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></table><p style="line-height:20px;">一行白鹭上青天</p>`,
		el: '#editor',
		allowPasteHtml: true,
		allowPaste: true,
		autofocus: true,
		useDefaultCSS: true,
		onSelectionUpdate: () => {
			//	console.log('selection更新')
		}
	})
	console.log(editor.value.stackNodes)
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
