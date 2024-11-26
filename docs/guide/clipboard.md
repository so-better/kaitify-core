---
title: 剪切板操作
---

# 剪切板操作

## 复制

编辑器自身对复制操作没有进行重写，但是你可以通过 `allowCopy` 来禁用复制功能

## 剪切

编辑器自身对剪切操作没有进行重写，主要处理了剪切时编辑器内节点的更新，你可以通过 `allowCut` 来禁用剪切功能

## 粘贴

编辑器重写了粘贴的操作，并且可以通过 `allowPaste` 来禁用粘贴功能

在允许粘贴的情况下，还可以通过 `allowPasteHtml` 来设置是否允许粘贴内容的样式

- 当 `editor.priorityPasteFiles` 为 `true` 时，编辑器内会优先考虑剪切板中的文件数据，此时如果剪切板存在文件，会先进行文件粘贴处理
- 当 `editor.priorityPasteFiles` 为 `false` 时，编辑器内部会优先考虑剪切板中的 `html` 数据（必须是在允许粘贴内容样式的前提下），此时哪怕剪切板有文件，但是只要同时存在 `html` 数据，也会直接处理 `html` 数据而忽略文件数据，此时会触发 `onPasteHtml`
- 如果不允许携带样式的内容粘贴，则只会粘贴纯文本内容，此时会触发 `onPasteText`
- 对于文件的粘贴，具体分为图片粘贴和视频粘贴、其他文件粘贴，依次触发的 `onPasteImage` `onPasteVideo` `onPasteFile`

> 在使用 onPasteText、onPasteHtml、onPasteImage、onPasteVideo、onPasteFile 这些自定义粘贴事件自行处理粘贴时，不需要调用 updateView 方法来更新视图，编辑器自身会在粘贴完成后更新视图

> 编辑器默认没有处理图片、视频以外的文件粘贴，你可以基于 onPasteFile 自行处理
