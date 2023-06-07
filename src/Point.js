import AlexElement from './Element'
class AlexPoint {
	constructor(element, offset) {
		//可以是任意元素
		this.element = element
		//如果是文本元素则表示光标在文本值中的序列，如果是其他元素，则只会是0或1
		this.offset = offset
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
		//如果该元素是不可编辑的
		if (element.isUneditable()) {
			this.element = element.getUneditableElement()
			this.offset = 1
		}
		//如果是文本元素
		else if (element.isText()) {
			this.element = element
			this.offset = element.textContent.length
		}
		//其他元素
		else {
			this.element = element
			this.offset = 1
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
		//如果该元素是不可编辑的
		if (element.isUneditable()) {
			this.element = element.getUneditableElement()
			this.offset = 0
		}
		//其他
		else {
			this.element = element
			this.offset = 0
		}
	}
}

export default AlexPoint
