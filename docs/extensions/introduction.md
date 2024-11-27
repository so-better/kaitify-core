---
title: 什么是扩展？
---

# 什么是扩展？

## 扩展的定义

扩展 `Extension` 是 `kaitify` 内部的一套特殊的机制，它将处理同一种事务的逻辑集中到了一起，通过对属性的配置，来设定编辑器的行为

扩展只是方便我们进行额外的功能开发，使得同一种功能的代码能够集中在一起，便于维护和优化

我们需要知道，即使没有使用扩展，也可以通过对构建编辑器时的入参进行配置达到我们的目的，但是我本人觉得那样不太优雅，因此提供了扩展的机制

## 扩展的属性

每一个扩展都是 `Extension` 的实例对象，它具有如下的属性：

##### name <Badge type="danger" text='string' />

扩展的名称，不同的扩展的 `name` 必须唯一

##### registered <Badge type="danger" text='boolean' />

扩展是否已注册到编辑器内，通过该属性我们可以知道某个扩展是否已注册

##### emptyRenderTags <Badge type="danger" text='string[]' />

需要置空的标签，同编辑器实例属性 `emptyRenderTags`

##### extraKeepTags <Badge type="danger" text='string[]' />

额外保留的标签，同编辑器实例属性 `extraKeepTags`

##### formatRules <Badge type="danger" text="RuleFunctionType[]" />

节点数组格式化规则，同编辑器实例属性 `formatRules`

## 使用扩展提供的命令

通过 `editor.commands` 来调用扩展提供的命令

```ts
//调用align扩展提供的setAlign方法
editor.commands.setAlign('center')
```

## 内置扩展

kaitify 内部配置了多个扩展，我们无需进行任何配置，因为它们是默认会集成到编辑器中的，但是部分扩展是支持作配置的，此时我们需要将扩展方法引入，将配置作为方法的入参传入，最终得到一个符合要求的扩展实例

```ts
import { AttachmentExtension } from '@kaitify/core'

const editor = await Editor.configure({
  el: '#editor',
  value: '',
  placeholder: '请输入正文...',
  extensions: [AttachmentExtension({ icon: 'xxx.png' })] // attachment扩展支持通过入参配置全局的icon属性
})
```

kaitify 提供的内置扩展都是以函数的形式对外使用，调用函数会获得一个对应的扩展实例，有的扩展函数支持提供入参，有的则没有入参，具体可在后续介绍具体每一个内置扩展时查看

> 我们配置的扩展会覆盖原本编辑器内部配置的同名扩展，因此无需担心两个相同的扩展被注册多次
