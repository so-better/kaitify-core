---
title: Editor 属性
---

# Editor 属性

## 实例属性

实例属性通过创建的编辑器实例来调用

##### guid <Badge type="danger" text="number" />

只读属性，唯一 `id`

##### $el <Badge type="danger" text="HTMLElement" />

只读属性，用于获取编辑器的的 `dom` 元素

##### allowCopy <Badge type="danger" text="boolean" />

是否允许复制，此值可以修改，初始值由创建编辑器时提供的对应参数确定

##### allowPaste <Badge type="danger" text="boolean" />

是否允许粘贴，此值可以修改，初始值由创建编辑器时提供的对应参数确定

##### allowCut <Badge type="danger" text="boolean" />

是否允许剪切，此值可以修改，初始值由创建编辑器时提供的对应参数确定

##### allowPasteHtml <Badge type="danger" text="boolean" />

粘贴时是否允许携带样式，此值可以修改，初始值由创建编辑器时提供的对应参数确定

##### priorityPasteFiles <Badge type="danger" text="boolean" />

剪切板同时存在文件和 `html`/`text` 时，是否优先粘贴文件，此值可以修改，初始值由创建编辑器时提供的对应参数确定

##### textRenderTag <Badge type="danger" text="string" />

此为只读属性，表示编辑器内渲染文本节点的真实标签，默认值由创建编辑器时提供的对应参数确定，如果没有设置，则默认为 `span`

##### blockRenderTag <Badge type="danger" text="string" />

此为只读属性，表示编辑内渲染默认块级节点的真实标签，即段落标签，默认值由创建编辑器时提供的对应参数确定，如果没有设置，则默认为 `p`

##### emptyRenderTags <Badge type="danger" text="string[]" />

此为只读属性，表示编辑器内需要置空的标签，编辑器针对需要置空的标签，会转为空节点，不会渲染到视图中，目前默认置空的元素有：`meta` `link` `style` `script` `title` `base` `noscript` `template` `annotation` `input` `form` `button`，你可以在这个基础上，在创建编辑器时添加额外的需要置空的元素标签

##### extraKeepTags <Badge type="danger" text="string[]" />

此为只读属性，表示编辑器内额外保留的标签，默认保留的标签只有 `p` `div` `address` `article` `aside` `nav` `section` `span` `label` `br`，编辑器内置的许多扩展都设置了此属性，比如 `image`扩展等，可以通过输出该属性，查看编辑器额外保留了哪些标签，你可以在此基础上，在创建编辑器时添加额外需要保留的标签，需要注意的是，额外保留的标签默认都是行内节点，如果想做更多自定义的处理，需要在创建编辑器时结合属性 `domParseNodeCallback`

##### extensions <Badge type="danger" text="Extension[]" />

此为只读属性，表示编辑器已注册的插件数组

##### formatRules <Badge type="danger" text="RuleFunctionType[]" />

此为只读属性，表示节点数组格式化规则

##### selection <Badge type="danger" text="Selection" />

虚拟光标 `Selection` 的实例对象，一个编辑器仅有一个 `Selection` 的实例对象，具体参考[Selection API](/apis/selection)

##### history <Badge type="danger" text="History" />

历史记录 `History` 的实例对象，一个编辑器仅有一个 `History` 的实例对象，具体参考[History API](/apis/history)

##### commands <Badge type="danger" text="EditorCommandsType" />

编辑器的命令集合，通过该属性可以直接调用编辑器内置扩展提供的命令方法

##### stackNodes <Badge type="danger" text="KNode[]" />

编辑器内的节点数组
