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
			value: '<p>33</p><div style="color:#f30;"><ul><li>333</li><li>444</li></ul></div>'
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
