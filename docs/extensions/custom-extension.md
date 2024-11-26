---
title: 如何自己创建一个扩展？
---

# 如何自己创建一个扩展？

## 创建扩展

通过 `Extension.create` 方法可以创建一个扩展实例

```ts
import { Editor, Extension } from '@kaitify/core'
const redExtension = Extension.create({
  name: 'red',
  formatRules: [
    ({ editor, node }) => {
      if (node.isBlock() && node.tag === editor.blockRenderTag) {
        if (node.hasStyles()) {
          node.styles.color = 'red'
        } else {
          node.styles = {
            color: 'red'
          }
        }
      }
    }
  ]
})
const editor = await Editor.configure({
  value: '<p><br/></p>',
  extension: [redExtension]
})
```

## 扩展构建参数

`Extension.create`方法接收一个 `ExtensionCreateOptionType` 类型的入参，该参数包含以下属性：

##### name <Badge type="danger" text='string' />

扩展的名称，不同的扩展的 `name` 必须唯一

##### emptyRenderTags <Badge type="danger" text='string[]' />

自定义编辑器内定义需要置空的标签数组，编辑器针对需要置空的标签，会转为空节点，不会渲染到视图中，同编辑器构建参数 `emptyRenderTags`

##### extraKeepTags <Badge type="danger" text='string[]' />

自定义编辑器内额外保留的标签，如果某个标签的元素被编辑器转为了默认的行内节点，不符合预期行为，可以通过此参数配置保留该标签，同编辑器构建参数 `extraKeepTags`

##### formatRules <Badge type="danger" text="RuleFunctionType[]" />

自定义节点数组格式化规则，同编辑器构建参数 `formatRules`

##### domParseNodeCallback <Badge type="danger" text="(this: Editor, node: KNode) => KNode[]" />

自定义 `dom` 转为非文本节点的后续处理，同编辑器构建参数 `domParseNodeCallback`

##### onSelectionUpdate <Badge type="danger" text="(this: Editor, selection: Selection) => void" />

编辑器光标发生变化时触发，同编辑器构建参数 `onSelectionUpdate`

##### onInsertParagraph <Badge type="danger" text="(this: Editor, node: KNode) => void" />

换行时触发，参数为换行操作后光标所在的块节点，同编辑器构建参数 `onInsertParagraph`

##### onDeleteComplete <Badge type="danger" text="(this: Editor) => void" />

完成删除时触发，同编辑器构建参数 `onDeleteComplete`

##### onKeydown <Badge type="danger" text="(this: Editor, event: KeyboardEvent) => void" />

光标在编辑器内时键盘按下触发，同编辑器构建参数 `onKeydown`

##### onKeyup <Badge type="danger" text="(this: Editor, event: KeyboardEvent) => void" />

光标在编辑器内时键盘松开触发，同编辑器构建参数 `onKeyup`

##### onFocus <Badge type="danger" text="(this: Editor, event: FocusEvent) => void" />

编辑器聚焦时触发，同编辑器构建参数 `onFocus`

##### onBlur <Badge type="danger" text="(this: Editor, event: FocusEvent) => void" />

编辑器失焦时触发，同编辑器构建参数 `onBlur`

##### pasteKeepMarks <Badge type="danger" text="(this: Editor, node: KNode) => KNodeMarksType" />

粘贴 `html` 时，对于节点标记保留的自定义方法，同编辑器构建参数 `pasteKeepMarks`

##### pasteKeepStyles <Badge type="danger" text="(this: Editor, node: KNode) => KNodeStylesType" />

粘贴 `html` 时，对于节点样式保留的自定义方法，同编辑器构建参数 `pasteKeepStyles`

##### beforeUpdateView <Badge type="danger" text="(this: Editor) => void" />

视图更新前回调方法，同编辑器构建参数 `beforeUpdateView`

##### afterUpdateView <Badge type="danger" text="(this: Editor) => void" />

视图更新后回调方法，同编辑器构建参数 `afterUpdateView`

##### onDetachMentBlockFromParentCallback <Badge type="danger" text="(this: Editor, node: KNode) => boolean" />

在删除和换行操作中块节点从其父节点中抽离出去成为与父节点同级的节点后触发，同编辑器构建参数 `onDetachMentBlockFromParentCallback`

##### beforePatchNodeToFormat <Badge type="danger" text="(this: Editor, node: KNode) => KNode" />

编辑器 `updateView` 执行时，通过比对新旧节点数组获取需要格式化的节点，在这些节点被格式化前，触发此方法，同编辑器构建参数 `beforePatchNodeToFormat`

##### addCommands <Badge type="danger" text="((this: Editor) => EditorCommandsType) | undefined" />

自定义扩展命令，添加的命令可以通过 `editor.commands` 来调用

## 添加自定义命令

创建扩展时通过配置 `addCommands` 来添加自定义命令

```ts
import { Editor, Extension } from '@kaitify/core'
const setTextExtension = Extension.create({
  name: 'setText',
  addCommands() {
    return {
      insertText: async (val: string) => {
        this.insertText(val)
        await this.updateView()
      }
    }
  }
})
const editor = await Editor.configure({
  value: '<p><br/></p>',
  extension: [setTextExtension]
})
```

```ts
//通过命令去调用该扩展提供的insertText方法，会向编辑器插入文本并且更新视图
editor.commands.insertText('hello')
```
