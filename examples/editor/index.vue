<template>
	<div class="editor">
		<div style="margin-bottom: 20px">
			<button @click="queryTextStyle">查询样式</button>
			<button style="margin-left: 10px" @click="setTextStyle">设置样式</button>
			<button style="margin-left: 10px" @click="removeTextStyle">移除样式</button>
		</div>
		<div style="width: 300px; height: 300px; border: 1px solid #ddd" contenteditable="true" @beforeinput="beforeinput" @compositionstart="beforeinput" @compositionupdate="beforeinput" @compositionend="beforeinput" @keydown="beforeinput"></div>
		<div class="editor-content"></div>
	</div>
</template>
<script>
import { AlexEditor, AlexElement } from '../../src'
export default {
	data() {
		return {
			value: `<h5><span>基本使用</span></h5><p><br></p><p><span>使用</span><span data-code-style="mvi-editor-code">v-model</span><span>来控制动作列表的显示和隐藏，使用</span><span data-code-style="mvi-editor-code">options</span><span>属性来配置动作列表，</span><span data-code-style="mvi-editor-code">@select</span><span>表示选择列表后触发的事件</span></p><pre mvi-editor-element-key="27"><span class="mvi-hljs-tag"><span>&lt;</span><span class="mvi-hljs-name">m-actionsheet</span><span> </span><span class="mvi-hljs-attr">v-model</span><span>=</span><span class="mvi-hljs-string">"show"</span><span> </span><span class="mvi-hljs-attr">:options</span><span>=</span><span class="mvi-hljs-string">"options"</span><span> @</span><span class="mvi-hljs-attr">select</span><span>=</span><span class="mvi-hljs-string">"doSelect"</span><span>&gt;&lt;/</span><span class="mvi-hljs-name">m-actionsheet</span><span>&gt;</span></span></pre><pre mvi-editor-element-key="63"><span class="mvi-hljs-keyword">export</span><span> </span><span class="mvi-hljs-keyword">default</span><span> {
    </span><span class="mvi-hljs-title function_">data</span><span>() {
        </span><span class="mvi-hljs-keyword">return</span><span> {
            </span><span class="mvi-hljs-attr">show</span><span>: </span><span class="mvi-hljs-literal">false</span><span>,
            </span><span class="mvi-hljs-attr">options</span><span>: [
                {
                    </span><span class="mvi-hljs-attr">label</span><span>: </span><span class="mvi-hljs-string">'分享到朋友圈'</span><span>
                },
                {
                    </span><span class="mvi-hljs-attr">label</span><span>: </span><span class="mvi-hljs-string">'分享到QQ空间'</span><span>
                }
            ]
        }
    },
    </span><span class="mvi-hljs-attr">methods</span><span>: {
        </span><span class="mvi-hljs-title function_">change</span><span>(</span><span class="mvi-hljs-params">item, index</span><span>) {
            </span><span class="mvi-hljs-comment">//如果选择第一个则输出：{label: '分享到朋友圈'} 0</span><span>
            </span><span class="mvi-hljs-variable language_">console</span><span>.</span><span class="mvi-hljs-title function_">log</span><span>(item, index)
        }
    }
}</span></pre><p><br></p><p><br></p><h5><span>Props</span></h5><p><br></p><table mvi-editor-element-key="141"><colgroup><col width="15.96%"><col width="9.38%"><col width="47.87%"><col width="16.57%"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>v-model</span></td><td><span>boolean</span></td><td><span>控制动作列表显示隐藏</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>overlay-color</span></td><td><span>string</span></td><td><span>遮罩层颜色</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>z-index</span></td><td><span>number</span></td><td><span>层级</span></td><td><span>-</span></td><td><span>900</span></td></tr><tr><td><span>timeout</span></td><td><span>number</span></td><td><span>显示或者隐藏的动画时长，单位ms</span></td><td><span>-</span></td><td><span>200</span></td></tr><tr><td><span>round</span></td><td><span>boolean</span></td><td><span>是否显示圆角</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>title</span></td><td><span>string</span></td><td><span>顶部标题文字内容</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>closable</span></td><td><span>boolean</span></td><td><span>点击遮罩是否可关闭</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>options</span></td><td><span>array</span></td><td><span>动作列表的选项数据配</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>show-cancel</span></td><td><span>boolean</span></td><td><span>是否显示取消按钮</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>cancel-text</span></td><td><span>string</span></td><td><span>取消按钮的文字内容</span></td><td><span>-</span></td><td><span>"取消"</span></td></tr><tr><td><span>active</span></td><td><span>boolean</span></td><td><span>列表和取消按钮是否显示点击态</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>mount-el</span></td><td><span>string</span></td><td><span>指定挂载的父元素，值为选择器名称，如果不设置，默认挂载在定位父元素下</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>select-close</span></td><td><span>boolean</span></td><td><span>选择完是否自动关闭</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>use-padding</span></td><td><span>boolean</span></td><td><span>局部显示时是否考虑滚动条影响</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>size</span></td><td><span>string</span></td><td><span>组件尺寸</span></td><td><span>"medium"/"large"</span></td><td><span>"medium"</span></td></tr></tbody></table><p><br></p><blockquote><span>options参数是一个数组，每个元素具体包含以下属性：</span></blockquote><table mvi-editor-element-key="43557"><colgroup><col width="auto"><col width="auto"><col width="auto"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>label</span></td><td><span>string</span></td><td><span>选项主文字内容</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>disabled</span></td><td><span>boolean</span></td><td><span>选项是否禁用</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>loading</span></td><td><span>boolean</span></td><td><span>选项是否显示加载状态</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>placement</span></td><td><span>string</span></td><td><span>选项显示图标时表示图标的位置</span></td><td><span>"left"/"right"</span></td><td><span>"left"</span></td></tr><tr><td><span>icon</span></td><td><span>string&nbsp;|&nbsp;object</span></td><td><span>选项显示的图标，如果是字符串，则表示Icon组件的type值，如果是对象，则参考icon组件的几个属性</span></td><td><span>-</span></td><td><span>-</span></td></tr></tbody></table><p><br></p><p><br></p><h5><span>Events</span></h5><p><br></p><table mvi-editor-element-key="78873"><colgroup><col width="auto"><col width="auto"><col width="auto"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>事件</span></td><td><span>说明</span></td></tr><tr><td><span>select</span></td><td><span>当点击列表某一项时触发，回调参数为item和index，分别表示选择的那一项数据和序列</span></td></tr></tbody></table><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>`,
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
		this.editor.on('copy', val => {
			console.log('复制触发', val)
		})
		this.editor.on('cut', val => {
			console.log('剪切触发', val)
		})
		this.editor.formatElementStack()
		this.editor.domRender()
	},
	methods: {
		beforeinput(e) {
			e.preventDefault()
		},
		queryTextStyle() {
			const flag = this.editor.queryTextStyle('color', '#87f390')
			console.log(flag)
		},
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
