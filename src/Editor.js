import Dap from 'dap-util'
import AlexElement from './Element'
import AlexRange from './Range'
import AlexPoint from './Point'
import AlexHistory from './History'
import { blockParse, closedParse, inblockParse, inlineParse } from './core/nodeParse'
import { initEditorNode, initEditorOptions, canUseClipboard, createGuid, getAttributes, getStyles, blobToBase64, isSpaceText, cloneData, queryHasValue } from './core/tool'
import { handleNotStackBlock, handleInblockWithOther, handleInlineChildrenNotInblock, breakFormat, mergeWithBrotherElement, mergeWithParentElement } from './core/formatRules'
import { checkStack, setRecentlyPoint, emptyDefaultBehaviorInblock, setRangeInVisible, handleStackEmpty, handleSelectionChange, handleBeforeInput, handleChineseInput, handleKeydown, handleCopy, handleCut, handlePaste, handleDragDrop, handleFocus, handleBlur } from './core/operation'

class AlexEditor {
	constructor(node, opts) {
		//编辑器容器
		this.$el = initEditorNode(node)
		//初始化opts参数
		const options = initEditorOptions(opts)
		//是否禁用
		this.disabled = options.disabled
		//编辑器的值
		this.value = options.value
		//自定义编辑器元素的格式化规则
		this.renderRules = options.renderRules
		//是否允许复制
		this.allowCopy = options.allowCopy
		//是否允许粘贴
		this.allowPaste = options.allowPaste
		//是否允许剪切
		this.allowCut = options.allowCut
		//粘贴是否携带样式
		this.allowPasteHtml = options.allowPasteHtml
		//自定义粘贴文本的处理方法
		this.customTextPaste = options.customTextPaste
		//自定义粘贴html的处理方法
		this.customHtmlPaste = options.customHtmlPaste
		//自定义粘贴图片的处理方法
		this.customImagePaste = options.customImagePaste
		//自定义粘贴视频的处理方法
		this.customVideoPaste = options.customVideoPaste
		//自定义合并元素的方法
		this.customMerge = options.customMerge
		//复制粘贴语法是否能够使用
		this.useClipboard = canUseClipboard()
		//创建历史记录
		this.history = new AlexHistory()
		//将html内容转为元素数组
		this.stack = this.parseHtml(this.value)
		//编辑的range
		this.range = null
		//初始化校验stack
		checkStack.apply(this)

		/**  ------以下是内部属性，不对外展示------  */

		//编辑器唯一id
		this.__guid = createGuid()
		//事件集合
		this.__events = {}
		//是否第一次渲染
		this.__firstRender = true
		//是否正在输入中文
		this.__isInputChinese = false
		//是否内部修改真实光标引起selctionChange事件
		this.__innerSelectionChange = false
		//取消中文输入标识的延时器
		this.__chineseInputTimer = null
		//数据缓存，用于提升性能
		this.__dataCaches = {}

		/**  ------以下是内部的一些初始化逻辑------  */

		//编辑器禁用和启用设置
		this.disabled ? this.setDisabled() : this.setEnabled()
		//设置selection的监听更新range
		Dap.event.on(document, `selectionchange.alex_editor_${this.__guid}`, handleSelectionChange.bind(this))
		//监听内容输入
		Dap.event.on(this.$el, 'beforeinput.alex_editor', handleBeforeInput.bind(this))
		//监听中文输入
		Dap.event.on(this.$el, 'compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor', handleChineseInput.bind(this))
		//监听键盘按下
		Dap.event.on(this.$el, 'keydown.alex_editor', handleKeydown.bind(this))
		//监听编辑器剪切
		Dap.event.on(this.$el, 'cut.alex_editor', handleCut.bind(this))
		//监听编辑器粘贴
		Dap.event.on(this.$el, 'paste.alex_editor', handlePaste.bind(this))
		//监听编辑器复制
		Dap.event.on(this.$el, 'copy.alex_editor', handleCopy.bind(this))
		//禁用编辑器拖拽和拖放
		Dap.event.on(this.$el, 'dragstart.alex_editor drop.alex_editor ', handleDragDrop.bind(this))
		//监听编辑器获取焦点
		Dap.event.on(this.$el, 'focus.alex_editor', handleFocus.bind(this))
		//监听编辑器失去焦点
		Dap.event.on(this.$el, 'blur.alex_editor', handleBlur.bind(this))
	}

	/**
	 * 初始化range
	 */
	initRange() {
		const elements = AlexElement.flatElements(this.stack).filter(el => {
			return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom)
		})
		const firstElement = elements[0]
		const anchor = new AlexPoint(firstElement, 0)
		const focus = new AlexPoint(firstElement, 0)
		this.range = new AlexRange(anchor, focus)
	}

	/**
	 * 根据光标进行粘贴操作
	 */
	async paste() {
		if (this.disabled) {
			return
		}
		if (!this.range) {
			return
		}
		if (!this.useClipboard) {
			return
		}
		if (!this.allowPaste) {
			return
		}
		const clipboardItems = await navigator.clipboard.read()
		const clipboardItem = clipboardItems[0]
		const getTypeFunctions = []
		clipboardItem.types.forEach(type => {
			getTypeFunctions.push(clipboardItem.getType(type))
		})
		const blobs = await Promise.all(getTypeFunctions)
		const length = blobs.length
		//是否存在html
		const hasHtml = blobs.some(blob => {
			return blob.type == 'text/html'
		})
		//只要存在html
		if (hasHtml) {
			for (let i = 0; i < length; i++) {
				const blob = blobs[i]
				//纯文本粘贴
				if (blob.type == 'text/plain' && !this.allowPasteHtml) {
					const data = await blob.text()
					if (data) {
						if (typeof this.customTextPaste == 'function') {
							await this.customTextPaste.apply(this, [data])
						} else {
							this.insertText(data)
							this.emit('pasteText', data)
						}
					}
				}
				//粘贴html
				else if (blob.type == 'text/html' && this.allowPasteHtml) {
					const data = await blob.text()
					if (data) {
						const elements = this.parseHtml(data).filter(el => {
							return !el.isEmpty()
						})
						if (typeof this.customHtmlPaste == 'function') {
							await this.customHtmlPaste.apply(this, [elements, data])
						} else {
							for (let i = 0; i < elements.length; i++) {
								this.formatElement(elements[i])
								this.insertElement(elements[i], false)
							}
							this.emit('pasteHtml', elements, data)
						}
					}
				}
			}
		}
		//不存在html
		else {
			for (let i = 0; i < length; i++) {
				const blob = blobs[i]
				//图片粘贴
				if (blob.type.startsWith('image/')) {
					const url = await blobToBase64(blob)
					if (typeof this.customImagePaste == 'function') {
						await this.customImagePaste.apply(this, [url])
					} else {
						const image = new AlexElement(
							'closed',
							'img',
							{
								src: url
							},
							null,
							null
						)
						this.insertElement(image)
						this.emit('pasteImage', url)
					}
				}
				//视频粘贴
				else if (blob.type.startsWith('video/')) {
					const url = await blobToBase64(blob)
					if (typeof this.customVideoPaste == 'function') {
						await this.customVideoPaste.apply(this, [url])
					} else {
						const video = new AlexElement(
							'closed',
							'video',
							{
								src: url
							},
							null,
							null
						)
						this.insertElement(video)
						this.emit('pasteVideo', url)
					}
				}
				//文字粘贴
				else if (blob.type == 'text/plain') {
					const data = await blob.text()
					if (data) {
						if (typeof this.customTextPaste == 'function') {
							await this.customTextPaste.apply(this, [data])
						} else {
							this.insertText(data)
							this.emit('pasteText', data)
						}
					}
				}
			}
		}
	}

	/**
	 * 根据光标进行剪切操作
	 */
	async cut() {
		if (!this.useClipboard) {
			return
		}
		if (!this.range) {
			return
		}
		if (!this.allowCut) {
			return
		}
		const result = await this.copy(true)
		if (result) {
			if (!this.disabled) {
				this.delete()
			}
			this.emit('cut', result.text, result.html)
		}
		return result
	}

	/**
	 * 根据光标执行复制操作
	 * isCut表示是否在执行剪切操作，默认为false，这个参数仅在内部使用
	 */
	async copy(isCut = false) {
		if (!this.useClipboard) {
			return
		}
		if (!this.range) {
			return
		}
		if (!this.allowCopy) {
			return
		}
		let result = this.getElementsByRange(true, false)
		if (result.length == 0) {
			return
		}
		let html = ''
		let text = ''
		result.forEach(item => {
			const newEl = item.element.clone()
			//offset存在值则说明该元素不是全部在选区内
			if (item.offset) {
				newEl.textContent = newEl.textContent.substring(item.offset[0], item.offset[1])
			}
			newEl.__render()
			html += newEl.elm.outerHTML
			text += newEl.elm.innerText
		})
		const clipboardItem = new window.ClipboardItem({
			'text/html': new Blob([html], { type: 'text/html' }),
			'text/plain': new Blob([text], { type: 'text/plain' })
		})
		await navigator.clipboard.write([clipboardItem])
		if (!isCut) {
			this.emit('copy', text, html)
		}
		return { text, html }
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
						const val = this.range.anchor.element.textContent
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
						const val = this.range.anchor.element.textContent
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
			const result = this.getElementsByRange(true, false).filter(item => {
				//批量删除时需要过滤掉那些不显示的元素
				return !AlexElement.VOID_NODES.includes(item.element.parsedom)
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
						item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1])
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
						item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1])
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
						item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1])
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
						item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1])
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
						item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1])
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
						item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1])
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
	insertText(data) {
		if (this.disabled) {
			return
		}
		if (!data || typeof data != 'string') {
			throw new Error('The argument must be a string')
		}
		if (!this.range) {
			return
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
				let val = this.range.anchor.element.textContent
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
			const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1
			//起点在内部块里
			if (inblock) {
				//在代码块样式中
				if (this.range.anchor.element.isPreStyle()) {
					this.insertText('\n')
					const text = AlexElement.getSpaceElement()
					this.insertElement(text)
					this.range.anchor.moveToEnd(text)
					this.range.focus.moveToEnd(text)
					this.emit('insertParagraph', null, inblock)
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
						const elements = AlexElement.flatElements(inblock.children)
						const index = elements.findIndex(item => {
							return this.range.anchor.element.isEqual(item)
						})
						//将终点移动到内部块元素末尾
						this.range.focus.moveToEnd(inblock)
						this.delete()
						//将终点移动到新的内部块元素
						const newElements = AlexElement.flatElements(newInblock.children)
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
					this.emit('insertParagraph', null, block)
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
						const elements = AlexElement.flatElements(block.children)
						const index = elements.findIndex(item => {
							return this.range.anchor.element.isEqual(item)
						})
						//将终点移动到根级块元素的末尾
						this.range.focus.moveToEnd(block)
						this.delete()
						//将终点移动到新的根级块元素
						const newElements = AlexElement.flatElements(newBlock.children)
						this.range.focus.element = newElements[index]
						this.range.focus.offset = this.range.anchor.offset
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
	insertElement(ele, cover = true) {
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
			const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1
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
					const elements = AlexElement.flatElements(inblock.children)
					const index = elements.findIndex(item => {
						return this.range.anchor.element.isEqual(item)
					})
					const newElements = AlexElement.flatElements(newInblock.children)
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
					this.addElementTo(ele, inblock, inblock.children.length)
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
					const elements = AlexElement.flatElements(inblock.children)
					const index = elements.findIndex(item => {
						return this.range.anchor.element.isEqual(item)
					})
					const newElements = AlexElement.flatElements(newInblock.children)
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
					this.addElementTo(ele, block, block.children.length)
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
					const elements = AlexElement.flatElements(block.children)
					const index = elements.findIndex(item => {
						return this.range.anchor.element.isEqual(item)
					})
					const newElements = AlexElement.flatElements(newBlock.children)
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
					const elements = AlexElement.flatElements(block.children)
					const index = elements.findIndex(item => {
						return this.range.anchor.element.isEqual(item)
					})
					const newElements = AlexElement.flatElements(newBlock.children)
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
					let val = this.range.anchor.element.textContent
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
	 * 格式化某个元素
	 */
	formatElement(element) {
		//获取自定义的格式化规则
		let renderRules = this.renderRules.filter(fn => {
			return typeof fn == 'function'
		})
		;[handleNotStackBlock, handleInblockWithOther, handleInlineChildrenNotInblock, breakFormat, mergeWithBrotherElement, mergeWithParentElement, ...renderRules].forEach(fn => {
			fn.apply(this, [element])
		})
		//判断是否有子元素
		if (element.hasChildren()) {
			//遍历子元素
			let index = 0
			while (index < element.children.length) {
				//获取子元素
				const ele = element.children[index]
				//如果是空元素则删除
				if (ele.isEmpty()) {
					if (this.range && ele.isContains(this.range.anchor.element)) {
						setRecentlyPoint.apply(this, [this.range.anchor])
					}
					if (this.range && ele.isContains(this.range.focus.element)) {
						setRecentlyPoint.apply(this, [this.range.focus])
					}
					element.children.splice(index, 1)
					continue
				}
				//对该子元素进行格式化处理
				this.formatElement(ele)
				//如果在经过格式化后是空元素，则需要删除该元素
				if (ele.isEmpty()) {
					if (ele.isContains(this.range.anchor.element)) {
						setRecentlyPoint.apply(this, [this.range.anchor])
					}
					if (ele.isContains(this.range.focus.element)) {
						setRecentlyPoint.apply(this, [this.range.focus])
					}
					element.children.splice(index, 1)
					continue
				}
				//序列+1
				index++
			}
		}
	}

	/**
	 * 格式化stack
	 */
	formatElementStack() {
		//遍历stack
		let index = 0
		while (index < this.stack.length) {
			const ele = this.stack[index]
			//空元素则删除
			if (ele.isEmpty()) {
				if (this.range && ele.isContains(this.range.anchor.element)) {
					setRecentlyPoint.apply(this, [this.range.anchor])
				}
				if (this.range && ele.isContains(this.range.focus.element)) {
					setRecentlyPoint.apply(this, [this.range.focus])
				}
				this.stack.splice(index, 1)
				continue
			}
			//不是根级块元素则转为根级块元素
			if (!ele.isBlock()) {
				ele.convertToBlock()
			}
			//格式化根级块元素
			this.formatElement(ele)
			//如果在经过格式化后是空元素，则需要删除该元素
			if (ele.isEmpty()) {
				if (this.range && ele.isContains(this.range.anchor.element)) {
					setRecentlyPoint.apply(this, [this.range.anchor])
				}
				if (this.range && ele.isContains(this.range.focus.element)) {
					setRecentlyPoint.apply(this, [this.range.focus])
				}
				this.stack.splice(index, 1)
				continue
			}
			//序列+1
			index++
		}
		//判断stack是否为空进行初始化
		handleStackEmpty.apply(this)
	}

	/**
	 * 渲染编辑器dom内容
	 * unPushHistory为false表示加入历史记录
	 */
	domRender(unPushHistory = false) {
		//触发事件
		this.emit('beforeRender')
		//创建fragment
		const fragment = document.createDocumentFragment()
		//生成新的dom
		this.stack.forEach(element => {
			element.__render()
			fragment.appendChild(element.elm)
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
		if (!this.range) {
			const selection = window.getSelection()
			selection.removeAllRanges()
			return
		}
		//将虚拟光标位置转为真实光标位置
		const handler = point => {
			let node = null
			let offset = null
			//如果是文本元素
			if (point.element.isText()) {
				node = point.element.elm.childNodes[0]
				offset = point.offset
			}
			//自闭合元素
			else {
				node = point.element.parent.elm
				const index = point.element.parent.children.findIndex(item => {
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
		selection.removeAllRanges()
		const range = document.createRange()
		range.setStart(anchorResult.node, anchorResult.offset)
		range.setEnd(focusResult.node, focusResult.offset)
		selection.addRange(range)
		setTimeout(() => {
			setRangeInVisible.apply(this)
			this.__innerSelectionChange = false
			this.emit('rangeUpdate', this.range)
		}, 0)
	}

	/**
	 * 将html转为元素
	 */
	parseHtml(html) {
		if (!html) {
			throw new Error('You need to give an html content to convert')
		}
		const node = document.createElement('div')
		node.innerHTML = html
		let elements = []
		Array.from(node.childNodes).forEach(el => {
			if (el.nodeType == 1 || el.nodeType == 3) {
				const element = this.parseNode(el)
				elements.push(element)
			}
		})
		return elements
	}

	/**
	 * 将node转为元素
	 */
	parseNode(node) {
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
		//默认配置
		const block = blockParse.find(item => item.parsedom == parsedom)
		const inblock = inblockParse.find(item => item.parsedom == parsedom)
		const inline = inlineParse.find(item => item.parsedom == parsedom)
		const closed = closedParse.find(item => item.parsedom == parsedom)
		//创建的元素
		let element = null
		//构造参数
		let config = {
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
				if (Dap.common.isObject(inline.parse)) {
					for (let key in inline.parse) {
						if (typeof inline.parse[key] == 'function') {
							config.styles[key] = inline.parse[key].apply(this, [node])
						} else {
							config.styles[key] = inline.parse[key]
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
			config.type = 'inline'
			config.parsedom = 'span'
		}
		element = new AlexElement(config.type, config.parsedom, config.marks, config.styles, null)
		//设置行为值
		element.behavior = config.behavior
		//如果不是自闭合元素则设置子元素
		if (!closed) {
			Array.from(node.childNodes).forEach(childNode => {
				if (childNode.nodeType == 1 || childNode.nodeType == 3) {
					const childEle = this.parseNode(childNode)
					childEle.parent = element
					if (element.hasChildren()) {
						element.children.push(childEle)
					} else {
						element.children = [childEle]
					}
				}
			})
		}
		return element
	}

	/**
	 * 将指定元素与另一个元素进行合并（仅限内部块元素和根级块元素）
	 */
	merge(ele, previousEle) {
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
			previousEle.children.push(...ele.children)
			previousEle.children.forEach(item => {
				item.parent = previousEle
			})
			ele.children = null
		}
	}

	/**
	 * 根据key查询元素
	 */
	getElementByKey(key) {
		if (!key) {
			throw new Error('You need to specify a key to do the query')
		}
		const fn = elements => {
			let element = null
			let i = 0
			let length = elements.length
			while (i < length) {
				if (elements[i].key == key) {
					element = elements[i]
					break
				}
				if (elements[i].hasChildren()) {
					const el = fn(elements[i].children)
					if (el) {
						element = el
						break
					}
				}
				i++
			}
			return element
		}
		return fn(this.stack)
	}

	/**
	 * 获取指定元素的前一个兄弟元素（会过滤空元素）
	 */
	getPreviousElement(ele) {
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
			if (this.stack[index - 1].isEmpty()) {
				return this.getPreviousElement(this.stack[index - 1])
			}
			return this.stack[index - 1]
		} else {
			const index = ele.parent.children.findIndex(item => {
				return ele.isEqual(item)
			})
			if (index <= 0) {
				return null
			}
			if (ele.parent.children[index - 1].isEmpty()) {
				return this.getPreviousElement(ele.parent.children[index - 1])
			}
			return ele.parent.children[index - 1]
		}
	}

	/**
	 * 获取指定元素的后一个兄弟元素（会过滤空元素）
	 */
	getNextElement(ele) {
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
			if (this.stack[index + 1].isEmpty()) {
				return this.getNextElement(this.stack[index + 1])
			}
			return this.stack[index + 1]
		} else {
			const index = ele.parent.children.findIndex(item => {
				return ele.isEqual(item)
			})
			if (index >= ele.parent.children.length - 1) {
				return null
			}
			if (ele.parent.children[index + 1].isEmpty()) {
				return this.getNextElement(ele.parent.children[index + 1])
			}
			return ele.parent.children[index + 1]
		}
	}

	/**
	 * 向上查询可以设置焦点的元素（会过滤空元素）
	 */
	getPreviousElementOfPoint(point) {
		if (!AlexPoint.isPoint(point)) {
			throw new Error('The argument must be an AlexPoint instance')
		}
		const flatElements = AlexElement.flatElements(this.stack)
		const fn = element => {
			const index = flatElements.findIndex(item => {
				return element.isEqual(item)
			})
			if (index <= 0) {
				return null
			}
			let ele = flatElements[index - 1]
			if ((ele.isText() || ele.isClosed()) && !ele.isEmpty()) {
				return ele
			}
			return fn(ele)
		}
		return fn(point.element)
	}

	/**
	 * 向下查找可以设置焦点的元素（会过滤空元素）
	 */
	getNextElementOfPoint(point) {
		if (!AlexPoint.isPoint(point)) {
			throw new Error('The argument must be an AlexPoint instance')
		}
		const flatElements = AlexElement.flatElements(this.stack)
		const fn = element => {
			const index = flatElements.findIndex(item => {
				return element.isEqual(item)
			})
			if (index == flatElements.length - 1) {
				return null
			}
			let ele = flatElements[index + 1]
			if ((ele.isText() || ele.isClosed()) && !ele.isEmpty()) {
				return ele
			}
			return fn(ele)
		}
		return fn(point.element)
	}

	/**
	 * 获取选区之间的元素
	 */
	getElementsByRange(includes = false, flat = false) {
		if (!this.range) {
			return
		}
		//起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			return []
		}
		//起点和终点在一个元素里
		if (this.range.anchor.element.isEqual(this.range.focus.element)) {
			//如果返回结果包含起点和终点
			if (includes) {
				const isCover = this.range.anchor.offset == 0 && this.range.focus.offset == (this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1)
				return [
					{
						element: this.range.anchor.element,
						offset: isCover ? false : [this.range.anchor.offset, this.range.focus.offset]
					}
				]
			}
			//不包含返回空数组
			return []
		}
		//起点和终点不在一个元素里
		let result = []
		//如果包含起点
		if (includes) {
			//如果起点在元素开始处，则将起点所在元素推入数组
			if (this.range.anchor.offset == 0) {
				result.push({
					element: this.range.anchor.element,
					offset: false
				})
			}
			//如果起点不在元素的末尾处
			else if (this.range.anchor.offset < (this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1)) {
				result.push({
					element: this.range.anchor.element,
					offset: [this.range.anchor.offset, this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1]
				})
			}
		}
		const elements = AlexElement.flatElements(this.stack)
		const anchorIndex = elements.findIndex(el => el.isEqual(this.range.anchor.element))
		const focusIndex = elements.findIndex(el => el.isEqual(this.range.focus.element))
		for (let i = anchorIndex + 1; i < focusIndex; i++) {
			result.push({
				element: elements[i],
				offset: false
			})
		}
		//如果包含终点
		if (includes) {
			//如果终点在元素结尾处
			if (this.range.focus.offset == (this.range.focus.element.isText() ? this.range.focus.element.textContent.length : 1)) {
				result.push({
					element: this.range.focus.element,
					offset: false
				})
			}
			//如果终点不在元素起点处
			else if (this.range.focus.offset > 0) {
				result.push({
					element: this.range.focus.element,
					offset: [0, this.range.focus.offset]
				})
			}
		}
		//以上代码生成result
		//通过上述代码获取到在选区内的元素，下面通过一段代码剔除子元素不是全部在数组里的元素
		const resLength = result.length
		let newResult = []
		//因为扁平化数据从左到右父元素在子元素前面，这里需要先检查子元素，所以倒序循环
		for (let i = resLength - 1; i >= 0; i--) {
			//如果存在子元素
			if (result[i].element.hasChildren()) {
				//判断该元素的每个子元素是否都在数组里
				let allIn = result[i].element.children.every(child => {
					return newResult.some(item => {
						return item.element.isEqual(child) && !item.offset
					})
				})
				//如果子元素全部在数组里
				if (allIn) {
					newResult.unshift(result[i])
				}
			} else {
				newResult.unshift(result[i])
			}
		}
		//通过下述代码将子元素全部在数组内，但是父元素不在数组内的元素加入进来
		for (let i = 0; i < newResult.length; i++) {
			const element = newResult[i].element
			//如果该元素全部在选区内，并且有父元素
			if (!element.offset && element.parent) {
				//父元素是否在数组内
				const selfIn = newResult.some(item => {
					return item.element.isEqual(element.parent)
				})
				//父元素的所有子元素是否都在数组内
				const allIn = element.parent.children.every(child => {
					return newResult.some(item => {
						return item.element.isEqual(child) && !item.offset
					})
				})
				//如果子元素都在并且自身不在
				if (allIn && !selfIn) {
					newResult.splice(i, 0, {
						element: element.parent,
						offset: false
					})
					i++
				}
			}
		}
		//以上代码生成newResult
		//返回扁平化处理的结果
		if (flat) {
			return newResult
		}
		//返回正常树状结构
		let notFlatResult = []
		const length = newResult.length
		for (let i = 0; i < length; i++) {
			if (newResult[i].element.isBlock()) {
				notFlatResult.push(newResult[i])
			} else {
				//父元素是否在扁平化数组里
				const isIn = newResult.some(item => item.element.isEqual(newResult[i].element.parent))
				//父元素不在
				if (!isIn) {
					notFlatResult.push(newResult[i])
				}
			}
		}

		//以上代码生成notFlagResult
		return notFlatResult
	}

	/**
	 * 分割选区选中的元素，会更新光标位置
	 */
	splitElementsByRange(includes = false, flat = false) {
		if (!this.range) {
			return
		}
		const result = this.getElementsByRange(includes, flat)
		let elements = []
		result.forEach((item, index) => {
			if (item.offset) {
				let selectEl = null
				if (item.offset[0] == 0) {
					const el = item.element.clone()
					item.element.textContent = item.element.textContent.substring(0, item.offset[1])
					el.textContent = el.textContent.substring(item.offset[1])
					this.addElementAfter(el, item.element)
					selectEl = item.element
				} else if (item.offset[1] == item.element.textContent.length) {
					const el = item.element.clone()
					item.element.textContent = item.element.textContent.substring(0, item.offset[0])
					el.textContent = el.textContent.substring(item.offset[0])
					this.addElementAfter(el, item.element)
					selectEl = el
				} else {
					const el = item.element.clone()
					const el2 = item.element.clone()
					item.element.textContent = item.element.textContent.substring(0, item.offset[0])
					el.textContent = el.textContent.substring(item.offset[0], item.offset[1])
					el2.textContent = el2.textContent.substring(item.offset[1])
					this.addElementAfter(el, item.element)
					this.addElementAfter(el2, el)
					selectEl = el
				}
				if (index == 0) {
					this.range.anchor.moveToStart(selectEl)
				}
				if (index == result.length - 1) {
					this.range.focus.moveToEnd(selectEl)
				}
				elements.push(selectEl)
			} else {
				elements.push(item.element)
			}
		})
		return elements
	}

	/**
	 * 将指定元素添加到父元素的子元素数组中
	 */
	addElementTo(childEle, parentEle, index = 0) {
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
			if (index >= parentEle.children.length) {
				parentEle.children.push(childEle)
			} else {
				parentEle.children.splice(index, 0, childEle)
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
	addElementBefore(newEle, targetEle) {
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
			const index = targetEle.parent.children.findIndex(item => {
				return targetEle.isEqual(item)
			})
			this.addElementTo(newEle, targetEle.parent, index)
		}
	}

	/**
	 * 将指定元素添加到另一个元素后面
	 */
	addElementAfter(newEle, targetEle) {
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
			const index = targetEle.parent.children.findIndex(item => {
				return targetEle.isEqual(item)
			})
			this.addElementTo(newEle, targetEle.parent, index + 1)
		}
	}

	/**
	 * 将虚拟光标设置到指定元素开始处
	 */
	collapseToStart(element) {
		if (this.disabled) {
			return
		}
		//range是否为null
		let rangeIsNull = false
		if (!this.range) {
			//初始化设置range
			this.initRange()
			//记录range是null的标识
			rangeIsNull = true
		}
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.range.anchor.moveToStart(element)
			this.range.focus.moveToStart(element)
		}
		//文档最前面
		else {
			const flatElements = AlexElement.flatElements(this.stack).filter(el => {
				return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom)
			})
			if (flatElements.length == 0) {
				throw new Error('There is no element to set the focus')
			}
			this.range.anchor.moveToStart(flatElements[0])
			this.range.focus.moveToStart(flatElements[0])
		}
		//如果一开始range是null的话，则更新当前history的range
		if (rangeIsNull) {
			this.history.updateCurrentRange(this.range)
		}
	}

	/**
	 * 将虚拟光标设置到指定元素最后
	 */
	collapseToEnd(element) {
		if (this.disabled) {
			return
		}
		//range是否为null
		let rangeIsNull = false
		//如果range为null
		if (!this.range) {
			//初始化设置range
			this.initRange()
			//记录range是null的标识
			rangeIsNull = true
		}
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.range.anchor.moveToEnd(element)
			this.range.focus.moveToEnd(element)
		}
		//文档最后面
		else {
			const flatElements = AlexElement.flatElements(this.stack).filter(el => {
				return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom)
			})
			const length = flatElements.length
			if (length == 0) {
				throw new Error('There is no element to set the focus')
			}
			this.range.anchor.moveToEnd(flatElements[length - 1])
			this.range.focus.moveToEnd(flatElements[length - 1])
		}
		//如果一开始range是null的话，则更新当前history的range
		if (rangeIsNull) {
			this.history.updateCurrentRange(this.range)
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
		this.$el.setAttribute('contenteditable', true)
	}

	/**
	 * 设置文本元素的样式
	 */
	setTextStyle(styles) {
		if (this.disabled) {
			return
		}
		if (!this.range) {
			return
		}
		if (!Dap.common.isObject(styles)) {
			throw new Error('The argument must be an object')
		}
		//起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//如果是空白文本元素直接设置样式
			if (this.range.anchor.element.isSpaceText()) {
				if (this.range.anchor.element.hasStyles()) {
					Object.assign(this.range.anchor.element.styles, cloneData(styles))
				} else {
					this.range.anchor.element.styles = cloneData(styles)
				}
			}
			//如果是文本元素
			else if (this.range.anchor.element.isText()) {
				//新建一个空白文本元素
				const el = AlexElement.getSpaceElement()
				//继承文本元素的样式和标记
				el.styles = cloneData(this.range.anchor.element.styles)
				el.marks = cloneData(this.range.anchor.element.marks)
				//设置样式
				if (el.hasStyles()) {
					Object.assign(el.styles, cloneData(styles))
				} else {
					el.styles = cloneData(styles)
				}
				//插入空白文本元素
				this.insertElement(el)
			}
			//如果是自闭合元素
			else {
				const el = AlexElement.getSpaceElement()
				el.styles = cloneData(styles)
				this.insertElement(el)
			}
		}
		//不在同一个点
		else {
			const elements = this.splitElementsByRange(true, true)
			elements.forEach(ele => {
				if (ele.isText()) {
					if (ele.hasStyles()) {
						Object.assign(ele.styles, cloneData(styles))
					} else {
						ele.styles = cloneData(styles)
					}
				}
			})
		}
	}

	/**
	 * 移除文本元素的样式
	 */
	removeTextStyle(styleNames) {
		if (this.disabled) {
			return
		}
		if (!this.range) {
			return
		}
		//移除样式的方法
		const removeFn = el => {
			//如果参数是数组，表示删除指定的样式
			if (Array.isArray(styleNames)) {
				if (el.hasStyles()) {
					let styles = {}
					Object.keys(el.styles).forEach(key => {
						if (!styleNames.includes(key)) {
							styles[key] = el.styles[key]
						}
					})
					el.styles = styles
				}
			}
			//如果没有参数，则表示删除所有的样式
			else {
				el.styles = null
			}
		}
		//如果起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//如果是空白文本元素直接移除样式
			if (this.range.anchor.element.isSpaceText()) {
				removeFn(this.range.anchor.element)
			}
			//如果是文本元素则新建一个空白文本元素
			else if (this.range.anchor.element.isText()) {
				const el = AlexElement.getSpaceElement()
				//继承文本元素的样式和标记
				el.styles = cloneData(this.range.anchor.element.styles)
				el.marks = cloneData(this.range.anchor.element.marks)
				//移除样式
				removeFn(el)
				//插入
				this.insertElement(el)
			}
		}
		//起点和终点不在一起
		else {
			const elements = this.splitElementsByRange(true, true)
			elements.forEach(ele => {
				if (ele.isText()) {
					removeFn(ele)
				}
			})
		}
	}

	/**
	 * 查询虚拟光标包含的文本元素是否具有某个样式
	 */
	queryTextStyle(name, value, useCache) {
		if (!name) {
			throw new Error('The first argument cannot be null')
		}
		if (!this.range) {
			return false
		}
		//起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//如果是文本元素并且具有样式
			if (this.range.anchor.element.isText() && this.range.anchor.element.hasStyles()) {
				return queryHasValue(this.range.anchor.element.styles, name, value)
			}
			//不是文本元素或者没有样式直接返回
			return false
		}
		//起点和终点不在一起获取选区中的文本元素
		let result = null
		//如果使用缓存数据
		if (useCache) {
			result = this.__dataCaches['queryTextStyle'] || []
		} else {
			result = this.getElementsByRange(true, true).filter(item => {
				return item.element.isText()
			})
		}
		//在不使用缓存的情况下将数据缓存
		if (!useCache) {
			this.__dataCaches['queryTextStyle'] = result
		}
		//如果不包含文本元素直接返回false
		if (result.length == 0) {
			return false
		}
		//判断每个文本元素是否都具有该样式
		let flag = result.every(item => {
			//文本元素含有样式进一步判断
			if (item.element.hasStyles()) {
				return queryHasValue(item.element.styles, name, value)
			}
			//文本元素没有样式直接返回false
			return false
		})
		return flag
	}

	/**
	 * 设置文本元素的标记
	 */
	setTextMark(marks) {
		if (this.disabled) {
			return
		}
		if (!this.range) {
			return
		}
		if (!Dap.common.isObject(marks)) {
			throw new Error('The argument must be an object')
		}
		//起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//如果是空白文本元素直接设置标记
			if (this.range.anchor.element.isSpaceText()) {
				if (this.range.anchor.element.hasMarks()) {
					Object.assign(this.range.anchor.element.marks, cloneData(marks))
				} else {
					this.range.anchor.element.marks = cloneData(marks)
				}
			}
			//如果是文本元素
			else if (this.range.anchor.element.isText()) {
				//新建一个空白文本元素
				const el = AlexElement.getSpaceElement()
				//继承文本元素的样式和标记
				el.styles = cloneData(this.range.anchor.element.styles)
				el.marks = cloneData(this.range.anchor.element.marks)
				//设置标记
				if (el.hasMarks()) {
					Object.assign(el.marks, cloneData(marks))
				} else {
					el.marks = cloneData(marks)
				}
				//插入空白文本元素
				this.insertElement(el)
			}
			//如果是自闭合元素
			else {
				const el = AlexElement.getSpaceElement()
				el.marks = UcloneData(marks)
				this.insertElement(el)
			}
		}
		//不在同一个点
		else {
			const elements = this.splitElementsByRange(true, true)
			elements.forEach(ele => {
				if (ele.isText()) {
					if (ele.hasMarks()) {
						Object.assign(ele.marks, cloneData(marks))
					} else {
						ele.marks = cloneData(marks)
					}
				}
			})
		}
	}

	/**
	 * 移除文本元素的标记
	 */
	removeTextMark(markNames) {
		if (this.disabled) {
			return
		}
		if (!this.range) {
			return
		}
		//移除标记的方法
		const removeFn = el => {
			//如果参数是数组，表示删除指定的标记
			if (Array.isArray(markNames)) {
				if (el.hasMarks()) {
					let marks = {}
					Object.keys(el.marks).forEach(key => {
						if (!markNames.includes(key)) {
							marks[key] = el.marks[key]
						}
					})
					el.marks = marks
				}
			}
			//如果没有参数，则表示删除所有的标记
			else {
				el.marks = null
			}
		}
		//如果起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//如果是空白文本元素直接移除标记
			if (this.range.anchor.element.isSpaceText()) {
				removeFn(this.range.anchor.element)
			}
			//如果是文本元素则新建一个空白文本元素
			else if (this.range.anchor.element.isText()) {
				const el = AlexElement.getSpaceElement()
				//继承文本元素的样式和标记
				el.styles = cloneData(this.range.anchor.element.styles)
				el.marks = cloneData(this.range.anchor.element.marks)
				//移除样式
				removeFn(el)
				//插入
				this.insertElement(el)
			}
		}
		//起点和终点不在一起
		else {
			const elements = this.splitElementsByRange(true, true)
			elements.forEach(ele => {
				if (ele.isText()) {
					removeFn(ele)
				}
			})
		}
	}

	/**
	 * 查询选区内的文本元素是否具有某个标记
	 */
	queryTextMark(name, value, useCache) {
		if (!name) {
			throw new Error('The first argument cannot be null')
		}
		if (!this.range) {
			return false
		}
		//起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//如果是文本元素并且具有标记
			if (this.range.anchor.element.isText() && this.range.anchor.element.hasMarks()) {
				return queryHasValue(this.range.anchor.element.marks, name, value)
			}
			//不是文本元素或者没有样式直接返回
			return false
		}
		//起点和终点不在一起获取选区中的文本元素
		let result = null
		if (useCache) {
			result = this.__dataCaches['queryTextMark'] || []
		} else {
			result = this.getElementsByRange(true, true).filter(item => {
				return item.element.isText()
			})
		}
		//在不使用缓存的情况下将数据缓存
		if (!useCache) {
			this.__dataCaches['queryTextMark'] = result
		}
		//如果不包含文本元素直接返回false
		if (result.length == 0) {
			return false
		}
		//判断每个文本元素是否都具有该样式
		let flag = result.every(item => {
			//文本元素含有样式进一步判断
			if (item.element.hasMarks()) {
				return queryHasValue(item.element.marks, name, value)
			}
			//文本元素没有样式直接返回false
			return false
		})
		return flag
	}

	/**
	 * 触发自定义事件
	 */
	emit(eventName, ...value) {
		if (Array.isArray(this.__events[eventName])) {
			this.__events[eventName].forEach(fn => {
				fn.apply(this, [...value])
			})
			return true
		}
		return false
	}

	/**
	 * 监听自定义事件
	 */
	on(eventName, eventHandle) {
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
		Dap.event.off(document, `selectionchange.alex_editor_${this.__guid}`)
		Dap.event.off(this.$el, 'beforeinput.alex_editor compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor keydown.alex_editor cut.alex_editor paste.alex_editor copy.alex_editor dragstart.alex_editor drop.alex_editor focus.alex_editor blur.alex_editor')
	}
}
export default AlexEditor
