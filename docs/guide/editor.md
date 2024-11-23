---
title: Editor
---

# Editor

> 作为 kaitify 最最最核心的对象，它有着自己的重大作用，并且贯穿整个编辑器操作的始终

## 创建一个编辑器

- 通过 `Editor` 的类方法 `configure`，我们可以轻松构建一个富文本编辑器，并获取创建后的编辑器实例。
- 具体如何操作编辑器，可以通过 [编辑器相关的 API](/apis/editor) 我们可以获取进一步的内容

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

## 节点数组 stackNodes

`stackNodes` 作为编辑器实例的重要属性，用以存储 `KNode` 即节点数组，编辑器实例通过 `updateView` 方法每次更新编辑器视图，在更新视图之前会通过内部定义的格式化规则对节点数组进行规范化校验，以保证输出的内容都是合法的

## 编辑器构建参数

构建编辑器的参数远不止上面所示的 `el`、`value`、`placeholder` 参数，完整参数如下：

##### el <Badge type="danger" text="HTMLElement | string" />

编辑器渲染的 `dom` 或者选择器

##### value <Badge type="danger" text="string" />

编辑器的初始默认值

##### editable <Badge type="danger" text="boolean" />

编辑器构建时是否可编辑，默认值为 `true`

##### autofocus <Badge type="danger" text="boolean" />

是否自动聚焦，默认值为 `false`

##### placeholder <Badge type="danger" text="string" />

编辑器内容只有一个段落时的占位符内容

##### dark <Badge type="danger" text="boolean" />

是否深色模式，默认值为 `true`

##### allowCopy <Badge type="danger" text="boolean" />

是否允许复制，默认值为 `true`

##### allowPaste <Badge type="danger" text="boolean" />

是否允许粘贴，默认值为 `true`

##### allowCut <Badge type="danger" text="boolean" />

是否允许剪切，默认值为 `true`

##### allowPasteHtml <Badge type="danger" text="boolean" />

粘贴的内容是否允许携带样式，默认值为 `false`，即粘贴内容时粘贴的是纯文本

##### priorityPasteFiles <Badge type="danger" text="boolean" />

剪切板同时存在文件和 `html`/`text` 时，是否优先粘贴文件，默认值为 `false`

##### textRenderTag <Badge type="danger" text="string" />

自定义编辑器内渲染文本节点的真实标签，默认值为 `“span”`

##### blockRenderTag <Badge type="danger" text="string" />

自定义编辑内渲染默认块级节点的真实标签，即段落标签，默认值为 `“p”`

##### emptyRenderTags <Badge type="danger" text="string[]" />

自定义编辑器内定义需要置空的标签数组，编辑器针对需要置空的标签，会转为空节点，不会渲染到视图中

##### extraKeepTags <Badge type="danger" text="string[]" />

自定义编辑器内额外保留的标签，如果某个标签的元素被编辑器转为了默认的行内节点，不符合预期行为，可以通过此参数配置保留该标签

##### extensions <Badge type="danger" text="Extension[]" />

自定义插件数组，该属性较为复杂，可参考 [拓展](/extensions) 一节的内容

##### formatRules <Badge type="danger" text="RuleFunctionType[]" />

自定义节点数组格式化规则，可参考 [格式化规则](/guide/format-rules) 一节的内容

##### domParseNodeCallback <Badge type="danger" text="(this: Editor, node: KNode) => KNode[]" />

自定义 `dom` 转为非文本节点的后续处理，该属性方法主要作用于编辑器将字符串内容转为 KNode 节点数组时，生成每个节点的回调时期，在该方法里你可以对该节点进行自定义操作，修改内容，只需要将最终的节点返回即可

##### onUpdateView <Badge type="danger" text="(this: Editor, init: boolean) => boolean | Promise<boolean>" />

视图渲染时触发，如果返回 `true` 则表示继续使用默认逻辑，返回 `false` 则不走默认逻辑，需要自定义渲染视图。当我们与 `Vue` / `React` 等 UI 框架结合时，该方法会起到很大的作用

##### onPasteText <Badge type="danger" text="(this: Editor, text: string) => boolean | Promise<boolean>" />

编辑器粘贴纯文本时触发，如果返回 `true` 则表示继续使用默认逻辑，返回 `false` 则不走默认逻辑，需要进行自定义处理

##### onPasteHtml <Badge type="danger" text="(this: Editor, nodes: KNode[], html: string) => boolean | Promise<boolean>" />

编辑器粘贴 `html` 内容时触发，如果返回 `true` 则表示继续使用默认逻辑，返回 `false` 则不走默认逻辑，需要进行自定义处理

##### onPasteImage <Badge type="danger" text="(this: Editor, file: File) => boolean | Promise<boolean>" />

编辑器粘贴图片时触发，如果返回 `true` 则表示继续使用默认逻辑，返回 `false` 则不走默认逻辑，需要进行自定义处理

##### onPasteVideo <Badge type="danger" text="(this: Editor, file: File) => boolean | Promise<boolean>" />

编辑器粘贴视频时触发，如果返回 `true` 则表示继续使用默认逻辑，返回 `false` 则不走默认逻辑，需要进行自定义处理

##### onPasteFile <Badge type="danger" text="(this: Editor, file: File) => void | Promise<void>" />

编辑器粘贴除了图片和视频以外的文件时触发，需要自定义处理

##### onChange <Badge type="danger" text="(this: Editor, newVal: string, oldVal: string) => void" />

编辑器内容改变时触发

##### onSelectionUpdate <Badge type="danger" text="(this: Editor, selection: Selection) => void" />

编辑器光标发生变化时触发

##### onInsertParagraph <Badge type="danger" text="(this: Editor, node: KNode) => void" />

换行时触发，参数为换行操作后光标所在的块节点

##### onDeleteComplete <Badge type="danger" text="(this: Editor) => void" />

完成删除时触发

##### onKeydown <Badge type="danger" text="(this: Editor, event: KeyboardEvent) => void" />

光标在编辑器内时键盘按下触发

##### onKeyup <Badge type="danger" text="(this: Editor, event: KeyboardEvent) => void" />

光标在编辑器内时键盘松开触发

##### onFocus <Badge type="danger" text="(this: Editor, event: FocusEvent) => void" />

编辑器聚焦时触发

##### onBlur <Badge type="danger" text="(this: Editor, event: FocusEvent) => void" />

编辑器失焦时触发

##### pasteKeepMarks <Badge type="danger" text="(this: Editor, node: KNode) => KNodeMarksType" />

粘贴 `html` 时，对于节点标记保留的自定义方法

##### pasteKeepStyles <Badge type="danger" text="(this: Editor, node: KNode) => KNodeStylesType" />

粘贴 `html` 时，对于节点样式保留的自定义方法

##### beforeUpdateView <Badge type="danger" text="(this: Editor) => void" />

视图更新前回调方法

##### afterUpdateView <Badge type="danger" text="(this: Editor) => void" />

视图更新后回调方法

##### onDetachMentBlockFromParentCallback <Badge type="danger" text="(this: Editor, node: KNode) => boolean" />

在删除和换行操作中块节点从其父节点中抽离出去成为与父节点同级的节点后触发，如果返回 `true` 则表示继续使用默认逻辑，会将该节点转为段落，返回 `false` 则不走默认逻辑，需要自定义处理

##### beforePatchNodeToFormat <Badge type="danger" text="(this: Editor, node: KNode) => KNode" />

编辑器 `updateView` 执行时，通过比对新旧节点数组获取需要格式化的节点，在这些节点被格式化前，触发此方法，回调参数即当前需要被格式化的节点，该方法返回一个节点，返回的节点将会被格式化，如果你不需要任何特殊处理，返回入参提供的节点即可

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

<script setup lang="ts">
  import { useData } from 'vitepress'
  import { onMounted, watch, ref } from "vue"
  import { Editor } from "../../lib/kaitify-core.es.js"

  const { isDark } = useData()

  const editor = ref<Editor | undefined>()
  
  onMounted(async ()=>{
    editor.value = await Editor.configure({
      el: '#ed',
      value: '',
      dark: isDark.value,
      placeholder:'请输入正文...'
    })
  })

  watch(()=>isDark.value,newVal=>{
    if(editor.value){
        editor.value.setDark(isDark.value)
    }
  })
</script>
