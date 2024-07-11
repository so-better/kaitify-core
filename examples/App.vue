<template>
	<div style="padding: 20px">
		<div id="editor"></div>
		<button @click="insert">插入一个段落</button>
	</div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AlexEditor, AlexElement } from '../src'

const editor = ref<AlexEditor | null>(null)

onMounted(() => {
	editor.value = new AlexEditor('#editor', {
		value: `<p>这是第一个段落，如果你只修改了第二个段落，该段落不会再进行格式化</p><p>这是第二个段落，如果你只修改了第一个段落，该段落不会再进行格式化</p>`,
		allowPasteHtml: true,
		extraKeepTags: ['svg', 'circle']
	})
	editor.value.domRender()
	editor.value.rangeRender()
})

const insert = () => {
	const el = AlexElement.create({
		type: 'block',
		parsedom: 'p',
		children: [
			{
				type: 'text',
				textcontent: '插入的段落'
			}
		]
	})
	editor.value!.insertElement(el)
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
</style>
