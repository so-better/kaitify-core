import Util from './Util'

class AlexElement {
	constructor(type, parsedom, marks, styles, children, textContent) {
		//key值
		this.key = Util.getUniqueKey()
		//类型 block/inline/text/closed
		this.type = type
		//真实节点名称
		this.parsedom = parsedom
		//标记集合
		this.marks = marks
		//样式集合
		this.styles = styles
		//子元素
		this.children = children
		//text时的值
		this.textContent = textContent
		//父元素
		this.parent = null
	}
	//是否文本
	isText() {
		return this.type == 'text'
	}
	//是否块
	isBlock() {
		return this.type == 'block'
	}
	//是否行内
	isInline() {
		return this.type == 'inline'
	}
	//是否闭合
	isClosed() {
		return this.type == 'closed'
	}
	//是否换行符
	isBreak() {
		return this.isClosed() && this.parsedom == 'br'
	}
	//是否空
	isEmpty() {
		//文本节点没有值认为是空
		if (this.isText() && !this.textContent) {
			return true
		}
		//行内和块元素
		if (this.isInline() || this.isBlock()) {
			if (!this.hasChildren()) {
				return true
			}
			const allEmpty = this.children.every(el => {
				return !el || el.isEmpty()
			})
			return allEmpty
		}
		return false
	}
	//是否根元素
	isRoot() {
		return !this.parent
	}
	//是否包含指定节点
	isContains(element) {
		if (this.isEqual(element)) {
			return true
		}
		if (element.isRoot()) {
			return false
		}
		return this.isContains(element.parent)
	}
	//判断两个Element是否相等
	isEqual(element) {
		if (!AlexElement.isElement(element)) {
			return false
		}
		return this.key == element.key
	}
	//判断两个元素是否有包含关系
	hasContains(element) {
		if (!AlexElement.isElement(element)) {
			return false
		}
		return this.isContains(element) || element.isContains(this)
	}
	//是否含有标记
	hasMarks() {
		return !Util.isEmptyObject(this.marks)
	}
	//是否含有样式
	hasStyles() {
		return !Util.isEmptyObject(this.styles)
	}
	//是否有子元素
	hasChildren() {
		if (Array.isArray(this.children)) {
			return !!this.children.length
		}
		return false
	}
	//查找真实节点
	getRealNode(el) {
		if (this.isText()) {
			const index = this.parent.children.findIndex(item => {
				return this.isEqual(item)
			})
			const parentNode = this.parent.getRealNode(el)
			return parentNode.childNodes[index]
		}
		return el.querySelector(`[data-alex-editor-element="${this.key}"]`)
	}
	//获取前一个兄弟元素
	getPreviousElement() {
		if (this.isRoot()) {
			const index = AlexElement.elementStack.findIndex(item => {
				return this.isEqual(item)
			})
			if (index == 0) {
				return null
			}
			if (AlexElement.elementStack[index - 1].isEmpty()) {
				return AlexElement.elementStack[index - 1].getPreviousElement()
			}
			return AlexElement.elementStack[index - 1]
		} else {
			const index = this.parent.children.findIndex(item => {
				return this.isEqual(item)
			})
			if (index == 0) {
				return null
			}
			if (this.parent.children[index - 1].isEmpty()) {
				return this.parent.children[index - 1].getPreviousElement()
			}
			return this.parent.children[index - 1]
		}
	}
	//获取后一个兄弟元素
	getNextElement() {
		if (this.isRoot()) {
			const index = AlexElement.elementStack.findIndex(item => {
				return this.isEqual(item)
			})
			if (index == AlexElement.elementStack.length - 1) {
				return null
			}
			if (AlexElement.elementStack[index + 1].isEmpty()) {
				return AlexElement.elementStack[index + 1].getNextElement()
			}
			return AlexElement.elementStack[index + 1]
		} else {
			const index = this.parent.children.findIndex(item => {
				return this.isEqual(item)
			})
			if (index == this.parent.children.length - 1) {
				return null
			}
			if (this.parent.children[index + 1].isEmpty()) {
				return this.parent.children[index + 1].getNextElement()
			}
			return this.parent.children[index + 1]
		}
	}
	//渲染成真实dom
	renderElement() {
		//文本节点
		if (this.isText()) {
			return document.createTextNode(this.textContent)
		}
		const el = document.createElement(this.parsedom)
		//设置属性
		if (this.hasMarks()) {
			for (let key in this.marks) {
				el.setAttribute(key, this.marks[key])
			}
		}
		//设置样式
		if (this.hasStyles()) {
			for (let key in this.styles) {
				el.style.setProperty(key, this.styles[key])
			}
		}
		//渲染子元素
		if (this.hasChildren()) {
			for (let child of this.children) {
				let childElm = child.renderElement()
				el.appendChild(childElm)
			}
		}
		//设置唯一key标记
		el.setAttribute('data-alex-editor-element', this.key)
		return el
	}
	//添加到父元素指定位置
	addSelfTo(element, index) {
		if (!AlexElement.isElement(element)) {
			return
		}
		//当前元素无法添加到自闭合元素和文本元素中去
		if (element.isClosed() || element.isText()) {
			return
		}
		//块元素无法添加到非块元素下
		if (this.isBlock() && !element.isBlok()) {
			return
		}
		//如果有子元素
		if (element.hasChildren()) {
			if (index >= element.children.length) {
				element.children.push(this)
			} else {
				element.children.splice(index, 0, this)
			}
		} else {
			element.children = [this]
		}
		//更新该元素的parent字段
		this.parent = element
	}
	//添加到该元素之前
	addSelfBefore(element) {
		if (!AlexElement.isElement(element)) {
			return
		}
		if (element.isRoot()) {
			const index = AlexElement.elementStack.findIndex(el => {
				return element.isEqual(el)
			})
			AlexElement.elementStack.splice(index, 0, this)
			this.parent = null
		} else {
			const index = element.parent.children.findIndex(el => {
				return element.isEqual(el)
			})
			this.addSelfTo(element.parent, index)
		}
	}
	//添加到该元素之后
	addSelfAfter(element) {
		if (!AlexElement.isElement(element)) {
			return
		}
		if (element.isRoot()) {
			const index = AlexElement.elementStack.findIndex(el => {
				return element.isEqual(el)
			})
			if (index == AlexElement.elementStack.length - 1) {
				AlexElement.elementStack.push(this)
			} else {
				AlexElement.elementStack.splice(index + 1, 0, this)
			}
			this.parent = null
		} else {
			const index = element.parent.children.findIndex(el => {
				return element.isEqual(el)
			})
			this.addSelfTo(element.parent, index + 1)
		}
	}
	//克隆当前元素,deep为true表示深度克隆
	clone(deep = true) {
		let el = new AlexElement(this.type, this.parsedom, this.marks, this.styles, null, this.textContent)
		if (deep && this.hasChildren()) {
			this.children.forEach(child => {
				let clonedChild = child.clone(deep)
				if (el.hasChildren()) {
					el.children.push(clonedChild)
				} else {
					el.children = [clonedChild]
				}
				clonedChild.parent = el
			})
		}
		return el
	}
	//转换成block元素
	convertToBlock(blockName = 'p') {
		if (this.isBlock()) {
			return
		}
		let element = this.clone(true)
		if (this.isText()) {
			this.textContent = null
		}
		this.type = 'block'
		this.parsedom = blockName
		this.children = [element]
		element.parent = this
	}
	//合并块元素
	mergeBlock() {
		if (!this.isBlock()) {
			return
		}
		//获取前一个兄弟元素
		const previousElement = this.getPreviousElement()
		//如果存在，也必然是块元素
		if (previousElement) {
			previousElement.children.push(...this.children)
			previousElement.children.forEach(el => {
				el.parent = previousElement
			})
			if (this.isRoot()) {
				const index = AlexElement.elementStack.findIndex(el => {
					return this.isEqual(el)
				})
				AlexElement.elementStack.splice(index, 1)
			} else {
				const index = this.parent.children.findIndex(el => {
					return this.isEqual(el)
				})
				this.parent.children.splice(index, 1)
			}
		}
		//前一个兄弟元素不存在，则将自身与父元素合并
		else if (!this.isRoot()) {
			this.parent.children.push(...this.children)
			this.parent.children.forEach(el => {
				el.parent = this.parent
			})
			if (this.isRoot()) {
				const index = AlexElement.elementStack.findIndex(el => {
					return this.isEqual(el)
				})
				AlexElement.elementStack.splice(index, 1)
			} else {
				const index = this.parent.children.findIndex(el => {
					return this.isEqual(el)
				})
				this.parent.children.splice(index, 1)
			}
		}
	}
	//判断是否该类型数据
	static isElement(val) {
		return val instanceof AlexElement
	}
	//将dom转为AlexElement,rendRules用于自定义转换
	static parseNode(el, renderRules) {
		if (!(el instanceof Node)) {
			return null
		}
		//文本节点
		if (el.nodeType == 3) {
			let text = new AlexElement('text', null, null, null, null, el.nodeValue)
			text = AlexElement.renderRules(text)
			if (typeof renderRules == 'function') {
				text = renderRules(text)
			}
			return text
		}
		//非元素节点返回null
		if (el.nodeType != 1) {
			return null
		}
		//以下是元素节点的转换
		const marks = Util.getAttributes(el)
		const styles = Util.getStyles(el)
		//默认定义为块元素，标签名为小写
		let element = new AlexElement('block', el.nodeName.toLocaleLowerCase(), marks, styles, null, null)
		element = AlexElement.renderRules(element)
		if (typeof renderRules == 'function') {
			element = renderRules(element)
		}
		Array.from(el.childNodes).forEach(item => {
			const childElement = AlexElement.parseNode(item, renderRules)
			if (childElement) {
				childElement.parent = element
				if (element.hasChildren()) {
					element.children.push(childElement)
				} else {
					element.children = [childElement]
				}
			}
		})
		return element
	}
	//将html转为AlexElement,rendRules用于自定义转换
	static parseHtml(html, renderRules) {
		const el = document.createElement('div')
		el.innerHTML = html
		const data = AlexElement.parseNode(el, renderRules)
		return data.children.map(item => {
			item.parent = null
			return item
		})
	}
	//根据key查询
	static getElementByKey(key) {
		const searchFn = elements => {
			let element = null
			for (let ele of elements) {
				if (ele.key == key) {
					element = ele
					break
				}
				if (ele.hasChildren()) {
					element = searchFn(ele.children)
					if (element) {
						break
					}
				}
			}
			return element
		}
		return searchFn(AlexElement.elementStack)
	}
	//扁平化处理
	static flatElements(elements) {
		const flat = arr => {
			let result = []
			arr.forEach(element => {
				result.push(element)
				if (element.hasChildren()) {
					let arr = flat(element.children)
					result = [...result, ...arr]
				}
			})
			return result
		}
		if (elements) {
			return flat(elements)
		}
		return flat(AlexElement.elementStack)
	}
	//内部定义的转换规则，可以被renderRules属性覆盖
	static renderRules(element) {
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
			case 'input':
				element.type = 'inline'
				element.parsedom = 'span'
				break
			default:
				break
		}
		return element
	}
	//格式化原始的alexElement数组(这里面的规则不可改动)
	static formatElements() {
		//格式化
		const format = element => {
			//从子孙元素开始格式化
			if (element.hasChildren()) {
				element.children = element.children.map(format)
			}
			//格式化自身
			AlexElement.formatUnchangeableRules.forEach(fn => {
				//这里的element是每一个fn执行后的结果，需要考虑到可能被置为了null
				if (element) {
					element = fn(element)
				}
			})
			return element
		}
		//移除null
		const removeNull = element => {
			if (element) {
				if (element.hasChildren()) {
					element.children.forEach(el => {
						if (el) {
							el = removeNull(el)
						}
					})
					element.children = element.children.filter(el => {
						return !!el
					})
				}
			}
			return element
		}
		AlexElement.elementStack = AlexElement.elementStack
			.map(el => {
				//转为块元素
				el.convertToBlock()
				//格式化
				el = format(el)
				//format会导致null出现，这里需要移除null
				el = removeNull(el)
				return el
			})
			.filter(el => {
				//移除根部的null元素
				return !!el
			})
	}
	//校验函数数组，用于格式化
	static formatUnchangeableRules = [
		//移除节点规则
		function (element) {
			//空节点移除
			if (element.isEmpty()) {
				element = null
			}
			return element
		},
		//子元素中换行符和非换行符元素不可同时存在
		function (element) {
			if (element.hasChildren()) {
				//是否有换行符
				let hasBreak = element.children.some(el => {
					if (el) {
						return el.isBreak()
					}
					return false
				})
				//是否有其他元素
				let hasOther = element.children.some(el => {
					if (el) {
						return !el.isBreak()
					}
					return false
				})
				//既有换行符也有其他元素则把换行符元素都置为null
				if (hasBreak && hasOther) {
					element.children = element.children.map(el => {
						if (el && el.isBreak()) {
							return null
						}
						return el
					})
				}
				//只有换行符且不止一个
				else if (hasBreak && element.children.length > 1) {
					element.children = [element.children[0]]
				}
			}
			return element
		},
		//同级元素如果存在block，则其他元素也必须是block
		function (element) {
			if (element.hasChildren()) {
				let hasBlock = element.children.some(el => {
					if (el) {
						return el.isBlock()
					}
					return false
				})
				if (hasBlock) {
					element.children.forEach(el => {
						if (el) {
							el.convertToBlock()
						}
					})
				}
			}
			return element
		}
	]
	//存放编辑器的alexElement数组
	static elementStack = []
}

export default AlexElement
