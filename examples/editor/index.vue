<template>
	<div class="editor">
		<div style="margin-bottom: 20px">
			<button @click="insertElemenet">插入元素</button>
			<button style="margin-left: 10px" @click="setTextStyle">设置样式</button>
			<button style="margin-left: 10px" @click="setTextMark">设置标记</button>
		</div>
		<div class="editor-content"></div>
	</div>
</template>
<script>
import { AlexEditor, AlexElement } from '../../src'
export default {
	data() {
		return {
			value: `<h5>基本使用</h5><p><br></p><p>使用v-model来绑定开关&nbsp;&nbsp;<br></p><pre mvi-editor-element-code="1"><span style="color: rgb(11, 115, 222);">&lt;m-s\nwitch v-model=</span><span style="color: rgb(99, 74, 165);">"checked"</span><span style="color: rgb(11, 115, 222);">&gt;&lt;/m-switch&gt;</span></pre><p><br></p><p><br></p><h5>加载状态</h5><p><br></p><p>使用loading属性使开关处于加载状态，此时不可点击&nbsp;&nbsp;<br></p><pre mvi-editor-element-code="2"><span style="color: rgb(11, 115, 222);">&lt;m-switch loading v-model=</span><span style="color: rgb(99, 74, 165);">"checked"</span><span style="color: rgb(11, 115, 222);">&gt;&lt;/m-switch&gt;</span></pre><p><br></p><p><br></p><h5>禁用状态</h5><p><br></p><p>使用disabled属性使开关禁用&nbsp;&nbsp;<br></p><pre mvi-editor-element-code="3"><span style="color: rgb(11, 115, 222);">&lt;m-switch disabled v-model=</span><span style="color: rgb(99, 74, 165);">"checked"</span><span style="color: rgb(11, 115, 222);">&gt;&lt;/m-switch&gt;</span></pre><p><br></p><p><br></p><h5>设置开关的大小</h5><p><br></p><p>使用size属性来更改开关的大小尺寸&nbsp;&nbsp;<br></p><pre mvi-editor-element-code="4"><span style="color: rgb(11, 115, 222);">&lt;m-switch size=</span><span style="color: rgb(99, 74, 165);">"1rem"</span><span style="color: rgb(11, 115, 222);"> v-model=</span><span style="color: rgb(99, 74, 165);">"checked"</span><span style="color: rgb(11, 115, 222);">&gt;&lt;/m-switch&gt;</span></pre><p><br></p><p><br></p><h5>更改开关的颜色</h5><p><br></p><p>使用active-color和inactive-color属性来更改开关打开和关闭时的颜色&nbsp;&nbsp;<br></p><pre mvi-editor-element-code="5"><span style="color: rgb(11, 115, 222);">&lt;m-switch active-color=</span><span style="color: rgb(99, 74, 165);">"#000"</span><span style="color: rgb(11, 115, 222);"> inactive-color=</span><span style="color: rgb(99, 74, 165);">"#ff3300"</span><span style="color: rgb(11, 115, 222);"> v-model=</span><span style="color: rgb(99, 74, 165);">"checked"</span><span style="color: rgb(11, 115, 222);">&gt;&lt;/m-switch&gt;</span></pre><p><br></p><p><br></p><h5>props</h5><table data-v-66d8370f="" cellpadding="0" cellspacing="0" mvi-editor-insert-table="" class="mvi-editor-table-demo"><tbody data-v-66d8370f="" mvi-editor-insert-table=""><tr data-v-66d8370f="" mvi-editor-insert-table=""><td data-v-66d8370f="" mvi-editor-insert-table="">参数</td><td data-v-66d8370f="" mvi-editor-insert-table="">类型</td><td data-v-66d8370f="" mvi-editor-insert-table="">说明</td><td data-v-66d8370f="" mvi-editor-insert-table="">可取值</td><td data-v-66d8370f="" mvi-editor-insert-table="">默认值</td></tr><tr data-v-66d8370f="" mvi-editor-insert-table=""><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">v-model</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">boolean</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">控制开关</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">true/false</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">false</span></td></tr><tr data-v-66d8370f="" mvi-editor-insert-table=""><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">size</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">string</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">开关的尺寸大小</span></td><td data-v-66d8370f="" mvi-editor-insert-table="">-</td><td data-v-66d8370f="" mvi-editor-insert-table="">0.4rem</td></tr><tr data-v-66d8370f="" mvi-editor-insert-table=""><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">loading</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">boolean</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">开关是否显示加载状态</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">true/false</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">false</span></td></tr><tr data-v-66d8370f="" mvi-editor-insert-table=""><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">disabled</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">boolean</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">是否禁用开关</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">true/false</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">false</span></td></tr><tr data-v-66d8370f="" mvi-editor-insert-table=""><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">active-color</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">string</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">开关打开的颜色</span></td><td data-v-66d8370f="" mvi-editor-insert-table="">-</td><td data-v-66d8370f="" mvi-editor-insert-table="">-</td></tr><tr data-v-66d8370f="" mvi-editor-insert-table=""><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">inactive-color</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">string</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">开关关闭的颜色</span></td><td data-v-66d8370f="" mvi-editor-insert-table="">-</td><td data-v-66d8370f="" mvi-editor-insert-table="">-</td></tr><tr data-v-66d8370f="" mvi-editor-insert-table=""><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">icon</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">string | object</span></td><td data-v-66d8370f="" mvi-editor-insert-table=""><span style="text-align: left;">加载状态时显示的图标，取值为字符串时表示icon组件的type，取值为对象时，参考icon组件属性，如{type:'load-a',spin:true}</span></td><td data-v-66d8370f="" mvi-editor-insert-table="">-</td><td data-v-66d8370f="" mvi-editor-insert-table="">load-e</td></tr></tbody></table><br><p><br></p><h5>events</h5><table data-v-d3491eaa="" cellpadding="0" cellspacing="0" mvi-editor-insert-table="" class="mvi-editor-table-demo"><colgroup><col><col></colgroup><tbody data-v-d3491eaa="" mvi-editor-insert-table=""><tr data-v-d3491eaa="" mvi-editor-insert-table=""><td data-v-d3491eaa="" mvi-editor-insert-table="">事件</td><td data-v-d3491eaa="" mvi-editor-insert-table="">说明</td></tr><tr data-v-d3491eaa="" mvi-editor-insert-table=""><td data-v-d3491eaa="" mvi-editor-insert-table="">change</td><td data-v-d3491eaa="" mvi-editor-insert-table="">开关状态变化时触发，回调参数为v-model绑定的值</td></tr></tbody></table>`,
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
		// this.editor.on('delete', val => {
		// 	console.log('删除触发', val)
		// })
		this.editor.formatElementStack()
		this.editor.domRender()
	},
	methods: {
		insertElemenet() {
			const arr = this.editor.parseHtml('<p>333444</p>')
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
