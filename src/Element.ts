import { common as DapCommon, data as DapData } from 'dap-util'
import { createUniqueKey, isSpaceText, cloneData, ObjectType } from './core/tool'

//元素类型
export type AlexElementType = 'block' | 'inblock' | 'inline' | 'text' | 'closed'

/**
 * 编辑器元素对象
 */
export class AlexElement {
	//key值
	key: number = createUniqueKey()
	//类型
	type: AlexElementType
	//真实节点名称
	parsedom: string | null
	//标记集合
	marks: ObjectType | null
	//样式集合
	styles: ObjectType | null
	//文本值
	textContent: string | null
	//子元素
	children: AlexElement[] | null = null
	//父元素
	parent: AlexElement | null = null
	//定义内部块元素的行为
	behavior: 'default' | 'block' = 'default'
	//命名空间(用于创建dom)
	namespace: string | null = null
	//是否锁定，此值为true表示元素不会被规则进行自动合并
	locked: boolean = false
	//真实node
	elm: HTMLElement | null = null

	constructor(type: AlexElementType, parsedom: string | null, marks: ObjectType | null, styles: ObjectType | null, textContent: string | null) {
		this.type = type
		this.parsedom = parsedom
		this.marks = marks
		this.styles = styles
		this.textContent = textContent
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
	isEmpty(): boolean {
		//文本元素
		if (this.isText()) {
			return !this.textContent
		}
		//根级块元素、内部块元素、行内元素
		if (this.isBlock() || this.isInblock() || this.isInline()) {
			if (!this.hasChildren()) {
				return true
			}
			const allEmpty: boolean = this.children!.every(el => {
				return el.isEmpty()
			})
			return allEmpty
		}
		return false
	}

	/**
	 * 是否零宽度无断空白元素
	 */
	isSpaceText() {
		return this.isText() && !this.isEmpty() && isSpaceText(this.textContent!)
	}

	/**
	 * 获取不可编辑的元素，如果是null，说明元素是可编辑的
	 */
	getUneditableElement(): AlexElement | null {
		if (this.hasMarks() && this.marks!['contenteditable'] == 'false') {
			return this
		}
		if (this.isBlock()) {
			return null
		}
		return this.parent!.getUneditableElement()
	}

	/**
	 * 比较当前元素和另一个元素是否相等
	 */
	isEqual(element: AlexElement) {
		if (!AlexElement.isElement(element)) {
			return false
		}
		return this.key == element.key
	}

	/**
	 * 判断当前元素是否包含另一个元素
	 */
	isContains(element: AlexElement): boolean {
		if (this.isEqual(element)) {
			return true
		}
		if (element.isBlock()) {
			return false
		}
		return this.isContains(element.parent!)
	}

	/**
	 * 判断当前元素的子元素数组是否只包含换行符
	 */
	isOnlyHasBreak() {
		if (this.hasChildren()) {
			//子元素中存在换行符
			const hasBreak = this.children!.some(item => {
				return item.isBreak()
			})
			//子元素中每个元素都是换行符或者空元素
			const isAll = this.children!.every(item => {
				return item.isBreak() || item.isEmpty()
			})
			return hasBreak && isAll
		}
		return false
	}

	/**
	 * 判断当前元素是否在拥有代码块样式的块内（包括自身）
	 */
	isPreStyle(): boolean {
		const block = this.getBlock()
		const inblock = this.getInblock()
		//在内部块里
		if (inblock) {
			if (inblock.parsedom == 'pre') {
				return true
			}
			if (inblock.hasStyles() && (inblock.styles!['white-space'] == 'pre' || inblock.styles!['white-space'] == 'pre-wrap')) {
				return true
			}
			return inblock.parent!.isPreStyle()
		}
		//在根级块内
		else {
			if (block.parsedom == 'pre') {
				return true
			}
			if (block.hasStyles() && (block.styles!['white-space'] == 'pre' || block.styles!['white-space'] == 'pre-wrap')) {
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
		if (DapCommon.isObject(this.marks)) {
			return !DapCommon.isEmptyObject(this.marks)
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
		if (DapCommon.isObject(this.styles)) {
			return !DapCommon.isEmptyObject(this.styles)
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
	hasContains(element: AlexElement) {
		return this.isContains(element) || element.isContains(this)
	}

	/**
	 * 克隆当前元素
	 * deep为true表示深度克隆，即克隆子元素，否则只会克隆自身
	 */
	clone(deep: boolean | undefined = true) {
		if (typeof deep != 'boolean') {
			throw new Error('The parameter must be a Boolean')
		}
		let el = new AlexElement(this.type, this.parsedom, cloneData(this.marks), cloneData(this.styles), this.textContent)
		el.behavior = this.behavior
		el.namespace = this.namespace
		el.locked = this.locked
		if (deep && this.hasChildren()) {
			this.children!.forEach(child => {
				let clonedChild = child.clone(deep)
				if (el.hasChildren()) {
					el.children!.push(clonedChild)
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
			this.namespace = null
			this.locked = false
			return
		}
		if (this.isClosed()) {
			this.type = 'text'
			this.parsedom = null
			this.marks = null
			this.styles = null
			this.textContent = null
			this.elm = null
			this.namespace = null
			this.locked = false
			return
		}
		if (this.hasChildren()) {
			this.children!.forEach(el => {
				el.toEmpty()
			})
		}
	}

	/**
	 * 获取所在根级块元素
	 */
	getBlock(): AlexElement {
		if (this.isBlock()) {
			return this
		}
		return this.parent!.getBlock()
	}

	/**
	 * 获取所在内部块元素
	 */
	getInblock(): AlexElement | null {
		if (this.isInblock()) {
			return this
		}
		if (this.isBlock()) {
			return null
		}
		return this.parent!.getInblock()
	}

	/**
	 * 获取所在行内元素
	 */
	getInline(): AlexElement | null {
		if (this.isInline()) {
			return this
		}
		if (this.isBlock()) {
			return null
		}
		return this.parent!.getInline()
	}

	/**
	 * 比较当前元素和另一个元素的styles是否一致
	 */
	isEqualStyles(element: AlexElement) {
		if (!this.hasStyles() && !element.hasStyles()) {
			return true
		}
		if (this.hasStyles() && element.hasStyles() && DapCommon.equal(this.styles, element.styles)) {
			return true
		}
		return false
	}

	/**
	 * 比较当前元素和另一个元素的marks是否一致
	 */
	isEqualMarks(element: AlexElement) {
		if (!this.hasMarks() && !element.hasMarks()) {
			return true
		}
		if (this.hasMarks() && element.hasMarks() && DapCommon.equal(this.marks, element.marks)) {
			return true
		}
		return false
	}

	/**
	 * 如果当前元素是文本元素或者自闭合元素，判断它是不是指定元素的后代所有文本元素和自闭合元素中的第一个
	 */
	isFirst(element: AlexElement) {
		//如果不是自闭合元素和文本元素返回false
		if (!this.isText() && !this.isClosed()) {
			return false
		}
		//如果是同一个元素返回false
		if (element.isEqual(this)) {
			return false
		}
		//如果目标元素包含当前元素
		if (element.isContains(this)) {
			const elements = AlexElement.flatElements(element.children!).filter(el => {
				return el.isText() || el.isClosed()
			})
			return this.isEqual(elements[0])
		}
		return false
	}

	/**
	 * 如果当前元素是文本元素或者自闭合元素，判断它是不是指定元素的后代所有文本元素和自闭合元素中的最后一个
	 */
	isLast(element: AlexElement) {
		//如果不是自闭合元素和文本元素返回false
		if (!this.isText() && !this.isClosed()) {
			return false
		}
		//如果是同一个元素返回false
		if (element.isEqual(this)) {
			return false
		}
		//如果目标元素包含当前元素
		if (element.isContains(this)) {
			const elements = AlexElement.flatElements(element.children!).filter(el => {
				return el.isText() || el.isClosed()
			})
			const length = elements.length
			return this.isEqual(elements[length - 1])
		}
		return false
	}

	/**
	 * 将元素渲染成真实的node并挂载在元素的elm属性上
	 */
	__render() {
		let el: HTMLElement | null = null
		//文本元素
		if (this.isText()) {
			if (this.namespace) {
				el = document.createElementNS(this.namespace, AlexElement.TEXT_NODE) as HTMLElement
			} else {
				el = document.createElement(AlexElement.TEXT_NODE)
			}
			const text = document.createTextNode(this.textContent!)
			el.appendChild(text)
		}
		//非文本元素
		else {
			if (this.namespace) {
				el = document.createElementNS(this.namespace, this.parsedom!) as HTMLElement
			} else {
				el = document.createElement(this.parsedom!)
			}
			//渲染子元素
			if (this.hasChildren()) {
				this.children!.forEach(child => {
					child.__render()
					el!.appendChild(child.elm as Node)
				})
			}
		}
		//设置属性
		if (this.hasMarks()) {
			Object.keys(this.marks!).forEach(key => {
				if (!/(^on)|(^style$)|(^face$)/g.test(key)) {
					el!.setAttribute(key, this.marks![key]!)
				}
			})
		}
		//设置样式
		if (this.hasStyles()) {
			Object.keys(this.styles!).forEach(key => {
				el!.style.setProperty(key, this.styles![key]!)
			})
		}
		//设置唯一key标记
		DapData.set(el, 'data-alex-editor-key', this.key)
		//更新挂载的真实dom
		this.elm = el
	}

	/**
	 * 完全复制元素，包括key也复制
	 */
	__fullClone() {
		let el = new AlexElement(this.type, this.parsedom, cloneData(this.marks), cloneData(this.styles), this.textContent)
		el.behavior = this.behavior
		el.namespace = this.namespace
		el.locked = this.locked
		el.key = this.key
		el.elm = this.elm
		if (this.hasChildren()) {
			this.children!.forEach(child => {
				let clonedChild = child.__fullClone()
				if (el.hasChildren()) {
					el.children!.push(clonedChild)
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
	static isElement(val: any) {
		return val instanceof AlexElement
	}

	/**
	 * 扁平化处理元素数组
	 */
	static flatElements(elements: AlexElement[]) {
		const fn = (arr: AlexElement[]) => {
			let result: AlexElement[] = []
			const length = arr.length
			for (let i = 0; i < length; i++) {
				if (arr[i]) {
					result.push(arr[i])
					if (arr[i].hasChildren()) {
						const childResult = fn(arr[i].children!)
						result.push(...childResult)
					}
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

	/**
	 * 定义需要置空的元素标签
	 */
	static EMPTY_NODES = ['meta', 'link', 'style', 'script', 'title', 'base', 'noscript', 'template', 'annotation']
}
