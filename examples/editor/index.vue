<template>
	<div class="editor">
		<div style="margin-bottom: 20px">
			<button @click="insertElemenet">插入元素</button>
			<button style="margin-left: 10px" @click="setTextStyle">设置样式</button>
			<button style="margin-left: 10px" @click="setTextMark">设置标记</button>
		</div>
		<div class="editor-content" @click="queryStyle"></div>
	</div>
</template>
<script>
import { AlexEditor, AlexElement } from '../../src'
export default {
	data() {
		return {
			value: '<ul><li><span style="color:#f30">十年生死两茫茫，不思量</span>，自难忘。</li><li>十年生死两茫茫，不思量，自难忘。</li><li>十年生死两茫茫，不思量，自难忘。</li></ul><p>十年生死两茫茫</p><blockquote><br></blockquote><p>十年生死两茫茫<a href="https://www.baidu.com">百度一下，你就知道</a><img style="width:100px" src="https://www.mvi-web.cn/bg.mp4"/><a href="www.baidu.com">百度一下，你就知道</a></p>',
			editor: null
		}
	},
	mounted() {
		this.editor = new AlexEditor('.editor-content', {
			value: this.value,
			htmlPaste: true,
			renderRules: element => {
				//console.log(element)
			}
		})
		this.editor.on('change', val => {
			//console.log('输入', val)
		})
	},
	methods: {
		insertElemenet() {
			const arr = this.editor.parseHtml('<p>333444</p><p>1112222</p>')
			arr.forEach(el => {
				this.editor.insertElement(el)
			})
			this.editor.formatElementStack()
			this.editor.domRender()
			this.editor.rangeRender()
		},
		setTextStyle() {
			this.editor.setTextStyle({
				color: '#87f390'
			})
			this.editor.formatElementStack()
			this.editor.domRender()
			this.editor.rangeRender()
		},
		setTextMark() {
			this.editor.setTextMark({
				class: 'bold'
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

:deep(.large) {
	font-size: 40px;
}
</style>
