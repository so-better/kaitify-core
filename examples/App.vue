<template>
	<div style="padding: 20px">
		<div style="width: 100%; height: 400px; border: 1px solid #ddd; overflow: auto" id="editor"></div>
		<button @click="insert">插入一个段落</button>
	</div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AlexEditor, AlexElement } from '../src'
import { color } from 'dap-util'

const editor = ref<AlexEditor | null>(null)

onMounted(() => {
	editor.value = new AlexEditor('#editor', {
		value: '<p><span style="color:red;"><span>3</span></span></p>',
		allowPasteHtml: true,
		extraKeepTags: ['svg', 'circle'],
		customParseNode: el => {
			if (el.parsedom == 'span') {
				el.locked = true
			}
			return el
		}
	})
	editor.value.on('keydown', (val, e) => {
		console.log('keydown', val, e)
	})
	editor.value.formatElementStack()
	editor.value.domRender()
	editor.value.rangeRender()
})

const insert = () => {
	const el = AlexElement.create({
		type: 'block',
		parsedom: 'p',
		children: [
			{
				type: 'inline',
				parsedom: 'span',
				children: [
					{
						type: 'text',
						styles: {
							color: 'red'
						},
						textcontent: '红色字体'
					},
					{
						type: 'text',
						styles: {
							'font-weight': 'bold'
						},
						textcontent: '加粗字体'
					}
				]
			},
			{
				type: 'inline',
				parsedom: 'code',
				children: [
					{
						type: 'text',
						textcontent: 'var a = 2;'
					}
				]
			}
		]
	})
	console.log(el)
	editor.value!.insertElement(el)
	editor.value!.formatElementStack()
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
</style>
