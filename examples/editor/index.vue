<template>
	<div class="editor">
		<div class="editor-menus">
			<div @click="setEditor(item)" class="editor-menu" v-for="item in menus">{{ item }}</div>
		</div>
		<div class="editor-content" @click="queryStyle"></div>
	</div>
</template>
<script>
import { AlexEditor, AlexElement } from '../../src'
export default {
	data() {
		return {
			editor: null,
			menus: ['设置字体', '设置字号', '设置前景色', '设置背景色']
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
			value: this.modelValue,
			htmlPaste: false
		})
		this.editor.on('change', val => {
			this.$emit('update:modelValue', val)
		})
	},
	methods: {
		setEditor(item) {
			if (item == '设置字体') {
				if (this.editor.range.anchor.isEqual(this.editor.range.focus)) {
					const spaceText = AlexElement.getSpaceElement()
					spaceText.styles = {
						'font-family': '华文仿宋'
					}
					this.editor.insertElement(spaceText)
				} else {
					const elements = this.editor.getElementsByRange(true)
					elements.forEach(el => {
						if (el.isText()) {
							if (el.hasStyles()) {
								Object.assign(el.styles, {
									'font-family': '华文仿宋'
								})
							} else {
								el.styles = {
									'font-family': '华文仿宋'
								}
							}
						}
					})
				}
			} else if (item == '设置字号') {
				if (this.editor.range.anchor.isEqual(this.editor.range.focus)) {
					const spaceText = AlexElement.getSpaceElement()
					spaceText.styles = {
						'font-size': '30px'
					}
					this.editor.insertElement(spaceText)
				} else {
					const elements = this.editor.getElementsByRange(true)
					elements.forEach(el => {
						if (el.isText()) {
							if (el.hasStyles()) {
								Object.assign(el.styles, {
									'font-size': '30px'
								})
							} else {
								el.styles = {
									'font-size': '30px'
								}
							}
						}
					})
				}
			} else if (item == '设置前景色') {
				if (this.editor.range.anchor.isEqual(this.editor.range.focus)) {
					const spaceText = AlexElement.getSpaceElement()
					spaceText.styles = {
						color: '#78afde'
					}
					this.editor.insertElement(spaceText)
				} else {
					const elements = this.editor.getElementsByRange(true)
					elements.forEach(el => {
						if (el.isText()) {
							if (el.hasStyles()) {
								Object.assign(el.styles, {
									color: '#78afde'
								})
							} else {
								el.styles = {
									color: '#78afde'
								}
							}
						}
					})
				}
			} else if (item == '设置背景色') {
				if (this.editor.range.anchor.isEqual(this.editor.range.focus)) {
					const spaceText = AlexElement.getSpaceElement()
					spaceText.styles = {
						'background-color': '#78afde',
						color: '#fff'
					}
					this.editor.insertElement(spaceText)
				} else {
					const elements = this.editor.getElementsByRange(true)
					elements.forEach(el => {
						if (el.isText()) {
							if (el.hasStyles()) {
								Object.assign(el.styles, {
									'background-color': '#78afde',
									color: '#fff'
								})
							} else {
								el.styles = {
									'background-color': '#78afde',
									color: '#fff'
								}
							}
						}
					})
				}
			}
			this.editor.formatElementStack()
			this.editor.domRender()
			this.editor.rangeRender()
		},
		queryStyle() {
			const inline = this.editor.range.anchor.element.getInline()
			if (inline && inline.hasStyles()) {
				console.log(Object.assign({}, inline.styles))
			}
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
