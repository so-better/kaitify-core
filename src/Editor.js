import Util from './Util'
import AlexElement from './Element'
import AlexPoint from './Point'
import AlexRange from './Range'
import AlexHistory from './History'
import Keyboard from './Keyboard'
import Dap from 'dap-util'

class AlexEditor {
	constructor(el, options) {
		if (typeof el == 'string' && el) {
			el = document.body.querySelector(el)
		}
		//校验el是否元素
		if (!Dap.element.isElement(el)) {
			throw new Error('You must specify a dom container to initialize the editor')
		}
		//校验是否已经初始化过
		if (Dap.data.get(el, 'data-alex-editor-init')) {
			throw new Error('The element node has been initialized to the editor')
		}
		//设置初始化后的标记
		Dap.data.set(el, 'data-alex-editor-init', true)
		//格式化options参数
		options = this._formatOptions(options)
		//编辑器容器
		this.$el = el
		//是否禁用
		this.disabled = options.disabled
		//编辑器的值
		this.value = options.value
		//自定义编辑器元素的格式化规则
		this.renderRules = options.renderRules
		//粘贴时是否粘贴html
		this.htmlPaste = options.htmlPaste
		//编辑的range
		this.range = null
		//事件集合
		this._events = {}
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
		//如果元素数组为空则说明给的初始值不符合要求，则此时初始化stack
		this.stack.length == 0 ? this._initStack() : null
		//初始设置range
		this._initRange()
		//渲染dom
		this.domRender()
		//编辑器禁用和启用设置
		this.disabled ? this.setDisabled() : this.setEnabled()
		//设置selection的监听更新range
		Dap.event.on(document, 'selectionchange.alex_editor', this._handleSelectionChange.bind(this))
		//监听内容输入
		Dap.event.on(this.$el, 'beforeinput.alex_editor', this._handleBeforeInput.bind(this))
		//监听中文输入
		Dap.event.on(this.$el, 'compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor', this._handleChineseInput.bind(this))
		//监听键盘按下
		Dap.event.on(this.$el, 'keydown.alex_editor', this._handleKeydown.bind(this))
		//监听编辑器剪切
		Dap.event.on(this.$el, 'cut.alex_editor', this._handleCut.bind(this))
		//监听编辑器粘贴
		Dap.event.on(this.$el, 'paste.alex_editor', this._handlePaste.bind(this))
		//监听编辑器拖放
		Dap.event.on(this.$el, 'drop.alex_editor', this._handleNodesChange.bind(this))
		//监听编辑器获取焦点
		Dap.event.on(this.$el, 'focus.alex_editor', () => {
			this.emit('focus', this.value)
		})
		//监听编辑器失去焦点
		Dap.event.on(this.$el, 'blur.alex_editor', () => {
			this.emit('blur', this.value)
		})
	}

	//校验函数数组，用于格式化
	_formatUnchangeableRules = [
		//修改元素的属性和自定义格式化规则
		element => {
			if (element.parsedom) {
				if (['br', 'img', 'video'].includes(element.parsedom)) {
					element.type = 'closed'
					element.children = null
				} else if (['span', 'a', 'label', 'code'].includes(element.parsedom)) {
					element.type = 'inline'
				} else if (['input', 'textarea', 'select', 'script', 'style', 'html', 'body', 'meta', 'link', 'head', 'title'].includes(element.parsedom)) {
					element.type = 'closed'
					element.parsedom = 'br'
					element.children = null
				} else if (['b', 'strong'].includes(element.parsedom)) {
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject(element.styles)) {
						Object.assign(element.styles, {
							'font-weight': 'bold'
						})
					} else {
						element.styles = {
							'font-weight': 'bold'
						}
					}
				} else if (['sup'].includes(element.parsedom)) {
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject(element.styles)) {
						Object.assign(element.styles, {
							'vertical-align': 'super'
						})
					} else {
						element.styles = {
							'vertical-align': 'super'
						}
					}
				} else if (['sub'].includes(element.parsedom)) {
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject(element.styles)) {
						Object.assign(element.styles, {
							'vertical-align': 'sub'
						})
					} else {
						element.styles = {
							'vertical-align': 'sub'
						}
					}
				} else if (['i'].includes(element.parsedom)) {
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject(element.styles)) {
						Object.assign(element.styles, {
							'font-style': 'italic'
						})
					} else {
						element.styles = {
							'font-style': 'italic'
						}
					}
				} else if (['u'].includes(element.parsedom)) {
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject(element.styles)) {
						Object.assign(element.styles, {
							'text-decoration-line': 'underline'
						})
					} else {
						element.styles = {
							'text-decoration-line': 'underline'
						}
					}
				} else if (['del'].includes(element.parsedom)) {
					element.type = 'inline'
					element.parsedom = 'span'
					if (Dap.common.isObject(element.styles)) {
						Object.assign(element.styles, {
							'text-decoration-line': 'line-through'
						})
					} else {
						element.styles = {
							'text-decoration-line': 'line-through'
						}
					}
				} else if (['pre'].includes(element.parsedom)) {
					element.type = 'block'
				} else if (['blockquote'].includes(element.parsedom)) {
					element.type = 'block'
					if (Dap.common.isObject(element.styles)) {
						Object.assign(element.styles, {
							'white-space': 'pre-wrap'
						})
					} else {
						element.styles = {
							'white-space': 'pre-wrap'
						}
					}
				}
			} else {
				element.type = 'text'
			}
			if (typeof this.renderRules == 'function') {
				element = this.renderRules.apply(this, [element])
			}
			return element
		},
		//兄弟元素合并策略（如果光标在子元素中可能会重新设置）
		element => {
			const mergeElement = ele => {
				//判断两个元素是否可以合并
				const canMerge = (pel, nel) => {
					if (pel.isEmpty() || nel.isEmpty()) {
						return true
					}
					if (pel.isBreak() && nel.isBreak()) {
						return true
					}
					if (pel.isText() && nel.isText()) {
						return true
					}
					if (pel.isInline() && nel.isInline()) {
						return pel.parsedom == nel.parsedom && pel.isEqualStyles(nel) && pel.isEqualMarks(nel)
					}
					return false
				}
				//两个元素的合并方法
				const merge = (pel, nel) => {
					//存在空元素
					if (pel.isEmpty() || nel.isEmpty()) {
						//后一个元素是空元素
						if (nel.isEmpty()) {
							//起点在后一个元素上，则直接将起点设置到前一个元素上
							if (this.range && nel.hasContains(this.range.anchor.element)) {
								this.range.anchor.moveToEnd(pel)
							}
							//终点在后一个元素上，则直接将终点设置到前一个元素上
							if (this.range && nel.hasContains(this.range.focus.element)) {
								this.range.focus.moveToEnd(pel)
							}
							//删除被合并的元素
							const index = nel.parent.children.findIndex(item => {
								return nel.isEqual(item)
							})
							nel.parent.children.splice(index, 1)
						}
						//前一个元素是空元素
						else if (pel.isEmpty()) {
							//起点在前一个元素上，则直接将起点设置到后一个元素上
							if (this.range && this.range.anchor.element.isEqual(pel)) {
								this.range.anchor.moveToStart(nel)
							}
							//终点在前一个元素上，则直接将终点设置到后一个元素上
							if (this.range && this.range.focus.element.isEqual(pel)) {
								this.range.focus.moveToStart(nel)
							}
							//删除被合并的元素
							const index = pel.parent.children.findIndex(item => {
								return pel.isEqual(item)
							})
							pel.parent.children.splice(index, 1)
						}
					}
					//文本元素合并
					else if (pel.isText()) {
						//起点在后一个元素上，则将起点设置到前一个元素上
						if (this.range && this.range.anchor.element.isEqual(nel)) {
							this.range.anchor.element = pel
							this.range.anchor.offset = pel.textContent.length + this.range.anchor.offset
						}
						//终点在后一个元素上，则将终点设置到前一个元素上
						if (this.range && this.range.focus.element.isEqual(nel)) {
							this.range.focus.element = pel
							this.range.focus.offset = pel.textContent.length + this.range.focus.offset
						}
						if (!pel.textContent) {
							pel.textContent = ''
						}
						if (!nel.textContent) {
							nel.textContent = ''
						}
						//将后一个元素的内容给前一个元素
						pel.textContent += nel.textContent
						//删除被合并的元素
						const index = nel.parent.children.findIndex(item => {
							return nel.isEqual(item)
						})
						nel.parent.children.splice(index, 1)
					}
					//换行符合并
					else if (pel.isBreak()) {
						//起点在后一个换行符上，则直接将起点设置到前一个换行符上
						if (this.range && this.range.anchor.element.isEqual(nel)) {
							this.range.anchor.element = pel
						}
						//终点在后一个换行符上，则直接将终点设置到前一个换行符上
						if (this.range && this.range.focus.element.isEqual(nel)) {
							this.range.focus.element = pel
						}
						//删除被合并的元素
						const index = nel.parent.children.findIndex(item => {
							return nel.isEqual(item)
						})
						nel.parent.children.splice(index, 1)
					}
					//行内元素合并
					else if (pel.isInline()) {
						if (!pel.hasChildren()) {
							pel.children = []
						}
						if (!nel.hasChildren()) {
							nel.children = []
						}
						pel.children.push(...nel.children)
						pel.children.forEach(item => {
							item.parent = pel
						})
						pel = mergeElement(pel)
						//删除被合并的元素
						const index = nel.parent.children.findIndex(item => {
							return nel.isEqual(item)
						})
						nel.parent.children.splice(index, 1)
					}
				}
				//存在子元素并且子元素数量大于1
				if (ele.hasChildren() && ele.children.length > 1) {
					let index = 0
					while (index <= ele.children.length - 2) {
						if (canMerge(ele.children[index], ele.children[index + 1])) {
							merge(ele.children[index], ele.children[index + 1])
						} else {
							index++
						}
					}
				}
				return ele
			}
			return mergeElement(element)
		},
		//子元素和父元素合并策略（仅会针对行内元素和块元素）
		element => {
			//判断两个元素是否可以合并
			const canMerge = (parent, child) => {
				if ((parent.isInline() && child.isInline()) || (parent.isBlock() && child.isBlock())) {
					return parent.parsedom == child.parsedom
				}
				return false
			}
			//两个元素的合并方法
			const merge = (parent, child) => {
				//如果子元素有styles
				if (child.hasStyles()) {
					if (parent.hasStyles()) {
						Object.assign(parent.styles, child.styles)
					} else {
						parent.styles = { ...child.styles }
					}
				}
				//如果子元素有marks
				if (child.hasMarks()) {
					if (parent.hasMarks()) {
						Object.assign(parent.marks, child.marks)
					} else {
						parent.marks = { ...child.marks }
					}
				}
				parent.children.push(...child.children)
				parent.children.forEach(item => {
					item.parent = parent
				})
				//删除被合并的元素
				const index = parent.children.findIndex(item => {
					return child.isEqual(item)
				})
				parent.children.splice(index, 1)
			}
			//存在子元素并且子元素只有一个且父子元素可以合并
			if (element.hasChildren() && element.children.length == 1 && canMerge(element, element.children[0])) {
				merge(element, element.children[0])
			}
			return element
		},
		//换行符清除规则
		element => {
			if (element.hasChildren()) {
				//块元素中的换行符
				if (element.isBlock()) {
					//过滤掉空元素
					const children = element.children.filter(el => {
						return !el.isEmpty()
					})
					//是否有换行符
					let hasBreak = children.some(el => {
						return el.isBreak()
					})
					//是否有其他元素
					let hasOther = children.some(el => {
						return !el.isBreak()
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
					else if (hasBreak && children.length > 1) {
						//把除了第一个换行符外的其他换行符都置为空元素
						element.children = element.children.map((el, index) => {
							if (el.isBreak() && index > 0) {
								el.setEmpty()
							}
							return el
						})
					}
				}
				//行内元素的换行符
				else if (element.isInline()) {
					element.children.map(el => {
						if (el.isBreak()) {
							el.setEmpty()
						}
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
				//移除空元素时判断该元素是否是起点元素，如果是则更新起点元素
				if (this.range && this.range.anchor.element.isEqual(element)) {
					this.setRecentlyPoint(this.range.anchor)
				}
				//移除空元素时判断该元素是否是终点元素，如果是则更新终点元素
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
			renderRules: null,
			htmlPaste: false,
			value: '<p><br></p>'
		}
		if (Dap.common.isObject(options)) {
			if (typeof options.disabled == 'boolean') {
				opts.disabled = options.disabled
			}
			if (typeof options.renderRules == 'function') {
				opts.renderRules = options.renderRules
			}
			if (typeof options.value == 'string' && options.value) {
				opts.value = options.value
			}
			if (typeof options.htmlPaste == 'boolean') {
				opts.htmlPaste = options.htmlPaste
			}
		}
		return opts
	}
	//初始化stack
	_initStack() {
		const ele = new AlexElement('block', AlexElement.paragraph, null, null, null)
		const breakEle = new AlexElement('closed', 'br', null, null, null)
		this.addElementTo(breakEle, ele)
		this.stack = [ele]
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
		const anchorBlock = this.range.anchor.element.getBlock()
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
					this.addElementTo(breakEl, anchorBlock)
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
			//文本元被删成了空白元素
			else if (this.range.anchor.element.isSpaceText()) {
				this.range.anchor.offset = 0
				this.range.focus.offset = this.range.anchor.element.textContent.length
				this.delete()
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
					this.addElementTo(breakEl, anchorBlock)
					this.range.anchor.moveToEnd(breakEl)
					this.range.focus.moveToEnd(breakEl)
				}
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
				//判断是否空白元素，如果是则继续删除
				if (this.range.anchor.element.isSpaceText()) {
					this.range.anchor.offset = 0
					this.range.focus.offset = this.range.anchor.element.textContent.length
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
				this.emit('rangeUpdate', this.range)
			}
		}
	}
	//监听beforeinput
	_handleBeforeInput(e) {
		if (this.disabled) {
			return
		}
		//以下输入类型使用系统的默认行为
		if (e.inputType == 'insertFromPaste' || e.inputType == 'deleteByCut' || e.inputType == 'deleteByDrag' || e.inputType == 'insertFromDrop' || e.inputType == 'insertCompositionText') {
			return
		}
		e.preventDefault()
		//插入文本
		if (e.inputType == 'insertText') {
			if (e.data) {
				this.insertText(e.data)
				this.formatElementStack()
				this.domRender()
				this.setCursor()
			}
			return
		}
		//插入段落
		if (e.inputType == 'insertParagraph' || e.inputType == 'insertLineBreak') {
			this.insertParagraph()
			this.formatElementStack()
			this.domRender()
			this.setCursor()
			return
		}
		//删除内容
		if (e.inputType == 'deleteContentBackward') {
			this.delete()
			this.formatElementStack()
			this.domRender()
			this.setCursor()
			return
		}
		console.log('beforeInput没有监听到的inputType', e.inputType, e)
	}
	//监听中文输入
	_handleChineseInput(e) {
		if (this.disabled) {
			return
		}
		e.preventDefault()
		if (e.type == 'compositionstart') {
			this._isInputChinese = true
		}
		if (e.type == 'compositionend') {
			this._isInputChinese = false
			//在中文输入结束后插入数据
			if (e.data) {
				this.insertText(e.data)
				this.formatElementStack()
				this.domRender()
				this.setCursor()
			}
		}
	}
	//监听键盘按下
	_handleKeydown(e) {
		if (this.disabled) {
			return
		}
		//撤销
		if (Keyboard.Undo(e)) {
			e.preventDefault()
			const historyRecord = this.history.get(-1)
			if (historyRecord) {
				this.stack = historyRecord.stack
				this.range = historyRecord.range
				this.formatElementStack()
				this.domRender(true)
				this.setCursor()
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
				this.setCursor()
			}
		}
	}
	//监听粘贴事件
	_handlePaste(e) {
		if (this.disabled) {
			return
		}
		const files = e.clipboardData.files
		//粘贴文件
		if (files.length) {
			e.preventDefault()
			if (!this.emit('pasteFile', files)) {
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
						this.setCursor()
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
				this.setCursor()
			}
		}
		//粘贴html：以下是针对浏览器原本的粘贴功能，进行节点和光标的更新
		else {
			let element = null
			const end = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1
			//在元素结尾处
			if (this.range.focus.offset == end) {
				const nextElement = this.getNextElementOfPoint(this.range.focus)
				if (nextElement) {
					element = nextElement
				}
			} else {
				element = this.range.focus.element
			}
			const elements = AlexElement.flatElements(this.stack)
			const index = elements.findIndex(item => {
				return element && item.isEqual(element)
			})
			//获取焦点元素距离扁平化数组结尾的距离
			const lastLength = elements.length - 1 - index
			setTimeout(() => {
				//重新渲染
				this.stack = this.parseHtml(this.$el.innerHTML)
				this.formatElementStack()
				const flatElements = AlexElement.flatElements(this.stack)
				//index>-1说明不是在编辑器的尾部进行的粘贴
				if (index > -1) {
					//根据之前计算的lastLength获取焦点元素的位置
					const newIndex = flatElements.length - 1 - lastLength
					this.range.anchor.moveToStart(flatElements[newIndex])
					this.range.focus.moveToStart(flatElements[newIndex])
					//将焦点移动到前一个可获取焦点的元素，即粘贴内容的最后
					const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
					if (previousElement) {
						this.range.anchor.moveToEnd(previousElement)
						this.range.focus.moveToEnd(previousElement)
					}
				}
				//在编辑器尾部粘贴
				else {
					this.range.anchor.moveToEnd(flatElements[flatElements.length - 1])
					this.range.focus.moveToEnd(flatElements[flatElements.length - 1])
				}
				this.domRender()
				this.setCursor()
			}, 0)
		}
	}
	//监听剪切事件
	_handleCut(e) {
		if (this.disabled) {
			return
		}
		//加上setTimeout是为了在剪切事件后进行处理，起到延时作用
		setTimeout(() => {
			this.delete()
			this.formatElementStack()
			this.domRender()
			this.setCursor()
		}, 0)
	}
	//解决编辑器内元素节点与stack数据不符的情况，进行数据纠正
	_handleNodesChange() {
		//加上setTimeout是为了保证this.$el.innerHTML获取的是最新的
		setTimeout(() => {
			this.stack = this.parseHtml(this.$el.innerHTML)
			this.formatElementStack()
			const flatElements = AlexElement.flatElements(this.stack)
			this.range.anchor.moveToEnd(flatElements[flatElements.length - 1])
			this.range.focus.moveToEnd(flatElements[flatElements.length - 1])
			this.domRender()
			this.setCursor()
		}, 0)
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
	//格式化单个元素
	formatElement(ele) {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		//格式化
		const format = (element, fn) => {
			//从子孙元素开始格式化
			if (element.hasChildren()) {
				element.children = element.children.map(item => {
					return format(item, fn)
				})
			}
			//格式化自身后返回
			return fn(element)
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
		this._formatUnchangeableRules.forEach(fn => {
			ele = format(ele, fn)
		})
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
			//触发change事件
			this.emit('change', this.value, this._oldValue)
			//unPushHistory如果是true则表示不加入历史记录中
			if (!unPushHistory) {
				//将本次的stack和range推入历史栈中
				this.history.push(this.stack, this.range)
			}
		}
	}
	//根据光标位置删除编辑器内容
	delete() {
		//单个删除
		if (this.range.anchor.isEqual(this.range.focus)) {
			//前一个可以获取焦点的元素
			const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
			//当前焦点所在的块元素
			const anchorBlock = this.range.anchor.element.getBlock()
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
				//获取选区元素数组
				const rangeElements = this.getElementsByRange(false, false)
				//选区元素都设为空
				rangeElements.forEach(el => {
					el.setEmpty()
				})
				//获取终点所在的块元素
				const focusBlock = this.range.focus.element.getBlock()
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
		//起点和终点在一个位置
		if (this.range.anchor.isEqual(this.range.focus)) {
			//不是代码块内则对空格进行处理
			if (!this.range.anchor.element.getBlock().isPreStyle()) {
				data = data.replace(/\s+/g, () => {
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
	//在光标处换行
	insertParagraph() {
		//起点和终点在一个位置
		if (this.range.anchor.isEqual(this.range.focus)) {
			//前一个可以获取焦点的元素
			const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
			//后一个可以获取焦点的元素
			const nextElement = this.getNextElementOfPoint(this.range.anchor)
			//当前焦点所在的块元素
			const anchorBlock = this.range.anchor.element.getBlock()
			//终点位置
			const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1
			//在代码块中
			if (anchorBlock.isPreStyle()) {
				//焦点在代码块的终点位置
				if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
					this.insertText('\n\n')
					this.range.anchor.offset -= 1
					this.range.focus.offset -= 1
				} else {
					this.insertText('\n')
				}
			}
			//在其他标签中
			else {
				//焦点在当前块的起点位置
				if (this.range.anchor.offset == 0 && !(previousElement && anchorBlock.isContains(previousElement))) {
					//在该块之前插入一个新的段落，标签名称和样式与上一个段落一致
					const paragraph = new AlexElement('block', anchorBlock.parsedom, { ...anchorBlock.marks }, { ...anchorBlock.styles }, null)
					const breakEle = new AlexElement('closed', 'br', null, null, null)
					this.addElementTo(breakEle, paragraph)
					this.addElementBefore(paragraph, anchorBlock)
					this.range.anchor.moveToStart(anchorBlock)
					this.range.focus.moveToStart(anchorBlock)
				}
				//焦点在当前块的终点位置
				else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
					//在该块之后插入一个新的段落，标签名称和样式与上一个段落一致
					const paragraph = new AlexElement('block', anchorBlock.parsedom, { ...anchorBlock.marks }, { ...anchorBlock.styles }, null)
					const breakEle = new AlexElement('closed', 'br', null, null, null)
					this.addElementTo(breakEle, paragraph)
					this.addElementAfter(paragraph, anchorBlock)
					this.range.anchor.moveToStart(paragraph)
					this.range.focus.moveToStart(paragraph)
				}
				//焦点在当前块的中间部分则需要切割
				else {
					//获取所在块元素
					const block = this.range.anchor.element.getBlock()
					const newBlock = block.clone(true)
					this.addElementAfter(newBlock, block)
					//记录起点所在元素在块元素中的序列
					const elements = AlexElement.flatElements(block.children)
					const index = elements.findIndex(item => {
						return this.range.anchor.element.isEqual(item)
					})
					//将终点移动到块元素末尾
					this.range.focus.moveToEnd(block)
					this.delete()
					//将终点移动到新的块元素
					const newElements = AlexElement.flatElements(newBlock.children)
					this.range.focus.element = newElements[index]
					this.range.focus.offset = this.range.anchor.offset
					this.range.anchor.moveToStart(newBlock)
					this.delete()
				}
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
				const anchorBlock = this.range.anchor.element.getBlock()
				//终点位置
				const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1
				//当前块是一个只有换行符的块，则该块需要被覆盖
				if (anchorBlock.isOnlyHasBreak()) {
					//在该块之前插入
					this.addElementBefore(ele, anchorBlock)
					//然后把当前块与前一个进行合并
					this.mergeBlockElement(anchorBlock)
				}
				//焦点在当前块的起点位置
				else if (this.range.anchor.offset == 0 && !(previousElement && anchorBlock.isContains(previousElement))) {
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
					const block = this.range.anchor.element.getBlock()
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
	//更新焦点的元素为最近的可设置光标的元素
	setRecentlyPoint(point) {
		const previousElement = this.getPreviousElementOfPoint(point)
		const nextElement = this.getNextElementOfPoint(point)
		const block = point.element.getBlock()
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
	getElementsByRange(includes = false, flat = true) {
		//如果起点和终点在一个地方则返回空数组
		if (this.range.anchor.isEqual(this.range.focus)) {
			return []
		}
		let elements = []
		//如果起点和终点是一个元素内
		if (this.range.anchor.element.isEqual(this.range.focus.element)) {
			//如果包含起点和终点元素
			if (includes) {
				//文本
				if (this.range.anchor.element.isText()) {
					//起点在文本开始处并且终点在文本结尾处
					if (this.range.anchor.offset == 0 && this.range.focus.offset == this.range.anchor.element.textContent.length) {
						elements = [this.range.anchor.element]
					}
					//起点在文本开始处且终点不在文本结尾处
					else if (this.range.anchor.offset == 0) {
						let val = this.range.anchor.element.textContent
						this.range.anchor.element.textContent = val.substring(0, this.range.focus.offset)
						let newFocus = new AlexElement('text', null, null, null, val.substring(this.range.focus.offset))
						this.addElementAfter(newFocus, this.range.anchor.element)
						elements = [this.range.anchor.element]
					}
					//起点不在文本开始处，但是终点在文本结尾处
					else if (this.range.focus.offset == this.range.anchor.element.textContent.length) {
						let val = this.range.anchor.element.textContent
						this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset)
						let newFocus = new AlexElement('text', null, null, null, val.substring(this.range.anchor.offset))
						this.addElementAfter(newFocus, this.range.anchor.element)
						elements = [newFocus]
						this.range.anchor.moveToStart(newFocus)
						this.range.focus.moveToEnd(newFocus)
					}
					//起点不在文本开始处且终点不在文本结尾处
					else {
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
				}
				//自闭合元素
				else {
					elements = [this.range.anchor.element]
				}
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
			if (includes) {
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
		}
		//返回扁平化数组
		if (flat) {
			return elements
		}
		let notFlatElements = []
		elements.forEach(el => {
			if (el.isRoot()) {
				notFlatElements.push(el)
			} else {
				//父元素是否在扁平化数组里
				const isIn = elements.some(item => {
					return item.isEqual(el.parent)
				})
				//父元素不在
				if (!isIn) {
					notFlatElements.push(el)
				}
			}
		})
		return notFlatElements
	}
	//将真实的光标设置到指定元素开始
	collapseToStart(element) {
		if (this.disabled) {
			return
		}
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.range.anchor.moveToStart(element)
			this.range.focus.moveToStart(element)
			this.setCursor()
		}
		//文档最后面
		else {
			const flatElements = AlexElement.flatElements(this.stack)
			this.collapseToStart(flatElements[0])
		}
	}
	//将真实的光标设置到指定元素最后
	collapseToEnd(element) {
		if (this.disabled) {
			return
		}
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.range.anchor.moveToEnd(element)
			this.range.focus.moveToEnd(element)
			this.setCursor()
		}
		//文档最后面
		else {
			const flatElements = AlexElement.flatElements(this.stack)
			const length = flatElements.length
			this.collapseToEnd(flatElements[length - 1])
		}
	}
	//根据anchor和focus来设置真实的光标
	setCursor() {
		//将虚拟光标位置转为真实光标位置
		const handler = point => {
			let node = null
			let offset = null
			//如果是自闭合元素
			if (point.element.isClosed()) {
				node = point.element.parent._elm
				const index = point.element.parent.children.findIndex(item => {
					return point.element.isEqual(item)
				})
				if (point.offset == 0 || point.element.isBreak()) {
					offset = index
				} else {
					offset = index + 1
				}
			}
			//文本元素
			else {
				node = point.element._elm
				offset = point.offset
			}
			return { node, offset }
		}
		const anchorResult = handler(this.range.anchor)
		const focusResult = handler(this.range.focus)
		//设置光标
		const selection = window.getSelection()
		selection.removeAllRanges()
		const range = document.createRange()
		range.setStart(anchorResult.node, anchorResult.offset)
		range.setEnd(focusResult.node, focusResult.offset)
		selection.addRange(range)
		this.emit('rangeUpdate', this.range)
	}
	//根据光标设置css样式
	setStyle(styleObject) {
		if (!Dap.common.isObject) {
			throw new Error('The argument must be an object')
		}
		//起点和终点在一个位置
		if (this.range.anchor.isEqual(this.range.focus)) {
			//在文本元素上
			if (this.range.anchor.element.isText()) {
				//过滤掉空元素
				const children = this.range.anchor.element.parent.children.filter(item => {
					return !item.isEmpty()
				})
				//如果文本元素是空白字符的元素，并且其父元素是行内元素且只有他一个子元素，则直接修改其父元素样式
				if (this.range.anchor.element.isSpaceText() && this.range.anchor.element.parent.isInline() && children.length == 1) {
					if (this.range.anchor.element.parent.hasStyles()) {
						Object.assign(this.range.anchor.element.parent.styles, styleObject)
					} else {
						this.range.anchor.element.parent.styles = { ...styleObject }
					}
				}
				//其他情况需要新建一个span并设置空白字符内容
				else {
					let spanEl = new AlexElement('inline', 'span', null, { ...styleObject }, null)
					let spaceEl = AlexElement.getSpaceElement()
					this.addElementTo(spaceEl, spanEl)
					let val = this.range.anchor.element.textContent
					this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset)
					let newEl = new AlexElement('text', null, null, null, val.substring(this.range.anchor.offset))
					this.addElementAfter(newEl, this.range.anchor.element)
					this.addElementBefore(spanEl, newEl)
					this.range.anchor.moveToEnd(spanEl)
					this.range.focus.moveToEnd(spanEl)
				}
			}
			//在自闭合元素上
			else {
				let spanEl = new AlexElement('inline', 'span', null, { ...styleObject }, null)
				let spaceEl = AlexElement.getSpaceElement()
				this.addElementTo(spaceEl, spanEl)
				if (this.range.anchor.offset == 0) {
					this.addElementBefore(spanEl, this.range.anchor.element)
				} else {
					this.addElementAfter(spanEl, this.range.anchor.element)
				}
				this.range.anchor.moveToEnd(spanEl)
				this.range.focus.moveToEnd(spanEl)
			}
		}
		//起点和终点不在一个位置
		else {
			const elements = this.getElementsByRange(true)
			elements.forEach(el => {
				//文本元素
				if (el.isText()) {
					//过滤掉空元素和空白元素
					const children = el.parent.children.filter(item => {
						return !item.isEmpty() && !item.isSpaceText()
					})
					//如果父元素是行内元素且只有该文本一个子元素，则直接修改父元素样式
					if (children.length == 1 && el.parent.isInline()) {
						if (el.parent.hasStyles()) {
							Object.assign(el.parent.styles, styleObject)
						} else {
							el.parent.styles = { ...styleObject }
						}
					}
					//其他情况需要新建一个span
					else {
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
						this.addElementTo(cloneEl, el)
					}
				}
				//自闭合元素
				else if (el.isClosed()) {
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
	//根据光标移除所有样式
	removeAllStyles() {
		const anchorBlock = this.range.anchor.element.getBlock()
		//起点和终点在同一个块元素内
		if (anchorBlock.hasContains(this.range.focus.element)) {
			let cloneElements = []
			this.getElementsByRange(true, false).forEach(el => {
				if (el.isInline()) {
					el.styles = null
				}
				cloneElements.push(el.clone(true))
			})
			const newBlock = anchorBlock.clone(true)
			this.addElementAfter(newBlock, anchorBlock)
			//记录终点在块中的序列
			const index = AlexElement.flatElements(anchorBlock.children).findIndex(item => {
				return item.isEqual(this.range.focus.element)
			})
			//记录终点的偏移值
			const offset = this.range.focus.offset
			//删除块元素中在起点后面的部分
			this.range.focus.moveToEnd(anchorBlock)
			if (!this.range.focus.isEqual(this.range.anchor)) {
				this.delete()
			}
			//将光标移到新块上，并删除终点前面的部分
			this.range.anchor.moveToStart(newBlock)
			this.range.focus.element = AlexElement.flatElements(newBlock.children)[index]
			this.range.focus.offset = offset
			if (!this.range.focus.isEqual(this.range.anchor)) {
				this.delete()
			}
			//存在选区
			if (cloneElements.length) {
				cloneElements.forEach((el, index) => {
					if (el.isText() || el.isClosed()) {
						let spanEl = new AlexElement('inline', 'span', null, null, null)
						this.addElementTo(el, spanEl)
						this.addElementTo(spanEl, newBlock, index)
					} else {
						this.addElementTo(el, newBlock, index)
					}
				})
				this.range.anchor.moveToStart(cloneElements[0])
				this.range.focus.moveToEnd(cloneElements[cloneElements.length - 1])
			}
			//起点和终点在一起即没有选区
			else {
				let spanEl = new AlexElement('inline', 'span', null, null, null)
				let spaceEl = AlexElement.getSpaceElement()
				this.addElementTo(spaceEl, spanEl)
				this.addElementTo(spanEl, newBlock)
				this.range.anchor.moveToEnd(spanEl)
				this.range.focus.moveToEnd(spanEl)
			}
			//新块与旧块进行合并
			this.mergeBlockElement(newBlock)
		}
		//起点和终点不在同一个块内
		else {
			//记录终点的元素和偏移值
			let focusElement = this.range.focus.element
			let focusOffset = this.range.focus.offset
			//记录起点的元素和偏移值
			let anchorElement = this.range.anchor.element
			let anchorOffset = this.range.anchor.offset
			//起点所在块元素
			const focusBlock = this.range.focus.element.getBlock()
			//重新设置虚拟光标
			this.range.anchor.moveToEnd(anchorBlock)
			this.range.focus.moveToStart(focusBlock)
			//获取起点和终点两个所在块外的选区元素
			const elements = this.getElementsByRange(false)
			//清除样式
			elements.forEach(el => {
				if (el.isInline()) {
					el.styles = null
				}
			})
			//将起点设置为原来的
			this.range.anchor.element = anchorElement
			this.range.anchor.offset = anchorOffset
			//将终点设置到起点所在块的结尾
			this.range.focus.moveToEnd(anchorBlock)
			this.removeAllStyles()
			//更新一下起点的位置记录
			anchorElement = this.range.anchor.element
			anchorOffset = this.range.anchor.offset
			//将终点设置为原来的
			this.range.focus.element = focusElement
			this.range.focus.offset = focusOffset
			//将起点设置到终点所在块的开头
			this.range.anchor.moveToStart(focusBlock)
			this.removeAllStyles()
			//恢复起点位置
			this.range.anchor.element = anchorElement
			this.range.anchor.offset = anchorOffset
		}
	}
	//销毁编辑器的方法
	destroy() {
		//去除可编辑效果
		this.setDisabled()
		//移除相关监听事件
		Dap.event.off(document, 'selectionchange.alex_editor')
		Dap.event.off(this.$el, 'beforeinput.alex_editor compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor keydown.alex_editor cut.alex_editor paste.alex_editor drop.alex_editor focus.alex_editor blur.alex_editor')
	}
	//触发自定义事件
	emit(eventName, ...value) {
		if (typeof this._events[eventName] == 'function') {
			this._events[eventName].apply(this, [...value])
			return true
		}
		return false
	}
	//监听自定义事件
	on(eventName, eventHandle) {
		this._events[eventName] = eventHandle
	}
}

export default AlexEditor
