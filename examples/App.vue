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
		value: '<p dataBox="1">\uFEFF<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="red" /></svg>\uFEFF</p>',
		allowPasteHtml: true,
		extraKeepTags: ['svg', 'circle'],
		customParseNode: el => {
			if (el.parsedom == 'circle') {
				el.type = 'closed'
			}
			return el
		}
	})
	editor.on('keydown', (val, e) => {
		console.log('keydown', val, e)
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
