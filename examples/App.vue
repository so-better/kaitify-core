<script setup>
import { ref } from 'vue'

let value = ref(`<p><span></span><span></span></p><p data-index="e"></p><p><br><span>有br还有span还有文本</span></p><p><br>有br也有文本</p>`)
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
		<alex-editor autofocus style="border: 1px solid #ddd; padding: 6px 10px; margin-top: 20px" v-model="value" :render-rules="renderRules"></alex-editor>
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
