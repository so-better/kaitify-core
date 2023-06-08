class AlexEditor {
	//根据光标位置删除编辑器内容
	delete() {
		//单个删除
		if (this.range.anchor.isEqual(this.range.focus)) {
			//前一个可以获取焦点的元素
			const previousElement = this.getPreviousElementOfPoint(this.range.anchor)
			//起点所在的块元素
			const block = this.range.anchor.element.getBlock()
			//光标在起点所在元素的开始处
			if (this.range.anchor.offset == 0) {
				//如果前一个可获取焦点的元素存在
				if (previousElement) {
					//和起点所在元素在同一个块内
					if (block.isContains(previousElement)) {
						this.range.anchor.moveToEnd(previousElement)
						this.range.focus.moveToEnd(previousElement)
						this.delete()
					}
					//和起点所在元素不在同一个块内并且所在块元素的删除行为是默认的，则进行合并块操作
					else if (block.deletion == 'default') {
						const previousBlock = this.getPreviousElement()
						if (previousBlock) {
							this.mergeBlockElement(block, previousBlock)
						}
					}
				}
			}
			//光标不在起点所在元素的开始处
			else {
				//如果起点所在元素不可编辑
				if (this.range.anchor.element.isUneditable()) {
					//获取设置不可编辑标记的元素
					const ele = this.range.anchor.element.getUneditableElement()
					//设为空元素
					ele.toEmpty()
				}
				//起点在空白元素文本内
				else if (this.range.anchor.element.isSpaceText()) {
					this.range.anchor.element.toEmpty()
					this.range.anchor.offset = 0
					this.range.focus.offset = 0
					this.delete()
				}
				//起点在文本元素内
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
					//如果所在块元素为空
					else if (block.isEmpty()) {
						//建一个换行符元素作为占位元素
						const breakEl = new AlexElement('closed', 'br', null, null, null)
						this.addElementTo(breakEl, block)
						this.range.anchor.moveToEnd(breakEl)
						this.range.focus.moveToEnd(breakEl)
					}
				}
				//起点在自闭合元素内
				else {
					//删除的是否是换行符
					const isBreak = this.range.anchor.element.isBreak()
					//删除该自闭合元素
					this.range.anchor.element.toEmpty()
					//如果所在块元素为空，并且删除行为是allow或者删除的不是换行符
					if (block.isEmpty() && (block.deletion == 'allow' || !isBreak)) {
						const breakEl = new AlexElement('closed', 'br', null, null, null)
						this.addElementTo(breakEl, block)
						this.range.anchor.moveToEnd(breakEl)
						this.range.focus.moveToEnd(breakEl)
					}
				}
			}
		}
		//批量删除
		else {
			//起点和终点在同一个元素内
			if (this.range.anchor.element.isEqual(this.range.focus.element)) {
				//起点所在的块元素
				const block = this.range.anchor.element.getBlock()
				//如果起点所在元素不可编辑
				if (this.range.anchor.element.isUneditable()) {
					this.range.anchor.element.toEmpty()
				}
				//起点在空白元素文本内
				else if (this.range.anchor.element.isSpaceText()) {
					this.range.anchor.element.toEmpty()
				}
				//起点在文本元素内
				else if (this.range.anchor.element.isText()) {
					//文本元素的值
					const val = this.range.anchor.element.textContent
					//进行删除
					this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset) + val.substring(this.range.focus.offset)
					//重新设置终点位置
					this.range.focus.offset = this.range.anchor.offset
					//如果所在块元素为空
					if (block.isEmpty()) {
						//建一个换行符元素作为占位元素
						const breakEl = new AlexElement('closed', 'br', null, null, null)
						this.addElementTo(breakEl, block)
						this.range.anchor.moveToEnd(breakEl)
						this.range.focus.moveToEnd(breakEl)
					}
				}
				//起点在自闭合元素内
				else {
					//删除的是否是换行符
					const isBreak = this.range.anchor.element.isBreak()
					//删除该自闭合元素
					this.range.anchor.element.toEmpty()
					//如果所在块元素为空，并且删除行为是allow或者删除的不是换行符
					if (block.isEmpty() && (block.deletion == 'allow' || !isBreak)) {
						const breakEl = new AlexElement('closed', 'br', null, null, null)
						this.addElementTo(breakEl, block)
						this.range.anchor.moveToEnd(breakEl)
						this.range.focus.moveToEnd(breakEl)
					}
				}
			}
			//起点和终点不在同一个元素内
			else {
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
				//起点在换行符上
				if (this.range.anchor.element.isBreak()) {
					this.insertText('\n\n')
					this.range.anchor.offset -= 1
					this.range.focus.offset -= 1
				}
				//起点在代码块的终点位置
				else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
					//终点位置的字符是换行符
					if (this.range.anchor.element.isText() && this.range.anchor.element.textContent[this.range.anchor.offset - 1] == '\n') {
						this.insertText('\n')
					}
					//终点位置的字符不是换行符
					else {
						this.insertText('\n\n')
						this.range.anchor.offset -= 1
						this.range.focus.offset -= 1
					}
				}
				//普通的换行
				else {
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
