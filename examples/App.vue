<script setup>
import { AlexEditor, AlexElement } from '../src'
import { onMounted, ref } from 'vue'
const videoUlr = 'https://apd-vlive.apdcdn.tc.qq.com/vhot2.qqvideo.tc.qq.com/B_9LhzPzw8agpeEeKUHV_JXruCWS6Elu7uF-K46n6AMF4/svp_50069/gzc_1000035_0bc3jicxeaafxqabmgr2h5sjaswdojfak4sa.f622.mp4?sdtfrom=v1103&guid=6ce4ad1a37373ce7fc8e377022d665ee&vkey=6A80A764007F3CCBFA95A86756538A1BBECAF0B7CFD49BCC1FF10BAFAFEA3C4730EE4BFDA1B2DE42F56E62287D6B1A5B2DECA0862FBA3D33060B414DD81F55B47E381A0C2E543BFAA1994B7709A278EDC509E60FBB99FC174363544B214148738A5D7883156B57F6BEF105C37518D7267A16DBAC6A6801C22290266289DCB44236501FF95FCFC225'
const url = 'https://www.mvi-web.cn/mvi-resources/images/mvi_image_2_1652322363009.jpeg'
let value = ref(`<p>aaaa<span>bbbb</span></p><p>3</p><p><img style="width:40px" src="${url}"/></p>`)

const el = ref(null)
let editor = null
onMounted(() => {
	editor = new AlexEditor(el.value, {
		autofocus: true,
		value: value.value,
		disabled: false,
		renderRules: function (el) {
			return el
		},
		onChange: function (val) {
			//console.log(val)
		}
	})
})

const undo = function () {
	const pre = new AlexElement(
		'block',
		'pre',
		null,
		{
			width: '100%',
			padding: '6px 10px',
			'background-color': '#f1f2f3',
			color: '#666',
			'font-size': '14px'
		},
		null
	)
	const code = new AlexElement('block', 'code', null, null, null)
	editor.addElementTo(code, pre, 0)
	const text = new AlexElement('text', null, null, null, ' ')
	editor.addElementTo(text, code, 0)
	editor.insertElement(pre)
	editor.render()
	// const ul = new AlexElement('block', 'ul', null, null, null, null)
	// const li = new AlexElement('block', 'li', null, null, null, null)
	// const text = new AlexElement('text', null, null, null, null, '123')
	// const li2 = new AlexElement('block', 'li', null, null, null, null)
	// const text2 = new AlexElement('text', null, null, null, null, '456')
	// const li3 = new AlexElement('block', 'li', null, null, null, null)
	// const text3 = new AlexElement('text', null, null, null, null, '789')
	// editor.addElementTo(text, li, 0)
	// editor.addElementTo(text2, li2, 1)
	// editor.addElementTo(text3, li3, 2)
	// editor.addElementTo(li, ul, 0)
	// editor.addElementTo(li2, ul, 1)
	// editor.addElementTo(li3, ul, 2)
	// editor.insertElement(ul)
	// const p = new AlexElement('block', 'p', null, null, null, null)
	// const br = new AlexElement('closed', 'br', null, null, null, null)
	// editor.addElementTo(br, p, 0)
	// editor.addElementAfter(p, ul)
	// editor.range.anchor.moveToEnd(p)
	// editor.range.focus.moveToEnd(p)
	// editor.render()
}

const redo = function () {
	editor.redo()
}
</script>
<template>
	<div>
		<button @click="undo">撤销</button>
		<button @click="redo">重做</button>
		<div>{{ value }}</div>
		<div ref="el" class="editor"></div>
	</div>
</template>
<style lang="less">
.editor {
	border: 1px solid #ddd;
	padding: 6px 10px;
	margin-top: 20px;
	overflow: auto;
	height: 400px;

	p {
		margin: 0 0 10px 0;
	}
}
</style>
