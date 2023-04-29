import AlexElement from './Element'

class AlexRange {
	constructor(el, anchor, focus) {
		this.$el = el
		this.anchor = anchor
		this.focus = focus
	}

	//插入文本
	insert(data) {
		//对空格进行处理
		data = data.replace(/\s+/g, val => {
			return '&nbsp;'
		})
	}

	//删除内容
	delete() {}

	//设置真实的光标
	setCusor() {
		//设置光标之前需要将两个点合二为一
		if (!this.anchor.isEqual(this.focus)) {
			return
		}
		const selection = window.getSelection()
		const node = this.focus.element.getRealNode(this.$el)
		selection.collapse(node, this.focus.offset)
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
