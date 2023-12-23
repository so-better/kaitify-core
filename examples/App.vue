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
