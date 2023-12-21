import Dap from 'dap-util'
import { createUniqueKey, isSpaceText, cloneData } from './core/tool'
/**
 * 编辑器元素对象
 */
class AlexElement {
	constructor(type, parsedom, marks, styles, textContent) {
		//key值
		this.key = createUniqueKey()
		//类型 block/inblock/inline/text/closed
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
		//定义内部块元素的行为 default/block
		this.behavior = 'default'
		//真实node
		this.elm = null
	}

	/**
	 * 是否根级块元素
	 */
	isBlock() {
		return this.type == 'block'
	}

	/**
	 * 是否内部块元素
	 */
	isInblock() {
		return this.type == 'inblock'
	}

	/**
	 * 是否行内元素
	 */
	isInline() {
		return this.type == 'inline'
	}

	/**
	 * 是否自闭合元素
	 */
	isClosed() {
		return this.type == 'closed'
	}

	/**
	 * 是否文本元素
	 */
	isText() {
		return this.type == 'text'
	}

	/**
	 * 是否换行符
	 */
	isBreak() {
		return this.isClosed() && this.parsedom == 'br'
	}

	/**
	 * 是否空元素
	 */
	isEmpty() {
		//文本元素
		if (this.isText()) {
			return !this.textContent
		}
		//根级块元素、内部块元素、行内元素
		if (this.isBlock() || this.isInblock() || this.isInline()) {
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

	/**
	 * 是否零宽度无断空白元素
	 */
	isSpaceText() {
		return this.isText() && !this.isEmpty() && isSpaceText(this.textContent)
	}

	/**
	 * 获取设置不可编辑的元素，如果是null，说明元素是可编辑的
	 */
	getUneditableElement() {
		if (this.hasMarks() && this.marks['contenteditable'] == 'false') {
			return this
		}
		if (this.isBlock()) {
			return null
		}
		return this.parent.getUneditableElement()
	}

	/**
	 * 比较当前元素和另一个元素是否相等
	 */
	isEqual(element) {
		if (!AlexElement.isElement(element)) {
			return false
		}
		return this.key == element.key
	}

	/**
	 * 判断当前元素是否包含另一个元素
	 */
	isContains(element) {
		if (this.isEqual(element)) {
			return true
		}
		if (element.isBlock()) {
			return false
		}
		return this.isContains(element.parent)
	}

	/**
	 * 判断当前元素的子元素数组是否只包含换行符
	 */
	isOnlyHasBreak() {
		if (this.hasChildren()) {
			return this.children.every(item => {
				return item.isBreak() || item.isEmpty()
			})
		}
		return false
	}

	/**
	 * 判断当前元素是否在拥有代码块样式的块内（包括自身）
	 */
	isPreStyle() {
		const block = this.getBlock()
		const inblock = this.getInblock()
		//在内部块里
		if (inblock) {
			if (inblock.parsedom == 'pre') {
				return true
			}
			if (inblock.hasStyles() && (inblock.styles['white-space'] == 'pre' || inblock.styles['white-space'] == 'pre-wrap')) {
				return true
			}
			return inblock.parent.isPreStyle()
		}
		//在根级块内
		else {
			if (block.parsedom == 'pre') {
				return true
			}
			if (block.hasStyles() && (block.styles['white-space'] == 'pre' || block.styles['white-space'] == 'pre-wrap')) {
				return true
			}
			return false
		}
	}

	/**
	 * 是否含有标记
	 */
	hasMarks() {
		if (!this.marks) {
			return false
		}
		if (Dap.common.isObject) {
			return !Dap.common.isEmptyObject(this.marks)
		}
		return false
	}

	/**
	 * 是否含有样式
	 */
	hasStyles() {
		if (!this.styles) {
			return false
		}
		if (Dap.common.isObject(this.styles)) {
			return !Dap.common.isEmptyObject(this.styles)
		}
		return false
	}

	/**
	 * 是否有子元素
	 */
	hasChildren() {
		if (this.isClosed() || this.isText()) {
			return false
		}
		if (Array.isArray(this.children)) {
			return !!this.children.length
		}
		return false
	}

	/**
	 * 判断当前元素与另一个元素是否有包含关系
	 */
	hasContains(element) {
		return this.isContains(element) || element.isContains(this)
	}

	/**
	 * 克隆当前元素
	 * deep为true表示深度克隆，即克隆子元素，否则只会克隆自身
	 */
	clone(deep = true) {
		if (typeof deep != 'boolean') {
			throw new Error('The parameter must be a Boolean')
		}
		let el = new AlexElement(this.type, this.parsedom, cloneData(this.marks), cloneData(this.styles), this.textContent)
		el.behavior = this.behavior
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

	/**
	 * 将当前元素转换成根级块元素
	 */
	convertToBlock() {
		if (this.isBlock()) {
			return
		}
		let element = this.clone()
		this.type = 'block'
		this.parsedom = AlexElement.BLOCK_NODE
		this.marks = null
		this.styles = null
		this.textContent = null
		this.children = [element]
		element.parent = this
	}

	/**
	 * 设置为空元素
	 * @returns
	 */
	toEmpty() {
		if (this.isEmpty()) {
			return
		}
		if (this.isText()) {
			this.marks = null
			this.styles = null
			this.textContent = null
			this.elm = null
			return
		}
		if (this.isClosed()) {
			this.type = 'text'
			this.parsedom = null
			this.marks = null
			this.styles = null
			this.textContent = null
			this.elm = null
			return
		}
		if (this.hasChildren()) {
			this.children.forEach(el => {
				el.toEmpty()
			})
		}
	}

	/**
	 * 获取所在根级块元素
	 */
	getBlock() {
		if (this.isBlock()) {
			return this
		}
		return this.parent.getBlock()
	}

	/**
	 * 获取所在内部块元素
	 */
	getInblock() {
		if (this.isInblock()) {
			return this
		}
		if (this.isBlock()) {
			return null
		}
		return this.parent.getInblock()
	}

	/**
	 * 获取所在行内元素
	 */
	getInline() {
		if (this.isInline()) {
			return this
		}
		if (this.isBlock()) {
			return null
		}
		return this.parent.getInline()
	}

	/**
	 * 比较当前元素和另一个元素的styles是否一致
	 */
	isEqualStyles(element) {
		if (!this.hasStyles() && !element.hasStyles()) {
			return true
		}
		if (this.hasStyles() && element.hasStyles() && Dap.common.equal(this.styles, element.styles)) {
			return true
		}
		return false
	}

	/**
	 * 比较当前元素和另一个元素的marks是否一致
	 */
	isEqualMarks(element) {
		if (!this.hasMarks() && !element.hasMarks()) {
			return true
		}
		if (this.hasMarks() && element.hasMarks() && Dap.common.equal(this.marks, element.marks)) {
			return true
		}
		return false
	}

	/**
	 * 将元素渲染成真实的node并挂载在元素的elm属性上
	 */
	__render() {
		let el = null
		//文本元素
		if (this.isText()) {
			el = document.createElement(AlexElement.TEXT_NODE)
			const text = document.createTextNode(this.textContent)
			el.appendChild(text)
		}
		//非文本元素
		else {
			el = document.createElement(this.parsedom)
			//渲染子元素
			if (this.hasChildren()) {
				this.children.forEach(child => {
					child.__render()
					el.appendChild(child.elm)
				})
			}
		}
		//设置属性
		if (this.hasMarks()) {
			Object.keys(this.marks).forEach(key => {
				if (!/(^on)|(^style$)|(^face$)/g.test(key)) {
					el.setAttribute(key, this.marks[key])
				}
			})
		}
		//设置样式
		if (this.hasStyles()) {
			Object.keys(this.styles).forEach(key => {
				el.style.setProperty(key, this.styles[key])
			})
		}
		//设置唯一key标记
		Dap.data.set(el, 'data-alex-editor-key', this.key)
		//更新挂载的真实dom
		this.elm = el
	}

	/**
	 * 完全复制元素，包括key也复制
	 */
	__fullClone() {
		let el = new AlexElement(this.type, this.parsedom, cloneData(this.marks), cloneData(this.styles), this.textContent)
		el.behavior = this.behavior
		el.key = this.key
		el.elm = this.elm
		if (this.hasChildren()) {
			this.children.forEach(child => {
				let clonedChild = child.__fullClone()
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

	/**
	 * 判断参数是否为AlexElement元素
	 */
	static isElement(val) {
		return val instanceof AlexElement
	}

	/**
	 * 扁平化处理元素数组
	 */
	static flatElements(elements) {
		const fn = arr => {
			let result = []
			const length = arr.length
			for (let i = 0; i < length; i++) {
				result.push(arr[i])
				if (arr[i].hasChildren()) {
					const childResult = fn(arr[i].children)
					result.push(...childResult)
				}
			}
			return result
		}
		return fn(elements)
	}

	/**
	 * 创建一个空白文本元素并返回
	 */
	static getSpaceElement() {
		return new AlexElement('text', null, null, null, '\uFEFF')
	}

	/**
	 * 定义默认的根级块元素标签
	 */
	static BLOCK_NODE = 'p'

	/**
	 * 定义默认的文本元素标签
	 */
	static TEXT_NODE = 'span'

	/**
	 * 定义不显示的元素标签
	 */
	static VOID_NODES = ['colgroup', 'col']
}

export default AlexElement
