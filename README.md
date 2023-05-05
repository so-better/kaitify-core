# 基于 Vue3 的 L1 级别富文本编辑器 alex-editor

> 其实可以基于原生 JS 开发，但是 vue 写起来爽一点，加上 vite 的库模式开发，就更舒服了\~

### 特性

-   基于数据驱动：每次操作后会先更新 alexElement 数据，然后通过数据来重新渲染富文本编辑器的内容
-   没有使用 document.execCommand 语法，内部通过浏览器的 selection/range 对象来操作光标，配合数据驱动，实现任何你想要的操作
-   上手简单，使用方便

### 快速上手

通过 `<alex-editor>` 组件来使用编辑器：

```html
<script>
	import alexEditor from 'alex-editor'
	import { ref } from 'vue'
	let value = ref(`<p><br></p>`)
	const editor = ref(null)
</script>

<template>
	<alex-editor ref="editor" autofocus class="editor" v-model="value"></alex-editor>
</template>

<style lang="less">
	/** 样式自己随便写 **/
	.editor {
		border: 1px solid #ddd;
		padding: 6px 10px;
		margin-top: 20px;
		overflow: auto;
		height: 400px;

		p {
			margin: 0 0 10px 0;
		}
	}
</style>
```

此时，一个基本的富文本编辑器已经创建好了，但是需要注意的是，这个富文本编辑器仅仅是一个可输入的区域，没有任何其他额外的功能

如果你需要使用复杂的功能，或者需要做一些自定义的操作，你需要引入 AlexElement 对象，同时搭配 AlexRange 实例来实现

```javascript
//引入AlexElement对象
import { alexEditor, AlexElement } from 'alex-editor'
//获取AlexRange实例
const range = editor.value.getCurrentRange()
```

如下代码实现了将一段文本插入到文档尾部：

```javascript
//创建一个文本元素
const el = new AlexElement('text', null, null, null, null, '我是插入的一段文本')
//获取当前的range
const range = editor.value.getCurrentRange()
//将光标设置到编辑器内容尾部
range.collapseToEnd()
//将创建的文本添加到光标所在元素的后面
el.addSelfAfter(range.focus.element)
//将range的起点和终点移动到创建的文本后面
range.anchor.moveToEnd(el)
range.focus.moveToEnd(el)
//重新渲染
editor.value.reRender()
```

### props

| 属性        | 类型     | 说明                 | 可取值     | 默认值           |
| ----------- | -------- | -------------------- | ---------- | ---------------- |
| modelValue  | string   | 编辑器的 html 内容   | -          | "\<p>\<br>\</p>" |
| disabled    | boolean  | 是否禁用编辑器       | true/false | false            |
| renderRules | function | 自定义编辑器渲染规则 | -          | -                |
| autofocus   | boolean  | 是否自动获取焦点     | true/false | false            |

> renderRules 函数的回调参数为 element，表示当前渲染的 AlexElement 实例，你可以针对该实例进行你想要的操作，但是最后需要返回一个 AlexElement 实例

### alex-editor 内部对象

#### AlexElement：元素

AlexElement 是 `alex-editor` 定义的一种特殊的数据结构，编辑器初始化时将 html 内容转为 AlexElement 数组，并存放在 AlexElement.elementStack（堆栈）中，后续的任意操作都将通过修改该组数据结构来更新编辑器内容。
其构造函数包含以下几个参数：

-   type：元素类型，可取值"text"（文本元素）、"closed"（自闭合元素）、"inline"（行内元素）、"block"（块元素）
-   parsedom：对应的需要渲染的真实节点名称（例："p"），如果是文本元素，此项为 null
-   marks：元素标记集合，对应需要渲染的真实节点的属性（不包括 style 和事件），如果是文本元素，此项为 null
-   styles：元素样式集合，对应需要渲染的真实节点的样式，如果是文本元素，此项为 null
-   children：子元素数组，如果是文本元素，此项为 null
-   textContent：文本内容，非文本元素下此值为 null

```javascript
//创建一个图片元素
const imageElement = new AlexElement('closed', 'img', { src: '#' }, { width: '300px' }, null, null)

//创建一个文本元素
const textElement = new AlexElement('text', null, null, null, null, '我是一个文本')
```

> 元素创建后并添加到堆栈中，拥有唯一的 key 属性，并且可以通过 parent 属性访问父元素

AlexElement 提供以下几种语法来方便我们的操作：

-   `el.isText()` ：el 是否文本元素
-   `el.isBlock()` ：el 是否块元素
-   `el.isInline()` ：el 是否行内元素
-   `el.isClosed()` ：el 是否自闭合元素
-   `el.isBreak()` ：el 是否是换行符
-   `el.isEmpty()` ：el 是否是空元素。文本没有值，行内和块元素没有子元素或者子元素都是 null 的话，都是空元素
-   `el.isRoot()` ：el 是否是根元素，即 AlexElement.elementStack 数组中的元素
-   `el.isContains(element)` ：el 是否包含 element。如果两个元素相等也认为是包含关系
-   `el.isEqual(element)` ：el 是否与 element 相等，即二者是否同一个元素
-   `el.hasContains(element)` ：el 与 element 是否拥有包含关系。即 el 包含 element 或者 element 包含 el 都视为拥有包含关系
-   `el.hasMarks()` ：el 是否含有标记
-   `el.hasStyles()` ：el 是否含有样式
-   `el.hasChildren()` ：el 是否有子元素
-   `el.getPreviousElement()` ：获取 el 的前一个兄弟元素
-   `el.getNextElement()` ：获取 el 的后一个兄弟元素
-   `el.addSelfTo(element, index)` ：将 el 添加到 element 的子元素中，index 用来指定添加序列
-   `el.addSelfBefore(element)` ：将 el 添加到 element 之前
-   `el.addSelfAfter(element)` ：将 el 添加到 element 之后
-   `el.clone(deep)` ：将 el 元素进行克隆，返回一个新的元素，deep 为 true 表示深度克隆，即克隆子孙元素，默认为 true
-   `AlexElement.isElement(val)` ：判断 val 是否 AlexElement 对象
-   `AlexElement.getElementByKey(key)` ：根据 key 查询到指定的 AlexElement 实例
-   `AlexElement.elementStack` ：堆栈，存放编辑器的 AlexElement 实例数组
-   `AlexElement.PARAGRAPH_BLOCKNAME` ：定义编辑器的段落标签名称，默认为"p"

#### AlexPoint：焦点对象

AlexPoint 表示当前操作的光标焦点，由编辑器内部创建其实例，包含 element 和 offset 两个属性

-   elemet: 即 AlexElement 实例，即该焦点所在的元素，只能是自闭合元素或者文本元素
-   offset：即焦点在元素上的偏移值，如果是自闭合元素，只能是 0 和 1

AlexPoint 提供以下几种语法来方便我们的操作：

-   `point.isEqual(target)` ：point 是否和 target 相等，即两个焦点是否同一个
-   `point.moveToEnd(element)` ：将焦点移动到 element 之后，如果 element 不是自闭合元素和文本元素，会查找其最后一个子元素，以此类推，直至获取到自闭合元素或者文本元素
-   `point.moveToStart(element)` ：将焦点移动到 element 之前，如果 element 不是自闭合元素和文本元素，会查找其第一个子元素，以此类推，直至获取到自闭合元素或者文本元素
-   `point.getBlock()` ：获取该焦点所在的块元素
-   `point.getInline()` ：获取该焦点所在的行内元素
-   `point.getPreviousElement()` ：获取在该焦点所在元素之前最近的可以获取焦点的元素
-   `point.getNextElement()` ：获取在该焦点所在元素之后最近的可以获取焦点的元素
-   `AlexPoint.isPoint(val)` ：判断 val 是否 AlexPoint 对象

#### AlexRange：光标范围对象

AlexPoint 是基于浏览器原生的 Selection 和 Range 对象进行封装，表示光标的相关操作，由编辑器内部创建其实例并不断更新，包含 anchor 和 focus 两个属性：

-   anchor：起点，是一个 AlexPoint 实例
-   focus：终点，是一个 AlexPoint 实例

> 如果 anchor 和 focus 相等，则表示光标在某一处，没有选择区域；如果 anchor.element 和 foucs.element 相等，则表示光标在一个元素上

AlexRange 提供以下几种方法来方便我们的操作：

-   `range.setCursor()` ：通过 anchor 和 focus 来设置编辑器真实光标位置
-   `range.insertText(data)` ：向光标所在位置插入文本
-   `range.insertParagraph()` ： 根据光标位置执行换行操作
-   `range.delete()`：根据光标位置执行删除操作
-   `range.getElements()`：根据光标位置获取光标起点和终点之间的元素
-   `range.collapseToStart(element)` ：将真实光标移动到 element 前面，element 是 AlexElement 实例
-   `range.collapseToEnd(element)` ：将真实光标移动到 element 后面，element 是 AlexElement 实例
-   `range.setStyle(styleObject)` ：根据光标位置设置元素样式，styleObject 是一个对象，对象的 key 表示样式名称，对象的 value 表示样式值，如`{ 'font-size': '16px' }`
