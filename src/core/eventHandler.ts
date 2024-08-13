import { AlexRange } from '../Range'
import { AlexPoint } from '../Point'
import { data as DapData } from 'dap-util'
import { isContains } from './tool'
import { isUndo, isRedo } from './keyboard'
import { AlexEditor } from '../Editor'
import { doPaste, setClipboardData } from './function'

/**
 * 监听selection改变
 * @param this
 * @returns
 */
export const handleSelectionChange = function (this: AlexEditor) {
	//如果是中文输入则不更新range
	if (this.__isInputChinese) {
		return
	}
	//如果是内部修改range则不触发
	if (this.__innerSelectionChange) {
		return
	}
	const selection = window.getSelection()
	if (selection && selection.rangeCount) {
		const range = selection.getRangeAt(0)
		if (isContains(this.$el, range.startContainer as HTMLElement) && isContains(this.$el, range.endContainer as HTMLElement)) {
			let anchorNode = null
			let focusNode = null
			let anchorOffset = null
			let focusOffset = null
			//如果起点所在是文本节点
			if (range.startContainer.nodeType == 3) {
				anchorNode = range.startContainer.parentNode
				anchorOffset = range.startOffset
			}
			//如果起点所在是元素节点
			else if (range.startContainer.nodeType == 1) {
				const childNodes = Array.from(range.startContainer.childNodes)
				if (childNodes.length) {
					anchorNode = childNodes[range.startOffset] ? childNodes[range.startOffset] : childNodes[range.startOffset - 1]
					anchorOffset = childNodes[range.startOffset] ? 0 : 1
					if (anchorNode.nodeType == 3) {
						anchorOffset = anchorOffset == 0 ? 0 : anchorNode.textContent!.length
						anchorNode = anchorNode.parentNode
					}
				}
				//如果没有子节点，表示是被认为是closed的元素
				else {
					anchorNode = range.startContainer
					anchorOffset = 0
				}
			}
			//如果终点所在是文本节点
			if (range.endContainer.nodeType == 3) {
				focusNode = range.endContainer.parentNode
				focusOffset = range.endOffset
			}
			//如果终点所在是元素节点
			else if (range.endContainer.nodeType == 1) {
				const childNodes = Array.from(range.endContainer.childNodes)
				if (childNodes.length) {
					focusNode = childNodes[range.endOffset] ? childNodes[range.endOffset] : childNodes[range.endOffset - 1]
					focusOffset = childNodes[range.endOffset] ? 0 : 1
					if (focusNode.nodeType == 3) {
						focusOffset = focusOffset == 0 ? 0 : focusNode.textContent!.length
						focusNode = focusNode.parentNode
					}
				}
				//如果没有子节点，表示是被认为是closed的元素
				else {
					focusNode = range.endContainer
					focusOffset = 1
				}
			}
			const anchorKey = DapData.get(anchorNode as HTMLElement, 'data-alex-editor-key')
			const focusKey = DapData.get(focusNode as HTMLElement, 'data-alex-editor-key')
			const anchorEle = this.getElementByKey(anchorKey)!
			const focusEle = this.getElementByKey(focusKey)!
			const anchor = new AlexPoint(anchorEle, anchorOffset!)
			const focus = new AlexPoint(focusEle, focusOffset!)
			if (this.range) {
				this.range.anchor = anchor
				this.range.focus = focus
			} else {
				this.range = new AlexRange(anchor, focus)
			}
			this.history.updateRange(this.range)
			this.emit('rangeUpdate', this.range)
		}
	}
}

/**
 * 监听beforeinput
 * @param this
 * @param e
 * @returns
 */
export const handleBeforeInput = function (this: AlexEditor, e: Event) {
	const event = e as InputEvent
	//以下输入类型不进行处理
	if (event.inputType == 'deleteByCut' || event.inputType == 'insertFromPaste' || event.inputType == 'deleteByDrag' || event.inputType == 'insertFromDrop') {
		return
	}
	//禁用系统默认行为
	event.preventDefault()
	//如果是禁用状态
	if (this.disabled) {
		return
	}
	//插入文本
	if (event.inputType == 'insertText' && event.data) {
		this.insertText(event.data!)
		this.domRender()
		this.rangeRender()
	}
	//插入段落
	else if (event.inputType == 'insertParagraph' || event.inputType == 'insertLineBreak') {
		this.insertParagraph()
		this.domRender()
		this.rangeRender()
	}
	//删除内容
	else if (event.inputType == 'deleteContentBackward') {
		this.delete()
		this.domRender()
		this.rangeRender()
	}
}

/**
 * 监听中文输入
 * @param this
 * @param e
 * @returns
 */
export const handleChineseInput = function (this: AlexEditor, e: Event) {
	const event = e as InputEvent
	event.preventDefault()
	if (this.disabled) {
		return
	}
	if (event.type == 'compositionstart') {
		//每次开始输入中文时先清除延时器
		if (this.__chineseInputTimer) {
			clearTimeout(this.__chineseInputTimer)
			this.__chineseInputTimer = null
		}
		//改变标识
		this.__isInputChinese = true
	} else if (event.type == 'compositionend') {
		//在中文输入结束后插入数据
		if (event.data) {
			this.insertText(event.data!)
			this.domRender()
			this.rangeRender()
		}
		//加上延时器避免过早修改中文输入标识导致删除中文拼音时触发range更新
		this.__chineseInputTimer = setTimeout(() => {
			this.__isInputChinese = false
		}, 0)
	}
}

/**
 * 监听键盘事件
 * @param this
 * @param e
 * @returns
 */
export const handleKeyboard = function (this: AlexEditor, e: Event) {
	if (this.__isInputChinese) {
		return
	}
	const event = e as KeyboardEvent
	//键盘按下
	if (event.type == 'keydown') {
		//撤销
		if (isUndo(event)) {
			event.preventDefault()
			this.undo()
		}
		//重做
		else if (isRedo(event)) {
			event.preventDefault()
			this.redo()
		}
		//触发keydown事件
		this.emit('keydown', this.value, event)
	}
	//键盘松开
	else if (event.type == 'keyup') {
		//触发keyup事件
		this.emit('keyup', this.value, event)
	}
}

/**
 * 监听编辑器复制
 * @param this
 * @param e
 * @returns
 */
export const handleCopy = async function (this: AlexEditor, e: Event) {
	const event = e as ClipboardEvent
	//阻止默认事件
	event.preventDefault()
	//没有获取光标
	if (!this.range) {
		return
	}
	//不允许复制
	if (!this.allowCopy) {
		return
	}
	//获取选区内的元素数据
	const result = this.getElementsByRange().list
	//如果剪切板有数据并且有光标选区
	if (event.clipboardData && result.length) {
		const { text, html } = setClipboardData.apply(this, [event.clipboardData, result])
		this.emit('copy', text, html)
	}
}

/**
 * 监听编辑器剪切
 * @param this
 * @param e
 * @returns
 */
export const handleCut = async function (this: AlexEditor, e: Event) {
	const event = e as ClipboardEvent
	//阻止默认事件
	event.preventDefault()
	//没有获取光标
	if (!this.range) {
		return
	}
	//不允许剪切
	if (!this.allowCut) {
		return
	}
	//获取选区内的元素数据
	const result = this.getElementsByRange().list
	//如果支持剪切板数据并且有光标选区
	if (event.clipboardData && result.length) {
		const { text, html } = setClipboardData.apply(this, [event.clipboardData, result])
		//在编辑器不禁用的情况下将选区内的元素都删除
		if (!this.disabled) {
			this.delete()
			this.domRender()
			this.rangeRender()
		}
		//触发剪切事件
		this.emit('cut', text, html)
	}
}

/**
 * 监听编辑器粘贴
 * @param this
 * @param e
 * @returns
 */
export const handlePaste = async function (this: AlexEditor, e: Event) {
	const event = e as ClipboardEvent
	event.preventDefault()
	if (this.disabled) {
		return
	}
	if (!this.range) {
		return
	}
	if (!this.allowPaste) {
		return
	}
	if (event.clipboardData) {
		//html内容
		const html = event.clipboardData.getData('text/html')
		//文本内容
		const text = event.clipboardData.getData('text/plain')
		//文件数组
		const files = event.clipboardData.files
		//粘贴处理
		await doPaste.apply(this, [html, text, files])
		//渲染
		this.domRender()
		this.rangeRender()
	}
}

/**
 * 监听编辑器拖拽和拖放
 * @param this
 * @param e
 * @returns
 */
export const handleDragDrop = async function (this: AlexEditor, e: Event) {
	e.preventDefault()
	//处理拖放
	if (e.type == 'drop') {
		if (this.disabled) {
			return
		}
		if (!this.range) {
			return
		}
		if (!this.allowPaste) {
			return
		}
		const event = e as DragEvent
		if (event.dataTransfer) {
			//html内容
			const html = event.dataTransfer.getData('text/html')
			//文本内容
			const text = event.dataTransfer.getData('text/plain')
			//文件数组
			const files = event.dataTransfer.files
			//粘贴处理
			await doPaste.apply(this, [html, text, files])
			//格式化和渲染
			this.domRender()
			this.rangeRender()
		}
	}
}

/**
 * 监听编辑器获取焦点
 * @param this
 * @param e
 * @returns
 */
export const handleFocus = function (this: AlexEditor, e: Event) {
	if (this.disabled) {
		return
	}
	this.emit('focus', this.value, e as FocusEvent)
}

/**
 * 监听编辑器失去焦点
 * @param this
 * @param e
 * @returns
 */
export const handleBlur = function (this: AlexEditor, e: Event) {
	if (this.disabled) {
		return
	}
	this.emit('blur', this.value, e as FocusEvent)
}
