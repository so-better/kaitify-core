---
title: DOM转换规则
---

# DOM 转换规则

构建编辑器时，编辑器内部会将入参 `value` 提供的 `html` 内容转为 `KNode` 节点数组

除此之外，在粘贴 `html` 内容时，也会将粘贴的内容转为节点数组

二者涉及到的转换功能，离不开 `Editor` 实例的 `htmlParseNode` 方法和 `domParseNode` 方法

> htmlParseNode 本质上内部调用的仍然是 domParseNode 方法，所以这里着重讲述 domParseNode 方法

## domParseNode

`domParseNode` 方法内部在将 `dom` 元素转为 `KNode` 节点时，会有一个默认的处理转换过程

- dom（`nodeType == 3`）会被转为文本节点
- dom（`nodeType == 1`）会再次进行分类：
  - 元素标签在 editor.emptyRenderTags 范围内的会被置空，即编辑器不进行处理和渲染
  - `p` `div` `address` `article` `aside` `nav` `section` 元素会转为块节点
  - `span` `label`元素会被转为行内节点
  - `br`元素会被转为闭合节点
  - 其余元素不在 `editor.extraKeepTags` 内的，都会被转为默认文本标签的行内节点

> 每个内置扩展都可能设置了 extraKeepTags 属性，所以编辑器内保留的元素远不止以上这些

最终，`domParseNode` 会返回给你一个 `KNode` 节点

## DOM 转换后回调 onDomParseNode

如果上述返回的节点并不完全符合你的需求，或者在预期之外，我们还提供了一个 `onDomParseNode` 方法，在 `domParseNode` 方法返回节点时再进行处理
，以确保最终返回的节点符合要求

```ts
const editor = await Editor.configure({
  value: '<p><br/></p>',
  onDomParseNode(node) {
    //有data-inline的节点都转为行内节点
    if (node.hasMarks() && node.marks['data-inline']) {
      node.type = 'inline'
    }
    return node
  }
})
```
