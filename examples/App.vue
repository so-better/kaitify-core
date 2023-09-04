<template>
	<div style="padding: 20px">
		<editor></editor>
	</div>
</template>
<script>
import editor from './editor/index.vue'
export default {
	components: {
		editor
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
html {
	height: 100%;
}
body {
	height: 100%;
	margin: 0;
}

*,
*::before,
*::after {
	box-sizing: border-box;
	outline: none;
}

#app {
	height: 100%;
	overflow-y: auto;
}
</style>
