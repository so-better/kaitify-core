<script setup>
import { ref } from 'vue'
const url = 'https://www.mvi-web.cn/mvi-resources/images/mvi_image_2_1652322363009.jpeg'
let value = ref(`<p><br></p><p><span style="color:#f30;">3333344444</span>55555</p><p><img src="#" /></p>`)
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
