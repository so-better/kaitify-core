import AlexElement from './Element'

class AlexRange {
	constructor(el, anchor, focus) {
		this.$el = el
		this.anchor = anchor
		this.focus = focus
	}

	//插入文本
	insertText(data) {
		//对空格进行处理
		data = data.replace(/\s+/g, () => {
			console.log(data)
			const span = document.createElement('span')
			span.innerHTML = '&nbsp;'
			return span.innerText
		})
		//起点和终点在一个位置
		if (this.anchor.isEqual(this.focus)) {
			//如果是文本
			if (this.anchor.element.isText()) {
				let val = this.anchor.element.textContent
				this.anchor.element.textContent = val.substring(0, this.anchor.offset) + data + val.substring(this.anchor.offset)
				this.anchor.offset = this.anchor.offset + data.length
				this.focus.offset = this.anchor.offset
			}
			//如果是自闭合元素
			else {
				const index = this.anchor.element.parent.children.findIndex(el => {
					return this.anchor.element.isEqual(el)
				})
				const textEl = new AlexElement('text', null, null, null, null, data)
				this.anchor.element.parent.children.splice(this.anchor.offset == 0 ? index : index + 1, 0, textEl)
				textEl.parent = this.anchor.element.parent
				this.anchor.moveToEnd(textEl)
				this.focus.moveToEnd(textEl)
			}
		}
		//起点和终点不在一个位置，即存在选区
		else {
			this.delete()
			this.insertText(data)
		}
	}

	//换行
	insertParagraph() {
		//起点和终点在一个位置
		if (this.anchor.isEqual(this.focus)) {
		}
		//起点和终点不在一个位置，即存在选区
		else {
		}
	}

	//删除内容
	delete() {
		//单个删除
		if (this.anchor.isEqual(this.focus)) {
			//前一个可以获取焦点的元素
			const previousElement = this.anchor.getPreviousElement()
			//当前焦点所在的块元素
			const anchorBlock = this.anchor.getBlock()

			//光标在焦点元素的开始处
			if (this.anchor.offset == 0) {
				//如果前一个可获取焦点的元素存在
				if (previousElement) {
					//和当前焦点元素在同一个块内
					if (anchorBlock.isContains(previousElement)) {
						this.anchor.moveToEnd(previousElement)
						this.focus.moveToEnd(previousElement)
						this.deleteInSameElement()
					}
					//和当前焦点元素不在同一个块内
					else {
						//当前焦点所在块元素和前一个块元素进行合并
						anchorBlock.mergeBlock()
						this.anchor.moveToEnd(previousElement)
						this.focus.moveToEnd(previousElement)
					}
				}
			}
			//正常删除
			else {
				this.deleteInSameElement()
			}
		}
		//批量删除
		else {
			//选区在一个元素内
			if (this.anchor.element.isEqual(this.focus.element)) {
				this.deleteInSameElement()
			} else {
				const flatElements = AlexElement.flatElements()
				const anchorIndex = flatElements.findIndex(el => {
					return this.anchor.element.isEqual(el)
				})
				const focusIndex = flatElements.findIndex(el => {
					return this.focus.element.isEqual(el)
				})
				//获取选区之间的
				let rangeElements = []
				for (let i = anchorIndex + 1; i < focusIndex; i++) {
					if (!flatElements[i].hasContains(this.anchor.element) && !flatElements[i].hasContains(this.focus.element)) {
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
				//获取起点所在的块元素
				const focusBlock = this.focus.getBlock()
				//不在一个块内则需要merge
				let hasMerge = !focusBlock.hasContains(this.anchor.element)
				//记录删除操作之前的值
				let focsuElement = this.focus.element
				let focusOffset = this.focus.offset
				let anchorElement = this.anchor.element
				let anchorOffset = this.anchor.offset

				//先执行终点处的删除逻辑
				this.anchor.element = focsuElement
				this.anchor.offset = 0 //如果是文本，起点从文本起点0开始；如果是自闭合元素，起点从0开始
				this.deleteInSameElement()

				//恢复终点光标位置
				this.anchor.element = anchorElement
				this.anchor.offset = anchorOffset
				this.focus.element = focsuElement
				this.focus.offset = focusOffset

				//后执行起点处的删除逻辑
				this.focus.element = anchorElement
				this.focus.offset = this.anchor.element.isText() ? this.anchor.element.textContent.length : 1 //如果是文本从文本终点开始，如果是自闭合元素从自闭合元素终点开始
				this.deleteInSameElement()

				if (hasMerge) {
					focusBlock.mergeBlock()
				}
			}
		}
	}

	//起始和结束点都在一个元素内的删除方法
	deleteInSameElement() {
		if (!this.anchor.element.isEqual(this.focus.element)) {
			return
		}
		if (this.anchor.offset == 0 && this.focus.offset == 0) {
			return
		}
		//前一个可以获取焦点的元素
		const previousElement = this.anchor.getPreviousElement()
		//后一个可以获取焦点的元素
		const nextElement = this.anchor.getNextElement()
		//当前焦点所在的块元素
		const anchorBlock = this.anchor.getBlock()
		if (this.anchor.element.isText()) {
			//文本值
			const val = this.anchor.element.textContent
			const start = this.anchor.offset == this.focus.offset ? this.anchor.offset - 1 : this.anchor.offset
			const end = this.focus.offset
			//进行删除
			this.anchor.element.textContent = val.substring(0, start) + val.substring(end)
			//重新设置光标位置
			if (this.anchor.offset == this.focus.offset) {
				this.anchor.offset -= 1
			}
			this.focus.element = this.anchor.element
			this.focus.offset = this.anchor.offset
			//文本元素被删空
			if (this.anchor.element.isEmpty()) {
				//如果所在块元素为空
				if (anchorBlock.isEmpty()) {
					const breakEl = new AlexElement('closed', 'br', null, null, null, null)
					anchorBlock.children = [breakEl]
					breakEl.parent = anchorBlock
					this.anchor.element = breakEl
					this.anchor.offset = 0
					this.focus.element = breakEl
					this.focus.offset = 0
				}
				//所在块元素不是空
				else {
					//同块内前面存在不为空的元素
					if (this.anchor.hasPreviousNotEmpty()) {
						this.anchor.moveToEnd(previousElement)
						this.focus.moveToEnd(previousElement)
					}
					//前面都是空，那么后面必然有不为空的
					else if (this.anchor.hasNextNotEmpty()) {
						this.anchor.moveToStart(nextElement)
						this.focus.moveToStart(nextElement)
					}
				}
			}
		} else {
			//当前焦点所在元素在父元素中的位置
			const index = this.anchor.element.parent.children.findIndex(el => {
				return this.anchor.element.isEqual(el)
			})
			//同块内前面是否存在不为空的元素
			const hasPreviousNotEmpty = this.anchor.hasPreviousNotEmpty()
			//同块内后面是否存在不为空的元素
			const hasNextNotEmpty = this.anchor.hasNextNotEmpty()
			//删除该自闭合元素
			this.anchor.element.parent.children.splice(index, 1)
			//如果所在块元素为空
			if (anchorBlock.isEmpty()) {
				const breakEl = new AlexElement('closed', 'br', null, null, null, null)
				anchorBlock.children = [breakEl]
				breakEl.parent = anchorBlock
				this.anchor.element = breakEl
				this.anchor.offset = 0
				this.focus.element = breakEl
				this.focus.offset = 0
			}
			//所在块元素不是空
			else {
				//同块内前面存在不为空的元素
				if (hasPreviousNotEmpty) {
					this.anchor.moveToEnd(previousElement)
					this.focus.moveToEnd(previousElement)
				}
				//前面都是空，那么后面必然有不为空的
				else if (hasNextNotEmpty) {
					this.anchor.moveToStart(nextElement)
					this.focus.moveToStart(nextElement)
				}
			}
		}
	}

	//设置真实的光标
	setCusor() {
		//设置光标之前需要将两个点合二为一
		if (!this.anchor.isEqual(this.focus)) {
			return
		}
		const selection = window.getSelection()
		let node = null
		let offset = null
		//自闭合文本需要特殊处理
		if (this.focus.element.isClosed()) {
			node = this.focus.element.parent.getRealNode(this.$el)
			const index = this.focus.element.parent.children.findIndex(el => {
				return this.focus.element.isEqual(el)
			})
			offset = this.focus.offset == 1 ? index + 1 : index
		} else {
			node = this.focus.element.getRealNode(this.$el)
			offset = this.focus.offset
		}
		selection.collapse(node, offset)
	}

	//将真实的光标设置到指定元素开始
	collapseToStart(element) {
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.anchor.moveToStart(element)
			this.focus.moveToStart(element)
			this.setCusor()
		}
		//文档最后面
		else {
			const flatElements = AlexElement.flatElements()
			this.collapseToStart(flatElements[0])
		}
	}

	//光标设置到指定的元素最后
	collapseToEnd(element) {
		//指定了某个元素
		if (AlexElement.isElement(element)) {
			this.anchor.moveToEnd(element)
			this.focus.moveToEnd(element)
			this.setCusor()
		}
		//文档最后面
		else {
			const flatElements = AlexElement.flatElements()
			const length = flatElements.length
			this.collapseToEnd(flatElements[length - 1])
		}
	}
}

export default AlexRange
