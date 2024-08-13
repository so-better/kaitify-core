<template>
	<div style="padding: 20px">
		<div tabindex="0" id="editor"></div>
		<div>
			<button @click="editor?.insertParagraph(), editor?.domRender(), editor?.rangeRender()">换行</button>
			<button @click="insert">插入元素</button>
			<button @click="editor?.insertText('hello，我是插入的文本'), editor?.domRender(), editor?.rangeRender()">插入文本</button>
			<button @click="editor?.delete(), editor?.domRender(), editor?.rangeRender()">删除</button>
			<button @click="editor?.collapseToEnd(), editor?.rangeRender()">光标移动到底部</button>
			<button @click="editor?.collapseToStart(), editor?.rangeRender()">光标移动到头部</button>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AlexEditor, AlexElement } from '../src'

const editor = ref<AlexEditor | null>(null)

onMounted(() => {
	editor.value = new AlexEditor('#editor', {
		disabled: true,
		value: `<p>33333</p><ol><li>444444</li></ol><p>4444</p>`,
		allowPasteHtml: true,
		extraKeepTags: ['svg', 'circle']
	})
	let t = 0
	editor.value.on('beforeRender', () => {
		t = Date.now()
	})
	editor.value.on('afterRender', () => {
		const t2 = Date.now()
		console.log(`渲染耗时：${t2 - t}ms`)
	})
	editor.value.domRender()
})

const insert = () => {
	editor.value!.insertElement(
		AlexElement.create({
			type: 'block',
			parsedom: 'h1',
			children: [
				{
					type: 'text',
					textContent: '当前系统时间：' + new Date().toLocaleDateString()
				}
			]
		})
	)
	editor.value!.domRender()
	editor.value!.rangeRender()
}
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

#editor {
	width: 100%;
	height: 400px;
	border: 1px solid #ddd;
	overflow: auto;
	padding: 10px;
	border-radius: 4px;
	margin-bottom: 20px;
	transition: all 200ms;

	&:focus {
		border-color: #708af3;
	}

	p,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: 0 0 15px 0;
	}

	ul,
	ol {
		margin: 0 0 15px 0;
	}

	li {
		margin-bottom: 10px;
	}

	li:last-child {
		margin-bottom: 0;
	}

	table {
		border: 1px solid #ccc;
		width: 100%;
		border-collapse: collapse;

		th,
		td {
			border: 1px solid #ccc;
			padding: 10px;
		}
	}
}

pre {
	background-color: #f7f8fa;
	padding: 10px;
}

button + button {
	margin-left: 10px;
}
</style>
