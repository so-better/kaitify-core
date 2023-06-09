import Dap from 'dap-util'
import Util from './Util'
import AlexElement from './Element'
import AlexPoint from './Point'
import AlexRange from './Range'
import AlexHistory from './History'
import Keyboard from './Keyboard'
import defaultConfig from './default'

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
		this.__events = {}
		//旧的文本内容
		this.__oldValue = options.value
		//是否正在输入中文
		this.__isInputChinese = false
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
				//默认的根级块元素
				if (defaultConfig.block.includes(element.parsedom)) {
					element.type = 'block'
				}
				//默认的内部块元素
				else if (defaultConfig.inblock.includes(element.parsedom)) {
					element.type = 'inblock'
				}
				//默认的行内元素
				else if (defaultConfig.inline.includes(element.parsedom)) {
					element.type = 'inline'
					//部分行内元素转为带样式的span
					if (defaultConfig.inlineToSpan[element.parsedom]) {
						const styles = defaultConfig.inlineToSpan[element.parsedom]
						element.type = 'inline'
						element.parsedom = 'span'
						if (element.hasStyles()) {
							Object.assign(element.styles, Util.clone(styles))
						} else {
							element.styles = Util.clone(styles)
						}
					}
				}
				//默认的自闭合元素
				else if (defaultConfig.closed.includes(element.parsedom)) {
					element.type = 'closed'
					element.children = null
				}

				//部分标签转为段落

				//定义行为如block的内部块元素
				if (element.isInblock() && ['li'].includes(element.parsedom)) {
					element.behavior = 'block'
				}
			}
		},
		//自定义元素格式化规则
		element => {
			if (typeof this.renderRules == 'function') {
				this.renderRules.apply(this, [element])
			}
		},
		//stack数组元素只能是根级块元素
		element => {
			if (!element.parent && !element.isBlock() && !element.isEmpty()) {
				element.convertToBlock()
			}
		},
		//block元素只能在根部
		element => {
			if (element.hasChildren()) {
				//子元素中存在根级块元素
				const hasBlock = element.children.some(el => {
					return !el.isEmpty() && el.isBlock()
				})
				//如果子元素中存在根级块元素，则转为行内元素或者内部块元素
				if (hasBlock) {
					element.children.forEach(el => {
						if (!el.isEmpty() && el.isBlock()) {
							//如果元素自身是inline，那么子元素转为inline，否则转为内部块元素
							el.type = element.type == 'inline' ? 'inline' : 'inblock'
						}
					})
				}
			}
		},
		//inblock与其他元素不能同时存在于子元素数组中
		element => {
			if (element.hasChildren()) {
				//是否有内部块元素
				let hasInblock = element.children.some(el => {
					return !el.isEmpty() && el.isInblock()
				})
				//是否有其他元素
				let hasOtherElement = element.children.some(el => {
					return !el.isEmpty() && !el.isInblock()
				})
				//既有内部块元素也有其他元素，则将inblock转为inline
				if (hasInblock && hasOtherElement) {
					element.children.forEach(el => {
						if (!el.isEmpty() && el.isInblock()) {
							el.type = 'inline'
						}
					})
				}
			}
		},
		//inblock元素只能在block或者inblock下
		element => {
			//如果行内元素有子元素
			if (element.isInline() && element.hasChildren()) {
				//子元素中存在内部块元素
				const hasInblock = element.children.some(el => {
					return !el.isEmpty() && el.isInblock()
				})
				//如果子元素中存在内部块元素，则转为行内元素
				if (hasInblock) {
					element.children.forEach(el => {
						if (!el.isEmpty() && el.isInblock()) {
							el.type = 'inline'
						}
					})
				}
			}
		},
		//换行符清除规则
		element => {
			if (element.hasChildren()) {
				//根级块元素和内部块元素中的换行符
				if (element.isBlock() && element.isInblock()) {
					//是否有换行符
					let hasBreak = element.children.some(el => {
						return el.isBreak()
					})
					//是否有其他元素
					let hasOtherElement = element.children.some(el => {
						return !el.isEmpty() && !el.isBreak()
					})
					//既有换行符也有其他元素则把换行符元素都置为空元素
					if (hasBreak && hasOtherElement) {
						element.children.forEach(el => {
							if (el.isBreak()) {
								el.toEmpty()
							}
						})
					}
					//只有换行符并且存在多个换行符
					else if (hasBreak && children.length > 1) {
						//把除了第一个换行符外的其他换行符都置为空元素
						element.children.forEach((el, index) => {
							if (el.isBreak() && index > 0) {
								el.toEmpty()
							}
						})
					}
				}
				//行内元素的换行符
				else if (element.isInline()) {
					element.children.forEach(el => {
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
							if (this.range && nel.isContains(this.range.anchor.element)) {
								this.range.anchor.moveToEnd(pel)
							}
							//终点在后一个元素上，则直接将终点设置到前一个元素上
							if (this.range && nel.isContains(this.range.focus.element)) {
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
							if (this.range && pel.isContains(this.range.anchor.element)) {
								this.range.anchor.moveToStart(nel)
							}
							//终点在前一个元素上，则直接将终点设置到后一个元素上
							if (this.range && pel.isContains(this.range.focus.element)) {
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
						if (this.range && nel.isEqual(this.range.anchor.element)) {
							this.range.anchor.element = pel
							this.range.anchor.offset = pel.textContent.length + this.range.anchor.offset
						}
						//终点在后一个元素上，则将终点设置到前一个元素上
						if (this.range && nel.isEqual(this.range.focus.element)) {
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
		//子元素和父元素合并策略（如果光标在子元素中可能会重新设置）
		element => {
			//判断两个元素是否可以合并
			const canMerge = (parent, child) => {
				//子元素是文本元素，父元素是标签等于文本标签的行内元素
				if (child.isText() && parent.isInline()) {
					return parent.parsedom == AlexElement.TEXT_NODE
				}
				//子元素和父元素的标签名相同
				if ((parent.isInline() && child.isInline()) || (parent.isInblock() && child.isInblock())) {
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
					//如果起点在子元素上
					if (this.range && child.isEqual(this.range.anchor.element)) {
						this.range.anchor.element = parent
					}
					//如果终点在子元素上
					if (this.range && child.isEqual(this.range.focus.element)) {
						this.range.focus.element = parent
					}
				}
				//子元素是行内元素或者内部块元素
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
					if (child.hasChildren()) {
						parent.children = [...child.children]
						parent.children.forEach(item => {
							item.parent = parent
						})
					}
				}
			}
			//存在子元素并且子元素只有一个且父子元素可以合并
			if (element.hasChildren() && element.children.length == 1 && canMerge(element, element.children[0])) {
				merge(element, element.children[0])
			}
		},
		//光标所在元素为空元素的情况下重新设置光标
		element => {
			if (element.isEmpty()) {
				//移除空元素时判断该元素是否是起点元素，如果是则更新起点元素
				if (this.range && element.isContains(this.range.anchor.element)) {
					this.__setRecentlyPoint(this.range.anchor)
				}
				//移除空元素时判断该元素是否是终点元素，如果是则更新终点元素
				if (this.range && element.isContains(this.range.focus.element)) {
					this.__setRecentlyPoint(this.range.focus)
				}
			}
		}
	]
	//初始化stack
	__initStack() {
		const ele = new AlexElement('block', AlexElement.BLOCK_NODE, null, null, null)
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
	//更新焦点的元素为最近的可设置光标的元素
	__setRecentlyPoint(point) {
		const previousElement = this.getPreviousElementOfPoint(point)
		const nextElement = this.getNextElementOfPoint(point)
		const block = point.element.getBlock()
		const inblock = point.element.getInblock()
		if (previousElement && inblock && inblock.isContains(previousElement)) {
			point.moveToEnd(previousElement)
		} else if (nextElement && inblock && inblock.isContains(nextElement)) {
			point.moveToStart(nextElement)
		} else if (previousElement && block.isContains(previousElement)) {
			point.moveToEnd(previousElement)
		} else if (nextElement && block.isContains(nextElement)) {
			point.moveToStart(nextElement)
		} else if (previousElement) {
			point.moveToEnd(previousElement)
		} else {
			point.moveToStart(nextElement)
		}
	}
	//监听selection改变
	__handleSelectionChange() {
		//如果编辑器禁用则不更新range
		if (this.disabled) {
			return
		}
		//如果是中文输入则不更新range
		if (this.__isInputChinese) {
			return
		}
		const selection = window.getSelection()
		if (selection.rangeCount) {
			const range = selection.getRangeAt(0)
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
				anchorNode = childNodes[range.startOffset] ? childNodes[range.startOffset] : childNodes[range.startOffset - 1]
				anchorOffset = childNodes[range.startOffset] ? 0 : 1
				if (anchorNode.nodeType == 3) {
					anchorOffset = anchorOffset == 0 ? 0 : anchorNode.textContent.length
					anchorNode = anchorNode.parentNode
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
				focusNode = childNodes[range.endOffset] ? childNodes[range.endOffset] : childNodes[range.endOffset - 1]
				focusOffset = childNodes[range.endOffset] ? 0 : 1
				if (focusNode.nodeType == 3) {
					focusOffset = focusOffset == 0 ? 0 : focusNode.textContent.length
					focusNode = focusNode.parentNode
				}
			}
			if (Dap.element.isContains(this.$el, anchorNode) && Dap.element.isContains(this.$el, focusNode)) {
				const anchorKey = Dap.data.get(anchorNode, 'data-alex-editor-key')
				const focusKey = Dap.data.get(focusNode, 'data-alex-editor-key')
				const anchorEle = this.getElementByKey(anchorKey)
				const focusEle = this.getElementByKey(focusKey)
				const anchor = new AlexPoint(anchorEle, anchorOffset)
				const focus = new AlexPoint(focusEle, focusOffset)
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
			this.__isInputChinese = true
		}
		if (e.type == 'compositionend') {
			this.__isInputChinese = false
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
	//根据光标进行删除操作
	delete() {
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
						}
						//如果光标在内部块元素的开始处
						else {
							//默认光标在内部块的开始处不做处理，这里触发一个事件，用于二次开发自定义开始处的删除操作
							this.emit('deleteExtend', inblock, previousElement, 'start')
						}
					}
					//前一个可设置光标的元素不存在
					else {
						//此时光标不仅在内部块的开始处，还是在编辑器的开始处
						this.emit('deleteExtend', inblock, previousElement, 'start')
					}
				}
				//如果光标在所在元素内部
				else {
					//如果光标在空白元素文本内
					if (this.range.anchor.element.isSpaceText()) {
						this.range.anchor.element.toEmpty()
						this.range.anchor.offset = 0
						this.range.focus.offset = 0
						this.delete()
					}
					//如果光标在文本元素内
					else if (this.range.anchor.element.isText()) {
						//文本元素的值
						const val = this.range.anchor.element.textContent
						//起点向前一位
						this.range.anchor.offset -= 1
						//要删除的字符是否空白文本
						const isSpaceText = Util.isSpaceText(val[this.range.anchor.offset])
						//进行删除
						this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset) + val.substring(this.range.focus.offset)
						//重新设置终点位置
						this.range.focus.offset = this.range.anchor.offset
						//如果删除的字符是空白文本，则再执行一次删除操作
						if (isSpaceText) {
							this.delete()
						}
						//如果内部块元素为空
						else if (inblock.isEmpty()) {
							//建一个换行符元素作为占位元素
							const breakEl = new AlexElement('closed', 'br', null, null, null)
							this.addElementTo(breakEl, inblock)
							this.range.anchor.moveToEnd(breakEl)
							this.range.focus.moveToEnd(breakEl)
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
							//如果删除的是换行符
							if (isBreak) {
								//没有定义删除拓展默认创建换行符
								if (!this.emit('deleteExtend', inblock, previousElement, 'empty')) {
									const breakEl = new AlexElement('closed', 'br', null, null, null)
									this.addElementTo(breakEl, inblock)
									this.range.anchor.moveToEnd(breakEl)
									this.range.focus.moveToEnd(breakEl)
								}
							}
							//如果删除的不是换行符则创建换行符
							else {
								const breakEl = new AlexElement('closed', 'br', null, null, null)
								this.addElementTo(breakEl, inblock)
								this.range.anchor.moveToEnd(breakEl)
								this.range.focus.moveToEnd(breakEl)
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
						}
						//如果光标在根级块元素的开始处
						else {
							//如果前一个可设置光标的元素在内部块内
							if (previousElement.getInblock()) {
								this.emit('deleteExtend', block, previousElement, 'start')
							}
							//如果前一个可设置光标的元素不在内部块内，则进行合并操作
							else {
								const previousBlock = previousElement.getBlock()
								this.mergeBlockElement(block, previousBlock)
							}
						}
					}
					//前一个可设置光标的元素不存在
					else {
						//此时光标不仅在根级块的开始处，还是在编辑器的开始处
						this.emit('deleteExtend', block, previousElement, 'start')
					}
				}
				//如果光标在所在元素内部
				else {
					//如果光标在空白元素文本内
					if (this.range.anchor.element.isSpaceText()) {
						this.range.anchor.element.toEmpty()
						this.range.anchor.offset = 0
						this.range.focus.offset = 0
						this.delete()
					}
					//如果光标在文本元素内
					else if (this.range.anchor.element.isText()) {
						//文本元素的值
						const val = this.range.anchor.element.textContent
						//起点向前一位
						this.range.anchor.offset -= 1
						//要删除的字符是否空白文本
						const isSpaceText = Util.isSpaceText(val[this.range.anchor.offset])
						//进行删除
						this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset) + val.substring(this.range.focus.offset)
						//重新设置终点位置
						this.range.focus.offset = this.range.anchor.offset
						//如果删除的字符是空白文本，则再执行一次删除操作
						if (isSpaceText) {
							this.delete()
						}
						//如果根级块元素为空
						else if (block.isEmpty()) {
							//建一个换行符元素作为占位元素
							const breakEl = new AlexElement('closed', 'br', null, null, null)
							this.addElementTo(breakEl, block)
							this.range.anchor.moveToEnd(breakEl)
							this.range.focus.moveToEnd(breakEl)
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
							//如果删除的是换行符
							if (isBreak) {
								//如果前一个可设置光标的元素不存在，表示光标在编辑器的开始处，并且没有自定义删除拓展，则默认创建一个换行符
								if (!previousElement && !this.emit('deleteExtend', block, previousElement, 'empty')) {
									const breakEl = new AlexElement('closed', 'br', null, null, null)
									this.addElementTo(breakEl, block)
									this.range.anchor.moveToEnd(breakEl)
									this.range.focus.moveToEnd(breakEl)
								}
								//其他情况下该块会被删除或者走自定义删除拓展的逻辑
							}
							//如果删除的不是换行符则创建换行符
							else {
								const breakEl = new AlexElement('closed', 'br', null, null, null)
								this.addElementTo(breakEl, block)
								this.range.anchor.moveToEnd(breakEl)
								this.range.focus.moveToEnd(breakEl)
							}
						}
					}
				}
			}
		}
		//起点和终点不在一起
		else {
			const elements = this.getElementsByRange(true, false)
			//起点所在的内部块元素
			const anchorInblock = this.range.anchor.element.getInblock()
			//终点所在的内部块元素
			const focusInblock = this.range.focus.element.getInblock()
			//起点所在的根级块元素
			const anchorBlock = this.range.anchor.element.getBlock()
			//终点所在的根级块元素
			const focusBlock = this.range.focus.element.getBlock()
			//选区根部元素中是否有内部块元素
			const hasInblock = elements.some(el => {
				return el.isInblock()
			})
		}
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
				let index = 0
				//遍历子元素
				while (index < element.children.length) {
					let el = element.children[index]
					//对该子元素进行格式化处理
					format(el)
					//获取格式化后的元素序列
					const newIndex = element.children.findIndex(item => {
						return el.isEqual(item)
					})
					//向后格式化
					index = newIndex + 1
				}
			}
			//格式化自身
			this.__formatUnchangeableRules.forEach(fn => {
				fn(element)
			})
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
		format(ele)
		//移除该元素下所有的空元素
		removeEmptyElement(ele)
	}
	//格式化stack
	formatElementStack() {
		let index = 0
		while (index < this.stack.length) {
			const el = this.stack[index]
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
	//渲染编辑器dom内容
	domRender(unPushHistory = false) {
		this.$el.innerHTML = ''
		this.stack.forEach(element => {
			element.__renderElement()
			this.$el.appendChild(element._elm)
		})
		this.__oldValue = this.value
		this.value = this.$el.innerHTML
		//值有变化
		if (this.__oldValue != this.value) {
			//触发change事件
			this.emit('change', this.value, this.__oldValue)
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
			//如果是文本元素
			if (point.element.isText()) {
				node = point.element._elm.childNodes[0]
				offset = point.offset
			}
			//自闭合元素
			else {
				node = point.element.parent._elm
				const index = point.element.parent.children.findIndex(item => {
					return point.element.isEqual(item)
				})
				offset = point.offset + index
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
		//默认定义为内部块元素
		let element = new AlexElement('inblock', parsedom, marks, styles, null)
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
	//将指定块元素与另一个块元素进行合并
	mergeBlockElement(ele, previousEle) {
		if (!AlexElement.isElement(ele)) {
			throw new Error('The first argument must be an AlexElement instance')
		}
		if (!AlexElement.isElement(previousEle)) {
			throw new Error('The second argument must be an AlexElement instance')
		}
		if (!ele.isBlock() || !previousEle.isBlock()) {
			throw new Error('Elements that are not "block" cannot be merged')
		}
		previousEle.children.push(...ele.children)
		previousEle.children.forEach(item => {
			item.parent = previousEle
		})
		//将指定的块元素设为空元素
		ele.toEmpty()
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
	//获取指定元素的前一个兄弟元素（会过滤空元素）
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
	//获取指定元素的后一个兄弟元素（会过滤空元素）
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
	//向上查询可以设置焦点的元素（会过滤空元素）
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
	//向下查找可以设置焦点的元素（会过滤空元素）
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
				if (!flatElements[i].isContains(this.range.anchor.element) && !flatElements[i].isContains(this.range.focus.element)) {
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

		//返回扁平化数组
		if (flat) {
			return elements
		}
		let notFlatElements = []
		elements.forEach(el => {
			if (el.isBlock()) {
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
	//将指定元素添加到另一个元素后面
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
	//触发自定义事件
	emit(eventName, ...value) {
		if (Array.isArray(this.__events[eventName])) {
			this.__events[eventName].forEach(fn => {
				fn.apply(this, [...value])
			})
			return true
		}
		return false
	}
	//监听自定义事件
	on(eventName, eventHandle) {
		if (!this.__events[eventName]) {
			this.__events[eventName] = []
		}
		this.__events[eventName].push(eventHandle)
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
