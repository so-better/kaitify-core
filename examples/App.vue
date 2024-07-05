<template>
	<div style="padding: 20px">
		<div id="editor"></div>
		<button @click="insert">插入一个段落</button>
	</div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AlexEditor, AlexElement } from '../src'

const editor = ref<AlexEditor | null>(null)

onMounted(() => {
	editor.value = new AlexEditor('#editor', {
		value: `<blockquote><span>vue-editify在光标操作的某些场景下，会在光标附近或者元素附近展示一个横向的工具条，工具条上提供了多种便捷操作</span></blockquote><p><br></p><h5><span>关于工具条</span></h5><p><br></p><div data-editify-list="ul"><span>工具条是编辑器编辑区域浮动展示的一个方便我们操作的栏目，具体分为</span><span style="font-weight: bold;">表格工具条</span><span>、</span><span style="font-weight: bold;">链接工具条</span><span>、</span><span style="font-weight: bold;">图片工具条</span><span>、</span><span style="font-weight: bold;">视频工具条</span><span>、</span><span style="font-weight: bold;">代码块工具条</span><span>和</span><span style="font-weight: bold;">文本工具条</span></div><div data-editify-list="ul"><span>工具条配置参数toolbar对象配置采用平替的方法，即只会对你配置的属性进行使用，未配置属性使用默认属性</span></div><p><br></p><p><br></p><h5><span>具体配置</span></h5><p><br></p><table data-editify-element="104954" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="13.55%"><col width="10.32%"><col width="57.74%"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>use</span></td><td><span>boolean</span></td><td><span>是否使用工具条</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>style</span></td><td><span>object</span></td><td><span>工具条样式设置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>tooltip</span></td><td><span>boolean</span></td><td><span>是否使用工具提示</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>codeBlock</span></td><td><span>object</span></td><td><span>代码块工具条配置，具体见下述文档</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>text</span></td><td><span>object</span></td><td><span>文本工具条配置，具体见下述文档</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>extraDisabled</span></td><td><span>function</span></td><td><span>该方法会在每次工具条显示时生效，用于添加额外的按钮禁用判定，回调参数为按钮名称name，this指向组件实例（只对文本工具条中的按钮生效），该方法必须返回一个布尔值用于判断是否禁用指定name的按钮</span></td><td><span>-</span></td><td><span>-</span></td></tr></tbody></table><p><br></p><h5><span>codeBlock代码块工具条配置</span></h5><p><br></p><p><span>codeBlock是一个对象值，主要是针对代码块工具条的部分配置</span></p><table data-editify-element="105084" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="auto"><col width="auto"><col width="auto"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>languages</span></td><td><span>object</span></td><td><span>语言列表按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr></tbody></table><p><br></p><p><span>languages按钮属性如下：</span></p><table data-editify-element="105129" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="10.32%"><col width="8.17%"><col width="64.3%"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示语言列表按钮，如果为false则不显示此按钮并且代码块不会进行高亮处理</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>options</span></td><td><span>array</span></td><td><span>语言列表配置，数组中每个元素是一个对象，包含label和value两个属性，value表示语言的值，label是显示在列表上的名称，目前支持的语言值有：“plaintext”、“json”、“javascript”、“java”、“typescript”、“python”、“php”、“css”、“less”、“scss”、“html”、“markdown”、“objectivec”、“swift”、“dart”、“nginx”、“http”、“go”、“ruby”、“c”、“cpp”、“csharp”、“sql”、“shell”、“r”、“kotlin”、“rust”</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>width</span></td><td><span>number</span></td><td><span>按钮浮层宽度，单位px</span></td><td><span>-</span></td><td><span>100</span></td></tr><tr><td><span>maxHeight</span></td><td><span>number</span></td><td><span>按钮浮层最大高度，单位px，如果设为空字符串，则表示不设置</span></td><td><span>-</span></td><td><span>180</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮左侧边框是否显示</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮右侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr></tbody></table><pre data-editify-element="105249" data-editify-hljs=""><span class="editify-hljs-comment"><span>// languages options默认配置如下</span></span><span>
[
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>:</span><span class="editify-hljs-string"><span>'自动识别'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>:</span><span class="editify-hljs-string"><span>''</span></span><span>    
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Plain Text'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'plaintext'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'JSON'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'json'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'JavaScript'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'javascript'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Java'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'java'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'TypeScript'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'typescript'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Python'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'python'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'PHP'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'php'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'CSS'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'css'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Less'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'less'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Scss'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'scss'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'HTML'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'html'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Markdown'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'markdown'</span></span><span>
    },
    {
	</span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Objective-C'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'objectivec'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Swift'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'swift'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Dart'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'dart'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Nginx'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'nginx'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'HTTP'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'http'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Go'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'go'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Ruby'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'ruby'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'C'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'c'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'C++'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'cpp'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'C#'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'csharp'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'SQL'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'sql'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Shell'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'shell'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'R'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'r'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Kotlin'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'kotlin'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Rust'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'rust'</span></span><span>
    }
]</span></pre><blockquote><span>关于按钮的options数组，每一项都包含label、value、icon和style四个属性，但是icon和style属性并非是必要的。如果options的某一项是一个字符串或者数值，表示label和value一样，都是这个字符串或者数值，此时icon和style未设置。</span></blockquote><blockquote><span>icon属性用于定义选项左侧的图标，具体值由组件内部定义，对于拥有icon属性的选项，你可以设置icon为null来不显示图标</span></blockquote><blockquote><span>style属性用于定义该选项的样式，一般用以设置字体大小和粗细等来达到使得该选项与众不同的目的</span></blockquote><p><br></p><p><br></p><h5><span>text文本工具条配置</span></h5><p><br></p><p><span>text是一个对象值，主要是用于自定义配置文本工具条中的按钮</span></p><table data-editify-element="105836" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="auto"><col width="auto"><col width="auto"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>heading</span></td><td><span>object</span></td><td><span>标题按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>align</span></td><td><span>object</span></td><td><span>对齐方式按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>orderList</span></td><td><span>object</span></td><td><span>有序列表按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>unorderList</span></td><td><span>object</span></td><td><span>无序列表按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>task</span></td><td><span>object</span></td><td><span>任务列表按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>bold</span></td><td><span>object</span></td><td><span>加粗按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>italic</span></td><td><span>object</span></td><td><span>斜体按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>strikethrough</span></td><td><span>object</span></td><td><span>删除线按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>underline</span></td><td><span>object</span></td><td><span>下划线按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>code</span></td><td><span>object</span></td><td><span>行内代码按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>super</span></td><td><span>object</span></td><td><span>上标按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>sub</span></td><td><span>object</span></td><td><span>下标按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>fontSize</span></td><td><span>object</span></td><td><span>字号按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>fontFamily</span></td><td><span>object</span></td><td><span>字体按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>lineHeight</span></td><td><span>object</span></td><td><span>行高按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>foreColor</span></td><td><span>object</span></td><td><span>前景色按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>backColor</span></td><td><span>object</span></td><td><span>背景色按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>formatClear</span></td><td><span>object</span></td><td><span>清除格式按钮配置</span></td><td><span>-</span></td><td><span>-</span></td></tr></tbody></table><p><br></p><p><span>heading按钮属性如下：</span></p><table data-editify-element="106153" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="11.61%"><col width="13.23%"><col width="58.49%"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示按钮</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>options</span></td><td><span>array</span></td><td><span>标题选项列表配置，数组中每个元素是一个对象，包含label、value、style三个属性，label表示显示的名称，value表示具体的标签值，style表示选项自定义样式的对象</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>defaultValue</span></td><td><span>string&nbsp;|&nbsp;number</span></td><td><span>如果选项列表的值都不符合的情况下默认显示的值</span></td><td><span>-</span></td><td><span>"p"</span></td></tr><tr><td><span>width</span></td><td><span>number</span></td><td><span>按钮浮层宽度，单位px</span></td><td><span>-</span></td><td><span>130</span></td></tr><tr><td><span>maxHeight</span></td><td><span>number</span></td><td><span>按钮浮层最大高度，单位px，如果设为空字符串，则表示不设置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮左侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮右侧边框是否显示</span></td><td><span>true/false</span></td><td><span>true</span></td></tr></tbody></table><pre data-editify-element="106289" data-editify-hljs="javascript"><span class="editify-hljs-comment"><span>//heading options默认配置如下</span></span><span>
﻿[
﻿    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'正文'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'p'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'一级标题'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'h1'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>style</span></span><span>: {
            </span><span class="editify-hljs-attr"><span>fontSize</span></span><span>: </span><span class="editify-hljs-string"><span>'26px'</span></span><span>,
            </span><span class="editify-hljs-attr"><span>fontWeight</span></span><span>: </span><span class="editify-hljs-string"><span>'bold'</span></span><span>
        }
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>:</span><span class="editify-hljs-string"><span>'二级标题'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'h2'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>style</span></span><span>: {
            </span><span class="editify-hljs-attr"><span>fontSize</span></span><span>: </span><span class="editify-hljs-string"><span>'24px'</span></span><span>,
            </span><span class="editify-hljs-attr"><span>fontWeight</span></span><span>: </span><span class="editify-hljs-string"><span>'bold'</span></span><span>
        }
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'三级标题'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'h3'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>style</span></span><span>: {
            </span><span class="editify-hljs-attr"><span>fontSize</span></span><span>: </span><span class="editify-hljs-string"><span>'22px'</span></span><span>,
            </span><span class="editify-hljs-attr"><span>fontWeight</span></span><span>: </span><span class="editify-hljs-string"><span>'bold'</span></span><span>
        }
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'四级标题'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'h4'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>style</span></span><span>: {
            </span><span class="editify-hljs-attr"><span>fontSize</span></span><span>: </span><span class="editify-hljs-string"><span>'20px'</span></span><span>,
            </span><span class="editify-hljs-attr"><span>fontWeight</span></span><span>: </span><span class="editify-hljs-string"><span>'bold'</span></span><span>
        }
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'五级标题'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'h5'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>style</span></span><span>: {
            </span><span class="editify-hljs-attr"><span>fontSize</span></span><span>: </span><span class="editify-hljs-string"><span>'18px'</span></span><span>,
            </span><span class="editify-hljs-attr"><span>fontWeight</span></span><span>: </span><span class="editify-hljs-string"><span>'bold'</span></span><span>
        }
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'六级标题'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'h6'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>style</span></span><span>: {
            </span><span class="editify-hljs-attr"><span>fontSize</span></span><span>: </span><span class="editify-hljs-string"><span>'16px'</span></span><span>,
            </span><span class="editify-hljs-attr"><span>fontWeight</span></span><span>: </span><span class="editify-hljs-string"><span>'bold'</span></span><span>
        }
    }
﻿]</span></pre><p><br></p><p><span>align按钮属性如下：</span></p><table data-editify-element="106590" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="10.43%"><col width="8.06%"><col width="65.16%"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示按钮</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>options</span></td><td><span>array</span></td><td><span>对齐方式选项列表配置，数组中每个元素是一个对象，包含label、value、icon三个属性，label表示显示的名称，value表示具体的样式值，icon表示选项显示在选项中的对齐方式图标</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>width</span></td><td><span>number</span></td><td><span>按钮浮层宽度，单位px</span></td><td><span>-</span></td><td><span>100</span></td></tr><tr><td><span>maxHeight</span></td><td><span>number</span></td><td><span>按钮浮层最大高度，单位px，如果设为空字符串，则表示不设置</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮是否显示左侧边框</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮是否显示右侧边框</span></td><td><span>true/false</span></td><td><span>false</span></td></tr></tbody></table><pre data-editify-element="106710"><span class="editify-hljs-comment"><span>//align options默认配置如下</span></span><span>
﻿[
﻿    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'左对齐'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'left'</span></span><span>,
﻿        </span><span class="editify-hljs-attr"><span>icon</span></span><span>: </span><span class="editify-hljs-string"><span>'align-left'</span></span><span>
    },
    ﻿{
        </span><span class="editify-hljs-attr"><span>label</span></span><span>:</span><span class="editify-hljs-string"><span>'右对齐'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'right'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>icon</span></span><span>: </span><span class="editify-hljs-string"><span>'align-right'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'居中对齐'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'center'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>icon</span></span><span>: </span><span class="editify-hljs-string"><span>'align-center'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'两端对齐'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'justify'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>icon</span></span><span>: </span><span class="editify-hljs-string"><span>'align-justify'</span></span><span>
    }
﻿]</span></pre><p><br></p><p><span>orderList、unorderList、task、super、sub按钮属性如下：</span></p><table data-editify-element="106841" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="auto"><col width="auto"><col width="auto"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示按钮</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮左侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮右侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr></tbody></table><p><br></p><p><span>bold、italic、underline、strikethrough、code按钮属性如下：</span></p><table data-editify-element="106918" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="auto"><col width="auto"><col width="auto"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示按钮</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮左侧是否显示边框</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮右侧是否显示边框</span></td><td><span>true/false</span></td><td><span>false</span></td></tr></tbody></table><p><br></p><p><span>fontSize按钮属性如下：</span></p><table data-editify-element="106995" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="13.44%"><col width="13.23%"><col width="56.45%"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示按钮</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>options</span></td><td><span>array</span></td><td><span>按钮字号列表配置，数组中每个元素是一个对象，包含label、value两个属性，label表示显示的名称，value表示具体的字号值</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>defaultValue</span></td><td><span>string&nbsp;|&nbsp;number</span></td><td><span>如果选项列表的值都不符合的情况下默认显示的值</span></td><td><span>-</span></td><td><span>''</span></td></tr><tr><td><span>width</span></td><td><span>number</span></td><td><span>按钮浮层宽度，单位px</span></td><td><span>-</span></td><td><span>90</span></td></tr><tr><td><span>maxHeight</span></td><td><span>number</span></td><td><span>按钮浮层最大高度，单位px，如果设置为空字符串，则表示不限制最大高度</span></td><td><span>-</span></td><td><span>200</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮左侧边框是否显示</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮右侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr></tbody></table><pre data-editify-element="107131"><span class="editify-hljs-comment"><span>//fontSize options默认配置如下</span></span><span>
﻿[
﻿    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'默认字号'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>''</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'12px'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'12px'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'14px'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'14px'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'16px'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'16px'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'18px'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'18px'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'20px'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'20px'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'24px'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'24px'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'28px'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'28px'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'32px'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'32px'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'36px'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'36px'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'40px'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'40px'</span></span><span>
    }
﻿]</span></pre><p><br></p><p><span>fontFamily按钮属性如下：</span></p><table data-editify-element="107362" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="11.18%"><col width="13.55%"><col width="59.25%"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示按钮</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>options</span></td><td><span>array</span></td><td><span>按钮字号列表配置，数组中每个元素是一个对象，包含label、value两个属性，label表示显示的名称，value表示具体的字体值</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>defaultValue</span></td><td><span>string&nbsp;|&nbsp;number</span></td><td><span>如果选项列表的值都不符合的情况下默认显示的值</span></td><td><span>-</span></td><td><span>''</span></td></tr><tr><td><span>width</span></td><td><span>number</span></td><td><span>按钮浮层宽度</span></td><td><span>-</span></td><td><span>100</span></td></tr><tr><td><span>maxHeight</span></td><td><span>number</span></td><td><span>按钮浮层最大高度，单位px，如果设置为空字符串，则表示不限制最大高度</span></td><td><span>-</span></td><td><span>200</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮左侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮右侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr></tbody></table><pre data-editify-element="107498" data-editify-hljs="javascript"><span class="editify-hljs-comment"><span>//fontFamily options默认配置如下</span></span><span>
﻿[
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'默认字体'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>''</span></span><span>
     },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'黑体'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'黑体,黑体-简'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'华文仿宋'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'华文仿宋'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'楷体'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'楷体,楷体-简'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'华文楷体'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'华文楷体'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'宋体'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'宋体,宋体-简'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Arial'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'Arial'</span></span><span>
    },
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'Consolas'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>'Consolas,monospace'</span></span><span>
    }
]</span></pre><p><br></p><p><span>lineHeight属性如下：</span></p><table data-editify-element="107669" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="13.01%"><col width="13.12%"><col width="56.77%"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示按钮</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>options</span></td><td><span>array</span></td><td><span>按钮列表配置，数组中每个元素是一个对象，包含label、value两个属性，label表示显示的名称，value表示具体的行高值</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>defaultValue</span></td><td><span>string&nbsp;|&nbsp;number</span></td><td><span>如果选项列表的值都不符合的情况下默认显示的值</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>width</span></td><td><span>number</span></td><td><span>按钮浮层宽度，单位px</span></td><td><span>-</span></td><td><span>90</span></td></tr><tr><td><span>maxHeight</span></td><td><span>number</span></td><td><span>按钮浮层最大高度，单位px，如果设置为空字符串，则表示不限制最大高度</span></td><td><span>-</span></td><td><span>''</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮左侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮右侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr></tbody></table><pre data-editify-element="107805"><span class="editify-hljs-comment"><span>//lineHeight options默认配置如下</span></span><span>
﻿[
    {
        </span><span class="editify-hljs-attr"><span>label</span></span><span>: </span><span class="editify-hljs-string"><span>'默认行高'</span></span><span>,
        </span><span class="editify-hljs-attr"><span>value</span></span><span>: </span><span class="editify-hljs-string"><span>''</span></span><span>
    },
    </span><span class="editify-hljs-number"><span>1</span></span><span>,
    </span><span class="editify-hljs-number"><span>1.15</span></span><span>,
    </span><span class="editify-hljs-number"><span>1.5</span></span><span>,
    </span><span class="editify-hljs-number"><span>2</span></span><span>,
    </span><span class="editify-hljs-number"><span>2.5</span></span><span>,
    </span><span class="editify-hljs-number"><span>3</span></span><span>
]</span></pre><p><br></p><p><span>foreColor按钮属性如下：</span></p><table data-editify-element="107866" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="10.65%"><col width="9.78%"><col width="63.23%"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示按钮</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>options</span></td><td><span>array</span></td><td><span>按钮列表配置，数组中每个元素是一个对象，包含label、value两个属性，label表示显示的工具提示内容，value表示具体的颜色值</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮左侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮右侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr></tbody></table><pre data-editify-element="107954" data-editify-hljs="javascript"><span class="editify-hljs-comment"><span>// foreColor options默认配置如下</span></span><span>
﻿[</span><span class="editify-hljs-string"><span>'#000000'</span></span><span>, </span><span class="editify-hljs-string"><span>'#505050'</span></span><span>, </span><span class="editify-hljs-string"><span>'#808080'</span></span><span>, </span><span class="editify-hljs-string"><span>'#BBBBBB'</span></span><span>, </span><span class="editify-hljs-string"><span>'#CCCCCC'</span></span><span>, </span><span class="editify-hljs-string"><span>'#EEEEEE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#F7F7F7'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFFFFF'</span></span><span>, </span><span class="editify-hljs-string"><span>'#EC1A0A'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FF9900'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFFF00'</span></span><span>, </span><span class="editify-hljs-string"><span>'#07C160'</span></span><span>, </span><span class="editify-hljs-string"><span>'#00FFFF'</span></span><span>, </span><span class="editify-hljs-string"><span>'#0B73DE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#9C00FF'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FF00FF'</span></span><span>, </span><span class="editify-hljs-string"><span>'#F7C6CE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFE7CE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFEFC6'</span></span><span>, </span><span class="editify-hljs-string"><span>'#D6EFD6'</span></span><span>, </span><span class="editify-hljs-string"><span>'#CEDEE7'</span></span><span>, </span><span class="editify-hljs-string"><span>'#CEE7F7'</span></span><span>, </span><span class="editify-hljs-string"><span>'#D6D6E7'</span></span><span>, </span><span class="editify-hljs-string"><span>'#E7D6DE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#E79C9C'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFC69C'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFE79C'</span></span><span>, </span><span class="editify-hljs-string"><span>'#B5D6A5'</span></span><span>, </span><span class="editify-hljs-string"><span>'#A5C6CE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#9CC6EF'</span></span><span>, </span><span class="editify-hljs-string"><span>'#B5A5D6'</span></span><span>, </span><span class="editify-hljs-string"><span>'#D6A5BD'</span></span><span>, </span><span class="editify-hljs-string"><span>'#e45649'</span></span><span>, </span><span class="editify-hljs-string"><span>'#F7AD6B'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFD663'</span></span><span>, </span><span class="editify-hljs-string"><span>'#94BD7B'</span></span><span>, </span><span class="editify-hljs-string"><span>'#73A5AD'</span></span><span>, </span><span class="editify-hljs-string"><span>'#6BADDE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#8C7BC6'</span></span><span>, </span><span class="editify-hljs-string"><span>'#C67BA5'</span></span><span>, </span><span class="editify-hljs-string"><span>'#CE0000'</span></span><span>, </span><span class="editify-hljs-string"><span>'#E79439'</span></span><span>, </span><span class="editify-hljs-string"><span>'#EFC631'</span></span><span>, </span><span class="editify-hljs-string"><span>'#50a14f'</span></span><span>, </span><span class="editify-hljs-string"><span>'#4A7B8C'</span></span><span>, </span><span class="editify-hljs-string"><span>'#03A8F3'</span></span><span>, </span><span class="editify-hljs-string"><span>'#634AA5'</span></span><span>, </span><span class="editify-hljs-string"><span>'#A54A7B'</span></span><span>, </span><span class="editify-hljs-string"><span>'#9C0000'</span></span><span>, </span><span class="editify-hljs-string"><span>'#B56308'</span></span><span>, </span><span class="editify-hljs-string"><span>'#BD9400'</span></span><span>, </span><span class="editify-hljs-string"><span>'#397B21'</span></span><span>, </span><span class="editify-hljs-string"><span>'#104A5A'</span></span><span>, </span><span class="editify-hljs-string"><span>'#085294'</span></span><span>, </span><span class="editify-hljs-string"><span>'#311873'</span></span><span>, </span><span class="editify-hljs-string"><span>'#731842'</span></span><span>, </span><span class="editify-hljs-string"><span>'#630000'</span></span><span>, </span><span class="editify-hljs-string"><span>'#7B3900'</span></span><span>, </span><span class="editify-hljs-string"><span>'#986801'</span></span><span>, </span><span class="editify-hljs-string"><span>'#295218'</span></span><span>, </span><span class="editify-hljs-string"><span>'#083139'</span></span><span>, </span><span class="editify-hljs-string"><span>'#003163'</span></span><span>, </span><span class="editify-hljs-string"><span>'#21104A'</span></span><span>, </span><span class="editify-hljs-string"><span>'#4A1031'</span></span><span>]</span></pre><p><br></p><p><span>backColor按钮属性如下：</span></p><table data-editify-element="108285" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="10.54%"><col width="87"><col width="62.15%"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示按钮</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>options</span></td><td><span>array</span></td><td><span>按钮列表配置，数组中每个元素是一个对象，包含label、value两个属性，label表示显示的工具提示内容，value表示具体的颜色值</span></td><td><span>-</span></td><td><span>-</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮左侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮右侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr></tbody></table><pre data-editify-element="108373"><span class="editify-hljs-comment"><span>// backColor options默认配置如下</span></span><span>
﻿</span><span class="editify-hljs-selector-attr"><span>[</span><span class="editify-hljs-string"><span>'#000000'</span></span><span>, </span><span class="editify-hljs-string"><span>'#505050'</span></span><span>, </span><span class="editify-hljs-string"><span>'#808080'</span></span><span>, </span><span class="editify-hljs-string"><span>'#BBBBBB'</span></span><span>, </span><span class="editify-hljs-string"><span>'#CCCCCC'</span></span><span>, </span><span class="editify-hljs-string"><span>'#EEEEEE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#F7F7F7'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFFFFF'</span></span><span>, </span><span class="editify-hljs-string"><span>'#EC1A0A'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FF9900'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFFF00'</span></span><span>, </span><span class="editify-hljs-string"><span>'#07C160'</span></span><span>, </span><span class="editify-hljs-string"><span>'#00FFFF'</span></span><span>, </span><span class="editify-hljs-string"><span>'#0B73DE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#9C00FF'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FF00FF'</span></span><span>, </span><span class="editify-hljs-string"><span>'#F7C6CE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFE7CE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFEFC6'</span></span><span>, </span><span class="editify-hljs-string"><span>'#D6EFD6'</span></span><span>, </span><span class="editify-hljs-string"><span>'#CEDEE7'</span></span><span>, </span><span class="editify-hljs-string"><span>'#CEE7F7'</span></span><span>, </span><span class="editify-hljs-string"><span>'#D6D6E7'</span></span><span>, </span><span class="editify-hljs-string"><span>'#E7D6DE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#E79C9C'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFC69C'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFE79C'</span></span><span>, </span><span class="editify-hljs-string"><span>'#B5D6A5'</span></span><span>, </span><span class="editify-hljs-string"><span>'#A5C6CE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#9CC6EF'</span></span><span>, </span><span class="editify-hljs-string"><span>'#B5A5D6'</span></span><span>, </span><span class="editify-hljs-string"><span>'#D6A5BD'</span></span><span>, </span><span class="editify-hljs-string"><span>'#e45649'</span></span><span>, </span><span class="editify-hljs-string"><span>'#F7AD6B'</span></span><span>, </span><span class="editify-hljs-string"><span>'#FFD663'</span></span><span>, </span><span class="editify-hljs-string"><span>'#94BD7B'</span></span><span>, </span><span class="editify-hljs-string"><span>'#73A5AD'</span></span><span>, </span><span class="editify-hljs-string"><span>'#6BADDE'</span></span><span>, </span><span class="editify-hljs-string"><span>'#8C7BC6'</span></span><span>, </span><span class="editify-hljs-string"><span>'#C67BA5'</span></span><span>, </span><span class="editify-hljs-string"><span>'#CE0000'</span></span><span>, </span><span class="editify-hljs-string"><span>'#E79439'</span></span><span>, </span><span class="editify-hljs-string"><span>'#EFC631'</span></span><span>, </span><span class="editify-hljs-string"><span>'#50a14f'</span></span><span>, </span><span class="editify-hljs-string"><span>'#4A7B8C'</span></span><span>, </span><span class="editify-hljs-string"><span>'#03A8F3'</span></span><span>, </span><span class="editify-hljs-string"><span>'#634AA5'</span></span><span>, </span><span class="editify-hljs-string"><span>'#A54A7B'</span></span><span>, </span><span class="editify-hljs-string"><span>'#9C0000'</span></span><span>, </span><span class="editify-hljs-string"><span>'#B56308'</span></span><span>, </span><span class="editify-hljs-string"><span>'#BD9400'</span></span><span>, </span><span class="editify-hljs-string"><span>'#397B21'</span></span><span>, </span><span class="editify-hljs-string"><span>'#104A5A'</span></span><span>, </span><span class="editify-hljs-string"><span>'#085294'</span></span><span>, </span><span class="editify-hljs-string"><span>'#311873'</span></span><span>, </span><span class="editify-hljs-string"><span>'#731842'</span></span><span>, </span><span class="editify-hljs-string"><span>'#630000'</span></span><span>, </span><span class="editify-hljs-string"><span>'#7B3900'</span></span><span>, </span><span class="editify-hljs-string"><span>'#986801'</span></span><span>, </span><span class="editify-hljs-string"><span>'#295218'</span></span><span>, </span><span class="editify-hljs-string"><span>'#083139'</span></span><span>, </span><span class="editify-hljs-string"><span>'#003163'</span></span><span>, </span><span class="editify-hljs-string"><span>'#21104A'</span></span><span>, </span><span class="editify-hljs-string"><span>'#4A1031'</span></span><span>]</span></span></pre><p><br></p><p><span>formatClear按钮属性如下：</span></p><table data-editify-element="108707" style="white-space: pre-wrap; word-break: break-word;"><colgroup><col width="auto"><col width="auto"><col width="auto"><col width="auto"><col width="auto"></colgroup><tbody><tr><td><span>参数</span></td><td><span>类型</span></td><td><span>说明</span></td><td><span>可取值</span></td><td><span>默认值</span></td></tr><tr><td><span>show</span></td><td><span>boolean</span></td><td><span>是否显示按钮</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>leftBorder</span></td><td><span>boolean</span></td><td><span>按钮左侧边框是否显示</span></td><td><span>true/false</span></td><td><span>true</span></td></tr><tr><td><span>rightBorder</span></td><td><span>boolean</span></td><td><span>按钮右侧边框是否显示</span></td><td><span>true/false</span></td><td><span>false</span></td></tr></tbody></table><p><br></p><p><br></p><h5><span>extraDisabled额外禁用判定</span></h5><p><br></p><div data-editify-list="ul"><span>当你需要对文本工具条中的某个按钮进行额外的禁用判定时，可以使用该方法</span></div><div data-editify-list="ul"><span>该方法会在每次文本工具条显示时触发</span></div><pre data-editify-element="108794" data-editify-hljs="javascript"><span class="editify-hljs-attr"><span>toolbar</span></span><span>:{
    </span><span class="editify-hljs-attr"><span>extraDisabled</span></span><span>:</span><span class="editify-hljs-keyword"><span>function</span></span><span>(</span><span class="editify-hljs-params"><span>name</span></span><span>){
﻿        </span><span class="editify-hljs-comment"><span>//禁用加粗按钮</span></span><span>
﻿        </span><span class="editify-hljs-keyword"><span>if</span></span><span>(name == </span><span class="editify-hljs-string"><span>'bold'</span></span><span>){
﻿            </span><span class="editify-hljs-keyword"><span>return</span></span><span> </span><span class="editify-hljs-literal"><span>true</span></span><span>
﻿        }
﻿        </span><span class="editify-hljs-keyword"><span>return</span></span><span> </span><span class="editify-hljs-literal"><span>false</span></span><span>
﻿    }﻿
﻿}</span></pre><p><br></p><p><br></p><p><span>好了，这篇文章比较长，工具条的配置相对于直接的属性来说较为复杂，但是如果你能够看完的话，相信你对工具条已经可以进行操作了</span></p>`,
		allowPasteHtml: true,
		extraKeepTags: ['svg', 'circle']
	})
	editor.value.on('change', (newVal, oldVal) => {
		//console.log('change', newVal, oldVal)
		console.log(editor.value?.$el.innerText.length)
	})
	editor.value.formatElementStack()
	editor.value.domRender()
	editor.value.rangeRender()
})

const insert = () => {
	const el = AlexElement.create({
		type: 'block',
		parsedom: 'p',
		children: [
			{
				type: 'inline',
				parsedom: 'span',
				children: [
					{
						type: 'text',
						styles: {
							color: 'red'
						},
						textcontent: '红色字体'
					},
					{
						type: 'text',
						styles: {
							'font-weight': 'bold'
						},
						textcontent: '加粗字体'
					}
				]
			},
			{
				type: 'inline',
				parsedom: 'code',
				children: [
					{
						type: 'text',
						textcontent: 'var a = 2;'
					}
				]
			}
		]
	})
	console.log(el)
	editor.value!.insertElement(el)
	editor.value!.formatElementStack()
	editor.value!.domRender()
	editor.value!.rangeRender()
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

#editor {
	width: 100%;
	height: 400px;
	border: 1px solid #ddd;
	overflow: auto;
	padding: 10px;
	border-radius: 4px;
	margin-bottom: 20px;
	transition: all 200ms;

	&:focus {
		border-color: #708af3;
	}

	p,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: 0 0 15px 0;
	}

	table {
		border: 1px solid #ccc;
		width: 100%;
		border-collapse: collapse;

		th,
		td {
			border: 1px solid #ccc;
			padding: 10px;
		}
	}
}
</style>
