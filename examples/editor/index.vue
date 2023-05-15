<template>
	<div class="editor">
		<div class="editor-menus">
			<div @click="setEditor(item)" class="editor-menu" v-for="item in menus">{{ item }}</div>
		</div>
		<div class="editor-content"></div>
	</div>
</template>
<script>
import { AlexEditor, AlexElement } from '../../src'
export default {
	data() {
		return {
			editor: null,
			menus: ['字体', '字号', '前景色', '背景色', '代码块']
		}
	},
	emits: ['update:modelValue'],
	props: {
		modelValue: {
			type: String,
			default: '<p><br></p>'
		}
	},
	mounted() {
		this.editor = new AlexEditor('.editor-content', {
			value: this.modelValue
		})
		this.editor.on('change', val => {
			this.$emit('update:modelValue', val)
		})
	},
	methods: {
		setEditor(item) {
			if (item == '字体') {
				this.editor.setStyle({
					'font-family': '华文仿宋'
				})
			} else if (item == '字号') {
				this.editor.setStyle({
					'font-size': '30px'
				})
			} else if (item == '前景色') {
				this.editor.setStyle({
					color: '#ff0000'
				})
			} else if (item == '背景色') {
				this.editor.setStyle({
					'background-color': '#ff0000'
				})
			} else if (item == '代码块') {
				const element = new AlexElement('block', 'pre', null, null, null)
				const breakElement = new AlexElement('closed', 'br', null, null, null)
				this.editor.addElementTo(breakElement, element)
				this.editor.insertElement(element)
			}
			this.editor.formatElementStack()
			this.editor.domRender()
			this.editor.setCursor()
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

		:deep(pre) {
			padding: 16px;
			overflow: auto;
			line-height: 1.5;
			color: #1f2328;
			background-color: #dfe4eb;
			border-radius: 6px;
			font-size: 14px;
			font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
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
			margin-bottom: 10px;

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
