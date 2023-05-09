<script setup>
import { AlexEditor, AlexElement } from '../src'
import { onMounted, ref } from 'vue'
const videoUlr = 'https://apd-vlive.apdcdn.tc.qq.com/vhot2.qqvideo.tc.qq.com/B_9LhzPzw8agpeEeKUHV_JXruCWS6Elu7uF-K46n6AMF4/svp_50069/gzc_1000035_0bc3jicxeaafxqabmgr2h5sjaswdojfak4sa.f622.mp4?sdtfrom=v1103&guid=6ce4ad1a37373ce7fc8e377022d665ee&vkey=6A80A764007F3CCBFA95A86756538A1BBECAF0B7CFD49BCC1FF10BAFAFEA3C4730EE4BFDA1B2DE42F56E62287D6B1A5B2DECA0862FBA3D33060B414DD81F55B47E381A0C2E543BFAA1994B7709A278EDC509E60FBB99FC174363544B214148738A5D7883156B57F6BEF105C37518D7267A16DBAC6A6801C22290266289DCB44236501FF95FCFC225'
const url = 'https://www.mvi-web.cn/mvi-resources/images/mvi_image_2_1652322363009.jpeg'
let value = ref(`<p><span style="display:inline-block;padding:10px;">背景色</span></p><p>33<span style="color:#f30">44</span></p><p><img style="width:100px;padding:20px" src="${url}"/></p>`)

const el = ref(null)
let editor = null
onMounted(() => {
	editor = new AlexEditor(el.value, {
		autofocus: true,
		value: value.value,
		htmlPaste: true,
		renderRules: function (element) {
			//将span设置为block
			if (element.parsedom == 'span') {
				element.type = 'block'
				element.styles = {
					display: 'block'
				}
			}
			return element
		},
		onChange: function (val) {
			//console.log(val)
			//console.log(this.value)
		}
		// handlePasteFile: function (files) {
		// 	console.log(files)
		// }
	})
})

const undo = function () {
	// const els = editor.parseHtml('<i>33333</i>')
	// els.forEach(el => {
	// 	editor.insertElement(el)
	// })
	editor.setStyle({
		'background-color': '#708af3'
	})
	editor.formatElements()
	editor.domRender()
	editor.range.setCursor()
}
</script>
<template>
	<div>
		<button @click="undo">操作1</button>
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
