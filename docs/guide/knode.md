---
title: KNode
---

# KNode

> KNode 是编辑器内容的唯一组成元素，可以说编辑器的任何操作都是与 KNode 有关的，也就是我们后面通常所说的节点

## 如何创建一个节点？

通过 `KNode.create` 方法来创建一个节点

```ts
const node = KNode.create({
	type: 'block',
	tag: 'p',
	children: [
		{
			type: 'text',
			textContent: '这是一个段落'
		}
	]
})
```

## 节点构建参数

##### type <Badge type="danger" text='"text" | "closed" | "inline" | "block"' />

节点类型

- `text`：文本节点，表示一段文本内容，没有 `tag` 属性，没有子节点，在视图渲染时会根据编辑器实例属性 `textRenderTag` 来渲染成对应的 dom
- `closed`：闭合节点，即没有子节点的节点，如图片、视频等
- `inline`：行内节点，必须有子节点，子节点可以是 `text`、`closed` 和 `inline` 类型的
- `block`：块节点，编辑器的 `stackNodes` 数组里的都是块节点，块节点的子节点可以是其他节点，但是其他节点不能作为块节点的父节点

##### tag <Badge type="danger" text='string' />

节点渲染成 dom 的真实元素标签，如`p`、`span`等

##### textContent <Badge type="danger" text='string' />

文本节点的独有属性，表示节点的文本内容

##### marks <Badge type="danger" text='KNodeMarksType' />

节点的标记集合，渲染成 `dom` 后表示元素的属性集合，但是不包括 `style` 属性

##### styles <Badge type="danger" text='KNodeStylesType' />

样式集合，样式名称请使用驼峰写法，虽然在渲染时兼容处理了中划线格式的样式名称，但是在其他地方可能会出现问题并且编辑器内部在样式相关的判断都是以驼峰写法为主

##### locked <Badge type="danger" text='boolean' />

是否锁定节点

- 针对块节点：在符合合并条件的情况下是否允许编辑器将其与父节点或者子节点进行合并；
- 针对行内节点：在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并；
- 针对文本节点：在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并。

##### fixed <Badge type="danger" text='boolean' />

是否为固定块节点，值为 `true` 时：当光标在节点起始处或者光标在节点内只有占位符时，执行删除操作不会删除此节点，会再次创建一个占位符进行处理；当光标在节点内且节点不是代码块样式，不会进行换行

##### nested <Badge type="danger" text='boolean' />

是否为固定格式的内嵌块节点，如 `li`、`tr`、`td` 等

##### void <Badge type="danger" text='boolean' />

是否为不可见节点，意味着此类节点在编辑器内视图内无法看到，如`colgroup`、`col`等

##### namespace <Badge type="danger" text='string' />

命名空间。如果此值不存在，则会使用 `document.createElement` 方法来创建 `dom` 元素；如果此值存在，则会使用 `document.createElementNS` 方法来创建 `dom` 元素

##### children <Badge type="danger" text='KNode[]' />

子节点数组
