<script setup>
import { ref } from 'vue'
const url = 'https://www.mvi-web.cn/mvi-resources/images/mvi_image_2_1652322363009.jpeg'
let value = ref(`<p><img style="width:100px;" src="${url}" />我是一个文本<span style="color:#f30;">我是一个红色的文本</span></p><p><img style="width:100px;" src="${url}" /></p><p>我是一个右边是图片的文本<span><img style="width:100px;" src="${url}"/></span>444</p><p><img style="width:100px;" src="${url}" /></p><p>我是一个右边是图片的文本<span><img style="width:100px;" src="${url}"/></span>444</p>`)
const renderRules = function (element) {
	// if (element.parsedom == 'p') {
	// 	element.parsedom = 'span'
	// }
	return element
}
</script>
<template>
	<div>
		<div>333333333444444</div>
		<input type="text" />
		<alex-editor autofocus style="border: 1px solid #ddd; padding: 6px 10px; margin-top: 20px; overflow: auto; height: 400px" v-model="value" :render-rules="renderRules"></alex-editor>
	</div>
</template>
<style lang="less">
*,
*::before,
*::after {
	box-sizing: border-box;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-webkit-tap-highlight-color: transparent;
	outline: none;
}

p {
	margin: 0 0 10px 0;
}
</style>
