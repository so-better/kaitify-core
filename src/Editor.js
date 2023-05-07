import Util from './Util'
import AlexElement from './Element'
import AlexPoint from './Point'
import AlexRange from './Range'
import AlexHistory from './History'

class AlexEditor {
	constructor(el, options) {
		//校验el是否元素
		if (!Util.isElement(el)) {
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
		//自定义编辑器内容渲染规则
		this.renderRules = options.renderRules
		//内容变更触发的事件
		this.onChange = options.onChange
		//编辑的range
		this.range = null
		//是否正在输入中文
		this._isInputChinese = false
		//将html内容转为元素数组
		this.stack = this.parseHtml(this.value)
		//创建历史记录
		this.history = new AlexHistory()
		//格式化元素数组
		this._formatElements()
		//渲染dom
		this._domRender()
		//初始设置range
		this._initRange()
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
		Util.on(document, 'selectionchange', this._selectionChange.bind(this))
		//监听内容输入
		Util.on(this.$el, 'beforeinput', this._beforeInput.bind(this))
		//监听中文输入
		Util.on(this.$el, 'compositionstart compositionupdate compositionend', this._chineseInputHandler.bind(this))
		//监听键盘按下
		Util.on(this.$el, 'keydown', this._keyboardDown.bind(this))
	}

	//格式化options参数
	_formatOptions(options) {
		let opts = {
			disabled: false,
			autofocus: false,
			renderRules: null,
			value: '<p><br></p>',
			onChange: null
		}
		if (Util.isObject(options)) {
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
		}
		return opts
	}
	//规范stack
	_formatElements() {
		//格式化
		const format = ele => {
			//从子孙元素开始格式化
			if (ele.hasChildren()) {
				ele.children = ele.children.map(format)
			}
			//格式化自身
			AlexElement._formatUnchangeableRules.forEach(fn => {
				//这里的ele是每一个fn执行后的结果，需要考虑到可能被置为了null
				if (ele) {
					ele = fn(ele)
				}
			})
			return ele
		}
		//移除null
		const removeNull = ele => {
			if (ele) {
				if (ele.hasChildren()) {
					ele.children.forEach(item => {
						if (item) {
							item = removeNull(item)
						}
					})
					ele.children = ele.children.filter(item => {
						return !!item
					})
				}
			}
			return ele
		}
		this.stack = this.stack
			.map(ele => {
				//转为块元素
				if (!ele.isBlock()) {
					ele.convertToBlock()
				}
				//格式化
				ele = format(ele)
				//format会导致null出现，这里需要移除null
				ele = removeNull(ele)
				return ele
			})
			.filter(ele => {
				//移除根部的null元素
				return !!ele
			})
	}
	//渲染编辑器dom内容
	_domRender(unPushHistory) {
		this.$el.innerHTML = ''
		this.stack.forEach(element => {
			let elm = element.renderElement()
			this.$el.appendChild(elm)
		})
		this.value = this.$el.innerHTML
		if (typeof this.onChange == 'function') {
			this.onChange.apply(this, [this.value])
		}
		//unPushHistory如果是true则表示不加入历史记录中
		if (!unPushHistory) {
			//记录历史
			this.history.push(
				this.stack.map(element => {
					return element.clone(true)
				})
			)
		}
	}
	//初始设置range
	_initRange() {
		const firstElement = this.stack[0]
		const anchor = new AlexPoint(firstElement, 0)
		const focus = new AlexPoint(firstElement, 0)
		this.range = new AlexRange(anchor, focus)
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
					const breakEl = new AlexElement('closed', 'br', null, null, null, null)
					this.addElementTo(breakEl, anchorBlock, 0)
					this.range.anchor.element = breakEl
					this.range.anchor.offset = 0
					this.range.focus.element = breakEl
					this.range.focus.offset = 0
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
				const breakEl = new AlexElement('closed', 'br', null, null, null, null)
				this.addElementTo(breakEl, anchorBlock, 0)
				this.range.anchor.moveToStart(breakEl)
				this.range.focus.moveToStart(breakEl)
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
	//监听selection改变
	_selectionChange() {
		//如果编辑器禁用则不更新range
		if (this.disabled) {
			return
		}
		//如果是中文输入则不更新range
		if (this.isInputChinese) {
			return
		}
		const selection = window.getSelection()
		if (selection.rangeCount) {
			const range = selection.getRangeAt(0)
			if (Util.isContains(this.$el, range.startContainer) && Util.isContains(this.$el, range.endContainer)) {
				const anchorKey = Util.getData(range.startContainer, 'data-alex-editor-key')
				const focusKey = Util.getData(range.endContainer, 'data-alex-editor-key')
				const anchorEle = this.getElementByKey(anchorKey)
				const focusEle = this.getElementByKey(focusKey)
				const anchor = new AlexPoint(anchorEle, range.startOffset)
				const focus = new AlexPoint(focusEle, range.endOffset)
				this.range = new AlexRange(anchor, focus)
			}
		}
	}
	//监听beforeinput
	_beforeInput(e) {
		e.preventDefault()
		//如果输入中文，则不更新编辑器
		if (e.inputType == 'insertCompositionText') {
			return
		}
		switch (e.inputType) {
			//输入操作
			case 'insertText':
				this.insertText(e.data)
				break
			//删除操作
			case 'deleteContentBackward':
				this.delete()
				break
			//插入段落
			case 'insertParagraph':
				this.insertParagraph()
				break
			//粘贴
			case 'insertFromPaste':
				let pasteText = e.dataTransfer.getData('text/html')
				let pasteFiles = e.dataTransfer.files
				console.log(pasteText)
				console.log(pasteFiles)
				break
			//剪切
			case 'deleteByCut':
				this.delete()
				break
			default:
				console.log('beforeInput没有监听到的inputType', e.inputType)
		}
		this.render()
	}
	//监听中文输入
	_chineseInputHandler(e) {
		e.preventDefault()
		if (e.type == 'compositionstart') {
			this._isInputChinese = true
		}
		if (e.type == 'compositionend') {
			this._isInputChinese = false
			//在中文输入结束后插入数据
			this.insertText(e.data)
			//渲染
			this.render()
		}
	}
	//监听键盘按下
	_keyboardDown(e) {
		switch (e.keyCode) {
			case 9:
				e.preventDefault()
				console.log('Tab键按下')
				break
		}
	}
	//渲染
	render() {
		//格式化
		this._formatElements()
		//渲染编辑器
		this._domRender()
		//设置光标
		this.range.setCursor()
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
		if (childEle.isBlock() && !parentEle.isBlok()) {
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
			const index = this.stack.findIndex(el => {
				return targetEle.isEqual(el)
			})
			this.stack.splice(index, 0, newEle)
			newEle.parent = null
		} else {
			const index = targetEle.parent.children.findIndex(el => {
				return targetEle.isEqual(el)
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
			const index = this.stack.findIndex(el => {
				return targetEle.isEqual(el)
			})
			if (index >= this.stack.length - 1) {
				this.stack.push(newEle)
			} else {
				this.stack.splice(index + 1, 0, newEle)
			}
			newEle.parent = null
		} else {
			const index = targetEle.parent.children.findIndex(el => {
				return targetEle.isEqual(el)
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
		//非元素和文本转为null
		if (!Util.isElement(node, true)) {
			return null
		}
		//文本节点
		if (node.nodeType == 3) {
			let element = new AlexElement('text', null, null, null, null, node.nodeValue)
			element = AlexElement._renderRules(element)
			if (typeof this.renderRules == 'function') {
				element = this.renderRules(element)
			}
			return element
		}
		//元素节点
		else {
			const marks = Util.getAttributes(node)
			const styles = Util.getStyles(node)
			//默认定义为块元素，标签名为小写
			let element = new AlexElement('block', node.nodeName.toLocaleLowerCase(), marks, styles, null, null)
			element = AlexElement._renderRules(element)
			if (typeof this.renderRules == 'function') {
				element = this.renderRules(element)
			}
			Array.from(node.childNodes).forEach(childNode => {
				const childEle = this.parseNode(childNode)
				if (childEle) {
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
	}
	//将html转为元素
	parseHtml(html) {
		if (!html) {
			throw new Error('You need to give an html content to convert')
		}
		const node = document.createElement('div')
		node.innerHTML = html
		const data = this.parseNode(node)
		return data.children.map(ele => {
			ele.parent = null
			return ele
		})
	}
	//向上查询可以设置焦点的元素
	getPreviousElementOfPoint(point) {
		if (!AlexPoint.isPoint(point)) {
			throw new Error('The argument must be an AlexPoint instance')
		}
		const flatElements = AlexElement.flatElements(this.stack)
		const fn = element => {
			const index = flatElements.findIndex(el => {
				return element.isEqual(el)
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
			const index = flatElements.findIndex(el => {
				return element.isEqual(el)
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
				let newEl = new AlexElement('text', null, null, null, null, val.substring(this.range.anchor.offset, this.range.focus.offset))
				this.addElementAfter(newEl, this.range.anchor.element)
				let newFocus = new AlexElement('text', null, null, null, null, val.substring(this.range.focus.offset))
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
			const anchorIndex = flatElements.findIndex(el => {
				return this.range.anchor.element.isEqual(el)
			})
			const focusIndex = flatElements.findIndex(el => {
				return this.range.focus.element.isEqual(el)
			})
			//获取选区之间的元素
			for (let i = anchorIndex + 1; i < focusIndex; i++) {
				if (!flatElements[i].hasContains(this.range.anchor.element) && !flatElements[i].hasContains(this.range.focus.element)) {
					elements.push(flatElements[i])
				}
			}
			//起点是文本
			if (this.range.anchor.element.isText()) {
				let val = this.range.anchor.element.textContent
				this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset)
				let newEl = new AlexElement('text', null, null, null, null, val.substring(this.range.anchor.offset))
				this.addElementAfter(newEl, this.range.anchor.element)
				elements.unshift(newEl)
			}
			//起点是自闭合元素且offset为0
			else if (this.range.anchor.offset == 0) {
				elements.unshift(this.range.anchor.element)
			}

			//终点是文本
			if (this.range.focus.element.isText()) {
				let val = this.range.focus.element.textContent
				this.range.focus.element.textContent = val.substring(0, this.range.focus.offset)
				let newEl = new AlexElement('text', null, null, null, null, val.substring(this.range.focus.offset))
				this.addElementAfter(newEl, this.range.focus.element)
				elements.push(this.range.focus.element)
			}
			//终点是自闭合元素且offset为1
			else {
				elements.push(this.range.focus.element)
			}
		}
		return elements
	}
	//根据光标位置删除编辑器内容
	delete() {
		//单个删除
		if (this.range.anchor.isEqual(this.focus)) {
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
				const anchorIndex = flatElements.findIndex(el => {
					return this.range.anchor.element.isEqual(el)
				})
				const focusIndex = flatElements.findIndex(el => {
					return this.range.focus.element.isEqual(el)
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
				//记录删除操作之前的值
				let focsuElement = this.range.focus.element
				let focusOffset = this.range.focus.offset
				let anchorElement = this.range.anchor.element
				let anchorOffset = this.range.anchor.offset

				//先执行终点处的删除逻辑
				this.range.anchor.element = focsuElement
				this.range.anchor.offset = 0 //如果是文本，起点从文本起点0开始；如果是自闭合元素，起点从0开始
				this._deleteInSameElement()

				//恢复终点光标位置
				this.range.anchor.element = anchorElement
				this.range.anchor.offset = anchorOffset
				this.range.focus.element = focsuElement
				this.range.focus.offset = focusOffset

				//后执行起点处的删除逻辑
				this.range.focus.element = anchorElement
				this.range.focus.offset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1 //如果是文本从文本终点开始，如果是自闭合元素从自闭合元素终点开始
				this._deleteInSameElement()

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
				const textEl = new AlexElement('text', null, null, null, null, data)
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
				//在该块之前插入一个新的段落
				const paragraph = new AlexElement('block', AlexElement.paragraph, null, null, null, null)
				const breakEle = new AlexElement('closed', 'br', null, null, null, null)
				this.addElementTo(breakEle, paragraph, 0)
				this.addElementBefore(paragraph, anchorBlock)
				this.range.anchor.moveToStart(anchorBlock)
				this.range.focus.moveToStart(anchorBlock)
			}
			//焦点在当前块的终点位置
			else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
				//在该块之后插入一个新的段落
				const paragraph = new AlexElement('block', AlexElement.paragraph, null, null, null, null)
				const breakEle = new AlexElement('closed', 'br', null, null, null, null)
				this.addElementTo(breakEle, paragraph, 0)
				this.addElementAfter(paragraph, anchorBlock)
				this.range.anchor.moveToStart(paragraph)
				this.range.focus.moveToStart(paragraph)
			}
			//焦点在当前块的中间部分则需要切割
			else {
				if (!this.range.anchor.isEqual(this.range.focus)) {
					return
				}
				//获取所在块元素
				const block = this.range.anchor.getBlock()
				const newBlock = block.clone(true)
				this.addElementAfter(newBlock, block)
				//将终点移动到块元素末尾
				this.range.focus.moveToEnd(block)
				this.delete()
				//将终点移动到新的块元素
				const elements = AlexElement.flatElements(block.children)
				const index = elements.findIndex(el => {
					return this.range.anchor.element.isEqual(el)
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
	//api：根据光标设置css样式
	setStyle(styleObject) {
		if (!Util.isObject) {
			throw new Error('The argument must be an object')
		}
		const elements = this.getElementsByRange()
		elements.forEach(el => {
			if (el.isText()) {
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
		})
		this.range.anchor.moveToStart(elements[0])
		this.range.focus.moveToEnd(elements[elements.length - 1])
	}
	//插入dom
	insertNode(node) {
		if (!Util.isElement(node, true)) {
			throw new Error('The parameter must be a text node or an element node')
		}
		const el = this.parseNode(node)
		//光标
		if (this.range.anchor.isEqual(this.range.focus)) {
		}
		//如果插入的是块元素
		if (el.isBlock()) {
		}
		//其他元素
		else {
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
	//撤销
	undo() {
		const flatElements = AlexElement.flatElements(this.stack)
		const anchorIndex = flatElements.findIndex(ele => {
			return this.range.anchor.element.isEqual(ele)
		})
		const focusIndex = flatElements.findIndex(ele => {
			return this.range.focus.element.isEqual(ele)
		})
		//获取前一个stack
		const stack = this.history.get(-1)
		if (stack) {
			this.stack = stack.map(element => {
				return element.clone(true)
			})
			//渲染编辑器
			this._domRender(true)
			const newFlatElements = AlexElement.flatElements(this.stack)
			//设置光标
			if (newFlatElements[anchorIndex]) {
				this.range.anchor.element = newFlatElements[anchorIndex]
				if (this.range.anchor.element.isText() && this.range.anchor.offset > this.range.anchor.element.textContent.length) {
					this.range.anchor.offset = this.range.anchor.element.textContent.length
				}
			} else {
				this.range.anchor.moveToEnd(newFlatElements[newFlatElements.length - 1])
			}
			if (newFlatElements[focusIndex]) {
				this.range.focus.element = newFlatElements[focusIndex]
				if (this.range.focus.element.isText() && this.range.focus.offset > this.range.focus.element.textContent.length) {
					this.range.focus.offset = this.range.focus.element.textContent.length
				}
			} else {
				this.range.focus.moveToEnd(newFlatElements[newFlatElements.length - 1])
			}
			this.range.setCursor()
		}
	}
	//重做
	redo() {
		//获取前一个stack
		const stack = this.history.get(1)
		if (stack) {
			this.stack = stack.map(element => {
				return element.clone(true)
			})
			//渲染编辑器
			this._domRender(true)
			//设置光标
			this.collapseToEnd()
		}
	}
}

export default AlexEditor
