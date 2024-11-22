---
title: 快速上手
---

# 快速上手

## 基本概念

- <b>`Editor`</b>：kaitify 的核心类型，整个编辑器的所有操作包括任何拓展 `Extension` 都离不开这个类，我们需要它去创建一个编辑器实例
- <b>`KNode`</b>：kaitify 的节点，实际上我们可以把它叫作 `Node`，之所以取名为 `KNode`，是为了与浏览器原生的 `Node` 对象作为区分，它是编辑器内容的基础数据类型

## 构建一个编辑器

```html
<div id="editor" style="width:500px;height:500px;"></div>
```

```js
// 编辑器创建并渲染的过程是异步的
// 因此需要通过 `await` 来等待编辑器创建完成后获取编辑器实例
const editor = await Editor.configure({
  el: '#editor',
  value: '<p>hello</p>'
})
```

> [!IMPORTANT] 至此，基本的编辑器已经创建完成了
> 如果你还需要复杂的操作，可以通过 Editor 和 KNode 去操作编辑器，也可以使用编辑器内置的拓展功能
