import AlexElement from './Element'

class AlexRange {
	constructor(anchor, focus) {
		this.anchor = anchor
		this.focus = focus
	}

	//设置真实的光标
	setCursor() {
		let anchorNode = null
		let anchorOffset = null
		let focusNode = null
		let focusOffset = null
		//自闭合文本需要特殊处理
		if (this.anchor.element.isClosed()) {
			anchorNode = this.anchor.element.parent._elm
			const index = this.anchor.element.parent.children.findIndex(el => {
				return this.anchor.element.isEqual(el)
			})
			anchorOffset = this.anchor.offset == 1 ? index + 1 : index
		} else {
			anchorNode = this.anchor.element._elm
			anchorOffset = this.anchor.offset
		}
		//自闭合文本需要特殊处理
		if (this.focus.element.isClosed()) {
			focusNode = this.focus.element.parent._elm
			const index = this.focus.element.parent.children.findIndex(el => {
				return this.focus.element.isEqual(el)
			})
			focusOffset = this.focus.offset == 1 ? index + 1 : index
		} else {
			focusNode = this.focus.element._elm
			focusOffset = this.focus.offset
		}
		const selection = window.getSelection()
		selection.removeAllRanges()
		const range = document.createRange()
		range.setStart(anchorNode, anchorOffset)
		range.setEnd(focusNode, focusOffset)
		selection.addRange(range)
	}
}

export default AlexRange
