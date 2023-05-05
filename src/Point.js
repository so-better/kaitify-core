import AlexElement from './Element'
class AlexPoint {
	constructor(node, offset) {
		this.element = null
		this.offset = 0
		if (node) {
			this.init(node, offset)
		}
	}

	//初始化
	init(node, offset) {
		//文本节点
		if (node.nodeType == 3) {
			const key = node.parentNode.getAttribute('data-alex-editor-element')
			const element = AlexElement.getElementByKey(key)
			const index = Array.from(node.parentNode.childNodes).findIndex(el => {
				return el === node
			})
			this.element = element.children[index]
			this.offset = offset
		}
		//元素节点
		else if (node.nodeType == 1) {
			const key = node.getAttribute('data-alex-editor-element')
			const element = AlexElement.getElementByKey(key)
			if (element.hasChildren()) {
				if (element.children[offset]) {
					this.element = element.children[offset]
					this.offset = 0
				} else {
					this.element = element.children[offset - 1]
					this.offset = 1
				}
			} else {
				this.element = element
				this.element = 0
			}
		}
	}

	//是否Point类型数据
	static isPoint(val) {
		return val instanceof AlexPoint
	}

	//两个点是否相等
	isEqual(point) {
		if (!AlexPoint.isPoint(point)) {
			return false
		}
		return this.element.isEqual(point.element) && this.offset == point.offset
	}

	//移动到到指定元素最后
	moveToEnd(element) {
		if (!AlexElement.isElement(element)) {
			return
		}
		if (element.isEmpty()) {
			return
		}
		//如果是文本
		if (element.isText()) {
			this.element = element
			this.offset = element.textContent.length
		}
		//如果是自闭合元素
		else if (element.isClosed()) {
			this.element = element
			this.offset = 1
		}
		//如果含有子元素
		else if (element.hasChildren()) {
			const flatElements = AlexElement.flatElements(element.children).filter(el => {
				return !el.isEmpty()
			})
			const length = flatElements.length
			this.moveToEnd(flatElements[length - 1])
		}
	}

	//移动到指定元素最前
	moveToStart(element) {
		if (!AlexElement.isElement(element)) {
			return
		}
		if (element.isEmpty()) {
			return
		}
		//文本元素
		if (element.isText()) {
			this.element = element
			this.offset = 0
		}
		//自闭合元素
		else if (element.isClosed()) {
			this.element = element
			this.offset = 0
		}
		//如果含有子元素
		else if (element.hasChildren()) {
			const flatElements = AlexElement.flatElements(element.children).filter(el => {
				return !el.isEmpty()
			})
			this.moveToStart(flatElements[0])
		}
	}

	//获取该点所在的块元素
	getBlock() {
		const fn = element => {
			if (element.isBlock()) {
				return element
			}
			return fn(element.parent)
		}
		return fn(this.element)
	}

	//获取该点所在的行内元素
	getInline() {
		const fn = element => {
			if (element.isInline()) {
				return element
			}
			return fn(element.parent)
		}
		return fn(this.element)
	}

	//向上查询可以设置光标的元素
	getPreviousElement() {
		const flatElements = AlexElement.flatElements()
		const fn = element => {
			const index = flatElements.findIndex(el => {
				return element.isEqual(el)
			})
			if (index == 0) {
				return null
			}
			let ele = flatElements[index - 1]
			if ((ele.isText() || ele.isClosed()) && !ele.isEmpty()) {
				return ele
			}
			return fn(ele)
		}
		return fn(this.element)
	}

	//向下查找可以设置光标的元素
	getNextElement() {
		const flatElements = AlexElement.flatElements()
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
		return fn(this.element)
	}
}

export default AlexPoint
