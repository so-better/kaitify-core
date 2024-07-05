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
		value: '<p><a href="#">这是一个连接</a>33444</p><p>333<video style="width:200px;" autoplay controls src="https://video.699pic.com/videos/92/68/18/a_66840022136f517199268180811.mp4" /></p><table><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td><div>333</div></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><span style="color:red;"><span>3</span></span></p>',
		allowPasteHtml: true,
		extraKeepTags: ['svg', 'circle']
	})
	editor.value.on('change', (newVal, oldVal) => {
		console.log('change', newVal, oldVal)
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
