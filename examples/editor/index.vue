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
			menus: ['设置字体', '设置字号', '设置前景色', '设置背景色', '插入代码块', '插入标题', '插入引用']
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
			if (item == '设置字体') {
				this.editor.setStyle({
					'font-family': '华文仿宋'
				})
			} else if (item == '设置字号') {
				this.editor.setStyle({
					'font-size': '30px'
				})
			} else if (item == '设置前景色') {
				this.editor.setStyle({
					color: '#ff0000'
				})
			} else if (item == '设置背景色') {
				this.editor.setStyle({
					'background-color': '#ff0000'
				})
			} else if (item == '插入代码块') {
				const anchorBlock = this.editor.range.anchor.element.getBlock()
				const focusBlock = this.editor.range.focus.element.getBlock()
				if (focusBlock.isEqual(anchorBlock)) {
					anchorBlock.parsedom = 'pre'
					this.editor.range.anchor.moveToEnd(anchorBlock)
					this.editor.range.focus.moveToEnd(anchorBlock)
				} else {
					let element = new AlexElement('block', 'pre', null, null, null)
					const breakElement = new AlexElement('closed', 'br', null, null, null)
					this.editor.addElementTo(breakElement, element)
					const elements = this.editor.getElementsByRange()
					let blocks = []
					elements.forEach(el => {
						if (el.isBlock()) {
							blocks.push(el)
						} else {
							const block = el.getBlock()
							let flag = blocks.some(item => {
								return item.isEqual(block)
							})
							if (!flag) {
								blocks.push(block)
							}
						}
					})
					blocks.forEach((el, index) => {
						const newEl = el.clone(true)
						newEl.parsedom = 'span'
						newEl.type = 'inline'
						this.editor.addElementBefore(this.editor.formatElement(newEl), breakElement)
						if (index < blocks.length - 1) {
							const text = new AlexElement('text', null, null, null, '\n')
							this.editor.addElementBefore(text, breakElement)
						}
						el.setEmpty()
						if (index == 0) {
							this.editor.addElementBefore(element, el)
						}
					})
					this.editor.range.anchor.moveToEnd(element)
					this.editor.range.focus.moveToEnd(element)
				}
			} else if (item == '插入标题') {
				const anchorBlock = this.editor.range.anchor.element.getBlock()
				const focusBlock = this.editor.range.focus.element.getBlock()
				if (focusBlock.isEqual(anchorBlock)) {
					anchorBlock.parsedom = 'h1'
					this.editor.range.anchor.moveToEnd(anchorBlock)
					this.editor.range.focus.moveToEnd(anchorBlock)
				} else {
					const elements = this.editor.getElementsByRange()
					let blocks = []
					elements.forEach(el => {
						if (el.isBlock()) {
							blocks.push(el)
						} else {
							const block = el.getBlock()
							let flag = blocks.some(item => {
								return item.isEqual(block)
							})
							if (!flag) {
								blocks.push(block)
							}
						}
					})
					blocks.forEach(el => {
						el.parsedom = 'h1'
					})
				}
			} else if (item == '插入引用') {
				const anchorBlock = this.editor.range.anchor.element.getBlock()
				const focusBlock = this.editor.range.focus.element.getBlock()
				if (focusBlock.isEqual(anchorBlock)) {
					anchorBlock.parsedom = 'blockquote'
					this.editor.range.anchor.moveToEnd(anchorBlock)
					this.editor.range.focus.moveToEnd(anchorBlock)
				} else {
					let element = new AlexElement('block', 'blockquote', null, null, null)
					const breakElement = new AlexElement('closed', 'br', null, null, null)
					this.editor.addElementTo(breakElement, element)
					const elements = this.editor.getElementsByRange()
					let blocks = []
					elements.forEach(el => {
						if (el.isBlock()) {
							blocks.push(el)
						} else {
							const block = el.getBlock()
							let flag = blocks.some(item => {
								return item.isEqual(block)
							})
							if (!flag) {
								blocks.push(block)
							}
						}
					})
					blocks.forEach((el, index) => {
						const newEl = el.clone(true)
						newEl.parsedom = 'span'
						newEl.type = 'inline'
						const text = new AlexElement('text', null, null, null, '\n')
						this.editor.addElementBefore(this.editor.formatElement(newEl), breakElement)
						this.editor.addElementBefore(text, breakElement)
						el.setEmpty()
						if (index == 0) {
							this.editor.addElementBefore(element, el)
						}
					})
					this.editor.range.anchor.moveToEnd(element)
					this.editor.range.focus.moveToEnd(element)
				}
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
