import AlexElement from './Element'
class AlexPoint {
	constructor(element, offset) {
		this.element = element
		this.offset = offset
		this._init()
	}

	//初始化
	_init() {
		//如果是文本元素
		if (this.element.isText()) {
			return
		}
		//如果是块元素或者行内元素
		if (this.element.hasChildren()) {
			if (this.element.children[this.offset]) {
				this.element = this.element.children[this.offset]
				this.offset = 0
			} else {
				this.element = this.element.children[this.offset - 1]
				this.offset = 1
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
			throw new Error('The argument must be an AlexElement instance')
		}
		if (element.isEmpty()) {
			throw new Error('The argument cannot be an empty element')
		}
		//如果是文本元素
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
			throw new Error('The argument must be an AlexElement instance')
		}
		if (element.isEmpty()) {
			throw new Error('The argument cannot be an empty element')
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
}

export default AlexPoint
