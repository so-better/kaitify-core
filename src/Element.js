import Dap from 'dap-util'
import Util from './Util'

class AlexElement {
	constructor(type, parsedom, marks, styles, textContent) {
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
		//文本值
		this.textContent = textContent
		//子元素
		this.children = null
		//父元素
		this.parent = null
		//真实dom
		this._elm = null
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
	//是否空元素
	isEmpty() {
		//文本节点没有值即为空
		if (this.isText() && !this.textContent) {
			return true
		}
		//行内和块元素没有子元素即为空
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
	//是否零宽度无断空白元素
	isSpaceText() {
		return this.isText() && !this.isEmpty() && Util.isSpaceText(this.textContent)
	}
	//是否根元素
	isRoot() {
		return !this.parent
	}
	//判断两个Element是否相等
	isEqual(element) {
		if (!AlexElement.isElement(element)) {
			return false
		}
		return this.key == element.key
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
	//判断是否只包含换行符
	isOnlyHasBreak() {
		if (this.hasChildren()) {
			return this.children.every(item => {
				return item.isBreak() || item.isEmpty()
			})
		}
		return false
	}
	//是否代码块样式
	isPreStyle() {
		if (!this.isBlock()) {
			return false
		}
		return this.hasStyles() && (this.styles['white-space'] == 'pre' || this.styles['white-space'] == 'pre-wrap')
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
		if (!this.marks) {
			return false
		}
		if (Dap.common.isObject) {
			return !Dap.common.isEmptyObject(this.marks)
		}
		return false
	}
	//是否含有样式
	hasStyles() {
		if (!this.styles) {
			return false
		}
		if (Dap.common.isObject(this.styles)) {
			return !Dap.common.isEmptyObject(this.styles)
		}
		return false
	}
	//是否有子元素
	hasChildren() {
		if (this.isClosed() || this.isText()) {
			return false
		}
		if (Array.isArray(this.children)) {
			return !!this.children.length
		}
		return false
	}
	//克隆当前元素,deep为true表示深度克隆
	clone(deep = true) {
		if (typeof deep != 'boolean') {
			throw new Error('The parameter must be a Boolean')
		}
		let el = new AlexElement(this.type, this.parsedom, Util.clone(this.marks), Util.clone(this.styles), this.textContent)
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
	convertToBlock() {
		if (this.isBlock()) {
			throw new Error('This element is already of type "block"')
		}
		let element = this.clone()
		this.type = 'block'
		this.parsedom = AlexElement.PARAGRAPH_NODE
		this.marks = null
		this.styles = null
		this.textContent = null
		this.children = [element]
		element.parent = this
	}
	//设置为空元素
	toEmpty() {
		if (this.isEmpty()) {
			return
		}
		if (this.isText()) {
			this.textContent = null
		} else if (this.isClosed()) {
			this.type = 'inline'
			this.parsedom = 'span'
			this.children = null
		} else if (this.isBlock() || this.isInline()) {
			this.children = null
		}
	}
	//获取所在块元素
	getBlock() {
		if (this.isBlock()) {
			return this
		}
		return this.parent.getBlock()
	}
	//获取所在行内元素
	getInline() {
		if (this.isInline()) {
			return this
		}
		if (this.isRoot()) {
			return null
		}
		return this.parent.getInline()
	}
	//比较两个元素样式是否一致
	isEqualStyles(element) {
		if (!this.hasStyles() && !element.hasStyles()) {
			return true
		}
		if (this.hasStyles() && element.hasStyles() && Dap.common.equal(this.styles, element.styles)) {
			return true
		}
		return false
	}
	//比较两个元素属性是否一致
	isEqualMarks(element) {
		if (!this.hasMarks() && !element.hasMarks()) {
			return true
		}
		if (this.hasMarks() && element.hasMarks() && Dap.common.equal(this.marks, element.marks)) {
			return true
		}
		return false
	}
	//渲染成真实dom
	_renderElement() {
		let el = null
		//文本元素
		if (this.isText()) {
			el = document.createElement(AlexElement.TEXT_NODE)
			el.innerHTML = this.textContent
		}
		//非文本元素
		else {
			el = document.createElement(this.parsedom)
			//渲染子元素
			if (this.hasChildren()) {
				for (let child of this.children) {
					child._renderElement()
					el.appendChild(child._elm)
				}
			}
		}
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
		//设置唯一key标记
		Dap.data.set(el, 'data-alex-editor-key', this.key)
		//更新挂载的真实dom
		this._elm = el
	}
	//定义段落标签
	static PARAGRAPH_NODE = 'p'
	//定义文本标签
	static TEXT_NODE = 'span'
	//判断是否该类型数据
	static isElement(val) {
		return val instanceof AlexElement
	}
	//扁平化处理元素数组
	static flatElements(elements) {
		const flat = arr => {
			let result = []
			arr.forEach(element => {
				if (AlexElement.isElement(element)) {
					result.push(element)
					if (element.hasChildren()) {
						let arr = flat(element.children)
						result = [...result, ...arr]
					}
				}
			})
			return result
		}
		return flat(elements)
	}
	//获取一个空白字符元素，用来占位防止行内元素没有内容被删除
	static getSpaceElement() {
		return new AlexElement('text', null, null, null, '\uFEFF')
	}
}

export default AlexElement
