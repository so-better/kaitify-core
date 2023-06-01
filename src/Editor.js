import Dap from 'dap-util'
import Util from './Util'
import AlexElement from './Element'
import AlexPoint from './Point'
import AlexRange from './Range'
import AlexHistory from './History'
import Keyboard from './Keyboard'
import ElementToStyle from './ElementToStyle'

class AlexEditor {
	constructor(el, options) {
		//支持选择器
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
		options = this.__formatOptions(options)
		//编辑器容器
		this.$el = el
		//是否禁用
		this.disabled = options.disabled
		//编辑器的值
		this.value = options.value
		//自定义编辑器元素的格式化规则
		this.renderRules = options.renderRules
		//粘贴是否携带样式
		this.htmlPaste = options.htmlPaste
		//编辑的range
		this.range = null
		//创建历史记录
		this.history = new AlexHistory()
		//事件集合
		this._events = {}
		//旧的文本内容
		this._oldValue = options.value
		//是否正在输入中文
		this._isInputChinese = false
		//将html内容转为元素数组
		this.stack = this.parseHtml(this.value)
		//格式化元素数组
		this.formatElementStack()
		//如果元素数组为空则说明给的初始值不符合要求，则此时初始化stack
		this.stack.length == 0 ? this.__initStack() : null
		//初始设置range
		this.__initRange()
		//渲染dom
		this.domRender()
		//编辑器禁用和启用设置
		this.disabled ? this.setDisabled() : this.setEnabled()
		//设置selection的监听更新range
		Dap.event.on(document, 'selectionchange.alex_editor', this.__handleSelectionChange.bind(this))
		//监听内容输入
		Dap.event.on(this.$el, 'beforeinput.alex_editor', this.__handleBeforeInput.bind(this))
		//监听中文输入
		Dap.event.on(this.$el, 'compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor', this.__handleChineseInput.bind(this))
		//监听键盘按下
		Dap.event.on(this.$el, 'keydown.alex_editor', this.__handleKeydown.bind(this))
		//监听编辑器剪切
		Dap.event.on(this.$el, 'cut.alex_editor', this.__handleCut.bind(this))
		//监听编辑器粘贴
		Dap.event.on(this.$el, 'paste.alex_editor', this.__handlePaste.bind(this))
		//监听编辑器拖放
		Dap.event.on(this.$el, 'drop.alex_editor', this.__handleNodesChange.bind(this))
		//监听编辑器获取焦点
		Dap.event.on(this.$el, 'focus.alex_editor', () => {
			this.emit('focus', this.value)
		})
		//监听编辑器失去焦点
		Dap.event.on(this.$el, 'blur.alex_editor', () => {
			this.emit('blur', this.value)
		})
	}
	//格式化options参数
	__formatOptions(options) {
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
	//格式化函数数组
	__formatUnchangeableRules = [
		//元素自身规范
		element => {
			if (element.parsedom) {
				//默认的自闭合元素
				if (['br', 'img', 'video'].includes(element.parsedom)) {
					element.type = 'closed'
					element.children = null
				}
				//默认的行内元素
				else if (['span', 'a', 'label', 'code'].includes(element.parsedom)) {
					element.type = 'inline'
				}
				//不应当存在的元素
				else if (['input', 'textarea', 'select', 'script', 'style', 'html', 'body', 'meta', 'link', 'head', 'title'].includes(element.parsedom)) {
					element.toEmpty()
				}
				//部分标签转为样式
				else if (ElementToStyle[element.parsedom]) {
					const styles = ElementToStyle[element.parsedom]
					element.type = 'inline'
					element.parsedom = 'span'
					if (element.hasStyles()) {
						Object.assign(element.styles, Util.clone(styles))
					} else {
						element.styles = Util.clone(styles)
					}
				}
				//部分标签设置代码块样式
				else if (['blockquote', 'pre'].includes(element.parsedom)) {
					if (element.hasStyles()) {
						element.styles['white-space'] = element.parsedom == 'pre' ? 'pre' : 'pre-wrap'
					} else {
						element.styles = {
							'white-space': element.parsedom == 'pre' ? 'pre' : 'pre-wrap'
						}
					}
				}
			}
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
								el.toEmpty()
							}
							return el
						})
					}
					//只有换行符并且存在多个换行符
					else if (hasBreak && children.length > 1) {
						//把除了第一个换行符外的其他换行符都置为空元素
						element.children = element.children.map((el, index) => {
							if (el.isBreak() && index > 0) {
								el.toEmpty()
							}
							return el
						})
					}
				}
				//行内元素的换行符
				else if (element.isInline()) {
					element.children.map(el => {
						if (el.isBreak()) {
							el.toEmpty()
						}
					})
				}
			}
		},
		//兄弟元素合并策略（如果光标在子元素中可能会重新设置）
		element => {
			const mergeElement = ele => {
				//判断两个元素是否可以合并
				const canMerge = (pel, nel) => {
					if (pel.isEmpty() || nel.isEmpty()) {
						return true
					}
					if (pel.isText() && nel.isText()) {
						return pel.isEqualStyles(nel) && pel.isEqualMarks(nel)
					}
					if (pel.isInline() && nel.isInline()) {
						return pel.parsedom == nel.parsedom && pel.isEqualMarks(nel) && pel.isEqualStyles(nel)
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
						mergeElement(pel)
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
			}
			mergeElement(element)
		},
		//子元素和父元素合并策略
		element => {
			//判断两个元素是否可以合并
			const canMerge = (parent, child) => {
				//子元素是文本元素，父元素是标签等于文本标签的元素
				if (child.isText() && parent.isInline()) {
					return parent.parsedom == AlexElement.TEXT_NODE
				}
				//子元素和父元素的标签名相同
				if ((parent.isInline() && child.isInline()) || (parent.isBlock() && child.isBlock())) {
					return parent.parsedom == child.parsedom
				}
				return false
			}
			//两个元素的合并方法
			const merge = (parent, child) => {
				//子元素是文本元素，父元素与之标签名相同
				if (child.isText()) {
					parent.type = 'text'
					parent.parsedom = null
					//如果子元素有标记
					if (child.hasMarks()) {
						if (parent.hasMarks()) {
							Object.assign(parent.marks, Util.clone(child.marks))
						} else {
							parent.marks = Util.clone(child.marks)
						}
					}
					//如果子元素有样式
					if (child.hasStyles()) {
						if (parent.hasStyles()) {
							Object.assign(parent.styles, Util.clone(child.styles))
						} else {
							parent.styles = Util.clone(child.styles)
						}
					}
					parent.textContent = child.textContent
					parent.children = null
				}
				//子元素是行内元素或者块元素
				else {
					//如果子元素有标记
					if (child.hasMarks()) {
						if (parent.hasMarks()) {
							Object.assign(parent.marks, Util.clone(child.marks))
						} else {
							parent.marks = Util.clone(child.marks)
						}
					}
					//如果子元素有样式
					if (child.hasStyles()) {
						if (parent.hasStyles()) {
							Object.assign(parent.styles, Util.clone(child.styles))
						} else {
							parent.styles = Util.clone(child.styles)
						}
					}
					parent.children = [...child.children]
					parent.children.forEach(item => {
						item.parent = parent
					})
				}
			}
			//存在子元素并且子元素只有一个且父子元素可以合并
			if (element.hasChildren() && element.children.length == 1 && canMerge(element, element.children[0])) {
				merge(element, element.children[0])
			}
		},
		//自定义元素格式化规则
		element => {
			if (typeof this.renderRules == 'function') {
				this.renderRules.apply(this, [element])
			}
		},
		//光标所在元素为空元素的情况下重新设置光标
		element => {
			if (element.isEmpty()) {
				//移除空元素时判断该元素是否是起点元素，如果是则更新起点元素
				if (this.range && this.range.anchor.element.isEqual(element)) {
					this.__setRecentlyPoint(this.range.anchor)
				}
				//移除空元素时判断该元素是否是终点元素，如果是则更新终点元素
				if (this.range && this.range.focus.element.isEqual(element)) {
					this.__setRecentlyPoint(this.range.focus)
				}
			}
		}
	]
	//初始化stack
	__initStack() {
		const ele = new AlexElement('block', AlexElement.PARAGRAPH_NODE, null, null, null)
		const breakEle = new AlexElement('closed', 'br', null, null, null)
		this.addElementTo(breakEle, ele)
		this.stack = [ele]
	}
	//初始设置range
	__initRange() {
		const lastElement = this.stack[this.stack.length - 1]
		const anchor = new AlexPoint(lastElement, 0)
		const focus = new AlexPoint(lastElement, 0)
		this.range = new AlexRange(anchor, focus)
		this.range.anchor.moveToEnd(lastElement)
		this.range.focus.moveToEnd(lastElement)
	}
	//起始和结束点都在一个元素内的删除方法
	__deleteInSameElement() {
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
			//文本元素被删成了空白元素
			else if (this.range.anchor.element.isSpaceText()) {
				this.range.anchor.offset = 0
				this.range.focus.offset = this.range.anchor.element.textContent.length
				this.delete()
			}
			//起点和终点在空白字符上
			else if (this.range.anchor.offset > 0 && Util.isSpaceText(this.range.anchor.element.textContent[this.range.anchor.offset - 1])) {
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
				//如果新的起点在文本元素上，需要对空白字符进行处理
				if (this.range.anchor.element.isText()) {
					//判断是否空白元素，如果是则继续删除
					if (this.range.anchor.element.isSpaceText()) {
						this.range.anchor.offset = 0
						this.range.focus.offset = this.range.anchor.element.textContent.length
						this.delete()
					}
					//起点和终点在空白字符上
					else if (this.range.anchor.offset > 0 && Util.isSpaceText(this.range.anchor.element.textContent[this.range.anchor.offset - 1])) {
						this.delete()
					}
				}
			}
		}
	}
	//监听selection改变
	__handleSelectionChange() {
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
			let anchorNode = range.startContainer
			let focusNode = range.endContainer
			//如果是文本节点
			if (range.startContainer.nodeType == 3) {
				anchorNode = range.startContainer.parentNode
			}
			if (range.endContainer.nodeType == 3) {
				focusNode = range.endContainer.parentNode
			}
			if (anchorNode.isEqualNode(this.$el) || focusNode.isEqualNode(this.$el)) {
				return
			}
			if (Dap.element.isContains(this.$el, anchorNode) && Dap.element.isContains(this.$el, focusNode)) {
				const anchorKey = Dap.data.get(anchorNode, 'data-alex-editor-key')
				const focusKey = Dap.data.get(focusNode, 'data-alex-editor-key')
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
	__handleBeforeInput(e) {
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
				this.rangeRender()
			}
			return
		}
		//插入段落
		if (e.inputType == 'insertParagraph' || e.inputType == 'insertLineBreak') {
			this.insertParagraph()
			this.formatElementStack()
			this.domRender()
			this.rangeRender()
			return
		}
		//删除内容
		if (e.inputType == 'deleteContentBackward') {
			this.delete()
			this.formatElementStack()
			this.domRender()
			this.rangeRender()
			return
		}
	}
	//监听中文输入
	__handleChineseInput(e) {
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
				this.rangeRender()
			}
		}
	}
	//监听键盘按下
	__handleKeydown(e) {
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
				this.rangeRender()
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
				this.rangeRender()
			}
		}
	}
	//监听粘贴事件
	__handlePaste(e) {
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
						this.rangeRender()
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
				this.rangeRender()
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
				this.rangeRender()
			}, 0)
		}
	}
	//监听剪切事件
	__handleCut(e) {
		if (this.disabled) {
			return
		}
		//加上setTimeout是为了在剪切事件后进行处理，起到延时作用
		setTimeout(() => {
			this.delete()
			this.formatElementStack()
			this.domRender()
			this.rangeRender()
		}, 0)
	}
	//解决编辑器内元素节点与stack数据不符的情况，进行数据纠正
	__handleNodesChange() {
		//加上setTimeout是为了保证this.$el.innerHTML获取的是最新的
		setTimeout(() => {
			this.stack = this.parseHtml(this.$el.innerHTML)
			this.formatElementStack()
			const flatElements = AlexElement.flatElements(this.stack)
			this.range.anchor.moveToEnd(flatElements[flatElements.length - 1])
			this.range.focus.moveToEnd(flatElements[flatElements.length - 1])
			this.domRender()
			this.rangeRender()
		}, 0)
	}
	//更新焦点的元素为最近的可设置光标的元素
	__setRecentlyPoint(point) {
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
	//格式化单个元素
	formatElement(ele) {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		//格式化
		const format = (element, fn) => {
			//从子孙元素开始格式化
			if (element.hasChildren()) {
				let index = 0
				//遍历子元素
				while (index < element.children.length) {
					let el = element.children[index]
					//对该子元素进行格式化处理
					format(el, fn)
					//获取格式化后的元素序列
					const newIndex = element.children.findIndex(item => {
						return el.isEqual(item)
					})
					//向后格式化
					index = newIndex + 1
				}
			}
			//格式化自身
			fn(element)
		}
		//移除子孙元素中的空元素
		const removeEmptyElement = element => {
			if (element.hasChildren()) {
				element.children.forEach(item => {
					if (!item.isEmpty()) {
						removeEmptyElement(item)
					}
				})
				element.children = element.children.filter(item => {
					return !item.isEmpty()
				})
			}
		}
		//格式化
		this.__formatUnchangeableRules.forEach(fn => {
			format(ele, fn)
		})
		//移除该元素下所有的空元素
		removeEmptyElement(ele)
	}
	//格式化stack
	formatElementStack() {
		let index = 0
		while (index < this.stack.length) {
			const el = this.stack[index]
			//转为块元素
			if (!el.isBlock()) {
				el.convertToBlock()
			}
			this.formatElement(el)
			const newIndex = this.stack.findIndex(item => {
				return el.isEqual(item)
			})
			index = newIndex + 1
		}
		this.stack = this.stack.filter(ele => {
			//移除根部的空元素
			return !ele.isEmpty()
		})
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
						this.__deleteInSameElement()
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
				this.__deleteInSameElement()
			}
		}
		//批量删除
		else {
			//选区在一个元素内
			if (this.range.anchor.element.isEqual(this.range.focus.element)) {
				this.__deleteInSameElement()
			} else {
				//获取选区元素数组
				const rangeElements = this.getElementsByRange(false, false)
				//选区元素都设为空
				rangeElements.forEach(el => {
					el.toEmpty()
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
					this.__deleteInSameElement()
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
					this.__deleteInSameElement()
				}
				if (hasMerge) {
					this.mergeBlockElement(focusBlock)
				}
			}
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
					//在该块之前插入一个新的段落，标签名称与上一个段落一致
					const paragraph = new AlexElement('block', anchorBlock.parsedom, Util.clone(anchorBlock.marks), Util.clone(anchorBlock.styles), null)
					const breakEle = new AlexElement('closed', 'br', null, null, null)
					this.addElementTo(breakEle, paragraph)
					this.addElementBefore(paragraph, anchorBlock)
					this.range.anchor.moveToStart(anchorBlock)
					this.range.focus.moveToStart(anchorBlock)
				}
				//焦点在当前块的终点位置
				else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
					//在该块之后插入一个新的段落，标签名称与上一个段落一致
					const paragraph = new AlexElement('block', anchorBlock.parsedom, Util.clone(anchorBlock.marks), Util.clone(anchorBlock.styles), null)
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
	//根据光标插入元素
	insertElement(ele) {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The argument must be an AlexElement instance')
		}
		//如果是空元素则不处理
		if (ele.isEmpty()) {
			return
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
			this.range.anchor.moveToEnd(ele)
			this.range.focus.moveToEnd(ele)
		} else {
			this.delete()
			this.insertElement(ele)
		}
	}
	//渲染编辑器dom内容
	domRender(unPushHistory = false) {
		this.$el.innerHTML = ''
		this.stack.forEach(element => {
			element._renderElement()
			this.$el.appendChild(element._elm)
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
	//根据anchor和focus来设置真实的光标
	rangeRender() {
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
			//如果是文本元素
			else {
				node = point.element._elm.childNodes[0]
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
	//将dom节点转为元素
	parseNode(node) {
		if (!(node instanceof Node)) {
			throw new Error('The argument must be an node')
		}
		if (!(node.nodeType == 1 || node.nodeType == 3)) {
			throw new Error('The argument must be an element node or text node')
		}
		//文本节点
		if (node.nodeType == 3) {
			return new AlexElement('text', null, null, null, node.nodeValue)
		}
		//元素节点
		const marks = Util.getAttributes(node)
		const styles = Util.getStyles(node)
		const parsedom = node.nodeName.toLocaleLowerCase()
		//默认定义为块元素
		let element = new AlexElement('block', parsedom, marks, styles, null)
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
		return element
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
	//将指定元素从元素数组中移除
	removeElement(ele) {
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
			ele.parent = null
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
	//获取选区之间的元素
	getElementsByRange(includes = false, flat = false) {
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
						let newFocus = this.range.anchor.element.clone()
						this.range.anchor.element.textContent = val.substring(0, this.range.focus.offset)
						newFocus.textContent = val.substring(this.range.focus.offset)
						this.addElementAfter(newFocus, this.range.anchor.element)
						elements = [this.range.anchor.element]
					}
					//起点不在文本开始处，但是终点在文本结尾处
					else if (this.range.focus.offset == this.range.anchor.element.textContent.length) {
						let newFocus = this.range.anchor.element.clone()
						let val = this.range.anchor.element.textContent
						this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset)
						newFocus.textContent = val.substring(this.range.anchor.offset)
						this.addElementAfter(newFocus, this.range.anchor.element)
						elements = [newFocus]
						this.range.anchor.moveToStart(newFocus)
						this.range.focus.moveToEnd(newFocus)
					}
					//起点不在文本开始处且终点不在文本结尾处
					else {
						let newEl = this.range.anchor.element.clone()
						let newFocus = this.range.anchor.element.clone()
						let val = this.range.anchor.element.textContent
						this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset)
						newEl.textContent = val.substring(this.range.anchor.offset, this.range.focus.offset)
						newFocus.textContent = val.substring(this.range.focus.offset)
						this.addElementAfter(newEl, this.range.anchor.element)
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
						let newEl = this.range.anchor.element.clone()
						let val = this.range.anchor.element.textContent
						this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset)
						newEl.textContent = val.substring(this.range.anchor.offset)
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
						let newEl = this.range.focus.element.clone()
						let val = this.range.focus.element.textContent
						this.range.focus.element.textContent = val.substring(0, this.range.focus.offset)
						newEl.textContent = val.substring(this.range.focus.offset)
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

		//针对子元素全部在选区内但是自身不在选区内的元素进行处理
		let i = 0
		while (i < elements.length) {
			//如果是根元素则跳过
			if (elements[i].isRoot()) {
				i++
			} else {
				//判断父元素是否在数组里
				let has = elements.some(item => {
					return item.isEqual(elements[i].parent)
				})
				//父元素在数组里则跳过
				if (has) {
					i++
				} else {
					//父元素的每个子元素都在选区内
					let allIn = elements[i].parent.children.every(item => {
						return elements.some(e => {
							return e.isEqual(item)
						})
					})
					//将父元素加入进来
					if (allIn) {
						const index = elements.findIndex(item => {
							return item.isEqual(elements[i])
						})
						elements.splice(index, 0, elements[i].parent)
					} else {
						i++
					}
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
	//将虚拟光标设置到指定元素开始处
	collapseToStart(element) {
		if (this.disabled) {
			return
		}
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.range.anchor.moveToStart(element)
			this.range.focus.moveToStart(element)
		}
		//文档最后面
		else {
			const flatElements = AlexElement.flatElements(this.stack)
			this.range.anchor.moveToStart(flatElements[0])
			this.range.focus.moveToStart(flatElements[0])
		}
	}
	//将虚拟光标设置到指定元素最后
	collapseToEnd(element) {
		if (this.disabled) {
			return
		}
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.range.anchor.moveToEnd(element)
			this.range.focus.moveToEnd(element)
		}
		//文档最后面
		else {
			const flatElements = AlexElement.flatElements(this.stack)
			const length = flatElements.length
			this.range.anchor.moveToEnd(flatElements[length - 1])
			this.range.focus.moveToEnd(flatElements[length - 1])
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
	//设置文本元素的样式
	setTextStyle(styles) {
		if (!Dap.common.isObject(styles)) {
			throw new Error('The argument must be an object')
		}
		//在起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//如果是空白文本元素直接设置样式
			if (this.range.anchor.element.isSpaceText()) {
				if (this.range.anchor.element.hasStyles()) {
					Object.assign(this.range.anchor.element.styles, Util.clone(styles))
				} else {
					this.range.anchor.element.styles = Util.clone(styles)
				}
			}
			//如果是文本元素
			else if (this.range.anchor.element.isText()) {
				//新建一个空白文本元素
				const el = AlexElement.getSpaceElement()
				//继承文本元素的样式和标记
				el.styles = Util.clone(this.range.anchor.element.styles)
				el.marks = Util.clone(this.range.anchor.element.marks)
				//设置样式
				if (el.hasStyles()) {
					Object.assign(el.styles, Util.clone(styles))
				} else {
					el.styles = Util.clone(styles)
				}
				//插入空白文本元素
				this.insertElement(el)
			}
			//如果是自闭合元素
			else {
				const el = AlexElement.getSpaceElement()
				el.styles = Util.clone(styles)
				this.insertElement(el)
			}
		}
		//不在同一个点
		else {
			const elements = this.getElementsByRange(true, true)
			elements.forEach(el => {
				if (el.isText()) {
					if (el.hasStyles()) {
						Object.assign(el.styles, Util.clone(styles))
					} else {
						el.styles = Util.clone(styles)
					}
				}
			})
		}
	}
	//移除文本元素的样式
	removeTextStyle(styleNames) {
		//移除样式的方法
		const removeFn = el => {
			//如果参数是数组，表示删除指定的样式
			if (Array.isArray(styleNames)) {
				if (el.hasStyles()) {
					let styles = {}
					for (let key in el.styles) {
						if (!styleNames.includes(key)) {
							styles[key] = el.styles[key]
						}
					}
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
				el.styles = Util.clone(this.range.anchor.element.styles)
				el.marks = Util.clone(this.range.anchor.element.marks)
				//移除样式
				removeFn(el)
				//插入
				this.insertElement(el)
			}
		}
		//起点和终点不在一起
		else {
			const elements = this.getElementsByRange(true, true)
			elements.forEach(el => {
				if (el.isText()) {
					removeFn(el)
				}
			})
		}
	}
	//查询虚拟光标包含的文本元素是否具有某个样式
	queryTextStyle(name, value) {
		if (!name) {
			throw new Error('The first argument cannot be null')
		}
		//起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//如果是文本元素并且具有样式
			if (this.range.anchor.element.isText() && this.range.anchor.element.hasStyles()) {
				//表示只查询是否具有样式名称
				if (value == null || value == undefined) {
					return this.range.anchor.element.styles.hasOwnProperty(name)
				}
				//查询是否具有某个样式值
				return this.range.anchor.element.styles[name] == value
			}
			//不是文本元素或者没有样式直接返回false
			return false
		}
		//起点和终点不在一起获取选区中的文本元素
		const elements = this.getElementsByRange(true, true).filter(el => {
			return el.isText()
		})
		//如果不包含文本元素直接返回false
		if (elements.length == 0) {
			return false
		}
		//判断每个文本元素是否都具有该样式
		let flag = elements.every(el => {
			//文本元素含有样式进一步判断
			if (el.hasStyles()) {
				if (value == null || value == undefined) {
					return el.styles.hasOwnProperty(name)
				}
				return el.styles[name] == value
			}
			//文本元素没有样式直接返回false
			return false
		})
		this.formatElementStack()
		return flag
	}
	//设置文本元素的标记
	setTextMark(marks) {
		if (!Dap.common.isObject(marks)) {
			throw new Error('The argument must be an object')
		}
		//在起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//如果是空白文本元素直接设置标记
			if (this.range.anchor.element.isSpaceText()) {
				if (this.range.anchor.element.hasMarks()) {
					Object.assign(this.range.anchor.element.marks, Util.clone(marks))
				} else {
					this.range.anchor.element.marks = Util.clone(marks)
				}
			}
			//如果是文本元素
			else if (this.range.anchor.element.isText()) {
				//新建一个空白文本元素
				const el = AlexElement.getSpaceElement()
				//继承文本元素的样式和标记
				el.styles = Util.clone(this.range.anchor.element.styles)
				el.marks = Util.clone(this.range.anchor.element.marks)
				//设置标记
				if (el.hasMarks()) {
					Object.assign(el.marks, Util.clone(marks))
				} else {
					el.marks = Util.clone(marks)
				}
				//插入空白文本元素
				this.insertElement(el)
			}
			//如果是自闭合元素
			else {
				const el = AlexElement.getSpaceElement()
				el.marks = Util.clone(marks)
				this.insertElement(el)
			}
		}
		//不在同一个点
		else {
			const elements = this.getElementsByRange(true, true)
			elements.forEach(el => {
				if (el.isText()) {
					if (el.hasMarks()) {
						Object.assign(el.marks, Util.clone(marks))
					} else {
						el.marks = Util.clone(marks)
					}
				}
			})
		}
	}
	//移除文本元素的标记
	removeTextMark(markNames) {
		//移除标记的方法
		const removeFn = el => {
			//如果参数是数组，表示删除指定的标记
			if (Array.isArray(markNames)) {
				if (el.hasMarks()) {
					let marks = {}
					for (let key in el.marks) {
						if (!markNames.includes(key)) {
							marks[key] = el.marks[key]
						}
					}
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
				el.styles = Util.clone(this.range.anchor.element.styles)
				el.marks = Util.clone(this.range.anchor.element.marks)
				//移除标记
				removeFn(el)
				//插入
				this.insertElement(el)
			}
		}
		//起点和终点不在一起
		else {
			const elements = this.getElementsByRange(true, true)
			elements.forEach(el => {
				if (el.isText()) {
					removeFn(el)
				}
			})
		}
	}
	//查询选区内的文本元素是否具有某个标记
	queryTextMark(name, value) {
		if (!name) {
			throw new Error('The first argument cannot be null')
		}
		//起点和终点在一起
		if (this.range.anchor.isEqual(this.range.focus)) {
			//如果是文本元素并且具有标记
			if (this.range.anchor.element.isText() && this.range.anchor.element.hasMarks()) {
				//表示只查询是否具标记名称
				if (value == null || value == undefined) {
					return this.range.anchor.element.marks.hasOwnProperty(name)
				}
				//查询是否具有某个样式值
				return this.range.anchor.element.marks[name] == value
			}
			//不是文本元素或者没有标记直接返回false
			return false
		}
		//起点和终点不在一起获取选区中的文本元素
		const elements = this.getElementsByRange(true, true).filter(el => {
			return el.isText()
		})
		//如果不包含文本元素直接返回false
		if (elements.length == 0) {
			return false
		}
		//判断每个文本元素是否都具有该标记
		let flag = elements.every(el => {
			//文本元素含有样式进一步判断
			if (el.hasMarks()) {
				if (value == null || value == undefined) {
					return el.marks.hasOwnProperty(name)
				}
				return el.marks[name] == value
			}
			//文本元素没有样式直接返回false
			return false
		})
		this.formatElementStack()
		return flag
	}
	//触发自定义事件
	emit(eventName, ...value) {
		if (Array.isArray(this._events[eventName])) {
			this._events[eventName].forEach(fn => {
				fn.apply(this, [...value])
			})
			return true
		}
		return false
	}
	//监听自定义事件
	on(eventName, eventHandle) {
		if (!this._events[eventName]) {
			this._events[eventName] = []
		}
		this._events[eventName].push(eventHandle)
	}
	//销毁编辑器的方法
	destroy() {
		//去除可编辑效果
		this.setDisabled()
		//移除相关监听事件
		Dap.event.off(document, 'selectionchange.alex_editor')
		Dap.event.off(this.$el, 'beforeinput.alex_editor compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor keydown.alex_editor cut.alex_editor paste.alex_editor drop.alex_editor focus.alex_editor blur.alex_editor')
	}
}

export default AlexEditor
