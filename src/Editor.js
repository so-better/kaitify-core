import Util from './Util'
import AlexElement from './Element'
import AlexPoint from './Point'
import AlexRange from './Range'
import AlexHistory from './History'
import Keyboard from './Keyboard'
import Dap from 'dap-util'

class AlexEditor {
	constructor(el, options) {
		//校验el是否元素
		if (!Dap.element.isElement(el)) {
			throw new Error('You must specify a dom container to initialize the editor')
		}
		//格式化options参数
		options = this._formatOptions(options)
		//编辑器容器
		this.$el = el
		//是否自动获取焦点
		this.autofocus = options.autofocus
		//是否禁用
		this.disabled = options.disabled
		//编辑器的值
		this.value = options.value
		//自定义编辑器元素的格式化规则
		this.renderRules = options.renderRules
		//内容变更触发的事件
		this.onChange = options.onChange
		//粘贴时是否粘贴html
		this.htmlPaste = options.htmlPaste
		//文件粘贴处理函数
		this.handlePasteFile = options.handlePasteFile
		//编辑的range
		this.range = null
		//是否正在输入中文
		this._isInputChinese = false
		//旧的文本内容
		this._oldValue = options.value
		//将html内容转为元素数组
		this.stack = this.parseHtml(this.value)
		//创建历史记录
		this.history = new AlexHistory()
		//格式化元素数组
		this.formatElementStack()
		//如果元素数组为空则说明给的初始值不符合要求，则此时初始化一个段落
		if (this.stack.length == 0) {
			const ele = new AlexElement('block', AlexElement.paragraph, null, null, null)
			const breakEle = new AlexElement('closed', 'br', null, null, null)
			this.addElementTo(breakEle, ele, 0)
			this.stack = [ele]
		}
		//初始设置range
		this._initRange()
		//渲染dom
		this.domRender()
		//编辑器禁用和启用设置
		if (this.disabled) {
			this.setDisabled()
		} else {
			this.setEnabled()
			//自动获取焦点
			if (this.autofocus) {
				this.collapseToEnd()
			}
		}
		//设置selection的监听更新range
		Dap.event.on(document, 'selectionchange', this._handleSelectionChange.bind(this))
		//监听内容输入
		Dap.event.on(this.$el, 'beforeinput', this._handleBeforeInput.bind(this))
		//监听中文输入
		Dap.event.on(this.$el, 'compositionstart compositionupdate compositionend', this._handleChineseInput.bind(this))
		//监听键盘按下
		Dap.event.on(this.$el, 'keydown', this._handleKeydown.bind(this))
		//监听编辑器剪切
		Dap.event.on(this.$el, 'cut', this._handleCut.bind(this))
		//监听编辑器粘贴
		Dap.event.on(this.$el, 'paste', this._handlePaste.bind(this))
	}

	//校验函数数组，用于格式化
	_formatUnchangeableRules = [
		//修改元素的属性和自定义格式化规则
		element => {
			//如果parsedom不存在，且存在文字
			if (!element.parsedom && element.textContent && element.type != 'text') {
				element.type = 'text'
				return element
			}
			switch (element.parsedom) {
				case 'br':
					element.type = 'closed'
					element.children = null
					break
				case 'span':
					element.type = 'inline'
					break
				case 'img':
					element.type = 'closed'
					element.children = null
					break
				case 'video':
					element.type = 'closed'
					element.children = null
					break
				case 'a':
					element.type = 'inline'
					break
				case 'input':
					element.type = 'br'
					element.children = null
					break
				case 'textarea':
					element.type = 'br'
					element.children = null
					break
				case 'select':
					element.type = 'br'
					element.children = null
					break
				case 'label':
					element.type = 'inline'
					break
				case 'b':
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject()) {
						Object.assign(element.styles, {
							'font-weight': 'bold'
						})
					} else {
						element.styles = {
							'font-weight': 'bold'
						}
					}
					break
				case 'strong':
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject()) {
						Object.assign(element.styles, {
							'font-weight': 'bold'
						})
					} else {
						element.styles = {
							'font-weight': 'bold'
						}
					}
					break
				case 'sup':
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject()) {
						Object.assign(element.styles, {
							'vertical-align': 'super'
						})
					} else {
						element.styles = {
							'vertical-align': 'super'
						}
					}
					break
				case 'sub':
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject()) {
						Object.assign(element.styles, {
							'vertical-align': 'sub'
						})
					} else {
						element.styles = {
							'vertical-align': 'sub'
						}
					}
					break
				case 'i':
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject()) {
						Object.assign(element.styles, {
							'font-style': 'italic'
						})
					} else {
						element.styles = {
							'font-style': 'italic'
						}
					}
					break
				case 'u':
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject()) {
						Object.assign(element.styles, {
							'text-decoration-line': 'underline'
						})
					} else {
						element.styles = {
							'text-decoration-line': 'underline'
						}
					}
					break
			}
			if (typeof this.renderRules == 'function') {
				element = this.renderRules.apply(this, [element])
			}
			return element
		},
		//换行符清除规则
		element => {
			if (element.hasChildren()) {
				//是否有换行符
				let hasBreak = element.children.some(el => {
					return el.isBreak()
				})
				//是否有其他元素
				let hasOther = element.children.some(el => {
					return !el.isEmpty() && !el.isBreak()
				})
				//既有换行符也有其他元素则把换行符元素都置为空元素
				if (hasBreak && hasOther) {
					element.children = element.children.map(el => {
						if (el.isBreak()) {
							el.setEmpty()
						}
						return el
					})
				}
				//只有换行符并且存在多个换行符
				else if (hasBreak && element.children.length > 1) {
					//把除了第一个换行符外的其他换行符都置为空元素
					element.children = element.children.map((el, index) => {
						if (el.isBreak() && index > 0) {
							el.setEmpty()
						}
						return el
					})
				}
			}
			return element
		},
		//其他类型元素与block元素在同一父元素下不能共存
		element => {
			if (element.hasChildren()) {
				let hasBlock = element.children.some(el => {
					return !el.isEmpty() && el.isBlock()
				})
				if (hasBlock) {
					element.children.forEach(el => {
						if (!el.isEmpty() && !el.isBlock()) {
							el.convertToBlock()
						}
					})
				}
			}
			return element
		},
		//光标所在元素为空元素的情况下重新设置光标
		element => {
			if (element.isEmpty()) {
				//移除空节点时判断该节点是否是起点元素，如果是则更新起点元素
				if (this.range && this.range.anchor.element.isEqual(element)) {
					this.setRecentlyPoint(this.range.anchor)
				}
				//移除空节点时判断该节点是否是终点元素，如果是则更新终点元素
				if (this.range && this.range.focus.element.isEqual(element)) {
					this.setRecentlyPoint(this.range.focus)
				}
			}
			return element
		}
	]
	//格式化options参数
	_formatOptions(options) {
		let opts = {
			disabled: false,
			autofocus: false,
			renderRules: null,
			htmlPaste: false,
			handlePasteFile: null,
			value: '<p><br></p>',
			onChange: null
		}
		if (Dap.common.isObject(options)) {
			if (typeof options.autofocus == 'boolean') {
				opts.autofocus = options.autofocus
			}
			if (typeof options.disabled == 'boolean') {
				opts.disabled = options.disabled
			}
			if (typeof options.renderRules == 'function') {
				opts.renderRules = options.renderRules
			}
			if (typeof options.value == 'string' && options.value) {
				opts.value = options.value
			}
			if (typeof options.onChange == 'function') {
				opts.onChange = options.onChange
			}
			if (typeof options.htmlPaste == 'boolean') {
				opts.htmlPaste = options.htmlPaste
			}
			if (typeof options.handlePasteFile == 'function') {
				opts.handlePasteFile = options.handlePasteFile
			}
		}
		return opts
	}
	//初始设置range
	_initRange() {
		const lastElement = this.stack[this.stack.length - 1]
		const anchor = new AlexPoint(lastElement, 0)
		const focus = new AlexPoint(lastElement, 0)
		this.range = new AlexRange(anchor, focus)
		this.range.anchor.moveToEnd(lastElement)
		this.range.focus.moveToEnd(lastElement)
	}
	//起始和结束点都在一个元素内的删除方法
	_deleteInSameElement() {
		if (!this.range.anchor.element.isEqual(this.range.focus.element)) {
			return
		}
		if (this.range.anchor.offset == 0 && this.range.focus.offset == 0) {
			return
		}
		//前一个可以获取焦点的元素
		const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
		//后一个可以获取焦点的元素
		const nextElement = this.getNextElementOfPoint(this.range.anchor)
		//当前焦点所在的块元素
		const anchorBlock = this.range.anchor.getBlock()
		//当前焦点所在的行内元素
		const anchorInline = this.range.anchor.getInline()
		//起点和终点都在文本内
		if (this.range.anchor.element.isText()) {
			const val = this.range.anchor.element.textContent
			const startOffset = this.range.anchor.offset == this.range.focus.offset ? this.range.anchor.offset - 1 : this.range.anchor.offset
			const endOffset = this.range.focus.offset
			//进行删除
			this.range.anchor.element.textContent = val.substring(0, startOffset) + val.substring(endOffset)
			//重新设置光标位置
			if (this.range.anchor.offset == this.range.focus.offset) {
				this.range.anchor.offset -= 1
			}
			this.range.focus.element = this.range.anchor.element
			this.range.focus.offset = this.range.anchor.offset
			//文本元素被删空
			if (this.range.anchor.element.isEmpty()) {
				//如果所在块元素为空
				if (anchorBlock.isEmpty()) {
					const breakEl = new AlexElement('closed', 'br', null, null, null)
					this.addElementTo(breakEl, anchorBlock, 0)
					this.range.anchor.moveToEnd(breakEl)
					this.range.focus.moveToEnd(breakEl)
				}
				//所在块元素不是空
				else {
					//同块内前面存在可以获取焦点的元素
					if (previousElement && anchorBlock.isContains(previousElement)) {
						this.range.anchor.moveToEnd(previousElement)
						this.range.focus.moveToEnd(previousElement)
					}
					//同块内后面存在可以获取焦点的元素
					else if (nextElement && anchorBlock.isContains(nextElement)) {
						this.range.anchor.moveToStart(nextElement)
						this.range.focus.moveToStart(nextElement)
					}
				}
			}
		}
		//起点和终点在自闭合元素内
		else {
			//当前焦点所在元素在父元素中的位置
			const index = this.range.anchor.element.parent.children.findIndex(el => {
				return this.range.anchor.element.isEqual(el)
			})
			//删除该自闭合元素
			this.range.anchor.element.parent.children.splice(index, 1)
			//如果所在块元素为空
			if (anchorBlock.isEmpty()) {
				//如果删除的是换行符并且换行符前面还有可以获取焦点的元素，则更新焦点位置到前一个可获取焦点的元素
				if (this.range.anchor.element.isBreak() && previousElement) {
					this.range.anchor.moveToEnd(previousElement)
					this.range.focus.moveToEnd(previousElement)
				}
				//否则创建换行符
				else {
					const breakEl = new AlexElement('closed', 'br', null, null, null)
					this.addElementTo(breakEl, anchorBlock, 0)
					this.range.anchor.moveToEnd(breakEl)
					this.range.focus.moveToEnd(breakEl)
				}
			}
			//所在块元素不是空
			else {
				//删除的元素是否是换行符
				const isBreak = this.range.anchor.element.isBreak()
				//同块内前面存在可以获取焦点的元素
				if (previousElement && anchorBlock.isContains(previousElement)) {
					this.range.anchor.moveToEnd(previousElement)
					this.range.focus.moveToEnd(previousElement)
				}
				//同块内后面存在可以获取焦点的元素
				else if (nextElement && anchorBlock.isContains(nextElement)) {
					this.range.anchor.moveToStart(nextElement)
					this.range.focus.moveToStart(nextElement)
				}
				//如果所在行内元素存在并且行内元素是空并且删除的是换行符
				if (anchorInline && anchorInline.isEmpty() && isBreak) {
					this.delete()
				}
			}
		}
	}
	//监听selection改变
	_handleSelectionChange() {
		//如果编辑器禁用则不更新range
		if (this.disabled) {
			return
		}
		//如果是中文输入则不更新range
		if (this._isInputChinese) {
			return
		}
		const selection = window.getSelection()
		if (selection.rangeCount) {
			const range = selection.getRangeAt(0)
			if (range.startContainer.isEqualNode(this.$el) || range.endContainer.isEqualNode(this.$el)) {
				return
			}
			if (Dap.element.isContains(this.$el, range.startContainer) && Dap.element.isContains(this.$el, range.endContainer)) {
				const anchorKey = Dap.data.get(range.startContainer, 'data-alex-editor-key')
				const focusKey = Dap.data.get(range.endContainer, 'data-alex-editor-key')
				const anchorEle = this.getElementByKey(anchorKey)
				const focusEle = this.getElementByKey(focusKey)
				const anchor = new AlexPoint(anchorEle, range.startOffset)
				const focus = new AlexPoint(focusEle, range.endOffset)
				this.range = new AlexRange(anchor, focus)
			}
		}
	}
	//监听beforeinput
	_handleBeforeInput(e) {
		//粘贴和剪切使用系统的默认行为
		if (e.inputType == 'insertFromPaste' || e.inputType == 'deleteByCut') {
			return
		}
		e.preventDefault()
		//插入文本
		if (e.inputType == 'insertText') {
			this.insertText(e.data)
			this.formatElementStack()
			this.domRender()
			this.range.setCursor()
			return
		}
		//插入段落
		if (e.inputType == 'insertParagraph' || e.inputType == 'insertLineBreak') {
			this.insertParagraph()
			this.formatElementStack()
			this.domRender()
			this.range.setCursor()
			return
		}
		//删除内容
		if (e.inputType == 'deleteContentBackward') {
			this.delete()
			this.formatElementStack()
			this.domRender()
			this.range.setCursor()
			return
		}
		console.log('beforeInput没有监听到的inputType', e.inputType, e)
	}
	//监听中文输入
	_handleChineseInput(e) {
		e.preventDefault()
		if (e.type == 'compositionstart') {
			this._isInputChinese = true
		}
		if (e.type == 'compositionend') {
			this._isInputChinese = false
			//在中文输入结束后插入数据
			this.insertText(e.data)
			this.formatElementStack()
			this.domRender()
			this.range.setCursor()
		}
	}
	//监听键盘按下
	_handleKeydown(e) {
		//撤销
		if (Keyboard.Undo(e)) {
			e.preventDefault()
			const historyRecord = this.history.get(-1)
			if (historyRecord) {
				this.stack = historyRecord.stack
				this.range = historyRecord.range
				this.formatElementStack()
				this.domRender(true)
				this.range.setCursor()
			}
		}
		//重做
		else if (Keyboard.Redo(e)) {
			e.preventDefault()
			const historyRecord = this.history.get(1)
			if (historyRecord) {
				this.stack = historyRecord.stack
				this.range = historyRecord.range
				this.formatElementStack()
				this.domRender(true)
				this.range.setCursor()
			}
		}
	}
	//监听粘贴事件
	_handlePaste(e) {
		const files = e.clipboardData.files
		//粘贴文件
		if (files.length) {
			e.preventDefault()
			if (typeof this.handlePasteFile == 'function') {
				this.handlePasteFile.apply(this, [files])
			} else {
				let parseImageFn = []
				Array.from(files).forEach(file => {
					//将图片文件和视频转为base64
					if (file.type && /^((image\/)|(video\/))/g.test(file.type)) {
						parseImageFn.push(Dap.file.dataFileToBase64(file))
					}
				})
				Promise.all(parseImageFn).then(urls => {
					urls.forEach((url, index) => {
						let el = null
						//视频
						if (/^(data:video\/)/g.test(url)) {
							const marks = {
								src: url,
								autoplay: true,
								muted: true,
								controls: true
							}
							const styles = {
								width: 'auto',
								'max-width': '100%'
							}
							el = new AlexElement('closed', 'video', marks, styles, null)
						}
						//图片
						else {
							const marks = {
								src: url
							}
							const styles = {
								width: 'auto',
								'max-width': '100%'
							}
							el = new AlexElement('closed', 'img', marks, styles, null)
						}
						this.insertElement(el)
						this.formatElementStack()
						this.domRender(index < urls.length - 1)
						this.range.setCursor()
					})
				})
			}
		}
		//粘贴纯文本
		else if (!this.htmlPaste) {
			e.preventDefault()
			const data = e.clipboardData.getData('text/plain')
			if (data) {
				this.insertText(data)
				this.formatElementStack()
				this.domRender()
				this.range.setCursor()
			}
		}
		//粘贴html：以下是针对浏览器原本的粘贴功能，进行节点和光标的更新
		else {
			//加上setTimeout是为了在粘贴事件后进行处理，起到延时作用
			setTimeout(() => {
				if (!this.range.anchor.isEqual(this.range.focus)) {
					this.delete()
				}
				const flatElements = AlexElement.flatElements(this.stack)
				const nextElement = this.getNextElementOfPoint(this.range.focus)
				let rIndex = -1
				//如果是文本并且offset不是在最后一个
				if (this.range.focus.element.isText() && this.range.focus.offset < this.range.focus.element.textContent.length) {
					rIndex = flatElements.findIndex(item => {
						return this.range.focus.element.isEqual(item)
					})
					rIndex = flatElements.length - 1 - rIndex
				} else if (nextElement) {
					//获取后一个焦点元素的距离终点的序列
					rIndex = flatElements.findIndex(item => {
						return nextElement.isEqual(item)
					})
					rIndex = flatElements.length - 1 - rIndex
				}
				this.stack = this.parseHtml(this.$el.innerHTML)
				this.formatElementStack()
				const newElements = AlexElement.flatElements(this.stack)
				if (rIndex >= 0) {
					this.range.anchor.moveToStart(newElements[newElements.length - 1 - rIndex])
					this.range.focus.moveToStart(newElements[newElements.length - 1 - rIndex])
					const previousElement = this.getPreviousElementOfPoint(this.range.focus)
					if (previousElement) {
						this.range.anchor.moveToEnd(previousElement)
						this.range.focus.moveToEnd(previousElement)
					}
				} else {
					this.range.anchor.moveToEnd(newElements[newElements.length - 1])
					this.range.focus.moveToEnd(newElements[newElements.length - 1])
				}
				this.domRender()
				this.range.setCursor()
			}, 0)
		}
	}
	//监听剪切事件
	_handleCut(e) {
		//加上setTimeout是为了在剪切事件后进行处理，起到延时作用
		setTimeout(() => {
			this.delete()
			this.formatElementStack()
			this.domRender()
			this.range.setCursor()
		}, 0)
	}
	//获取最近的可设置光标的元素
	setRecentlyPoint(point) {
		const previousElement = this.getPreviousElementOfPoint(point)
		const nextElement = this.getNextElementOfPoint(point)
		const block = point.getBlock()
		if (previousElement && block.isContains(previousElement)) {
			point.moveToEnd(previousElement)
		} else if (nextElement && block.isContains(nextElement)) {
			point.moveToStart(nextElement)
		} else if (previousElement) {
			point.moveToEnd(previousElement)
		} else {
			point.moveToStart(nextElement)
		}
	}
	//获取指定元素的前一个兄弟元素
	getPreviousElement(ele) {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		if (ele.isRoot()) {
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
	//获取指定元素的后一个兄弟元素
	getNextElement(ele) {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		if (ele.isRoot()) {
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
	//将指定元素添加到父元素的子元素数组中
	addElementTo(childEle, parentEle, index) {
		if (!AlexElement.isElement(childEle)) {
			throw new Error('The first argument must be an AlexElement instance')
		}
		if (!AlexElement.isElement(parentEle)) {
			throw new Error('The second argument must be an AlexElement instance')
		}
		if (typeof index != 'number' || isNaN(index) || index < 0) {
			throw new Error('The third argument must be an integer not less than 0')
		}
		//当前元素无法添加到自闭合元素和文本元素中去
		if (parentEle.isClosed() || parentEle.isText()) {
			throw new Error('Elements of type "closed" and "text" cannot have children')
		}
		//块元素无法添加到非块元素下
		if (childEle.isBlock() && !parentEle.isBlock()) {
			throw new Error('A block element cannot be added to an element that is not a block')
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
	//将指定元素添加到另一个元素前面
	addElementBefore(newEle, targetEle) {
		if (!AlexElement.isElement(newEle)) {
			throw new Error('The first argument must be an AlexElement instance')
		}
		if (!AlexElement.isElement(targetEle)) {
			throw new Error('The second argument must be an AlexElement instance')
		}
		if (targetEle.isRoot()) {
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
	//将指定元素添加到另一个元素后面
	addElementAfter(newEle, targetEle) {
		if (!AlexElement.isElement(newEle)) {
			throw new Error('The first argument must be an AlexElement instance')
		}
		if (!AlexElement.isElement(targetEle)) {
			throw new Error('The second argument must be an AlexElement instance')
		}
		if (targetEle.isRoot()) {
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
	//将指定的块元素与其之前的一个块元素进行合并
	mergeBlockElement(ele) {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		if (!ele.isBlock()) {
			throw new Error('Elements that are not "block" cannot be merged')
		}
		//获取前一个兄弟元素
		const previousElement = this.getPreviousElement(ele)
		//如果存在，也必然是块元素
		if (previousElement) {
			previousElement.children.push(...ele.children)
			previousElement.children.forEach(item => {
				item.parent = previousElement
			})
			if (ele.isRoot()) {
				const index = this.stack.findIndex(item => {
					return ele.isEqual(item)
				})
				this.stack.splice(index, 1)
			} else {
				const index = ele.parent.children.findIndex(item => {
					return ele.isEqual(item)
				})
				ele.parent.children.splice(index, 1)
			}
		}
		//前一个兄弟元素不存在，则将自身与父元素合并
		else if (!ele.isRoot()) {
			ele.parent.children.push(...ele.children)
			ele.parent.children.forEach(item => {
				item.parent = ele.parent
			})
			const index = ele.parent.children.findIndex(item => {
				return ele.isEqual(item)
			})
			ele.parent.children.splice(index, 1)
		}
	}
	//根据key查询元素
	getElementByKey(key) {
		if (!key) {
			throw new Error('You need to specify a key to do the query')
		}
		const searchFn = elements => {
			let element = null
			for (let el of elements) {
				if (el.key == key) {
					element = el
					break
				}
				if (el.hasChildren()) {
					element = searchFn(el.children)
					if (element) {
						break
					}
				}
			}
			return element
		}
		return searchFn(this.stack)
	}
	//将节点转为元素
	parseNode(node) {
		if (!node) {
			throw new Error('You need to give a node to convert')
		}
		if (node.nodeType != 1 && node.nodeType != 3) {
			throw new Error('Nodes that are not elements or text cannot be parsed')
		}
		//文本节点
		if (node.nodeType == 3) {
			return this.formatElement(new AlexElement('text', null, null, null, node.nodeValue))
		}
		//元素节点
		else {
			const marks = Util.getAttributes(node)
			const styles = Util.getStyles(node)
			//默认定义为块元素，标签名为小写
			let element = new AlexElement('block', node.nodeName.toLocaleLowerCase(), marks, styles, null)
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
			return this.formatElement(element)
		}
	}
	//将html转为元素
	parseHtml(html) {
		if (!html) {
			throw new Error('You need to give an html content to convert')
		}
		const node = document.createElement('div')
		node.innerHTML = html
		let elements = []
		Array.from(node.childNodes).forEach(el => {
			const element = this.parseNode(el)
			elements.push(element)
		})
		return elements
	}
	//向上查询可以设置焦点的元素
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
	//向下查找可以设置焦点的元素
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
	//获取选区之间的元素
	getElementsByRange() {
		//如果起点和终点在一个地方则返回空数组
		if (this.range.anchor.isEqual(this.range.focus)) {
			return []
		}
		let elements = []
		//如果起点和终点是一个元素内
		if (this.range.anchor.element.isEqual(this.range.focus.element)) {
			//文本
			if (this.range.anchor.element.isText()) {
				let val = this.range.anchor.element.textContent
				this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset)
				let newEl = new AlexElement('text', null, null, null, val.substring(this.range.anchor.offset, this.range.focus.offset))
				this.addElementAfter(newEl, this.range.anchor.element)
				let newFocus = new AlexElement('text', null, null, null, val.substring(this.range.focus.offset))
				this.addElementAfter(newFocus, newEl)
				this.range.anchor.moveToStart(newEl)
				this.range.focus.moveToEnd(newEl)
				elements = [newEl]
			}
			//自闭合元素
			else {
				elements = [this.range.anchor.element]
			}
		}
		//起点和终点不在一个元素内
		else {
			const flatElements = AlexElement.flatElements(this.stack)
			const anchorIndex = flatElements.findIndex(item => {
				return this.range.anchor.element.isEqual(item)
			})
			const focusIndex = flatElements.findIndex(item => {
				return this.range.focus.element.isEqual(item)
			})
			//获取选区之间的元素
			for (let i = anchorIndex + 1; i < focusIndex; i++) {
				if (!flatElements[i].hasContains(this.range.anchor.element) && !flatElements[i].hasContains(this.range.focus.element)) {
					elements.push(flatElements[i])
				}
			}
			//起点是文本
			if (this.range.anchor.element.isText()) {
				//在文本最前面
				if (this.range.anchor.offset == 0) {
					elements.unshift(this.range.anchor.element)
				}
				//不在文本最后面
				else if (this.range.anchor.offset < this.range.anchor.element.textContent.length) {
					let val = this.range.anchor.element.textContent
					this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset)
					let newEl = new AlexElement('text', null, null, null, val.substring(this.range.anchor.offset))
					this.addElementAfter(newEl, this.range.anchor.element)
					elements.unshift(newEl)
					this.range.anchor.moveToStart(newEl)
				}
			}
			//起点是自闭合元素且在自闭合元素前面
			else if (this.range.anchor.offset == 0) {
				elements.unshift(this.range.anchor.element)
			}

			//终点是文本
			if (this.range.focus.element.isText()) {
				//在文本最后面
				if (this.range.focus.offset == this.range.focus.element.textContent.length) {
					elements.push(this.range.focus.element)
				}
				//不在文本最前面
				else if (this.range.focus.offset > 0) {
					let val = this.range.focus.element.textContent
					this.range.focus.element.textContent = val.substring(0, this.range.focus.offset)
					let newEl = new AlexElement('text', null, null, null, val.substring(this.range.focus.offset))
					this.addElementAfter(newEl, this.range.focus.element)
					elements.push(this.range.focus.element)
				}
			}
			//终点是自闭合元素且offset为1
			else if (this.range.focus.offset == 1) {
				elements.push(this.range.focus.element)
			}
		}
		return elements
	}
	//格式化单个元素
	formatElement(ele) {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		//格式化
		const format = element => {
			//从子孙元素开始格式化
			if (element.hasChildren()) {
				element.children = element.children.map(format)
			}
			//格式化自身
			this._formatUnchangeableRules.forEach(fn => {
				element = fn(element)
			})
			return element
		}
		//移除子孙元素中的空元素
		const removeEmptyElement = element => {
			if (element.hasChildren()) {
				element.children.forEach(item => {
					if (!item.isEmpty()) {
						item = removeEmptyElement(item)
					}
				})
				element.children = element.children.filter(item => {
					return !item.isEmpty()
				})
			}
			return element
		}
		//格式化
		ele = format(ele)
		//移除所有的空元素
		ele = removeEmptyElement(ele)
		return ele
	}
	//格式化stack
	formatElementStack() {
		this.stack = this.stack
			.map(ele => {
				//转为块元素
				if (!ele.isBlock()) {
					ele.convertToBlock()
				}
				ele = this.formatElement(ele)
				return ele
			})
			.filter(ele => {
				//移除根部的空元素
				return !ele.isEmpty()
			})
	}
	//渲染编辑器dom内容
	domRender(unPushHistory = false) {
		this.$el.innerHTML = ''
		this.stack.forEach(element => {
			let elm = element._renderElement()
			this.$el.appendChild(elm)
		})
		this._oldValue = this.value
		this.value = this.$el.innerHTML
		//值有变化
		if (this._oldValue != this.value) {
			if (typeof this.onChange == 'function') {
				this.onChange.apply(this, [this.value, this._oldValue])
			}
			//unPushHistory如果是true则表示不加入历史记录中
			if (!unPushHistory) {
				//将本次的stack和range推入历史栈中
				this.history.push(this.stack, this.range)
			}
		}
	}
	//禁用编辑器
	setDisabled() {
		this.disabled = true
		this.$el.removeAttribute('contenteditable')
	}
	//启用编辑器
	setEnabled() {
		this.disabled = false
		this.$el.setAttribute('contenteditable', true)
	}
	//根据光标位置删除编辑器内容
	delete() {
		//单个删除
		if (this.range.anchor.isEqual(this.range.focus)) {
			//前一个可以获取焦点的元素
			const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
			//当前焦点所在的块元素
			const anchorBlock = this.range.anchor.getBlock()
			//光标在焦点元素的开始处
			if (this.range.anchor.offset == 0) {
				//如果前一个可获取焦点的元素存在
				if (previousElement) {
					//和当前焦点元素在同一个块内
					if (anchorBlock.isContains(previousElement)) {
						this.range.anchor.moveToEnd(previousElement)
						this.range.focus.moveToEnd(previousElement)
						this._deleteInSameElement()
					}
					//和当前焦点元素不在同一个块内
					else {
						//当前焦点所在块元素和前一个块元素进行合并
						this.mergeBlockElement(anchorBlock)
						this.range.anchor.moveToEnd(previousElement)
						this.range.focus.moveToEnd(previousElement)
					}
				}
			}
			//正常删除
			else {
				this._deleteInSameElement()
			}
		}
		//批量删除
		else {
			//选区在一个元素内
			if (this.range.anchor.element.isEqual(this.range.focus.element)) {
				this._deleteInSameElement()
			} else {
				const flatElements = AlexElement.flatElements(this.stack)
				const anchorIndex = flatElements.findIndex(item => {
					return this.range.anchor.element.isEqual(item)
				})
				const focusIndex = flatElements.findIndex(item => {
					return this.range.focus.element.isEqual(item)
				})
				//获取选区之间的
				let rangeElements = []
				for (let i = anchorIndex + 1; i < focusIndex; i++) {
					if (!flatElements[i].hasContains(this.range.anchor.element) && !flatElements[i].hasContains(this.range.focus.element)) {
						rangeElements.push(flatElements[i])
					}
				}
				//清空选区内容
				rangeElements.forEach(el => {
					if (el.isText()) {
						el.textContent = ''
					} else if (el.isClosed()) {
						const index = el.parent.children.findIndex(item => {
							return el.isEqual(item)
						})
						el.parent.children.splice(index, 1)
					}
					if (el.hasChildren()) {
						el.children = []
					}
				})
				//获取终点所在的块元素
				const focusBlock = this.range.focus.getBlock()
				//不在一个块内则需要merge
				let hasMerge = !focusBlock.hasContains(this.range.anchor.element)

				//执行终点处的删除逻辑
				if (this.range.focus.offset > 0) {
					//记录删除操作之前的值
					let anchorElement = this.range.anchor.element
					let anchorOffset = this.range.anchor.offset
					this.range.anchor.element = this.range.focus.element
					this.range.anchor.offset = 0 //如果是文本，起点从文本起点0开始；如果是自闭合元素，起点从0开始
					this._deleteInSameElement()
					//恢复起点光标位置
					this.range.anchor.element = anchorElement
					this.range.anchor.offset = anchorOffset
				}
				const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1
				//执行起点处的删除逻辑
				if (this.range.anchor.offset < endOffset) {
					this.range.focus.element = this.range.anchor.element
					//如果是文本从文本终点开始，如果是自闭合元素从自闭合元素终点开始
					this.range.focus.offset = endOffset
					this._deleteInSameElement()
				}
				if (hasMerge) {
					this.mergeBlockElement(focusBlock)
				}
			}
		}
	}
	//根据光标位置向编辑器内插入文本
	insertText(data) {
		if (!data || typeof data != 'string') {
			throw new Error('The argument must be a string')
		}
		//对空格进行处理
		data = data.replace(/\s+/g, () => {
			const span = document.createElement('span')
			span.innerHTML = '&nbsp;'
			return span.innerText
		})
		//起点和终点在一个位置
		if (this.range.anchor.isEqual(this.range.focus)) {
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
	//在光标处换行
	insertParagraph() {
		//起点和终点在一个位置
		if (this.range.anchor.isEqual(this.range.focus)) {
			//前一个可以获取焦点的元素
			const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
			//后一个可以获取焦点的元素
			const nextElement = this.getNextElementOfPoint(this.range.anchor)
			//当前焦点所在的块元素
			const anchorBlock = this.range.anchor.getBlock()
			//终点位置
			const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1
			//焦点在当前块的起点位置
			if (this.range.anchor.offset == 0 && !(previousElement && anchorBlock.isContains(previousElement))) {
				//在该块之前插入一个新的段落，标签名称和样式与上一个段落一致
				const paragraph = new AlexElement('block', anchorBlock.parsedom, null, { ...anchorBlock.styles }, null)
				const breakEle = new AlexElement('closed', 'br', null, null, null)
				this.addElementTo(breakEle, paragraph, 0)
				this.addElementBefore(paragraph, anchorBlock)
				this.range.anchor.moveToStart(anchorBlock)
				this.range.focus.moveToStart(anchorBlock)
			}
			//焦点在当前块的终点位置
			else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
				//在该块之后插入一个新的段落，标签名称和样式与上一个段落一致
				const paragraph = new AlexElement('block', anchorBlock.parsedom, null, { ...anchorBlock.styles }, null)
				const breakEle = new AlexElement('closed', 'br', null, null, null)
				this.addElementTo(breakEle, paragraph, 0)
				this.addElementAfter(paragraph, anchorBlock)
				this.range.anchor.moveToStart(paragraph)
				this.range.focus.moveToStart(paragraph)
			}
			//焦点在当前块的中间部分则需要切割
			else {
				//获取所在块元素
				const block = this.range.anchor.getBlock()
				const newBlock = block.clone(true)
				this.addElementAfter(newBlock, block)
				//将终点移动到块元素末尾
				this.range.focus.moveToEnd(block)
				this.delete()
				//将终点移动到新的块元素
				const elements = AlexElement.flatElements(block.children)
				const index = elements.findIndex(item => {
					return this.range.anchor.element.isEqual(item)
				})
				const newElements = AlexElement.flatElements(newBlock.children)
				this.range.focus.element = newElements[index]
				this.range.focus.offset = this.range.anchor.offset
				this.range.anchor.moveToStart(newBlock)
				this.delete()
			}
		} else {
			this.delete()
			this.insertParagraph()
		}
	}
	//根据光标插入元素
	insertElement(ele) {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		//起点和终点在一个位置
		if (this.range.anchor.isEqual(this.range.focus)) {
			if (ele.isBlock()) {
				//前一个可以获取焦点的元素
				const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
				//后一个可以获取焦点的元素
				const nextElement = this.getNextElementOfPoint(this.range.anchor)
				//当前焦点所在的块元素
				const anchorBlock = this.range.anchor.getBlock()
				//终点位置
				const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1
				//焦点在当前块的起点位置
				if (this.range.anchor.offset == 0 && !(previousElement && anchorBlock.isContains(previousElement))) {
					//在该块之前插入
					this.addElementBefore(ele, anchorBlock)
				}
				//焦点在当前块的终点位置
				else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
					//在该块之后插入
					this.addElementAfter(ele, anchorBlock)
				}
				//焦点在当前块的中间部分则需要切割
				else {
					//获取所在块元素
					const block = this.range.anchor.getBlock()
					const newBlock = block.clone(true)
					this.addElementAfter(newBlock, block)
					//将终点移动到块元素末尾
					this.range.focus.moveToEnd(block)
					this.delete()
					//将终点移动到新的块元素
					const elements = AlexElement.flatElements(block.children)
					const index = elements.findIndex(item => {
						return this.range.anchor.element.isEqual(item)
					})
					const newElements = AlexElement.flatElements(newBlock.children)
					this.range.focus.element = newElements[index]
					this.range.focus.offset = this.range.anchor.offset
					this.range.anchor.moveToStart(newBlock)
					this.delete()

					//在新的块之前插入
					this.addElementBefore(ele, newBlock)
				}
			} else {
				//是文本
				if (this.range.anchor.element.isText()) {
					let val = this.range.anchor.element.textContent
					this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset)
					let newText = new AlexElement('text', null, null, null, val.substring(this.range.anchor.offset))
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
			this.range.anchor.moveToEnd(ele)
			this.range.focus.moveToEnd(ele)
		} else {
			this.delete()
			this.insertElement(ele)
		}
	}
	//将真实的光标设置到指定元素开始
	collapseToStart(element) {
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.range.anchor.moveToStart(element)
			this.range.focus.moveToStart(element)
			this.range.setCursor()
		}
		//文档最后面
		else {
			const flatElements = AlexElement.flatElements(this.stack)
			this.collapseToStart(flatElements[0])
		}
	}
	//将真实的光标设置到指定元素最后
	collapseToEnd(element) {
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.range.anchor.moveToEnd(element)
			this.range.focus.moveToEnd(element)
			this.range.setCursor()
		}
		//文档最后面
		else {
			const flatElements = AlexElement.flatElements(this.stack)
			const length = flatElements.length
			this.collapseToEnd(flatElements[length - 1])
		}
	}
	//根据光标设置css样式
	setStyle(styleObject) {
		if (!Dap.common.isObject) {
			throw new Error('The argument must be an object')
		}
		const elements = this.getElementsByRange()
		elements.forEach(el => {
			if (el.isText()) {
				const children = el.parent.children.filter(item => {
					return !item.isEmpty()
				})
				//如果父元素只有该文本一个子元素
				if (children.length == 1) {
					for (let key in styleObject) {
						if (!el.parent.hasStyles()) {
							el.parent.styles = {}
						}
						el.parent.styles[key] = styleObject[key]
					}
				} else {
					let cloneEl = el.clone()
					el.type = 'inline'
					el.parsedom = 'span'
					el.textContent = null
					for (let key in styleObject) {
						if (!el.hasStyles()) {
							el.styles = {}
						}
						el.styles[key] = styleObject[key]
					}
					this.addElementTo(cloneEl, el, 0)
				}
			} else if (el.isClosed()) {
				for (let key in styleObject) {
					if (!el.hasStyles()) {
						el.styles = {}
					}
					el.styles[key] = styleObject[key]
				}
			}
		})
		this.range.anchor.moveToStart(elements[0])
		this.range.focus.moveToEnd(elements[elements.length - 1])
	}
}

export default AlexEditor
