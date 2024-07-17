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
		value: `<p>下面是<span><span>一个</span>有序</span>列表</p><ol><li>第一个</li><li>第二个</li><li>第三个</li><li>第四个</li><li><ol><li>第一个</li><li>第二个</li><li>第三个</li><li>第四个</li><li>第五个</li></ol></li></ol><p>下面是一个无序列表</p><ul><li>第一个</li><li>第二个</li><li>第三个</li><li>第四个</li><li>第五个</li></ul>`,
		allowPasteHtml: true,
		extraKeepTags: ['svg', 'circle']
	})
	editor.value.domRender()

	//editor.value.rangeRender()
})

const insert = () => {
	editor.value!.insertElement(
		AlexElement.create({
			type: 'block',
			parsedom: 'h1',
			children: [
				{
					type: 'text',
					textcontent: '我是插入的h1'
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
</style>
