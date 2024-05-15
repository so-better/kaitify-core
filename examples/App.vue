<template>
	<div style="padding: 20px">
		<div style="width: 100%; height: 400px; border: 1px solid #ddd; overflow: auto" id="editor"></div>
	</div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AlexEditor, AlexElement } from '../src'

onMounted(() => {
	const editor = new AlexEditor('#editor', {
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
	editor.on('keydown', (val, e) => {
		console.log('keydown', val, e)
	})
	editor.formatElementStack()
	editor.domRender()
	editor.rangeRender().then(() => {
		console.log(1)
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

#app {
	height: 100%;
	overflow-y: auto;
}
</style>
