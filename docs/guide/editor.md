---
title: Editor
---

# Editor

> 作为 kaitify 最最最核心的对象，它有着自己的重大作用，并且贯穿整个编辑器操作的始终

## 创建一个编辑器

通过如下代码，可以轻松构建一个富文本编辑器

```html
<div id="editor" style="width:100%;height:200px;"></div>
```

```js
const editor = await Editor.configure({
  el: '#editor',
  value: '',
  placeholder: '请输入正文...'
})
```

示例：

<div id="ed" style="width:100%;height:200px;"></div>

<script setup>
  import { onMounted } from "vue"
  import { Editor } from "../../lib/kaitify-core.es.js"
  
  onMounted(async ()=>{
    const editor = await Editor.configure({
      el: '#ed',
      value: '',
      placeholder:'请输入正文...'
    })
  })
</script>

## 编辑器构建参数

构建编辑器的参数远不止上面所示的 `el`、`value`、`placeholder` 参数，完整参数如下：

#### el <Badge type="danger" text="HTMLElement | string" />

编辑器渲染的 `dom` 或者选择器

#### allowCopy <Badge type="danger" text="boolean" />

是否允许复制，默认值为 `true`

#### allowPaste <Badge type="danger" text="boolean" />

是否允许粘贴，默认值为 `true`

#### allowCut <Badge type="danger" text="boolean" />

是否允许剪切，默认值为 `true`

#### allowPasteHtml <Badge type="danger" text="boolean" />

粘贴的内容是否允许携带样式，默认值为 `false`，即粘贴内容时粘贴的是纯文本

#### priorityPasteFiles <Badge type="danger" text="boolean" />

剪切板同时存在文件和 `html`/`text` 时，是否优先粘贴文件，默认值为 `false`

#### textRenderTag <Badge type="danger" text="string" />

自定义编辑器内渲染文本节点的真实标签，默认值为 `“span”`

#### blockRenderTag <Badge type="danger" text="string" />

自定义编辑内渲染默认块级节点的真实标签，即段落标签，默认值为 `“p”`

#### emptyRenderTags <Badge type="danger" text="string[]" />

自定义编辑器内定义需要置空的标签数组，编辑器针对需要置空的标签，会转为空节点，不会渲染到视图中

#### extraKeepTags <Badge type="danger" text="string[]" />

自定义编辑器内额外保留的标签，如果某个标签的元素被编辑器转为了默认的行内节点，不符合预期行为，可以通过此参数配置保留该标签

#### extensions <Badge type="danger" text="Extension[]" />

自定义插件数组，该属性较为复杂，可参考 [拓展](/extensions) 一节的内容

#### formatRules <Badge type="danger" text="RuleFunctionType[]" />

自定义节点数组格式化规则，可参考 [格式化规则](/guide/format-rules) 一节的内容

## 修改默认样式

kaitify 构建的富文本编辑器会有自带的默认的样式，如果你不需要，你可以通过 css 样式覆盖去修改。或者你可以通过修改 `:root` 下的 css 变量来修改：

```less
:root {
  //主题色
  --kaitify-theme: #4bb4ba;
  //最浅主题色，通常用于悬浮效果
  --kaitify-lightest-theme: fade(@theme, 10);
  //更浅主题色，通常用于激活效果
  --kaitify-lighter-theme: fade(@theme, 20);
  //浅主题色，用于选区颜色
  --kaitify-light-theme: fade(@theme, 30);
  //字体颜色
  --kaitify-font-color: #505050;
  //边框颜色
  --kaitify-border-color: #dedede;
  //背景色
  --kaitify-background-color: #fff;
  //行高
  --kaitify-line-height: 1.5;
  //字号
  --kaitify-font-size: 14px;
  //通用圆角大小
  --kaitify-border-radius: 3px;
  //外边距
  --kaitify-margin: 10px;
  --kaitify-small-margin: 5px;
  --kaitify-large-margin: 15px;
  //内边距
  --kaitify-padding: 10px;
  --kaitify-small-padding: 5px;
  --kaitify-large-padding: 20px;
  //节点两侧和其他节点的间距
  --kaitify-sides-between: 2px;
  //字体
  --kaitify-font-family: PingFang SC, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Helvetica, Hiragino KaKu Gothic Pro, Microsoft YaHei, Arial, sans-serif;
}

:root[kaitify-dark] {
  //字体颜色
  --kaitify-font-color: #e7e7e7;
  //边框颜色
  --kaitify-border-color: #4a4a4a;
  //背景色
  --kaitify-background-color: #1a1a1a;
}
```

> 这些只是编辑器基本的样式变量，对于拓展中的样式，你还需要单独去修改，每一个拓展的样式都是单独维护的
