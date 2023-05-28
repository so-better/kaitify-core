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
			value: '<blockquote>aaa</blockquote><p style="color:#f30;">十年生死两茫茫，不思量，自难忘。</p><p>千里孤坟，<span style="font-weight:bold;color:#798af1">无处话凄凉</span>。</p><p>纵使相逢应不识，尘满面，鬓如霜。</p>'
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
