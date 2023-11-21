<template>
	<div class="editor">
		<div style="margin-bottom: 20px">
			<button @click="queryTextStyle">查询样式</button>
			<button style="margin-left: 10px" @click="setTextStyle">设置样式</button>
			<button style="margin-left: 10px" @click="removeTextStyle">移除样式</button>
		</div>
		<div class="editor-content"></div>
	</div>
</template>
<script>
import { AlexEditor, AlexElement } from '../../src'
export default {
	data() {
		return {
			value: `<p><br></p><p style="background:#000;color:#fff;" contenteditable="false">不可编辑的段落</p><ul><li>3</li><li>333<span contenteditable="false" style="color:#f30;">4444</span>3</li></ul>`,
			editor: null
		}
	},
	mounted() {
		this.editor = new AlexEditor('.editor-content', {
			value: this.value,
			disabled: false,
			allowPasteHtml: true
		})
		this.editor.on('change', val => {
			console.log('复制触发', val)
		})
		this.editor.on('cut', val => {
			console.log('剪切触发', val)
		})
		this.editor.formatElementStack()
		this.editor.domRender()
		this.editor.collapseToEnd()
		this.editor.rangeRender()
	},
	methods: {
		queryTextStyle() {},
		setTextStyle() {
			this.editor.setTextStyle({
				color: '#87f390'
			})
			this.editor.formatElementStack()
			this.editor.domRender()
			this.editor.rangeRender()
		},
		removeTextStyle() {
			this.editor.removeTextStyle()
			this.editor.formatElementStack()
			this.editor.domRender()
			this.editor.rangeRender()
		}
	}
}
</script>
<style lang="less" scoped>
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
		height: 2000px;
		overflow: auto;
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

:deep(.large) {
	font-size: 40px;
}
</style>
