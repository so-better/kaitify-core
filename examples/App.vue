<script setup>
import { AlexElement, alexEditor } from '../src'
import { ref } from 'vue'
const videoUlr = 'https://apd-vlive.apdcdn.tc.qq.com/vhot2.qqvideo.tc.qq.com/B_9LhzPzw8agpeEeKUHV_JXruCWS6Elu7uF-K46n6AMF4/svp_50069/gzc_1000035_0bc3jicxeaafxqabmgr2h5sjaswdojfak4sa.f622.mp4?sdtfrom=v1103&guid=6ce4ad1a37373ce7fc8e377022d665ee&vkey=6A80A764007F3CCBFA95A86756538A1BBECAF0B7CFD49BCC1FF10BAFAFEA3C4730EE4BFDA1B2DE42F56E62287D6B1A5B2DECA0862FBA3D33060B414DD81F55B47E381A0C2E543BFAA1994B7709A278EDC509E60FBB99FC174363544B214148738A5D7883156B57F6BEF105C37518D7267A16DBAC6A6801C22290266289DCB44236501FF95FCFC225'
const url = 'https://www.mvi-web.cn/mvi-resources/images/mvi_image_2_1652322363009.jpeg'
let value = ref(`<p>aaaa<span>bbbb</span></p><p><img style="width:40px" src="${url}"/></p>`)

const editor = ref(null)

const op = () => {
	// const img = document.createElement('img')
	// img.src = url
	// img.style.width = '300px'
	// const range = editor.value.getCurrentRange()
	// range.insertNode(img)
	// editor.value.reRender()
	const img = new AlexElement('closed', 'img', { src: url }, { width: '300px' }, null, null)
	const range = editor.value.getCurrentRange()
	img.addSelfAfter(AlexElement.getElementByKey('6'))
	editor.value.reRender()
}
</script>
<template>
	<div>
		<button @click="op">操作</button>
		<div>{{ value }}</div>
		<alex-editor ref="editor" autofocus class="editor" v-model="value"></alex-editor>
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
