# 基于 Vue3 的 L1 级别富文本编辑器 alex-editor

> 其实可以基于原生 JS 开发，但是 vue 写起来爽一点，加上 vite 的库模式开发，就更舒服了~

#### 特性

-   基于数据驱动：每次操作后会先更新 alexElement 数据，然后通过数据来重新渲染富文本编辑器的内容
-   没有使用 document.execCommand 语法，内部通过浏览器的 selection/range 对象来操作光标，配合数据驱动，实现任何你想要的操作
-   上手简单，使用方便

#### 基本使用

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

如果你需要使用复杂的功能，或者需要做一些自定义的操作，你需要引入 AlexElement 对象

```javascript
import { alexEditor, AlexElement } from 'alex-editor'
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
