import { common as DapCommon, data as DapData } from 'dap-util'
import { createUniqueKey, isSpaceText, ObjectType } from './core/tool'

/**
 * 元素类型
 */
export type AlexElementType = 'block' | 'inblock' | 'inline' | 'text' | 'closed'

/**
 * 创建元素的入参类型
 */
export type AlexElementCreateConfigType = {
	type: AlexElementType
	parsedom?: string | null
	marks?: ObjectType | null
	styles?: ObjectType | null
	children?: AlexElementCreateConfigType[] | null
	textContent?: string | null
	behavior?: 'default' | 'block'
	namespace?: string | null
	locked?: boolean
}

/**
 * 编辑器元素对象
 */
export class AlexElement {
	/**
	 * key值
	 */
	key: number = createUniqueKey()
	/**
	 * 类型
	 */
	type: AlexElementType
	/**
	 * 真实节点名称
	 */
	parsedom: string | null
	/**
	 * 标记集合
	 */
	marks: ObjectType | null
	/**
	 * 样式集合
	 */
	styles: ObjectType | null
	/**
	 * 文本值
	 */
	textContent: string | null
	/**
	 * 子元素数组
	 */
	children: AlexElement[] | null = null
	/**
	 * 父元素
	 */
	parent: AlexElement | null = null
	/**
	 * 定义内部块元素的行为
	 */
	behavior: 'default' | 'block' = 'default'
	/**
	 * 命名空间(用于创建dom)
	 */
	namespace: string | null = null
	/**
	 * 是否锁定，此值为true表示元素不会被规则进行自动合并
	 */
	locked: boolean = false
	/**
	 * 真实node
	 */
	elm: HTMLElement | null = null

	constructor(type: AlexElementType, parsedom: string | null, marks: ObjectType | null, styles: ObjectType | null, textContent: string | null) {
		this.type = type
		this.parsedom = parsedom
		this.marks = marks
		this.styles = styles
		//统一将\r\n换成\n，解决Windows兼容问题
		this.textContent = textContent ? textContent.replace(/\r\n/g, '\n') : textContent
	}

	/**
	 * 是否根级块元素
	 * @returns
	 */
	isBlock() {
		return this.type == 'block'
	}

	/**
	 * 是否内部块元素
	 * @returns
	 */
	isInblock() {
		return this.type == 'inblock'
	}

	/**
	 * 是否行内元素
	 * @returns
	 */
	isInline() {
		return this.type == 'inline'
	}

	/**
	 * 是否自闭合元素
	 * @returns
	 */
	isClosed() {
		return this.type == 'closed'
	}

	/**
	 * 是否文本元素
	 * @returns
	 */
	isText() {
		return this.type == 'text'
	}

	/**
	 * 是否换行符
	 * @returns
	 */
	isBreak() {
		return this.isClosed() && this.parsedom == 'br'
	}

	/**
	 * 是否空元素
	 * @returns
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
			return this.children!.every(el => el.isEmpty())
		}
		return false
	}

	/**
	 * 是否零宽度无断空白元素
	 * @returns
	 */
	isSpaceText() {
		return !this.isEmpty() && this.isText() && isSpaceText(this.textContent!)
	}

	/**
	 * 获取不可编辑的元素，如果是null，说明元素是可编辑的
	 * @returns
	 */
	getUneditableElement(): AlexElement | null {
		if (this.hasMarks() && this.marks!['contenteditable'] == 'false') {
			return this
		}
		if (!this.parent) {
			return null
		}
		return this.parent.getUneditableElement()
	}

	/**
	 * 比较当前元素和另一个元素是否相等
	 * @param element
	 * @returns
	 */
	isEqual(element: AlexElement) {
		if (!AlexElement.isElement(element)) {
			return false
		}
		return this.key == element.key
	}

	/**
	 * 判断当前元素是否包含另一个元素
	 * @param element
	 * @returns
	 */
	isContains(element: AlexElement): boolean {
		if (this.isEqual(element)) {
			return true
		}
		if (!element.parent) {
			return false
		}
		return this.isContains(element.parent)
	}

	/**
	 * 判断当前元素的子元素数组是否只包含换行符
	 * @returns
	 */
	isOnlyHasBreak() {
		if (this.hasChildren()) {
			const elements = this.children!.filter(el => !el.isEmpty())
			return elements.length && elements.every(el => el.isBreak())
		}
		return false
	}

	/**
	 * 判断当前元素是否在拥有代码块样式的块内（包括自身）
	 * @returns
	 */
	isPreStyle(): boolean {
		const block = this.getInblock() || this.getBlock()
		if (block.parsedom == 'pre') {
			return true
		}
		if (block.hasStyles() && ['pre', 'pre-wrap'].includes(block.styles!['white-space'])) {
			return true
		}
		return block.parent ? block.parent.isPreStyle() : false
	}

	/**
	 * 是否含有标记
	 * @returns
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
	 * @returns
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
	 * @returns
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
	 * @param element
	 * @returns
	 */
	hasContains(element: AlexElement) {
		return this.isContains(element) || element.isContains(this)
	}

	/**
	 * 克隆当前元素
	 * @param deep 为true表示深度克隆，即克隆子元素，否则只会克隆自身
	 * @returns
	 */
	clone(deep: boolean | undefined = true) {
		if (typeof deep != 'boolean') {
			throw new Error('The parameter must be a Boolean')
		}
		let el = new AlexElement(this.type, this.parsedom, DapCommon.clone(this.marks), DapCommon.clone(this.styles), this.textContent)
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
	 * @returns
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
	 * @returns
	 */
	getBlock(): AlexElement {
		if (!this.parent) {
			return this
		}
		return this.parent.getBlock()
	}

	/**
	 * 获取所在内部块元素
	 * @returns
	 */
	getInblock(): AlexElement | null {
		if (this.isInblock()) {
			return this
		}
		if (!this.parent) {
			return null
		}
		return this.parent.getInblock()
	}

	/**
	 * 获取所在行内元素
	 * @returns
	 */
	getInline(): AlexElement | null {
		if (this.isInline()) {
			return this
		}
		if (!this.parent) {
			return null
		}
		return this.parent.getInline()
	}

	/**
	 * 比较当前元素和另一个元素的styles是否一致
	 * @param element
	 * @returns
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
	 * @param element
	 * @returns
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
	 * @param element
	 * @returns
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
			const elements = AlexElement.flatElements(element.children!).filter(el => el.isText() || el.isClosed())
			return this.isEqual(elements[0])
		}
		return false
	}

	/**
	 * 如果当前元素是文本元素或者自闭合元素，判断它是不是指定元素的后代所有文本元素和自闭合元素中的最后一个
	 * @param element
	 * @returns
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
			const elements = AlexElement.flatElements(element.children!).filter(el => el.isText() || el.isClosed())
			return this.isEqual(elements[elements.length - 1])
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
			el.textContent = this.textContent!
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
		let el = new AlexElement(this.type, this.parsedom, DapCommon.clone(this.marks), DapCommon.clone(this.styles), this.textContent)
		el.behavior = this.behavior
		el.namespace = this.namespace
		el.locked = this.locked
		el.key = this.key
		el.elm = this.elm
		if (this.hasChildren()) {
			el.children = this.children!.map(child => {
				const cloenChild = child.__fullClone()
				cloenChild.parent = el
				return cloenChild
			})
		}
		return el
	}

	/**
	 * 判断参数是否为AlexElement元素
	 * @param val
	 * @returns
	 */
	static isElement(val: any) {
		return val instanceof AlexElement
	}

	/**
	 * 扁平化处理元素数组
	 * @param elements
	 * @returns
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
	 * @returns
	 */
	static getSpaceElement() {
		return new AlexElement('text', null, null, null, '\uFEFF')
	}

	/**
	 * 创建元素的快捷方法
	 * @param elementConfig
	 * @returns
	 */
	static create(elementConfig: AlexElementCreateConfigType) {
		let el: AlexElement | null = null
		//处理文本元素
		if (elementConfig.type == 'text') {
			el = new AlexElement(elementConfig.type, null, elementConfig.marks ? elementConfig.marks : null, elementConfig.styles ? elementConfig.styles : null, elementConfig.textContent ? elementConfig.textContent : null)
		}
		//其他元素
		else {
			el = new AlexElement(elementConfig.type, elementConfig.parsedom!, elementConfig.marks ? elementConfig.marks : null, elementConfig.styles ? elementConfig.styles : null, null)
			//内部块元素设置行为值
			if (elementConfig.type == 'inblock' && elementConfig.behavior) {
				el.behavior = elementConfig.behavior
			}
			//非自闭和元素设置子元素
			if (elementConfig.type != 'closed' && Array.isArray(elementConfig.children)) {
				el.children = elementConfig.children.map(item => {
					const child = AlexElement.create(item)
					child.parent = el
					return child
				})
			}
		}
		if (elementConfig.namespace) {
			el.namespace = elementConfig.namespace
		}
		if (typeof elementConfig.locked == 'boolean') {
			el.locked = elementConfig.locked
		}

		return el
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
