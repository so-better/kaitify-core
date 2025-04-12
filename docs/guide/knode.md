---
title: KNode
---

# KNode

> KNode 是编辑器内容的唯一组成元素，可以说编辑器的任何操作都是与 KNode 有关的，也就是我们后面通常所说的节点

富文本编辑器的内容原本都是 html 元素，但在 kaitify 的内部实现中，都被转换成了一个个节点，从而构成一个节点数组，挂载在编辑器实例属性 `stackNodes` 下

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

## 节点构建参数 KNodeCreateOptionType

##### type <Badge type="danger" text='KNodeType' />

节点类型，可取值 `block` `inline` `closed` `text`

- `text`：文本节点，表示一段文本内容，没有 `tag` 属性，没有子节点，在视图渲染时会根据编辑器实例属性 `textRenderTag` 来渲染成对应的 dom
- `closed`：闭合节点，即没有子节点的节点，如图片、视频等
- `inline`：行内节点，必须有子节点，子节点可以是 `text`、`closed` 和 `inline` 类型的
- `block`：块节点，编辑器的 `stackNodes` 数组里的都是块节点，块节点的子节点可以是其他节点，但是其他节点不能作为块节点的父节点

##### tag <Badge type="danger" text='string' />

节点渲染成 dom 的真实元素标签，如`p`、`span`等，文本节点不需要设置此参数

##### textContent <Badge type="danger" text='string' />

文本节点的独有属性，表示节点的文本内容，非文本节点不需要设置此参数

##### marks <Badge type="danger" text='KNodeMarksType' />

节点的标记集合，渲染成 `dom` 后表示元素的属性集合，但是不包括 `style` 属性

##### styles <Badge type="danger" text='KNodeStylesType' />

节点的样式集合，样式名称请使用驼峰写法，如 `backgroundColor`，`textAlign` 等

##### locked <Badge type="danger" text='boolean' />

是否锁定节点，锁定的节点不会被编辑器格式化校验时与其他节点进行合并，默认值为 `false`

- 针对块节点：在符合合并条件的情况下是否允许编辑器将其与父节点或者子节点进行合并；
- 针对行内节点：在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并；
- 针对文本节点：在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并。

##### fixed <Badge type="danger" text='boolean' />

是否为固定块节点，值为 `true` 时：当光标在节点起始处或者光标在节点内只有占位符时，执行删除操作不会删除此节点，会再次创建一个占位符进行处理；当光标在节点内且节点不是代码块样式，不会进行换行，默认值为 `false`

##### nested <Badge type="danger" text='boolean' />

是否为固定格式的内嵌块节点，如 `li`、`tr`、`td` 等，默认值为 `false`

##### void <Badge type="danger" text='boolean' />

是否为不可见节点，意味着此类节点在编辑器内视图内无法看到，如`colgroup`、`col`等，默认值为 `false`

##### namespace <Badge type="danger" text='string' />

渲染 `dom` 所用到的命名空间。如果此值不存在，在默认的渲染方法中使用 `document.createElement` 方法来创建 `dom` 元素；如果此值存在，在默认的渲染方法中则会使用 `document.createElementNS` 方法来创建 `dom` 元素

##### children <Badge type="danger" text='KNodeCreateOptionType[]' />

子节点构建参数数组，文本节点和闭合节点无需设置此属性

## 零宽度空白文本节点

编辑器设定了一个非常特殊的文本节点，该节点内容没有长度，在页面表现上仅仅是一个光标的占位大小，我们称之为“零宽度空白文本节点”。这类节点在很多场景下有非常特殊的用途。

那么如何创建一个零宽度空白文本节点呢？

可以通过`KNode.createZeroWidthText`方法来创建：

```ts
const zeroTextNode = KNode.createZeroWidthText(options)
```

该方法的入参是一个对象，包含以下属性：

##### marks <Badge type="danger" text='KNodeMarksType' />

同创建节点入参的 `marks` 属性，表示零宽度空白文本节点的标记

##### styles <Badge type="danger" text='KNodeStylesType' />

同创建节点入参的 `styles` 属性，表示零宽度空白文本节点的样式

##### namespace <Badge type="danger" text='string' />

同创建节点入参的 `namespace` 属性，表示零宽度空白文本节点的命名空间

##### locked <Badge type="danger" text='boolean' />

同创建节点入参的 `locked` 属性，表示零宽度空白文本节点是否锁定

## 占位符节点

编辑器中标签 `<br />` 被视为占位符节点，该节点只能存在于块节点的子节点中，并且与其他节点无法共存，其通常仅在块节点无内容时作占位使用
编辑器提供了一个方法来快速创建一个占位符节点：

```ts
const placeholderNode = KNode.createPlaceholder()
```

当然你也可以使用 `create` 方法来创建，只是相对繁琐：

```ts
const placeholderNode = KNode.create({
	type: 'closed',
	tag: 'br'
})
```

## 空节点

- 对于文本节点，没有文本内容则视为空节点
- 对于行内节点和块节点，没有子节点则视为空节点
- 对于有子节点的节点，所有的子节点都是空节点的情况下，也视为空节点

编辑器内部会自动过滤所有的空节点，因为在 `kaitify` 中，空节点被视为无意义的节点，所以我们在创建节点时，需要避免创建空节点，以防止导致开发的功能未能按照预期执行
