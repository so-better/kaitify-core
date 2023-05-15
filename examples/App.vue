<template>
	<div style="padding: 20px">
		<div class="area">{{ value }}</div>
		<editor v-model="value"></editor>
	</div>
</template>
<script>
import editor from './editor/index.vue'
export default {
	components: {
		editor
	},
	data() {
		return {
			value: 'alex-editor基于原生JS开发，不依赖于其他框架，脱离了浏览器的document.execCommand语法，是一款非常强大的轻量型底层富文本编辑器'
		}
	}
}
</script>
<style lang="less">
::-webkit-scrollbar {
	width: 12px;
	height: 12px;
}
::-webkit-scrollbar-thumb {
	background: #e8e8e8;
	border-radius: 4px;
}
::-webkit-scrollbar-track {
	background: #fff;
	border-radius: 4px;
}
.area {
	display: block;
	width: 100%;
	padding: 10px;
	background-color: #faf9f9;
	color: #333;
	font-size: 14px;
	box-sizing: border-box;
	margin-bottom: 10px;
	height: 100px;
	overflow: auto;
}
</style>
