---
title: KNode 属性
---

# KNode 属性

## 实例属性

实例属性通过创建的编辑器实例来调用

##### key <Badge type="danger" text="number" />

只读属性，唯一 `id`

##### type <Badge type="danger" text="KNodeType" />

节点类型，可取值 `block` `inline` `closed` `text`，此值可以修改，初始值由创建节点时提供的对应参数确定

##### tag <Badge type="danger" text="string" />

节点的渲染标签，文本节点此属性无效，此值可以修改，初始值由创建节点时提供的对应参数确定，

##### textContent <Badge type="danger" text="string" />

文本节点的文本值，仅文本节点支持此属性，此值可以修改，初始值由创建节点时提供的对应参数确定

##### marks <Badge type="danger" text="KNodeMarksType" />

节点的标记集合，在渲染时会当做 `dom` 的 `attrs` 进行渲染，此值可以修改，初始值由创建节点时提供的对应参数确定

##### styles <Badge type="danger" text="KNodeStylesType" />

节点的样式集合，在渲染时会当做 `dom` 的 `style` 属性进行渲染，此值可以修改，初始值由创建节点时提供的对应参数确定

##### locked <Badge type="danger" text="boolean" />

是否锁定节点，锁定的节点不会被编辑器格式化校验时与其他节点进行合并，此值可以修改，初始值由创建节点时提供的对应参数确定，如果没有设置则默认为 `false`

- 针对块节点：在符合合并条件的情况下是否允许编辑器将其与父节点或者子节点进行合并；
- 针对行内节点：在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并；
- 针对文本节点：在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并。

##### fixed <Badge type="danger" text='boolean' />

是否为固定块节点，值为 `true` 时：当光标在节点起始处或者光标在节点内只有占位符时，执行删除操作不会删除此节点，会再次创建一个占位符进行处理；当光标在节点内且节点不是代码块样式，不会进行换行

此值可以修改，初始值由创建节点时提供的对应参数确定，如果没有设置则默认为 `false`

##### nested <Badge type="danger" text='boolean' />

是否为固定格式的内嵌块节点，如 `li`、`tr`、`td` 等，此值可以修改，初始值由创建节点时提供的对应参数确定，如果没有设置则默认为 `false`

##### void <Badge type="danger" text='boolean' />

只读属性，表示是否不可见节点，意味着此类节点在编辑器内视图内无法看到，如`colgroup`、`col`等

##### namespace <Badge type="danger" text='string' />

渲染 `dom` 所用到的命名空间。如果此值不存在，在默认的渲染方法中使用 `document.createElement` 方法来创建 `dom` 元素；如果此值存在，在默认的渲染方法中则会使用 `document.createElementNS` 方法来创建 `dom` 元素

此值可以修改，初始值由创建节点时提供的对应参数确定

##### children <Badge type="danger" text='KNode[]' />

子节点数组，文本节点和闭合节点此属性无效，通过访问该属性可以获取节点的子节点，此值可以修改，初始子节点由创建节点时提供的对应参数确定

##### parent <Badge type="danger" text='KNode' />

节点的父节点，如果节点没有父节点，此值不存在
