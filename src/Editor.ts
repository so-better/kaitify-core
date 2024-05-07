import { event as DapEvent, common as DapCommon } from 'dap-util'
import { AlexElement, AlexElementConfigType } from './Element'
import { AlexRange } from './Range'
import { AlexPoint } from './Point'
import { AlexHistory } from './History'
import { blockParse, closedParse, inblockParse, inlineParse } from './core/nodeParse'
import { initEditorNode, initEditorOptions, createGuid, getAttributes, getStyles, isSpaceText, getHighestByFirst, EditorOptionsType, ObjectType } from './core/tool'
import { handleNotStackBlock, handleInblockWithOther, handleInlineChildrenNotInblock, breakFormat, mergeWithBrotherElement, mergeWithParentElement, mergeWithSpaceTextElement } from './core/formatRules'
import { checkStack, setRecentlyPoint, emptyDefaultBehaviorInblock, setRangeInVisible, handleStackEmpty, handleSelectionChange, handleBeforeInput, handleChineseInput, handleKeyboard, handleCopy, handleCut, handlePaste, handleDragDrop, handleFocus, handleBlur } from './core/operation'

export type AlexElementRangeType = {
	element: AlexElement
	offset: number[] | false
}

export type AlexElementsRangeType = {
	list: AlexElementRangeType[]
	flatList: AlexElementRangeType[]
}

export class AlexEditor {
	//编辑器容器
	$el: HTMLElement
	//是否禁用
	disabled: boolean
	//编辑器的值
	value: string
	//自定义渲染规则
	renderRules: ((element: AlexElement) => void)[]
	//是否允许复制
	allowCopy: boolean
	//是否允许粘贴
	allowPaste: boolean
	//是否允许剪切
	allowCut: boolean
	//是否允许粘贴html
	allowPasteHtml: boolean
	//自定义纯文本粘贴方法
	customTextPaste: ((text: string) => void | Promise<void>) | null
	//自定义html粘贴方法
	customHtmlPaste: ((AlexElements: AlexElement[], html: string) => void | Promise<void>) | null
	//自定义图片粘贴方法
	customImagePaste: ((file: File) => void | Promise<void>) | null
	//自定义视频粘贴方法
	customVideoPaste: ((file: File) => void | Promise<void>) | null
	//自定义文件粘贴方法（除图片视频外）
	customFilePaste: ((file: File) => void | Promise<void>) | null
	//自定义处理不可编辑元素合并的逻辑
	customMerge: ((mergeElement: AlexElement, targetElement: AlexElement) => void | Promise<void>) | null
	//自定义dom转为非文本元素的后续处理逻辑
	customParseNode: ((el: AlexElement) => AlexElement) | null
	//dom转为非文本元素时需要额外保留的标签数组
	extraKeepTags: string[]
	//创建历史记录
	history: AlexHistory = new AlexHistory()
	//存放元素的数组
	stack: AlexElement[]
	//光标虚拟对象
	range: AlexRange | null = null

	//编辑器唯一id
	__guid: number = createGuid()
	//事件集合
	__events: ObjectType = {}
	//是否第一次渲染
	__firstRender: boolean = true
	//是否正在输入中文
	__isInputChinese: boolean = false
	//是否内部修改真实光标引起selctionChange事件
	__innerSelectionChange: boolean = false
	//取消中文输入标识的延时器
	__chineseInputTimer: any = null

	constructor(node: HTMLElement | string, opts: EditorOptionsType) {
		this.$el = initEditorNode(node)
		const options = initEditorOptions(opts)
		this.disabled = options.disabled!
		this.value = options.value!
		this.renderRules = options.renderRules!
		this.allowCopy = options.allowCopy!
		this.allowPaste = options.allowPaste!
		this.allowCut = options.allowCut!
		this.allowPasteHtml = options.allowPasteHtml!
		this.customTextPaste = options.customTextPaste!
		this.customHtmlPaste = options.customHtmlPaste!
		this.customImagePaste = options.customImagePaste!
		this.customVideoPaste = options.customVideoPaste!
		this.customFilePaste = options.customFilePaste!
		this.customMerge = options.customMerge!
		this.customParseNode = options.customParseNode!
		this.extraKeepTags = options.extraKeepTags!

		//将html内容转为元素数组
		this.stack = this.parseHtml(this.value)
		//初始化校验stack
		checkStack.apply(this)
		//编辑器禁用和启用设置
		this.disabled ? this.setDisabled() : this.setEnabled()

		//设置selection的监听更新range
		DapEvent.on(document, `selectionchange.alex_editor_${this.__guid}`, handleSelectionChange.bind(this))
		//监听内容输入
		DapEvent.on(this.$el, 'beforeinput.alex_editor', handleBeforeInput.bind(this))
		//监听中文输入
		DapEvent.on(this.$el, 'compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor', handleChineseInput.bind(this))
		//监听键盘事件
		DapEvent.on(this.$el, 'keydown.alex_editor keyup.alex_editor', handleKeyboard.bind(this))
		//监听编辑器剪切
		DapEvent.on(this.$el, 'cut.alex_editor', handleCut.bind(this))
		//监听编辑器粘贴
		DapEvent.on(this.$el, 'paste.alex_editor', handlePaste.bind(this))
		//监听编辑器复制
		DapEvent.on(this.$el, 'copy.alex_editor', handleCopy.bind(this))
		//禁用编辑器拖拽和拖放
		DapEvent.on(this.$el, 'dragstart.alex_editor drop.alex_editor', handleDragDrop.bind(this))
		//监听编辑器获取焦点
		DapEvent.on(this.$el, 'focus.alex_editor', handleFocus.bind(this))
		//监听编辑器失去焦点
		DapEvent.on(this.$el, 'blur.alex_editor', handleBlur.bind(this))
	}

	/**
	 * 初始化设置默认的range
	 */
	initRange() {
		const elements = AlexElement.flatElements(this.stack).filter(el => {
			return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom!)
		})
		const firstElement = elements[0]
		const anchor = new AlexPoint(firstElement, 0)
		const focus = new AlexPoint(firstElement, 0)
		this.range = new AlexRange(anchor, focus)
	}

	/**
	 * 根据光标进行删除操作
	 */
	delete() {
		if (this.disabled) {
			return
		}
		if (!this.range) {
			return
		}
		//起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//前一个可设置光标的元素
			const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
			//光标所在的根级块元素
			const block = this.range.anchor.element.getBlock()
			//光标所在的内部块元素
			const inblock = this.range.anchor.element.getInblock()
			//如果光标在内部块元素里
			if (inblock) {
				//如果光标在所在元素的开始处
				if (this.range.anchor.offset == 0) {
					//前一个可设置光标的元素存在
					if (previousElement) {
						//如果光标不在内部块元素的开始处
						if (inblock.isContains(previousElement)) {
							this.range.anchor.moveToEnd(previousElement)
							this.range.focus.moveToEnd(previousElement)
							this.delete()
							return
						}
						//如果光标在内部块元素的开始处并且行为值为block
						else if (inblock.behavior == 'block') {
							const previousBlock = previousElement.getBlock()
							const previousInblock = previousElement.getInblock()
							//前一个可获取焦点的元素在内部块内部，并且它的行为值是block，则进行合并操作
							if (previousInblock) {
								if (previousInblock.behavior == 'block') {
									this.merge(inblock, previousInblock)
								}
							}
							//不在内部块内部则合并根级块元素
							else {
								this.merge(inblock, previousBlock)
							}
						}
					}
					//前一个可设置光标的元素不存在
					else {
						//光标此刻在内部块的开始处，也在编辑器的开始处
						this.emit('deleteInStart', inblock)
					}
				}
				//如果光标在所在元素内部
				else {
					//如果光标在空白元素文本内
					if (this.range.anchor.element.isSpaceText()) {
						this.range.anchor.element.toEmpty()
						if (inblock.isEmpty()) {
							const breakEl = new AlexElement('closed', 'br', null, null, null)
							this.addElementTo(breakEl, inblock)
							this.range.anchor.moveToStart(breakEl)
							this.range.focus.moveToStart(breakEl)
						} else {
							this.range.anchor.offset = 0
							this.range.focus.offset = 0
							this.delete()
							return
						}
					}
					//如果光标在文本元素内
					else if (this.range.anchor.element.isText()) {
						//文本元素的值
						const val = this.range.anchor.element.textContent!
						//起点向前一位
						this.range.anchor.offset -= 1
						//要删除的字符是否空白文本
						const isSpace = isSpaceText(val[this.range.anchor.offset])
						//进行删除
						this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset) + val.substring(this.range.focus.offset)
						//重新设置终点位置
						this.range.focus.offset = this.range.anchor.offset
						//如果删除的字符是空白文本，则再执行一次删除操作
						if (isSpace) {
							this.delete()
							return
						}
						//如果内部块元素为空
						if (inblock.isEmpty()) {
							//建一个换行符元素作为占位元素
							const breakEl = new AlexElement('closed', 'br', null, null, null)
							this.addElementTo(breakEl, inblock)
							this.range.anchor.moveToStart(breakEl)
							this.range.focus.moveToStart(breakEl)
						}
					}
					//如果光标在自闭合元素内
					else {
						//删除的是否换行符
						const isBreak = this.range.anchor.element.isBreak()
						//删除该自闭合元素
						this.range.anchor.element.toEmpty()
						//如果所在的内部块元素为空
						if (inblock.isEmpty()) {
							//如果删除的不是换行符或者内部块的行为值是默认的，则创建换行符
							if (!isBreak || inblock.behavior == 'default') {
								const breakEl = new AlexElement('closed', 'br', null, null, null)
								this.addElementTo(breakEl, inblock)
								this.range.anchor.moveToStart(breakEl)
								this.range.focus.moveToStart(breakEl)
							}
							//删除的是换行符并且内部块的行为值是block，但是前一个可以获取焦点的元素不存在
							else if (!previousElement) {
								//此刻光标在内部块的开始处，也在编辑器的开始处，且内部块为空了
								const breakEl = new AlexElement('closed', 'br', null, null, null)
								this.addElementTo(breakEl, inblock)
								this.range.anchor.moveToStart(breakEl)
								this.range.focus.moveToStart(breakEl)
							}
						}
					}
				}
			}
			//如果光标不在内部块元素里，即在根级块元素里
			else {
				//如果光标在所在元素的开始处
				if (this.range.anchor.offset == 0) {
					//前一个可设置光标的元素存在
					if (previousElement) {
						//如果光标不在根级块元素的开始处
						if (block.isContains(previousElement)) {
							this.range.anchor.moveToEnd(previousElement)
							this.range.focus.moveToEnd(previousElement)
							this.delete()
							return
						}
						//如果光标在根级块元素的开始处
						else {
							const previousInblock = previousElement.getInblock()
							const previousBlock = previousElement.getBlock()
							//如果前一个可设置光标的元素在内部块内并且它的行为值是block，则进行合并
							if (previousInblock) {
								if (previousInblock.behavior == 'block') {
									//将根级块元素与内部块元素进行合并
									this.merge(block, previousInblock)
								}
							}
							//如果前一个可设置光标的元素不在内部块内，则进行根级块元素的合并操作
							else {
								this.merge(block, previousBlock)
							}
						}
					}
					//前一个可设置光标的元素不存在
					else {
						//光标此刻在根级块的开始处，也在编辑器的开始处
						this.emit('deleteInStart', block)
					}
				}
				//如果光标在所在元素内部
				else {
					//如果光标在空白元素文本内
					if (this.range.anchor.element.isSpaceText()) {
						this.range.anchor.element.toEmpty()
						if (block.isEmpty()) {
							const breakEl = new AlexElement('closed', 'br', null, null, null)
							this.addElementTo(breakEl, block)
							this.range.anchor.moveToStart(breakEl)
							this.range.focus.moveToStart(breakEl)
						} else {
							this.range.anchor.offset = 0
							this.range.focus.offset = 0
							this.delete()
							return
						}
					}
					//如果光标在文本元素内
					else if (this.range.anchor.element.isText()) {
						//文本元素的值
						const val = this.range.anchor.element.textContent!
						//起点向前一位
						this.range.anchor.offset -= 1
						//要删除的字符是否空白文本
						const isSpace = isSpaceText(val[this.range.anchor.offset])
						//进行删除
						this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset) + val.substring(this.range.focus.offset)
						//重新设置终点位置
						this.range.focus.offset = this.range.anchor.offset
						//如果删除的字符是空白文本，则再执行一次删除操作
						if (isSpace) {
							this.delete()
							return
						}
						//如果根级块元素为空
						if (block.isEmpty()) {
							//建一个换行符元素作为占位元素
							const breakEl = new AlexElement('closed', 'br', null, null, null)
							this.addElementTo(breakEl, block)
							this.range.anchor.moveToStart(breakEl)
							this.range.focus.moveToStart(breakEl)
						}
					}
					//如果光标在自闭合元素内
					else {
						//删除的是否换行符
						const isBreak = this.range.anchor.element.isBreak()
						//删除该自闭合元素
						this.range.anchor.element.toEmpty()
						//如果所在的根级块元素为空
						if (block.isEmpty()) {
							//第一种情况：如果删除的不是换行符
							//第二种情况：如果是换行符但是前一个可以设置光标的元素不存在，此刻光标在根级块的开始处，也在编辑器的开始处，且根级块为空了
							if (!isBreak || !previousElement) {
								const breakEl = new AlexElement('closed', 'br', null, null, null)
								this.addElementTo(breakEl, block)
								this.range.anchor.moveToStart(breakEl)
								this.range.focus.moveToStart(breakEl)
							}
						}
					}
				}
			}
		}
		//起点和终点不在一起
		else {
			const result = this.getElementsByRange().list.filter(item => {
				//批量删除时需要过滤掉那些不显示的元素
				return !AlexElement.VOID_NODES.includes(item.element.parsedom!)
			})
			//起点所在的内部块元素
			const anchorInblock = this.range.anchor.element.getInblock()
			//终点所在的内部块元素
			const focusInblock = this.range.focus.element.getInblock()
			//起点所在的根级块元素
			const anchorBlock = this.range.anchor.element.getBlock()
			//终点所在的根级块元素
			const focusBlock = this.range.focus.element.getBlock()
			//起点和终点都在同一个内部块中
			if (anchorInblock && focusInblock && anchorInblock.isEqual(focusInblock)) {
				result.forEach(item => {
					//如果存在offset说明不全是在选区内
					if (item.offset) {
						item.element.textContent = item.element.textContent!.substring(0, item.offset[0]) + item.element.textContent!.substring(item.offset[1])
					}
					//不存在offset说明全在选区内
					else {
						item.element.toEmpty()
					}
					if (anchorInblock.isEmpty()) {
						const breakEl = new AlexElement('closed', 'br', null, null, null)
						this.addElementTo(breakEl, anchorInblock)
					}
				})
			}
			//起点和终点都在内部块中但是不在同一个内部块中
			else if (anchorInblock && focusInblock) {
				result.forEach(item => {
					//如果存在offset说明不全是在选区内
					if (item.offset) {
						item.element.textContent = item.element.textContent!.substring(0, item.offset[0]) + item.element.textContent!.substring(item.offset[1])
					}
					//不存在offset说明全在选区内
					else {
						if (item.element.isInblock() && item.element.behavior == 'default') {
							emptyDefaultBehaviorInblock.apply(this, [item.element])
						} else {
							item.element.toEmpty()
							if (item.element.parent && (item.element.parent.isInblock() || item.element.parent.isBlock()) && item.element.parent.isEmpty()) {
								const breakEl = new AlexElement('closed', 'br', null, null, null)
								this.addElementTo(breakEl, item.element.parent)
							}
						}
					}
				})
				//如果两个内部块的行为值都是block，则合并
				if (anchorInblock.behavior == 'block' && focusInblock.behavior == 'block') {
					this.merge(focusInblock, anchorInblock)
				}
			}
			//起点在内部块中，终点不在内部块中
			else if (anchorInblock) {
				result.forEach(item => {
					//如果存在offset说明不全是在选区内
					if (item.offset) {
						item.element.textContent = item.element.textContent!.substring(0, item.offset[0]) + item.element.textContent!.substring(item.offset[1])
					}
					//不存在offset说明全在选区内
					else {
						if (item.element.isInblock() && item.element.behavior == 'default') {
							emptyDefaultBehaviorInblock.apply(this, [item.element])
						} else {
							item.element.toEmpty()
							if (item.element.parent && (item.element.parent.isInblock() || item.element.parent.isBlock()) && item.element.parent.isEmpty()) {
								const breakEl = new AlexElement('closed', 'br', null, null, null)
								this.addElementTo(breakEl, item.element.parent)
							}
						}
					}
				})
				//如果起点所在内部块的行为值是block则合并
				if (anchorInblock.behavior == 'block') {
					this.merge(focusBlock, anchorInblock)
				}
			}
			//终点在内部块中，起点不在内部块中
			else if (focusInblock) {
				result.forEach(item => {
					//如果存在offset说明不全是在选区内
					if (item.offset) {
						item.element.textContent = item.element.textContent!.substring(0, item.offset[0]) + item.element.textContent!.substring(item.offset[1])
					}
					//不存在offset说明全在选区内
					else {
						if (item.element.isInblock() && item.element.behavior == 'default') {
							emptyDefaultBehaviorInblock.apply(this, [item.element])
						} else {
							item.element.toEmpty()
							if (item.element.parent && (item.element.parent.isInblock() || item.element.parent.isBlock()) && item.element.parent.isEmpty()) {
								const breakEl = new AlexElement('closed', 'br', null, null, null)
								this.addElementTo(breakEl, item.element.parent)
							}
						}
					}
				})
				//如果终点所在内部块的行为值是block则合并
				if (focusInblock.behavior == 'block') {
					this.merge(focusInblock, anchorBlock)
				}
			}
			//起点和终点在同一个根级块元素中
			else if (anchorBlock.isEqual(focusBlock)) {
				result.forEach(item => {
					//如果存在offset说明不全是在选区内
					if (item.offset) {
						item.element.textContent = item.element.textContent!.substring(0, item.offset[0]) + item.element.textContent!.substring(item.offset[1])
					}
					//不存在offset说明全在选区内
					else {
						item.element.toEmpty()
					}
					if (anchorBlock.isEmpty()) {
						const breakEl = new AlexElement('closed', 'br', null, null, null)
						this.addElementTo(breakEl, anchorBlock)
					}
				})
			}
			//起点和终点不在一个根级块元素中
			else {
				result.forEach(item => {
					//如果存在offset说明不全是在选区内
					if (item.offset) {
						item.element.textContent = item.element.textContent!.substring(0, item.offset[0]) + item.element.textContent!.substring(item.offset[1])
					}
					//不存在offset说明全在选区内
					else {
						if (item.element.isInblock() && item.element.behavior == 'default') {
							emptyDefaultBehaviorInblock.apply(this, [item.element])
						} else {
							item.element.toEmpty()
							if (item.element.parent && (item.element.parent.isInblock() || item.element.parent.isBlock()) && item.element.parent.isEmpty()) {
								const breakEl = new AlexElement('closed', 'br', null, null, null)
								this.addElementTo(breakEl, item.element.parent)
							}
						}
					}
				})
				this.merge(focusBlock, anchorBlock)
			}
		}
		//如果起点所在元素是空元素则更新起点
		if (this.range.anchor.element.isEmpty()) {
			setRecentlyPoint.apply(this, [this.range.anchor])
		}
		//合并起点和终点
		this.range.focus.element = this.range.anchor.element
		this.range.focus.offset = this.range.anchor.offset
		//为空判断进行初始化
		handleStackEmpty.apply(this)
		//触发删除完成事件
		this.emit('deleteComplete')
	}

	/**
	 * 根据光标位置向编辑器内插入文本
	 */
	insertText(data: string) {
		if (this.disabled) {
			return
		}
		if (!this.range) {
			return
		}
		if (!data || typeof data != 'string') {
			throw new Error('The argument must be a string')
		}
		//起点和终点在一个位置
		if (this.range.anchor.isEqual(this.range.focus)) {
			//不是代码块内则对空格进行处理
			if (!this.range.anchor.element.isPreStyle()) {
				data = data.replace(/\s/g, () => {
					const span = document.createElement('span')
					span.innerHTML = '&nbsp;'
					return span.innerText
				})
			}
			//如果是文本
			if (this.range.anchor.element.isText()) {
				let val = this.range.anchor.element.textContent!
				this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset) + data + val.substring(this.range.anchor.offset)
				this.range.anchor.offset = this.range.anchor.offset + data.length
				this.range.focus.offset = this.range.anchor.offset
			}
			//如果是自闭合元素
			else {
				const textEl = new AlexElement('text', null, null, null, data)
				if (this.range.anchor.offset == 0) {
					this.addElementBefore(textEl, this.range.anchor.element)
				} else {
					this.addElementAfter(textEl, this.range.anchor.element)
				}
				this.range.anchor.moveToEnd(textEl)
				this.range.focus.moveToEnd(textEl)
			}
		}
		//起点和终点不在一个位置，即存在选区
		else {
			this.delete()
			this.insertText(data)
		}
	}

	/**
	 * 在光标处换行
	 */
	insertParagraph() {
		if (this.disabled) {
			return
		}
		if (!this.range) {
			return
		}
		//起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//前一个可设置光标的元素
			const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
			//后一个可设置光标的元素
			const nextElement = this.getNextElementOfPoint(this.range.anchor)
			//光标所在的根级块元素
			const block = this.range.anchor.element.getBlock()
			//光标所在的内部块元素
			const inblock = this.range.anchor.element.getInblock()
			//终点位置
			const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent!.length : 1
			//起点在内部块里
			if (inblock) {
				//在代码块样式中
				if (this.range.anchor.element.isPreStyle()) {
					this.insertText('\n')
					const text = AlexElement.getSpaceElement()
					this.insertElement(text)
					this.range.anchor.moveToEnd(text)
					this.range.focus.moveToEnd(text)
					this.emit('insertParagraph', inblock, inblock)
				}
				//不在代码块样式中且内部块元素的行为值是block
				else if (inblock.behavior == 'block') {
					//起点在内部块元素的起点位置
					if (this.range.anchor.offset == 0 && !(previousElement && inblock.isContains(previousElement))) {
						//在该内部块之前插入一个新的内部块
						const paragraph = inblock.clone(false)
						const breakEle = new AlexElement('closed', 'br', null, null, null)
						this.addElementTo(breakEle, paragraph)
						this.addElementBefore(paragraph, inblock)
						this.emit('insertParagraph', inblock, paragraph)
					}
					//起点在内部块元素的终点位置
					else if (this.range.anchor.offset == endOffset && !(nextElement && inblock.isContains(nextElement))) {
						//在该内部块之后插入一个新的内部块
						const paragraph = inblock.clone(false)
						const breakEle = new AlexElement('closed', 'br', null, null, null)
						this.addElementTo(breakEle, paragraph)
						this.addElementAfter(paragraph, inblock)
						this.range.anchor.moveToStart(breakEle)
						this.range.focus.moveToStart(breakEle)
						this.emit('insertParagraph', paragraph, inblock)
					}
					//起点在内部块元素的中间部分则需要切割
					else {
						const newInblock = inblock.clone()
						this.addElementAfter(newInblock, inblock)
						//记录起点所在元素在内部块元素中的序列
						const elements = AlexElement.flatElements(inblock.children!)
						const index = elements.findIndex(item => {
							return this.range!.anchor.element.isEqual(item)
						})
						//将终点移动到内部块元素末尾
						this.range.focus.moveToEnd(inblock)
						this.delete()
						//将终点移动到新的内部块元素
						const newElements = AlexElement.flatElements(newInblock.children!)
						this.range.focus.element = newElements[index]
						this.range.focus.offset = this.range.anchor.offset
						this.range.anchor.moveToStart(newInblock)
						this.delete()
						this.emit('insertParagraph', newInblock, inblock)
					}
				}
			}
			//起点不在内部块里
			else {
				//在代码块样式中
				if (this.range.anchor.element.isPreStyle()) {
					this.insertText('\n')
					const text = AlexElement.getSpaceElement()
					this.insertElement(text)
					this.range.anchor.moveToEnd(text)
					this.range.focus.moveToEnd(text)
					this.emit('insertParagraph', block, block)
				}
				//不在代码块样式中
				else {
					//起点在根级块元素的起点位置
					if (this.range.anchor.offset == 0 && !(previousElement && block.isContains(previousElement))) {
						//在该根级块元素之前插入一个新的根级块元素
						const paragraph = block.clone(false)
						const breakEle = new AlexElement('closed', 'br', null, null, null)
						this.addElementTo(breakEle, paragraph)
						this.addElementBefore(paragraph, block)
						this.emit('insertParagraph', block, paragraph)
					}
					//起点在根级块元素的终点位置
					else if (this.range.anchor.offset == endOffset && !(nextElement && block.isContains(nextElement))) {
						//在该根级块元素之后插入一个新的根级块元素
						const paragraph = block.clone(false)
						const breakEle = new AlexElement('closed', 'br', null, null, null)
						this.addElementTo(breakEle, paragraph)
						this.addElementAfter(paragraph, block)
						this.range.anchor.moveToStart(breakEle)
						this.range.focus.moveToStart(breakEle)
						this.emit('insertParagraph', paragraph, block)
					}
					//起点在根级块元素的中间部分则需要切割
					else {
						const newBlock = block.clone()
						this.addElementAfter(newBlock, block)
						//记录起点所在元素在根级块元素中的序列
						const elements = AlexElement.flatElements(block.children!)
						const index = elements.findIndex(item => {
							return this.range!.anchor.element.isEqual(item)
						})
						//记录起点的偏移值
						const offset = this.range.anchor.offset
						//将终点移动到根级块元素的末尾
						this.range.focus.moveToEnd(block)
						this.delete()
						//将终点移动到新的根级块元素
						const newElements = AlexElement.flatElements(newBlock.children!)
						this.range.focus.element = newElements[index]
						this.range.focus.offset = offset
						this.range.anchor.moveToStart(newBlock)
						this.delete()
						this.emit('insertParagraph', newBlock, block)
					}
				}
			}
		} else {
			this.delete()
			this.insertParagraph()
		}
	}

	/**
	 * 根据光标插入元素
	 * cover表示所在根级块或者内部块元素只有换行符时是否覆盖此元素
	 */
	insertElement(ele: AlexElement, cover: boolean | undefined = true) {
		if (this.disabled) {
			return
		}
		if (!this.range) {
			return
		}
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		//如果是空元素则不处理
		if (ele.isEmpty()) {
			return
		}
		//起点和终点在一个位置
		if (this.range.anchor.isEqual(this.range.focus)) {
			//前一个可设置光标的元素
			const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
			//后一个可设置光标的元素
			const nextElement = this.getNextElementOfPoint(this.range.anchor)
			//光标所在的根级块元素
			const block = this.range.anchor.element.getBlock()
			//光标所在的内部块元素
			const inblock = this.range.anchor.element.getInblock()
			//终点位置
			const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent!.length : 1
			//如果插入的元素是内部块且行为值为block，同时光标在内部块里且所在内部块的行为值是block
			if (ele.isInblock() && ele.behavior == 'block' && inblock && inblock.behavior == 'block') {
				//光标所在内部块是一个只有换行符的块，则该块需要被覆盖
				if (inblock.isOnlyHasBreak() && cover) {
					//在该内部块之前插入
					this.addElementBefore(ele, inblock)
					//删除当前内部块
					inblock.toEmpty()
				}
				//光标在当前内部块的起点位置
				else if (this.range.anchor.offset == 0 && !(previousElement && inblock.isContains(previousElement))) {
					//在该内部块元素之前插入
					this.addElementBefore(ele, inblock)
				}
				//光标在当前内部块的终点位置
				else if (this.range.anchor.offset == endOffset && !(nextElement && inblock.isContains(nextElement))) {
					//在该内部块元素之后插入
					this.addElementAfter(ele, inblock)
				}
				//光标在当前内部块的中间部分则需要切割
				else {
					const newInblock = inblock.clone()
					this.addElementAfter(newInblock, inblock)
					//将终点移动到该内部块元素末尾
					this.range.focus.moveToEnd(inblock)
					//执行删除操作
					this.delete()
					//将终点移动到新内部块元素
					const elements = AlexElement.flatElements(inblock.children!)
					const index = elements.findIndex(item => {
						return this.range!.anchor.element.isEqual(item)
					})
					const newElements = AlexElement.flatElements(newInblock.children!)
					this.range.focus.element = newElements[index]
					this.range.focus.offset = this.range.anchor.offset
					this.range.anchor.moveToStart(newInblock)
					//执行删除操作
					this.delete()
					//在新的内部块之前插入
					this.addElementBefore(ele, newInblock)
				}
			}
			//如果插入的元素是内部块，同时光标在内部块里，但是两个内部块的行为值并非同时是block
			else if (ele.isInblock() && inblock) {
				//光标所在内部块是一个只有换行符的块
				if (inblock.isOnlyHasBreak()) {
					//插入到内部块里
					this.addElementTo(ele, inblock, 0)
				}
				//光标在当前内部块的起点位置
				else if (this.range.anchor.offset == 0 && !(previousElement && inblock.isContains(previousElement))) {
					//插入到内部块里
					this.addElementTo(ele, inblock, 0)
				}
				//光标在当前内部块的终点位置
				else if (this.range.anchor.offset == endOffset && !(nextElement && inblock.isContains(nextElement))) {
					//插入到内部块里
					this.addElementTo(ele, inblock, inblock.children!.length)
				}
				//光标在当前内部块的中间部分则需要切割
				else {
					const newInblock = inblock.clone()
					this.addElementAfter(newInblock, inblock)
					//将终点移动到该内部块元素末尾
					this.range.focus.moveToEnd(inblock)
					//执行删除操作
					this.delete()
					//将终点移动到新内部块元素
					const elements = AlexElement.flatElements(inblock.children!)
					const index = elements.findIndex(item => {
						return this.range!.anchor.element.isEqual(item)
					})
					const newElements = AlexElement.flatElements(newInblock.children!)
					this.range.focus.element = newElements[index]
					this.range.focus.offset = this.range.anchor.offset
					this.range.anchor.moveToStart(newInblock)
					//执行删除操作
					this.delete()
					//在新的内部块最前面插入元素
					this.addElementTo(ele, newInblock)
					//合并内部块
					this.merge(newInblock, inblock)
				}
			}
			//如果插入的元素是内部块，但是光标不在内部块中
			else if (ele.isInblock()) {
				//光标所在根级块是一个只有换行符的块
				if (block.isOnlyHasBreak()) {
					//插入到根级块里
					this.addElementTo(ele, block, 0)
				}
				//光标在当前根级块的起点位置
				else if (this.range.anchor.offset == 0 && !(previousElement && block.isContains(previousElement))) {
					//插入到根级块里
					this.addElementTo(ele, block, 0)
				}
				//光标在当前根级块的终点位置
				else if (this.range.anchor.offset == endOffset && !(nextElement && block.isContains(nextElement))) {
					//插入到根级块里
					this.addElementTo(ele, block, block.children!.length)
				}
				//光标在当前根级块的中间部分则需要切割
				else {
					const newBlock = block.clone()
					this.addElementAfter(newBlock, block)
					//将终点移动到该根级块元素末尾
					this.range.focus.moveToEnd(block)
					//执行删除操作
					this.delete()
					//将终点移动到新根级块元素
					const elements = AlexElement.flatElements(block.children!)
					const index = elements.findIndex(item => {
						return this.range!.anchor.element.isEqual(item)
					})
					const newElements = AlexElement.flatElements(newBlock.children!)
					this.range.focus.element = newElements[index]
					this.range.focus.offset = this.range.anchor.offset
					this.range.anchor.moveToStart(newBlock)
					//执行删除操作
					this.delete()
					//在新的根级块最前面插入元素
					this.addElementTo(ele, newBlock)
					//合并根级块
					this.merge(newBlock, block)
				}
			}
			//如果插入的元素是根级块
			else if (ele.isBlock()) {
				//光标所在根级块是一个只有换行符的块，则该块需要被覆盖
				if (block.isOnlyHasBreak() && cover) {
					//在该根级块之前插入
					this.addElementBefore(ele, block)
					//删除当前根级块
					block.toEmpty()
				}
				//光标在当前根级块的起点位置
				else if (this.range.anchor.offset == 0 && !(previousElement && block.isContains(previousElement))) {
					//在该根级块元素之前插入
					this.addElementBefore(ele, block)
				}
				//光标在当前根级块的终点位置
				else if (this.range.anchor.offset == endOffset && !(nextElement && block.isContains(nextElement))) {
					//在该根级块元素之后插入
					this.addElementAfter(ele, block)
				}
				//光标在当前根级块的中间部分则需要切割
				else {
					const newBlock = block.clone()
					this.addElementAfter(newBlock, block)
					//将终点移动到该根级块元素末尾
					this.range.focus.moveToEnd(block)
					//执行删除操作
					this.delete()
					//将终点移动到新根级块元素
					const elements = AlexElement.flatElements(block.children!)
					const index = elements.findIndex(item => {
						return this.range!.anchor.element.isEqual(item)
					})
					const newElements = AlexElement.flatElements(newBlock.children!)
					this.range.focus.element = newElements[index]
					this.range.focus.offset = this.range.anchor.offset
					this.range.anchor.moveToStart(newBlock)
					//执行删除操作
					this.delete()
					//在新的根级块之前插入
					this.addElementBefore(ele, newBlock)
				}
			}
			//如果插入的是其他元素
			else {
				//是文本
				if (this.range.anchor.element.isText()) {
					let val = this.range.anchor.element.textContent!
					let newText = this.range.anchor.element.clone()
					this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset)
					newText.textContent = val.substring(this.range.anchor.offset)
					this.addElementAfter(newText, this.range.anchor.element)
					this.addElementBefore(ele, newText)
				}
				//自闭合元素
				else {
					if (this.range.anchor.offset == 0) {
						this.addElementBefore(ele, this.range.anchor.element)
					} else {
						this.addElementAfter(ele, this.range.anchor.element)
					}
				}
			}
			//重置光标
			this.range.anchor.moveToEnd(ele)
			this.range.focus.moveToEnd(ele)
		} else {
			this.delete()
			this.insertElement(ele, cover)
		}
	}

	/**
	 * 格式化stack
	 */
	formatElementStack() {
		//一种格式化方法对一组元素的格式化
		const format = (elements: AlexElement[], fn: (el: AlexElement) => void, isStack?: boolean) => {
			if (typeof isStack != 'boolean') {
				isStack = false
			}
			let index = 0
			while (index < elements.length) {
				//如果是null直接删除，跳过当前后续步骤
				if (!elements[index]) {
					elements.splice(index, 1)
					continue
				}
				//如果是空元素则直接删除，跳过当前后续步骤
				if (elements[index]!.isEmpty()) {
					if (this.range && elements[index]!.isContains(this.range.anchor.element)) {
						setRecentlyPoint.apply(this, [this.range.anchor])
					}
					if (this.range && elements[index]!.isContains(this.range.focus.element)) {
						setRecentlyPoint.apply(this, [this.range.focus])
					}
					elements.splice(index, 1)
					continue
				}
				//对元素使用该方法进行格式化
				fn.apply(this, [elements[index]!])
				//如果在经过格式化后是空元素，则需要删除该元素，并且跳过当前后续步骤
				if (elements[index]!.isEmpty()) {
					if (this.range && elements[index]!.isContains(this.range.anchor.element)) {
						setRecentlyPoint.apply(this, [this.range.anchor])
					}
					if (this.range && elements[index]!.isContains(this.range.focus.element)) {
						setRecentlyPoint.apply(this, [this.range.focus])
					}
					elements.splice(index, 1)
					continue
				}
				//如果当前元素是根级元素，但是不是根级块元素则转为根级块元素
				if (!elements[index]!.isBlock() && isStack) {
					elements[index]!.convertToBlock()
				}
				//对自身所有的子元素进行格式化
				if (elements[index]!.hasChildren()) {
					format(elements[index]!.children!, fn)
				}
				//子元素格式化后，当前元素变成空元素，则需要删除该元素，并且跳过后续步骤
				if (elements[index]!.isEmpty()) {
					if (this.range && elements[index]!.isContains(this.range.anchor.element)) {
						setRecentlyPoint.apply(this, [this.range.anchor])
					}
					if (this.range && elements[index]!.isContains(this.range.focus.element)) {
						setRecentlyPoint.apply(this, [this.range.focus])
					}
					elements.splice(index, 1)
					continue
				}
				//序列+1
				index++
			}
		}
		//获取自定义的格式化规则
		let renderRules = this.renderRules.filter(fn => {
			return typeof fn == 'function'
		})
		//这里合并父子元素执行两次，是因为合并兄弟元素会导致可能出现父子需要合并的情况
		;[handleNotStackBlock, handleInblockWithOther, handleInlineChildrenNotInblock, breakFormat, mergeWithParentElement, mergeWithBrotherElement, mergeWithParentElement, mergeWithSpaceTextElement, ...renderRules].forEach(fn => {
			format(this.stack, fn, true)
		})
		//判断stack是否为空进行初始化
		handleStackEmpty.apply(this)
	}

	/**
	 * 渲染编辑器dom内容
	 * unPushHistory为false表示加入历史记录
	 */
	domRender(unPushHistory: boolean | undefined = false) {
		//触发事件
		this.emit('beforeRender')
		//创建fragment
		const fragment = document.createDocumentFragment()
		//生成新的dom
		this.stack.forEach(element => {
			element.__render()
			fragment.appendChild(element.elm!)
		})
		//更新dom值
		this.$el.innerHTML = ''
		this.$el.appendChild(fragment)
		//暂记旧值
		const oldValue = this.value
		//设置新值
		this.value = this.$el.innerHTML
		//如果是第一次渲染或者值发生变化
		if (this.__firstRender || oldValue != this.value) {
			//如果不是第一次渲染，则触发change事件
			if (!this.__firstRender) {
				this.emit('change', this.value, oldValue)
			}
			//如果unPushHistory为false，则加入历史记录
			if (!unPushHistory) {
				//将本次的stack和range推入历史栈中
				this.history.push(this.stack, this.range)
			}
		}
		//修改是否第一次渲染的标记
		if (this.__firstRender) {
			this.__firstRender = false
		}
		//触发事件
		this.emit('afterRender')
	}

	/**
	 * 根据range来设置真实的光标
	 */
	rangeRender() {
		//如果编辑器被禁用则无法设置真实光标
		if (this.disabled) {
			return
		}
		if (this.range) {
			//将虚拟光标位置转为真实光标位置
			const handler = (point: AlexPoint) => {
				let node: HTMLElement | null = null
				let offset: number | null = null
				//如果是文本元素
				if (point.element.isText()) {
					node = <HTMLElement>point.element.elm!.childNodes[0]
					offset = point.offset
				}
				//自闭合元素
				else {
					node = point.element.parent!.elm
					const index = point.element.parent!.children!.findIndex(item => {
						return point.element.isEqual(item)
					})
					offset = point.offset + index
				}
				return { node, offset }
			}
			this.__innerSelectionChange = true
			const anchorResult = handler(this.range.anchor)
			const focusResult = handler(this.range.focus)
			//设置光标
			const selection = window.getSelection()
			if (selection) {
				selection.removeAllRanges()
				const range = document.createRange()
				range.setStart(anchorResult.node!, anchorResult.offset)
				range.setEnd(focusResult.node!, focusResult.offset)
				selection.addRange(range)
			}
		} else {
			const selection = window.getSelection()
			if (selection) {
				selection.removeAllRanges()
			}
		}
		setTimeout(() => {
			setRangeInVisible.apply(this)
			this.__innerSelectionChange = false
			this.history.updateCurrentRange(this.range!)
			this.emit('rangeUpdate', this.range)
		}, 0)
	}

	/**
	 * 将html转为元素
	 */
	parseHtml(html: string) {
		if (!html) {
			throw new Error('You need to give an html content to convert')
		}
		const node = document.createElement('div')
		node.innerHTML = html
		let elements: AlexElement[] = []
		Array.from(node.childNodes).forEach(el => {
			if (el.nodeType == 1 || el.nodeType == 3) {
				const element = this.parseNode(<HTMLElement>el)
				elements.push(element)
			}
		})
		return elements
	}

	/**
	 * 将node转为元素
	 */
	parseNode(node: HTMLElement) {
		if (!(node instanceof Node)) {
			throw new Error('The argument must be an node')
		}
		if (!(node.nodeType == 1 || node.nodeType == 3)) {
			throw new Error('The argument must be an element node or text node')
		}
		//文本节点
		if (node.nodeType == 3) {
			return new AlexElement('text', null, null, null, node.textContent)
		}
		//元素节点
		const marks = getAttributes(node)
		const styles = getStyles(node)
		const parsedom = node.nodeName.toLocaleLowerCase()
		//如果是style、meta和script标签，则返回一个空文本元素
		if (parsedom == 'style' || parsedom == 'meta' || parsedom == 'script' || parsedom == 'link') {
			return new AlexElement('text', null, null, null, null)
		}
		//如果是TEXT_NOE并且内部只有文本节点，则返回文本元素
		if (parsedom == AlexElement.TEXT_NODE && node.childNodes.length && Array.from(node.childNodes).every(childNode => childNode.nodeType == 3)) {
			return new AlexElement('text', null, marks, styles, node.textContent)
		}
		//默认配置
		const block = blockParse.find(item => item.parsedom == parsedom)
		const inblock = inblockParse.find(item => item.parsedom == parsedom)
		const inline = inlineParse.find(item => item.parsedom == parsedom)
		const closed = closedParse.find(item => item.parsedom == parsedom)
		//创建的元素
		let element: AlexElement | null = null
		//构造参数
		let config: AlexElementConfigType = {
			type: 'inblock',
			parsedom,
			marks,
			styles,
			behavior: 'default'
		}
		//默认的根级块元素
		if (block) {
			config.type = 'block'
			if (block.parse) {
				config.parsedom = AlexElement.BLOCK_NODE
			}
		}
		//默认的内部块元素
		else if (inblock) {
			config.type = 'inblock'
			if (inblock.block) {
				config.behavior = 'block'
			}
		}
		//默认的行内元素
		else if (inline) {
			config.type = 'inline'
			if (inline.parse) {
				config.parsedom = AlexElement.TEXT_NODE
				if (DapCommon.isObject(inline.parse)) {
					for (let key in <ObjectType>inline.parse) {
						if (typeof (<ObjectType>inline.parse)[key] == 'function') {
							config.styles[key] = (<ObjectType>inline.parse)[key].apply(this, [node])
						} else {
							config.styles[key] = (<ObjectType>inline.parse)[key]
						}
					}
				}
			}
		}
		//默认的自闭合元素
		else if (closed) {
			config.type = 'closed'
		}
		//其余元素
		else {
			if (!this.extraKeepTags.includes(config.parsedom)) {
				config.parsedom = AlexElement.TEXT_NODE
			}
			config.type = 'inline'
		}
		element = new AlexElement(config.type, config.parsedom, config.marks, config.styles, null)
		//设置行为值
		element.behavior = config.behavior
		//如果不是自闭合元素则设置子元素
		if (!closed) {
			Array.from(node.childNodes).forEach(childNode => {
				if (childNode.nodeType == 1 || childNode.nodeType == 3) {
					const childEle = this.parseNode(<HTMLElement>childNode)
					childEle.parent = element
					if (element!.hasChildren()) {
						element!.children!.push(childEle)
					} else {
						element!.children = [childEle]
					}
				}
			})
		}
		if (typeof this.customParseNode == 'function') {
			element = this.customParseNode.apply(this, [element])
		}
		return element
	}

	/**
	 * 将指定元素与另一个元素进行合并（仅限内部块元素和根级块元素）
	 */
	merge(ele: AlexElement, previousEle: AlexElement) {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The first argument must be an AlexElement instance')
		}
		if (!AlexElement.isElement(previousEle)) {
			throw new Error('The second argument must be an AlexElement instance')
		}
		if ((!ele.isBlock() && !ele.isInblock()) || (!previousEle.isBlock() && !previousEle.isInblock())) {
			throw new Error('Elements that are not "block" or "inblock" cannot be merged')
		}
		//如果自定义merge，则不走正常merge逻辑
		if (typeof this.customMerge == 'function') {
			this.customMerge.apply(this, [ele, previousEle])
		} else {
			previousEle.children!.push(...ele.children!)
			previousEle.children!.forEach(item => {
				item.parent = previousEle
			})
			ele.children = null
		}
	}

	/**
	 * 根据key查询元素
	 */
	getElementByKey(key: number) {
		if (!key) {
			throw new Error('You need to specify a key to do the query')
		}
		const fn = (elements: AlexElement[]): AlexElement | null => {
			let element: AlexElement | null = null
			const length = elements.length
			for (let i = 0; i < length; i++) {
				const item = elements[i]
				if (item && item.key === key) {
					element = item
					break
				}
				if (item && item.hasChildren()) {
					const el = fn(item.children!)
					if (el) {
						element = el
						break
					}
				}
			}
			return element
		}
		return fn(this.stack)
	}

	/**
	 * 获取指定元素的前一个兄弟元素（会跳过空元素）
	 */
	getPreviousElement(ele: AlexElement): AlexElement | null {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		if (ele.isBlock()) {
			const index = this.stack.findIndex(item => {
				return ele.isEqual(item)
			})
			if (index <= 0) {
				return null
			}
			if (this.stack[index - 1]!.isEmpty()) {
				return this.getPreviousElement(this.stack[index - 1]!)
			}
			return this.stack[index - 1]
		} else {
			const index = ele.parent!.children!.findIndex(item => {
				return ele.isEqual(item)
			})
			if (index <= 0) {
				return null
			}
			if (ele.parent!.children![index - 1]!.isEmpty()) {
				return this.getPreviousElement(ele.parent!.children![index - 1]!)
			}
			return ele.parent!.children![index - 1]
		}
	}

	/**
	 * 获取指定元素的后一个兄弟元素（会跳过空元素）
	 */
	getNextElement(ele: AlexElement): AlexElement | null {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		if (ele.isBlock()) {
			const index = this.stack.findIndex(item => {
				return ele.isEqual(item)
			})
			if (index >= this.stack.length - 1) {
				return null
			}
			if (this.stack[index + 1]!.isEmpty()) {
				return this.getNextElement(this.stack[index + 1]!)
			}
			return this.stack[index + 1]
		} else {
			const index = ele.parent!.children!.findIndex(item => {
				return ele.isEqual(item)
			})
			if (index >= ele.parent!.children!.length - 1) {
				return null
			}
			if (ele.parent!.children![index + 1]!.isEmpty()) {
				return this.getNextElement(ele.parent!.children![index + 1]!)
			}
			return ele.parent!.children![index + 1]
		}
	}

	/**
	 * 向上查询可以设置焦点的元素（会跳过空元素）
	 */
	getPreviousElementOfPoint(point: AlexPoint) {
		if (!AlexPoint.isPoint(point)) {
			throw new Error('The argument must be an AlexPoint instance')
		}
		//查找子元素中的可设为焦点的元素
		const fnChild = (children: AlexElement[]): AlexElement | null => {
			let el = null
			//遍历子元素
			const length = children.length
			for (let i = length - 1; i >= 0; i--) {
				const child = children[i]
				//如果子元素是空元素跳过
				if (child.isEmpty()) {
					continue
				}
				//如果子元素是文本元素或者自闭合元素
				if (child.isText() || child.isClosed()) {
					el = child
					break
				}
				//如果是其他元素
				el = fnChild(child.children!)
				//这里如果在子元素中找到了可以设置焦点的元素，一定要break直接终止for循环的执行
				if (el) {
					break
				}
			}
			return el
		}

		const fn = (element: AlexElement): AlexElement | null => {
			//获取上一个兄弟元素
			const previousElement = this.getPreviousElement(element)
			//如果兄弟元素存在
			if (previousElement) {
				//如果兄弟元素是空元素，直接上一个
				if (previousElement.isEmpty()) {
					return fn(previousElement)
				}
				//如果是文本元素或者自闭合元素
				if (previousElement.isText() || previousElement.isClosed()) {
					return previousElement
				}
				/** 其他元素的情况下 */
				return fnChild(previousElement.children!)
			}
			//如果兄弟元素不存在，表示当前焦点所在元素是子元素数组中最后一个，则查找父元素的下个兄弟节点
			if (element.parent) {
				return fn(element.parent)
			}
			return null
		}

		return fn(point.element)
	}

	/**
	 * 向下查找可以设置焦点的元素（会跳过空元素）
	 */
	getNextElementOfPoint(point: AlexPoint) {
		if (!AlexPoint.isPoint(point)) {
			throw new Error('The argument must be an AlexPoint instance')
		}
		//查找子元素中的可设为焦点的元素
		const fnChild = (children: AlexElement[]): AlexElement | null => {
			let el: AlexElement | null = null
			//遍历子元素
			const length = children.length
			for (let i = 0; i < length; i++) {
				const child = children[i]
				//如果子元素是空元素跳过
				if (child.isEmpty()) {
					continue
				}
				//如果子元素是文本元素或者自闭合元素
				if (child.isText() || child.isClosed()) {
					el = child
					break
				}
				//如果是其他元素
				el = fnChild(child.children!)
				//这里如果在子元素中找到了可以设置焦点的元素，一定要break直接终止for循环的执行
				if (el) {
					break
				}
			}
			return el
		}

		const fn = (element: AlexElement): AlexElement | null => {
			//获取下一个兄弟元素
			const nextElement = this.getNextElement(element)
			//如果兄弟元素存在
			if (nextElement) {
				//如果兄弟元素是空元素，直接下一个
				if (nextElement.isEmpty()) {
					return fn(nextElement)
				}
				//如果是文本元素或者自闭合元素
				if (nextElement.isText() || nextElement.isClosed()) {
					return nextElement
				}
				/** 其他元素的情况下 */
				return fnChild(nextElement.children!)
			}
			//如果兄弟元素不存在，表示当前焦点所在元素是子元素数组中最后一个，则查找父元素的下个兄弟节点
			if (element.parent) {
				return fn(element.parent)
			}
			return null
		}

		return fn(point.element)
	}

	/**
	 * 获取选区之间的元素，flat参数表示是否返回扁平化的数据
	 */
	getElementsByRange(): AlexElementsRangeType {
		//虚拟光标不存在
		if (!this.range) {
			return {
				list: [],
				flatList: []
			}
		}

		//起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			return {
				list: [],
				flatList: []
			}
		}

		/** 以下是起点和终点不在一起的情况 */

		//获取扁平化的数据
		const getFlatList = () => {
			let flatList: AlexElementRangeType[] = []
			//起点是不是在元素开始处
			const anchorInStart = this.range!.anchor.offset == 0
			//终点是不是在元素末尾处
			const focusInEnd = this.range!.focus.offset == (this.range!.focus.element.isText() ? this.range!.focus.element.textContent!.length : 1)
			//获取起点和终点所在的根级块
			const anchorBlock = this.range!.anchor.element.getBlock()
			const focusBlock = this.range!.focus.element.getBlock()
			//获取起点和终点所在根级块的序列
			const anchorBlockIndex = this.stack.findIndex(el => anchorBlock.isEqual(el))
			const focusBlockIndex = this.stack.findIndex(el => focusBlock.isEqual(el))
			//获取这两个块元素之间所有元素，包括起点和终点
			let elements = AlexElement.flatElements(this.stack.slice(anchorBlockIndex, focusBlockIndex + 1))
			//获取以起点所在元素为第一个文本元素或者自闭合元素的最高级元素
			const firstElement = getHighestByFirst(this.range!.anchor)
			//因为数组中以起点所在根级块元素为第一个元素，到起点之间，可能有些元素不属于选区范围内，因此通过firstElement或者this.range.anchor.element的序列来截取
			const startIndex = elements.findIndex(el => el.isEqual(firstElement ? firstElement : this.range!.anchor.element))
			//因为在数组中终点所在元素的祖先元素肯定在它前面，所以在它后面的都不是选区范围内的元素
			const endIndex = elements.findIndex(el => el.isEqual(this.range!.focus.element))
			//截取
			if (startIndex > 0 || endIndex < elements.length - 1) {
				elements = elements.slice(startIndex, endIndex + 1)
			}
			//如果起点和终点在一个元素上
			if (this.range!.anchor.element.isEqual(this.range!.focus.element)) {
				if (anchorInStart && focusInEnd) {
					flatList = elements.map(element => {
						return {
							element,
							offset: false
						}
					})
				} else {
					flatList = [
						{
							element: this.range!.anchor.element,
							offset: [this.range!.anchor.offset, this.range!.focus.offset]
						}
					]
				}
			}
			//如果起点和终点不在一个元素上
			else {
				//遍历获取的元素数组
				const length = elements.length
				for (let i = 0; i < length; i++) {
					//起点元素
					if (this.range!.anchor.element.isEqual(elements[i])) {
						//如果起点在元素开始处，则将起点所在元素推入数组
						if (anchorInStart) {
							flatList.push({
								element: this.range!.anchor.element,
								offset: false
							})
						}
						//如果起点不在元素的末尾处，此时起点元素必然是文本元素
						else if (this.range!.anchor.element.isText() && this.range!.anchor.offset < this.range!.anchor.element.textContent!.length) {
							flatList.push({
								element: this.range!.anchor.element,
								offset: [this.range!.anchor.offset, this.range!.anchor.element.textContent!.length]
							})
						}
					}
					//包含起点的元素
					else if (elements[i].isContains(this.range!.anchor.element)) {
						//起点是不是它后代文本元素或者自闭合元素中的第一个
						const isFirst = this.range!.anchor.element.isFirst(elements[i])
						//该元素是否包含终点
						const hasFocus = elements[i].isContains(this.range!.focus.element)
						//终点元素是否它后代文本元素或者自闭合元素中的最后一个
						const isLast = this.range!.focus.element.isLast(elements[i])
						//该元素都在选区内，并且终点也在该元素内
						if (anchorInStart && isFirst && hasFocus && isLast && focusInEnd) {
							flatList.push({
								element: elements[i],
								offset: false
							})
						}
						//该元素都在选区内，但是终点不在该元素内
						else if (anchorInStart && isFirst && !hasFocus) {
							flatList.push({
								element: elements[i],
								offset: false
							})
						}
					}
					//终点元素
					else if (this.range!.focus.element.isEqual(elements[i])) {
						//如果终点在元素结尾处
						if (focusInEnd) {
							flatList.push({
								element: this.range!.focus.element,
								offset: false
							})
						}
						//如果终点不在元素起点处，则终点所在元素必然是文本元素
						else if (this.range!.focus.offset > 0) {
							flatList.push({
								element: this.range!.focus.element,
								offset: [0, this.range!.focus.offset]
							})
						}
					}
					//包含终点的元素
					else if (elements[i].isContains(this.range!.focus.element)) {
						//终点元素是否它后代文本元素或者自闭合元素中的最后一个
						const isLast = this.range!.focus.element.isLast(elements[i])
						//该元素都在选区内
						if (isLast && focusInEnd) {
							flatList.push({
								element: elements[i],
								offset: false
							})
						}
					}
					//起点和终点之间的元素
					else {
						flatList.push({
							element: elements[i],
							offset: false
						})
					}
				}
			}
			return flatList
		}
		//根据扁平化的数据获取非扁平化的数组
		const getList = (flatList: AlexElementRangeType[]) => {
			//返回的树结构数组
			let list: AlexElementRangeType[] = []
			//返回的树结构数组中的根级块元素数组
			let blockElements: AlexElement[] = []
			//返回的树结构数组中的行内元素、内部块元素
			let notBlockElements: AlexElement[] = []
			//遍历扁平化的数据结果
			const length = flatList.length
			for (let i = 0; i < length; i++) {
				//如果是根级块元素则直接加入list
				if (flatList[i].element.isBlock()) {
					list.push(flatList[i])
					//更新根级块元素数组
					blockElements.push(flatList[i].element)
				} else {
					//获取元素所在的根级块元素
					const block = flatList[i].element.getBlock()
					//判断该根级块元素是否存在于list数组里，这里使用blockElements来判断，提升性能
					let hasBlock = false
					const blockLength = blockElements.length
					//因为当前元素的根级块元素相比于其他元素一定更靠近当前元素，所以采用反向查询
					for (let j = blockLength - 1; j >= 0; j--) {
						if (blockElements[j].isEqual(block)) {
							hasBlock = true
							break
						}
					}
					//如果根级块元素不存在于list里才进行下一步判断
					if (!hasBlock) {
						//判断list里的元素是否包含当前元素
						const isInclude = notBlockElements.some(el => el.isContains(flatList[i].element))
						//不包含当前元素则加入
						if (!isInclude) {
							list.push(flatList[i])
							//如果加入的是行内元素和内部块元素则更新行内元素和内部块元素数组
							if (flatList[i].element.isInblock() || flatList[i].element.isInline()) {
								notBlockElements.push(flatList[i].element)
							}
						}
					}
				}
			}
			return list
		}

		const flatListArr = getFlatList()
		const listArr = getList(flatListArr)

		return {
			list: listArr,
			flatList: flatListArr
		}
	}

	/**
	 * 将指定元素添加到父元素的子元素数组中
	 */
	addElementTo(childEle: AlexElement, parentEle: AlexElement, index: number | undefined = 0) {
		if (!AlexElement.isElement(childEle)) {
			throw new Error('The first argument must be an AlexElement instance')
		}
		if (!AlexElement.isElement(parentEle)) {
			throw new Error('The second argument must be an AlexElement instance')
		}
		if (typeof index != 'number' || isNaN(index) || index < 0) {
			throw new Error('The third argument must be an integer not less than 0')
		}
		//如果有子元素
		if (parentEle.hasChildren()) {
			if (index >= parentEle.children!.length) {
				parentEle.children!.push(childEle)
			} else {
				parentEle.children!.splice(index, 0, childEle)
			}
		} else {
			parentEle.children = [childEle]
		}
		//更新该元素的parent字段
		childEle.parent = parentEle
	}

	/**
	 * 将指定元素添加到另一个元素前面
	 */
	addElementBefore(newEle: AlexElement, targetEle: AlexElement) {
		if (!AlexElement.isElement(newEle)) {
			throw new Error('The first argument must be an AlexElement instance')
		}
		if (!AlexElement.isElement(targetEle)) {
			throw new Error('The second argument must be an AlexElement instance')
		}
		if (targetEle.isBlock()) {
			const index = this.stack.findIndex(item => {
				return targetEle.isEqual(item)
			})
			this.stack.splice(index, 0, newEle)
			newEle.parent = null
		} else {
			const index = targetEle.parent!.children!.findIndex(item => {
				return targetEle.isEqual(item)
			})
			this.addElementTo(newEle, targetEle.parent!, index)
		}
	}

	/**
	 * 将指定元素添加到另一个元素后面
	 */
	addElementAfter(newEle: AlexElement, targetEle: AlexElement) {
		if (!AlexElement.isElement(newEle)) {
			throw new Error('The first argument must be an AlexElement instance')
		}
		if (!AlexElement.isElement(targetEle)) {
			throw new Error('The second argument must be an AlexElement instance')
		}
		if (targetEle.isBlock()) {
			const index = this.stack.findIndex(item => {
				return targetEle.isEqual(item)
			})
			if (index >= this.stack.length - 1) {
				this.stack.push(newEle)
			} else {
				this.stack.splice(index + 1, 0, newEle)
			}
			newEle.parent = null
		} else {
			const index = targetEle.parent!.children!.findIndex(item => {
				return targetEle.isEqual(item)
			})
			this.addElementTo(newEle, targetEle.parent!, index + 1)
		}
	}

	/**
	 * 将虚拟光标设置到指定元素开始处
	 */
	collapseToStart(element?: AlexElement) {
		if (this.disabled) {
			return
		}
		//range是否为null的标识
		let rangeIsNull = false
		//如果range为null
		if (!this.range) {
			//初始化设置range
			this.initRange()
			//记录range是null
			rangeIsNull = true
		}
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.range!.anchor.moveToStart(element!)
			this.range!.focus.moveToStart(element!)
		}
		//文档最前面
		else {
			const flatElements = AlexElement.flatElements(this.stack).filter(el => {
				return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom!)
			})
			if (flatElements.length == 0) {
				throw new Error('There is no element to set the focus')
			}
			this.range!.anchor.moveToStart(flatElements[0])
			this.range!.focus.moveToStart(flatElements[0])
		}
		//如果一开始range是null的话，则更新当前history的range
		if (rangeIsNull) {
			this.history.updateCurrentRange(this.range!)
		}
	}

	/**
	 * 将虚拟光标设置到指定元素最后
	 */
	collapseToEnd(element?: AlexElement) {
		if (this.disabled) {
			return
		}
		//range是否为null的标识
		let rangeIsNull = false
		//如果range为null
		if (!this.range) {
			//初始化设置range
			this.initRange()
			//记录range是null
			rangeIsNull = true
		}
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.range!.anchor.moveToEnd(element!)
			this.range!.focus.moveToEnd(element!)
		}
		//文档最后面
		else {
			const flatElements = AlexElement.flatElements(this.stack).filter(el => {
				return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom!)
			})
			const length = flatElements.length
			if (length == 0) {
				throw new Error('There is no element to set the focus')
			}
			this.range!.anchor.moveToEnd(flatElements[length - 1])
			this.range!.focus.moveToEnd(flatElements[length - 1])
		}
		//如果一开始range是null的话，则更新当前history的range
		if (rangeIsNull) {
			this.history.updateCurrentRange(this.range!)
		}
	}

	/**
	 * 禁用编辑器
	 */
	setDisabled() {
		this.disabled = true
		this.$el.removeAttribute('contenteditable')
	}

	/**
	 * 启用编辑器
	 */
	setEnabled() {
		this.disabled = false
		this.$el.setAttribute('contenteditable', 'true')
	}

	/**
	 * 触发自定义事件
	 */
	emit(eventName: string, ...value: any) {
		if (Array.isArray(this.__events[eventName])) {
			this.__events[eventName].forEach((fn: (...args: any) => void) => {
				fn.apply(this, [...value])
			})
			return true
		}
		return false
	}

	/**
	 * 监听自定义事件
	 */
	on(eventName: string, eventHandle: (...args: any) => void) {
		if (!this.__events[eventName]) {
			this.__events[eventName] = []
		}
		this.__events[eventName].push(eventHandle)
	}
	/**
	 * 销毁编辑器的方法
	 */
	destroy() {
		//去除可编辑效果
		this.setDisabled()
		//移除相关监听事件
		DapEvent.off(document, `selectionchange.alex_editor_${this.__guid}`)
		DapEvent.off(this.$el, 'beforeinput.alex_editor compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor keydown.alex_editor cut.alex_editor paste.alex_editor copy.alex_editor dragstart.alex_editor drop.alex_editor focus.alex_editor blur.alex_editor')
	}
}
