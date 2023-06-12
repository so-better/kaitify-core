class AlexEditor {
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
			//如果插入的是块元素
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
					//删除当前块
					anchorBlock.toEmpty()
					//重置光标
					this.range.anchor.moveToEnd(ele)
					this.range.focus.moveToEnd(ele)
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
			}
			//插入的不是块元素
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
			this.range.anchor.moveToEnd(ele)
			this.range.focus.moveToEnd(ele)
		} else {
			this.delete()
			this.insertElement(ele)
		}
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
}

export default AlexEditor
