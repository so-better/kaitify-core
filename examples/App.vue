<script setup>
import { AlexElement } from '../src'
import { ref } from 'vue'
const url = 'https://www.mvi-web.cn/mvi-resources/images/mvi_image_2_1652322363009.jpeg'
let value = ref(`<p>aaaa<span>bbbb</span></p>`)

const editor = ref(null)

const bold = () => {
	const range = editor.value.getCurrentRange()
	console.log(range)
	range.setStyle({
		color: '#f30'
	})
}
</script>
<template>
	<div>
		<button @click="bold">加粗</button>
		<div>{{ value }}</div>
		<alex-editor ref="editor" autofocus style="border: 1px solid #ddd; padding: 6px 10px; margin-top: 20px; overflow: auto; height: 400px" v-model="value"></alex-editor>
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
