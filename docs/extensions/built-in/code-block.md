---
title: code-block 代码块
---

# code-block 代码块

支持代码块的渲染，提供插入代码块的能力，注：在代码块内按下 `Tab` 键会插入 2 个空格

## Commands 命令

##### getCodeBlock()

获取光标所在的代码块节点

- 类型

  ```ts
  getCodeBlock(): KNode | null
  ```

- 详细信息

  该方法可以获取光标所在的唯一代码块节点，如果光标不在一个代码块节点内，则返回 `null`

- 示例

  ```ts
  const codeBlockNode = editor.commands.getCodeBlock()
  ```

##### hasCodeBlock()

判断光标范围内是否有代码块节点

- 类型

  ```ts
  hasCodeBlock(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内是否有代码块节点，返回 `boolean` 值

- 示例

  ```ts
  const hasCodeBlock = editor.commands.hasCodeBlock()
  ```

##### allCodeBlock()

光标范围内是否都是代码块节点

- 类型

  ```ts
  allCodeBlock(): boolean
  ```

- 详细信息

  该方法用来判断光标范围内都是代码块节点，返回 `boolean` 值

- 示例

  ```ts
  const allCodeBlock = editor.commands.allCodeBlock()
  ```

##### setCodeBlock()

设置代码块

- 类型

  ```ts
  setCodeBlock(): Promise<void>
  ```

- 详细信息

  该方法会将光标所在的块节点都转为代码块节点，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allCodeBlock` 判断光标范围内都是代码块节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.setCodeBlock()
  ```

##### unsetCodeBlock()

取消代码块

- 类型

  ```ts
  unsetCodeBlock(): Promise<void>
  ```

- 详细信息

  该方法会将光标所在的代码块节点都转为段落节点，在设置完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果通过 `allCodeBlock` 判断光标范围内不都是代码块节点，则不会继续执行

- 示例

  ```ts
  await editor.commands.unsetCodeBlock()
  ```

##### updateCodeBlockLanguage()

更新光标所在代码块的语言类型

- 类型

  ```ts
  updateCodeBlockLanguage(language?: HljsLanguageType): Promise<void>
  ```

- 详细信息

  提供一个入参，类型为 `HljsLanguageType`，取值范围是 `plaintext` `json` `javascript` `java` `typescript` `python` `php` `css` `less` `scss` `html` `markdown` `objectivec` `swift` `dart` `nginx` `http` `go` `ruby` `c` `cpp` `csharp` `sql` `shell` `r` `kotlin` `rust` ，表示更新的语言值，该方法会修改所在代码块的语言类型，以达到不同的高亮效果，更新完毕后会更新视图和光标的渲染，所以调用该命令你无需主动 `updateView`

  如果光标不是在唯一的代码块节点内，则不会执行

- 示例

  ```ts
  await editor.commands.updateCodeBlockLanguage('java')
  ```

## 代码示例

<div style="margin:0 0 10px 0">
  <button class="demo-button" @click="editor?.commands.setCodeBlock()">设置代码块</button>
  <button class="demo-button" @click="editor?.commands.unsetCodeBlock()">取消代码块</button>
</div>
<div ref="editorRef" style="width:100%;height:200px;"></div>

<script lang="ts" setup>
  import { useData } from 'vitepress'
  import { onMounted, watch, ref, onBeforeUnmount } from "vue"
  import { Editor } from "../../../lib/kaitify-core.es.js"

  const { isDark } = useData()
  const editorRef = ref<HtmlElement | undefined>()
  const editor = ref<Editor | undefined>()

  onMounted(async ()=>{
    editor.value = await Editor.configure({
      el: editorRef.value,
      value: '<p>const node = KNode.createPlaceholder()</p><p><br/></p><p><br/></p>',
      dark: isDark.value,
      placeholder:'请输入正文...'
    })
  })

  onBeforeUnmount(()=>{
    editor.value?.destroy()
  })

  watch(()=>isDark.value,newVal=>{
    if(editor.value){
        editor.value.setDark(isDark.value)
    }
  })
</script>
