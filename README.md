# 基于原生 JS 的 L1 级别富文本编辑器 alex-editor

### 特性

-   基于数据驱动：每次操作后会先更新编辑器对象内部保存的一组特殊的数据结构，然后通过数据来重新渲染富文本编辑器的内容
-   没有使用 document.execCommand 语法，内部通过浏览器的 selection/range 对象来操作光标，配合数据驱动，实现任何你想要的操作
-   上手简单，使用方便

### 快速上手

```html
<div id="editor" style="width:500px;height:500px;"></div>
```

```javascript
import AlexEditor from 'alex-editor'
const el = document.body.querySlector('#editor')
//创建编辑器实例
const editor = new AlexEditor(el, {
	value: '<p>hello,我是一个编辑器</p>'
})
//对编辑器的元素数组进行格式化
editor.formatElementStack()
//进行dom渲染
editor.domRender()
```

此时，一个基本的富文本编辑器已经创建好了，但是需要注意的是，这个富文本编辑器仅仅是一个可输入的区域，没有任何其他额外的功能

如果你需要使用复杂的功能，或者需要做一些自定义的操作，你需要引入 AlexElement 对象，同时搭配 AlexRange 实例来实现

```javascript
//引入AlexElement对象
import { AlexEditor, AlexElement } from 'alex-editor'
const el = document.body.querySlector('#editor')
const editor = new AlexEditor(el, {
	value: '<p>hello,我是一个编辑器</p>'
})
//对编辑器的元素数组进行格式化
editor.formatElementStack()
//进行dom渲染
editor.domRender()
//获取AlexRange实例
const range = editor.range
```

如下代码实现了将一个文本元素插入到光标所在位置：

```javascript
//创建一个文本元素
const ele = new AlexElement('text', null, null, null, '我是插入的一段文本')
editor.insertElement(ele)
//渲染
editor.formatElementStack()
editor.domRender()
editor.rangeRender()
```

### 创建 editor 实例的第二个构造参数 options 是一个对象，具体包含以下属性：

| 属性        | 类型    | 说明                                                                                                                                                                                      | 可取值     | 默认值           |
| ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| value       | string  | 初始化时设置的编辑器内容                                                                                                                                                                  | -          | "\<p>\<br>\</p>" |
| disabled    | boolean | 初始化时是否禁用编辑器                                                                                                                                                                    | true/false | false            |
| renderRules | array   | 数组的每个元素必须是一个函数，作为自定义编辑器格式化元素的规则，其回调参数为 element，表示当前要进行格式化处理的 AlexElement 实例，你可以针对该实例或者其子孙元素进行操作，并将该元素返回 | -          | -                |
| htmlPaste   | boolean | 粘贴时是否携带样式                                                                                                                                                                        | true/false | false            |

### 编辑器内部规范

-   stack 数组元素只能是 block 元素，同时 block 元素只会出现在根部，如果某个元素的子元素是 block 元素，那么该 block 元素会被转为 inline 元素或者 inblock 元素
-   inblock 与其他元素不能同时存在于子元素数组中，如果某个元素的子元素数组中含有 inblock 元素，那么其他子元素也必然是 inblock 元素，否则该 inblock 元素会被转为 inline 元素
-   inblock 元素的父元素必然是 block 元素或者 inblock 元素
-   换行符与其他元素不能同时存在，并且如果某个元素下存在多个换行符则会被清除为一个换行符
-   兄弟元素合并策略：相邻的两个文本元素的 styles 和 marks 相同则会被合并；相邻的两个行内元素的 parsedom、styles 和 marks 相同则会被合并
-   父子元素合并策略：父元素的子元素只有一个，并且该子元素是文本元素，父元素是 parsedom==AlexElement.TEXT_NODE 的行内元素，则子元素会父元素进行合并；父元素的子元素只有一个，inline 元素、inblock 元素如果与父元素的 parsedom 一致，marks 和 styles 也一致，那么会与父元素合并

### AlexEditor 编辑器

作为该编辑器组件的最顶级的核心类，其功能强大，提供了丰富的语法：

-   `editor.$el` ：编辑器所在的 dom 元素，请勿修改此属性
-   `editor.value` ：当前编辑器的内容，请勿修改此属性
-   `editor.range` ：editor 内部创建的 AlexRange 实例，通过该属性来操控 anchor、focus 和设置光标。请勿修改此属性
-   `editor.stack` ：存放编辑器内所有的 AlexElement 元素的数组
-   `editor.history` ：editor 内部创建的 AlexHistory 实例，通过该属性来操控历史的记录，请勿修改此属性
-   `editor.paste()` ：根据虚拟光标执行粘贴操作，该方法返回一个 promise 对象
-   `editor.cut()` ：根据虚拟光标执行剪切操作，该方法返回一个 promise 对象，promise 的 then 方法只含有一个布尔类型的参数，表示是否有效执行剪切操作
-   `editor.copy()` ：根据虚拟光标执行复制操作，该方法返回一个 promise 对象，promise 的 then 方法只含有一个布尔类型的参数，表示是否有效执行复制操作
-   `editor.delete()` ：根据虚拟光标执行删除操作
-   `editor.insertText(data)` ：根据虚拟光标位置向编辑器内插入文本
-   `editor.insertParagraph()` ：在虚拟光标处换行
-   `editor.insertElement(ele,cover=true)` ：根据虚拟光标位置插入指定的元素，cover 为 true 会在某些情况下进行覆盖操作（情况 1：向根级块内插入根级块元素，如果被插入的根级块元素只有换行符，则插入的根级块元素会覆盖此根级块元素；情况 2：向行为值为 block 的内部块内插入内部块，如果被插入的内部块元素只有换行符，则插入的内部块元素会覆盖此内部块元素）
-   `editor.formatElementStack()` ：对 editor.stack 进行格式化
-   `editor.domRender(unPushHistory=false)` ：渲染编辑器 dom 内容，该方法会触发 value 的更新，如果 unPushHistory 为 true，则本次操作不会添加到历史记录中去，除了做“撤销”和“重做”功能时一般情况下不设置此参数。
-   `editor.rangeRender()` ：根据虚拟光标来渲染真实的光标或者选区
-   `editor.parseHtml(html)` ：将 html 文本内容转为 AlexElement 元素，返回一个元素数组（转换过程中会移除节点的 on 开头的属性）
-   `editor.parseNode(node)` ：将 node 节点转为 AlexElement 元素（转换过程中会移除节点的 on 开头的属性）
-   `editor.mergeBlockElement(ele,previousEle)` ：将 ele 与前一个兄弟元素进行合并，ele 会置为空元素，子元素全部添加到前一个兄弟元素下【仅针对根级块元素和内部块元素】
-   `editor.getElementByKey(key)` ：根据 key 查询元素
-   `editor.getPreviousElement(ele)` ：获取 ele 元素前一个兄弟元素，如果没有则返回 null
-   `editor.getNextElement(ele)` ：获取 ele 元素后一个兄弟元素，如果没有则返回 null
-   `editor.getPreviousElementOfPoint(point)` ：根据指定焦点向前查询可以设置焦点的最近的元素
-   `editor.getNextElementOfPoint(point)` ：根据指定焦点向后查询可以设置焦点的最近的元素
-   `editor.getElementsByRange(includes=false,flat=false)` ：获取 anchor 和 focus 两个点之间的元素。如果 includes 为 true，则返回结果包含起点和终点所在元素，并且如果焦点在文本中间，还会分割文本元素，默认为 false；如果 flat 是 true 则返回是扁平化处理后的元素数组，如果是 false 则返回原结构，默认为 false【该方法可能会引起 stack 数据变化，使用后需要使用 formatElementStack 进行格式化】
-   `editor.addElementTo(childEle, parentEle, index=0)` ：将指定元素添加到父元素的子元素数组中
-   `editor.addElementBefore(newEle, targetEle)` ：将指定元素添加到另一个元素前面
-   `editor.addElementAfter(newEle, targetEle)` ：将指定元素添加到另一个元素后面
-   `editor.collapseToStart(element)` ：将虚拟光标移动到文档头部，如果 element 指定了元素，则移动到该元素头部
-   `editor.collapseToEnd(element)` ：将虚拟光标移动到文档尾部，如果 element 指定了元素，则移动到该元素尾部
-   `editor.setDisabled()` ：设置编辑器禁用，此时不可编辑
-   `editor.setEnabled()` ：设置编辑器启用，此时可以编辑
-   `editor.setTextStyle(styles)` ：根据虚拟光标设置文本元素的指定样式
-   `editor.removeTextStyle(styleNames)` ：根据虚拟光标移除文本元素的指定样式，如果参数 styleNames 不存在，则移除文本元素的所有样式
-   `editor.queryTextStyle(name, value)` ：根据虚拟光标查询文本元素是否在某个样式下，name 表示样式名称，value 表示样式的值。如果 value 不存在，则仅判断是否拥有名为 name 的样式。如果光标进行了选区操作，则判断选区内的每个文本元素，全部符合才会返回 true【当虚拟光标起点和终点不在一起时，该方法内部会调用 getElementsByRange，此时需要使用 formatElementStack 进行格式化】
-   `editor.setTextMark(marks)` ：根据虚拟光标设置文本元素的指定标记
-   `editor.removeMark(markNames)` ：根据虚拟光标移除文本元素的指定标记，如果参数 markNames 不存在，则移除文本元素的所有标记
-   `editor.queryTextMark(name, value)` ：根据虚拟光标查询文本元素是否在某个标记下，name 表示标记名称，value 表示标记的值。如果 value 不存在，则仅判断是否拥有名为 name 的标记。如果光标进行了选区操作，则判断选区内的每个文本元素，全部符合才会返回 true【当虚拟光标起点和终点不在一起时，该方法内部会调用 getElementsByRange，此时需要使用 formatElementStack 进行格式化】
-   `editor.setIndent()` ：增加所在根级块元素或者所在内部块元素（行为值为"block"）的缩进
-   `editor.setOutdent()` ：减少所在根级块元素或者所在内部块元素（行为值为"block"）的缩进
-   `editor.emit(eventName, ...value)` ：触发指定的监听事件，第一个参数为事件名称，后面的参数都是回调参数
-   `editor.on(eventName, eventHandle)` ：对 editor 进行监听，第一个参数为监听的事件名称，第二个参数为监听的回调函数，回调函数的参数具体有哪些取决于 emit 方法
-   `editor.destroy()` ：销毁编辑器，主要是设置编辑器不可编辑，同时移除编辑相关的事件。当编辑器对应的元素从页面中移除前，应当调用一次该方法进行事件解绑处理

> parseNode 方法内部在将 Node 节点转为 AlexElement 元素时，会有一个默认的处理转换过程，比如 li 标签会被转为行为值是"block"的内部块元素、b 标签会被转为带加粗样式的行内元素且 parsedom 为 span 等等。parseHtml 同理，其内部调用的仍然是 parseNode 方法

> 在创建编辑器时需要调用 formatElementStack 方法、domRender 方法来进行编辑器的格式化和 dom 渲染
> 只要对编辑器的 stack 数组内的元素或者虚拟光标进行了操作，就应当使用 formatElementStack 和 domRender 来重新渲染编辑器

> 下面是 editor 内部定义的事件：

| 事件名称        | 事件说明                                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| change          | 编辑的内容发生变化就会触发此事件，回调参数为编辑器当前值和编辑器旧值                                                                              |
| blur            | 编辑器失去焦点时触发，回调参数为编辑器当前的值                                                                                                    |
| focus           | 编辑器获取焦点时触发，回调参数为编辑器当前的值                                                                                                    |
| rangeUpdate     | 当编辑器的真实光标更新时触发，回调参数为当前的 alexRange 实例                                                                                     |
| insertParagraph | 调用 insertParagraph 方法执行换行操作时触发，回调参数有两个，依次为为换行后光标所在的根级块元素或者内部块元素，以及前一个根级块元素或者内部块元素 |
| copy            | 进行复制操作时触发                                                                                                                                |
| cut             | 进行剪切操作时触发（剪切操作也会触发 copy 事件）                                                                                                  |
| paste           | 进行粘贴操作时触发，回调参数为粘贴的内容（如果 htmlPaste 为 true，回调参数为粘贴的内容和内容转换后的 AlexEelemnt 数组）                           |
| pasteImage      | 自定义图片粘贴（剪切板数据仅有图片时），回调参数为图片的 base64 字符串                                                                            |
| pasteVideo      | 自定义视频的粘贴（剪切板数据仅有视频时），回调参数为视频的 base64 字符串                                                                          |
| deleteInStart   | 当光标在编辑器的开始处执行删除时会触发此事件，回调参数为光标所在的根级块元素或者内部块元素                                                        |
| domRender       | 当执行 domRender 触发 dom 渲染后触发的事件                                                                                                        |

> 请注意，如果不是本地安全环境或者 https 安全环境下，可能无法使用复制、剪切和粘贴操作，此时浏览器控制台会进行告警提示。这是由于 clipboard 语法在非安全环境下无法使用导致的，属于浏览器限制

### AlexElement：元素

AlexElement 是 `alex-editor` 定义的一种特殊的数据结构，编辑器初始化时将 html 内容转为 AlexElement 数组，并挂载在编辑器实例上（ `editor.stack` ），后续的任意操作都将通过修改该组数据结构来更新编辑器内容。
其构造函数包含以下几个参数：

-   type：元素类型，可取值"text"（文本元素）、"closed"（自闭合元素）、"inline"（行内元素）、"inblock"（内部块元素）、"block"（根级块元素）
-   parsedom：对应的需要渲染的真实节点名称（例："p"），如果是文本元素，此项为 null
-   marks：元素标记集合，对应需要渲染的真实节点的属性（不包括 style 属性）
-   styles：元素样式集合，对应需要渲染的真实节点的样式
-   textContent：文本内容，非文本元素下此值为 null

```javascript
//创建一个图片元素
const imageElement = new AlexElement('closed', 'img', { src: '#' }, null, null)

//创建一个文本元素
const textElement = new AlexElement('text', null, null, null, null, '我是一个文本')
```

> 元素创建后并添加到堆栈中，拥有唯一的 key 属性，并且可以通过 parent 属性访问父元素，通过 children 属性来访问子元素

AlexElement 提供以下几种语法来方便我们的操作：

-   `el.key` ：元素的唯一值
-   `el.type` ：元素的类型
-   `el.parsedom` ：转换的真实节点名称
-   `el.marks` ：元素的标记集合
-   `el.styles` ：元素的样式集合
-   `el.textContent` ：文本元素的文本值
-   `el.children`：子元素数组
-   `el.parent` ：父元素
-   `el.behavior` ：元素的行为值【仅在 type="inblock"时有效】，默认值为 default，可取值 block【如果设置为 block，其行为与根级块元素相似】
-   `el.isBlock()` ：el 是否根级块元素
-   `el.isInblock()` ：el 是否内部块元素
-   `el.isInline()` ：el 是否行内元素
-   `el.isClosed()` ：el 是否自闭合元素
-   `el.isText()` ：el 是否文本元素
-   `el.isBreak()` ：el 是否是换行符`<br>`
-   `el.isEmpty()` ：el 是否是空元素。【文本元素没有值，行内元素、内部块元素和根级块元素没有子元素或者子元素都是空元素 的话，则判定为空元素】
-   `el.isSpaceText()` ：el 是否只含有空白字符的 text 元素
-   `el.isEqual(element)` ：el 是否与 element 相等，即二者是否同一个元素
-   `el.isContains(element)` ：el 是否包含 element。如果两个元素相等也认为是包含关系
-   `el.isOnlyHasBreak()` ：el 的子元素是否只含有换行符`<br>`
-   `el.isPreStyle()` ：el 是否为代码块样式的根级块元素或者内部块元素，对于 styles 中含有"white-space":"pre" 或者 "white-space":"pre-wrap"样式的根级块元素或内部块元素，即认为是代码块样式元素（pre 标签默认就是代码块样式）。代码块样式的元素在空格、换行处理方面与一般元素不同
-   `el.hasMarks()` ：el 是否含有标记
-   `el.hasStyles()` ：el 是否含有样式
-   `el.hasChildren()` ：el 是否有子元素
-   `el.hasContains(element)` ：el 与 element 是否拥有包含关系。即 el 包含 element 或者 element 包含 el 都视为拥有包含关系
-   `el.clone(deep)` ：将 el 元素进行克隆，返回一个新的元素，deep 为 true 表示深度克隆，即克隆子孙元素，默认为 true
-   `el.convertToBlock()` ：将非 block 类型的元素转为 block 元素
-   `el.toEmpty()` ：将一个非空元素设为空元素（如果你希望在编辑器内部进行格式化的时候删除此元素，可以使用此方法设为空元素，因为空元素会在格式化时删除）
-   `el.getBlock()` ：获取该元素所在的根级块元素，如果自身是根级块元素则返回自身
-   `el.getInblock()` ：获取该元素所在的内部块元素，如果自身是内部块元素则返回自身
-   `el.getInline()` ：获取该元素所在的行内元素，如果自身是行内元素则返回自身，如果该元素不在行内元素中则返回 null
-   `el.isEqualStyles(element)` ：判断 el 与 element 的 styles 是否相同，如果二者都没有 styles 也会返回 true
-   `el.isEqualMarks(element)` ：判断 el 与 element 的 marks 是否相同，如果二者都没有 marks 也会返回 true
-   `AlexElement.isElement(val)` ：判断 val 是否 AlexElement 对象
-   `AlexElement.flatElements(elements)` ：将 elements 元素数组转为扁平化元素数组
-   `AlexElement.getSpaceElement()`：返回一个空白元素，该元素是一个 text 元素，其内容不显示，但是不会被认定为空元素
-   `AlexElement.BLOCK_NODE` ：定义段落元素，默认是"p"
-   `AlexElement.TEXT_NODE` ：定义文本元素的标签，默认是"span"
-   `AlexElement.VOID_NODES` ：定义不显示的元素标签数组，存在于该数组中的元素标签所表示的元素在批量删除行为时会被过滤掉

> 自行创建的 AlexElement 元素实例，向编辑器内插入需要添加到某元素的 children 里，并且该元素的 parent 设为某元素。你可以选择 editor.addElementTo、editor.addElementBefore 和 editor.addElementAfter 来插入新的元素，此时不需要你自己设置 children 和 parent

> 在内部块元素内部执行删除操作时，当内部块元素为空时，始终给一个换行符进行占位，该元素不会被删除；在内部块元素内部执行换行操作无效；向内部块元素插入内部块元素时，直接作为其子元素；

> 如果你希望内部块元素在删除、换行和插入操作时拥有和根级块元素一样的表现，设置其行为属性值 behavior 为"block"

### AlexPoint：虚拟光标的点对象

AlexPoint 表示虚拟光标的点，由编辑器内部创建实例，包含 element 和 offset 两个属性

-   elemet: 即 AlexElement 实例，即该点所在的元素，只能是 closed 元素或者 text 元素
-   offset：即点在元素上的偏移值，如果是 closed 元素，只能是 0 和 1

AlexPoint 提供以下几种语法来方便我们的操作：

-   `point.isEqual(target)` ：point 是否和 target 相等，即两个点是否同一个
-   `point.moveToEnd(element)` ：将点移动到 element 之后，如果 element 不是 closed 元素和 text 元素，会查找其最后一个子元素，以此类推，直至获取到 closed 元素或 text 元素
-   `point.moveToStart(element)` ：将点移动到 element 之前，如果 element 不是 closed 元素和 text 元素，会查找其第一个子元素，以此类推，直至获取到 closed 元素或 text 元素
-   `AlexPoint.isPoint(val)` ：判断 val 是否 AlexPoint 对象

### AlexRange：虚拟光标的范围对象

AlexRange 实例由编辑器内部创建并挂在在 `editor.range` 上，它包含 anchor 和 focus 两个属性：

-   anchor：起点，是一个 AlexPoint 实例
-   focus：终点，是一个 AlexPoint 实例

> 如果 anchor 和 focus 相等，则表示虚拟光标在某一点上，没有选择区域；如果 anchor.element 和 foucs.element 相等，则表示虚拟光标在一个元素上

> anchor 和 focus 只要不相等，表示虚拟光标的起点和终点不在一起，即用户操作选区

> 自定义操作中如果使用的是 editor 提供的语法，如 insertText，insertElement，delete 等等，会自动更新虚拟光标位置。如果你是自行操作，不依赖于这些语法，你需要手动去更新 range 的 anchor 和 focus，主要是设置新的点位

### AlexHistory：历史记录对象

AlexHistory 是 editor 内部封装的一个用于读取和存入历史记录的对象，可以用来实现撤销和重做的功能，包含两个属性：

-   records：一个数组，数组内的元素包含 stack 和 range 两个属性，stack 表示记录的元素数组，range 表示记录的光标信息
-   current：记录当前编辑器展示的 stack 和 range 在 records 中的序列

AlexHistory 通过以下方法来读取和操作历史记录：

-   `history.get(type)` ：type 为-1 时表示读取上一个历史记录，type 为 1 时表示读取下一个历史记录，返回一个包含 stack 和 range 的对象
-   `history.push(stack,range)` ：将 stack 和 range 保存在历史记录中

> editor 在每次执行 domRender 时，当 unPushHistory 参数为 false 时，都会自动把当前编辑器的 stack 和 range 保存到 history 中去

> 自定义撤销和重做功能时，你需要通过 get 方法读取 stack 和 range，然后赋值给编辑器的 stack 和 range，然后执行 editor.domRender(true)并通过 editor.rangeRender()设置真实光标
