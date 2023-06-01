<template>
	<div class="editor">
		<div class="editor-menus">
			<div @click="setEditor" class="editor-menu">自定义插件</div>
		</div>
		<div class="editor-content" @click="queryStyle"></div>
	</div>
</template>
<script>
import { AlexEditor, AlexElement } from '../../src'
export default {
	data() {
		return {
			value: '<p>十年生<b><span>死两茫茫</span><span>死两茫茫</span></b>，不思量，自难忘。</p><p>千里孤坟，<span style="font-weight:bold;color:#798af1">无处话凄凉</span>。</p><p>纵使相逢应不识，尘满面，鬓如霜。<span style="text-decoration-line:underline"><img src="https://www.mvi-web.cn/mvi-resources/images/mvi_image_0_1676971974565.png" style="width:100px" /></span></p>',
			editor: null
		}
	},
	mounted() {
		this.editor = new AlexEditor('.editor-content', {
			value: this.value
		})
	},
	methods: {
		setEditor() {
			this.editor.setStyle({
				color: '#f30'
			})
			this.editor.formatElementStack()
			this.editor.domRender()
			this.editor.rangeRender()
		}
	}
}
</script>
<style lang="less" scoped>
*,
*::before,
*::after {
	box-sizing: border-box;
	outline: none;
}
.editor {
	display: block;
	width: 100%;
	font-size: 14px;
	font-family: PingFang SC, Helvetica Neue, Helvetica, Roboto, Segoe UI, Microsoft YaHei, Arial, sans-serif;

	.editor-menus {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		width: 100%;
		margin-bottom: 20px;

		.editor-menu {
			padding: 6px 10px;
			background-color: #708af9;
			border-radius: 4px;
			color: #fff;
			font-size: 14px;
			margin: 6px;
		}
	}

	.editor-content {
		border: 1px solid #ddd;
		padding: 6px 10px;
		overflow: auto;
		height: 600px;
		border-radius: 4px;

		:deep(p) {
			margin: 0 0 10px 0;
		}

		:deep(blockquote) {
			margin: 0 0 10px 0;
			padding: 10px 10px 10px 30px;
			border-left: 10px solid #ebedf0;
			font-size: 14px;
			background-color: #fafafa;
			color: #333;
		}

		:deep(pre) {
			padding: 16px;
			overflow: auto;
			line-height: 1.5;
			color: #505050;
			background-color: #fafafa;
			border-radius: 6px;
			font-size: 14px;
			font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
			margin: 0 0 10px 0;
		}
		:deep(code) {
			padding: 0 4px;
			color: #1f2328;
			background-color: #dfe4eb;
			font-size: 14px;
			font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
		}

		:deep(table) {
			border: 1px solid #ddd;
			border-spacing: 0;
			width: 100%;
			text-align: center;
			margin: 0 0 10px 0;

			td,
			th {
				padding: 10px;
				font-size: 14px;
				line-height: 1.5;
				border: 1px solid #ddd;
			}
		}
	}
}
</style>
