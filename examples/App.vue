<template>
	<div style="padding: 20px">
		<div style="width: 100%; height: 400px; border: 1px solid #ddd" id="editor"></div>
	</div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AlexEditor, AlexElement } from '../src'

onMounted(() => {
	const editor = new AlexEditor('#editor', {
		value: '<p><br/></p>',
		allowPasteHtml: true
	})
	editor.on('copy', (text, html) => {
		console.log('复制事件', text, html)
	})
	editor.on('cut', (text, html) => {
		console.log('剪切事件', text, html)
	})
	editor.on('pasteHtml', (elements, html) => {
		console.log('粘贴事件', elements, html)
	})
	editor.formatElementStack()
	editor.domRender()
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

#app {
	height: 100%;
	overflow-y: auto;
}
</style>
