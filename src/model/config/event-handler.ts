import { delay } from '@/tools'
import { Editor } from '../Editor'
import { handlerForPasteDrop, redressSelection, updateSelection } from './function'

/**
 * 监听selection
 */
export const onSelectionChange = async function (this: Editor) {
  if (!this.$el) {
    return
  }
  //正在输入中文
  if (this.isComposition) {
    return
  }
  //内部修改触发
  if (this.internalCauseSelectionChange) {
    return
  }
  //更新selection
  const hasUpdate = updateSelection.apply(this)
  //没有更新
  if (!hasUpdate) {
    return
  }
  //进行纠正
  const hasRedress = redressSelection.apply(this)
  //有纠正
  if (hasRedress) {
    //则渲染真实光标
    await this.updateRealSelection()
    return
  }
  //更新记录的selection
  this.history.updateSelection(this.selection)
  //触发事件
  if (typeof this.onSelectionUpdate == 'function') {
    this.onSelectionUpdate.apply(this, [this.selection])
  }
}

/**
 * 监听beforeinput
 */
export const onBeforeInput = async function (this: Editor, e: Event) {
  const event = e as InputEvent
  //中文输入相关保持默认行为
  if (event.inputType === 'insertCompositionText' || event.inputType === 'insertFromComposition') {
    return
  }
  //禁用系统默认行为
  event.preventDefault()
  //不可编辑
  if (!this.isEditable()) {
    return
  }
  //光标没有聚焦
  if (!this.selection.focused()) {
    return
  }
  //插入文本
  if (event.inputType == 'insertText' && event.data) {
    this.insertText(event.data!)
    this.updateView()
  }
  //删除内容
  else if (event.inputType == 'deleteContentBackward' || event.inputType == 'deleteByCut' || event.inputType == 'deleteByDrag') {
    //禁用剪切功能的情况
    if (event.inputType == 'deleteByCut' && !this.allowCut) {
      return
    }
    this.isUserDelection = true
    this.delete()
    await this.updateView()
    this.isUserDelection = false
  }
  //插入段落
  else if (event.inputType == 'insertParagraph' || event.inputType == 'insertLineBreak') {
    this.insertParagraph()
    this.updateView()
  }
  //粘贴
  else if (event.inputType == 'insertFromPaste') {
    //存在粘贴数据且允许粘贴
    if (event.dataTransfer && this.allowPaste) {
      await handlerForPasteDrop.apply(this, [event.dataTransfer])
      this.updateView()
    }
  }
  //拖入
  else if (event.inputType == 'insertFromDrop') {
    //延时，防止和deleteByDrag冲突
    await delay()
    //拖放时不会触发selectionchange，所以虚拟光标位置没有更新，这里主动更新一下
    updateSelection.apply(this)
    //存在粘贴数据且允许粘贴
    if (event.dataTransfer && this.allowPaste) {
      await handlerForPasteDrop.apply(this, [event.dataTransfer])
      this.updateView()
    }
  }
}

/**
 * 监听中文输入
 */
export const onComposition = async function (this: Editor, e: Event) {
  const event = e as InputEvent
  //不可编辑
  if (!this.isEditable()) {
    return
  }
  //开始输入中文
  if (event.type == 'compositionstart') {
    //改变标识
    this.isComposition = true
  }
  //输入中文结束后
  else if (event.type == 'compositionend') {
    //获取真实光标
    const realSelection = window.getSelection()!
    const range = realSelection.getRangeAt(0)
    //获取真实光标所在的真实dom，一定是文本
    const element = range.endContainer
    //父元素
    const parentElement = element.parentNode! as HTMLElement
    //获取对应的节点
    const parentNode = this.findNode(parentElement)
    //是文本节点且文本不一致
    if (parentNode.isText() && parentNode.textContent != element.textContent) {
      const textContent = parentNode.textContent || ''
      //更新文本内容
      parentNode.textContent = element.textContent || ''
      //更新光标
      if (this.isSelectionInNode(parentNode)) {
        updateSelection.apply(this)
      }
      //移除非法的文本
      element.textContent = textContent
      //更新视图
      await this.updateView()
    }
    //不是文本节点
    else if (!parentNode.isText()) {
      //子元素在父元素中的位置
      const index = Array.from(parentElement.childNodes).findIndex(item => item === element)
      //将子元素转为节点
      const node = this.domParseNode(element)
      //添加到编辑器内
      parentNode.children!.splice(index, 0, node)
      node.parent = parentNode
      //删除非法dom
      parentElement.removeChild(element)
      //重置光标到节点后
      if (this.selection.focused()) {
        this.setSelectionAfter(node, 'all')
      }
      //更新视图
      await this.updateView()
    }
    //改变标识
    this.isComposition = false
  }
}

/**
 * 监听键盘事件
 */
export const onKeyboard = function (this: Editor, e: Event) {
  if (this.isComposition) {
    return
  }
  const event = e as KeyboardEvent
  //键盘按下
  if (event.type == 'keydown') {
    //不可编辑
    if (!this.isEditable()) {
      return
    }
    //触发keydown
    if (typeof this.onKeydown == 'function') {
      this.onKeydown.apply(this, [event])
    }
  }
  //键盘松开
  else if (event.type == 'keyup') {
    //不可编辑
    if (!this.isEditable()) {
      return
    }
    //触发keyup
    if (typeof this.onKeyup == 'function') {
      this.onKeyup.apply(this, [event])
    }
  }
}

/**
 * 监听编辑器获取焦点
 */
export const onFocus = function (this: Editor, e: Event) {
  //不可编辑
  if (!this.isEditable()) {
    return
  }
  if (typeof this.onFocus == 'function') {
    this.onFocus.apply(this, [e as FocusEvent])
  }
}

/**
 * 监听编辑器失去焦点
 */
export const onBlur = function (this: Editor, e: Event) {
  //不可编辑
  if (!this.isEditable()) {
    return
  }
  if (typeof this.onBlur == 'function') {
    this.onBlur.apply(this, [e as FocusEvent])
  }
}
/**
 * 监听编辑器复制
 */
export const onCopy = function (this: Editor, e: Event) {
  const event = e as ClipboardEvent
  if (!this.allowCopy) {
    event.preventDefault()
  }
}

/**
 * 监听编辑器剪切
 */
export const onCut = function (this: Editor, e: Event) {
  const event = e as ClipboardEvent
  if (!this.allowCut) {
    event.preventDefault()
  }
}
