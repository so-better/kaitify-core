import AlexElement from './Element'
class AlexPoint {
	constructor(element, offset) {
		//虚拟光标对应的元素
		this.element = element
		//虚拟光标在元素中的偏移值
		this.offset = offset
		//初始设置
		if (this.element.isText() || this.element.isClosed()) {
			if (AlexElement.VOID_NODES.includes(this.element.parsedom)) {
				throw new Error('Invisible element cannot be set as focal point')
			}
			return
		}
		//如果是根级块元素或者内部块元素或者行内元素
		if (this.offset == 0) {
			this.moveToStart(this.element)
		} else {
			this.moveToEnd(this.element)
		}
	}

	/**
	 * 是否Point类型数据
	 */
	static isPoint(val) {
		return val instanceof AlexPoint
	}

	/**
	 * 两个点是否相等
	 */
	isEqual(point) {
		if (!AlexPoint.isPoint(point)) {
			return false
		}
		return this.element.isEqual(point.element) && this.offset == point.offset
	}

	/**
	 * 移动到到指定元素最后
	 */
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
			if (AlexElement.VOID_NODES.includes(element.parsedom)) {
				throw new Error('Invisible element cannot be set as focal point')
			}
			this.element = element
			this.offset = 1
		}
		//如果含有子元素
		else if (element.hasChildren()) {
			const flatElements = AlexElement.flatElements(element.children).filter(el => {
				return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom)
			})
			const length = flatElements.length
			if (length == 0) {
				throw new Error('There is no element to set the focus')
			}
			this.moveToEnd(flatElements[length - 1])
		}
	}

	/**
	 * 移动到指定元素最前
	 */
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
			if (AlexElement.VOID_NODES.includes(element.parsedom)) {
				throw new Error('Invisible element cannot be set as focal point')
			}
			this.element = element
			this.offset = 0
		}
		//如果含有子元素
		else if (element.hasChildren()) {
			const flatElements = AlexElement.flatElements(element.children).filter(el => {
				return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom)
			})
			if (flatElements.length == 0) {
				throw new Error('There is no element to set the focus')
			}
			this.moveToStart(flatElements[0])
		}
	}
}

export default AlexPoint
