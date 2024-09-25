import { common as DapCommon } from 'dap-util'
import { createUniqueKey, getZeroWidthText, isZeroWidthText } from '../tools'
import * as CSS from 'csstype'
/**
 * 节点类型
 */
export type KNodeType = 'text' | 'closed' | 'inline' | 'block'

/**
 * 标记集合类型
 */
export type KNodeMarksType = {
	[mark: string]: string | number
}
/**
 * 样式集合类型
 */
export type KNodeStylesType = CSS.Properties<string | number> & {
	[style: string]: string | number
}

/**
 * 节点匹配入参类型
 */
export type KNodeMatchOptionType = {
	/**
	 * 节点对应的dom标签
	 */
	tag?: string
	/**
	 * 节点标记集合
	 */
	marks?: KNodeMarksType & {
		[key: string]: boolean
	}
	/**
	 * 节点样式集合
	 */
	styles?: KNodeStylesType & {
		[key: string]: boolean
	}
}

/**
 * 创建节点的入参类型
 */
export type KNodeCreateOptionType = {
	/**
	 * 节点类型
	 */
	type: KNodeType
	/**
	 * 节点对应的dom标签
	 */
	tag?: string
	/**
	 * 节点标记集合
	 */
	marks?: KNodeMarksType
	/**
	 * 节点样式集合
	 */
	styles?: KNodeStylesType
	/**
	 * 节点命名空间
	 */
	namespace?: string
	/**
	 * 节点文本内容
	 */
	textContent?: string
	/**
	 * 是否锁定节点：
	 * 针对块节点，在符合合并条件的情况下不允许编辑器将其与父节点或者子节点进行合并；
	 * 针对行内节点，在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并；
	 * 针对文本节点，在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并。
	 */
	locked?: boolean
	/**
	 * 是否为固定块节点，值为true时：当光标在节点起始处或者光标在节点内只有占位符时，执行删除操作不会删除此节点，会再次创建一个占位符进行处理；当光标在节点内且节点不是代码块样式，不会进行换行
	 */
	fixed?: boolean
	/**
	 * 子节点数组
	 */
	children?: KNodeCreateOptionType[]
}

/**
 * 创建零宽度无断空白文本节点的入参类型
 */
export type ZeroWidthTextKNodeCreateOptionType = {
	/**
	 * 节点标记集合
	 */
	marks?: KNodeMarksType
	/**
	 * 节点样式集合
	 */
	styles?: KNodeStylesType
	/**
	 * 节点命名空间
	 */
	namespace?: string
	/**
	 * 是否锁定节点：
	 * 针对块节点，在符合合并条件的情况下不允许编辑器将其与父节点或者子节点进行合并；
	 * 针对行内节点，在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并；
	 * 针对文本节点，在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并。
	 */
	locked?: boolean
}

/**
 * 基本节点
 */
export class KNode {
	/**
	 * 唯一key
	 */
	key: number = createUniqueKey()
	/**
	 * 类型
	 */
	type?: KNodeType
	/**
	 * 渲染标签
	 */
	tag?: string
	/**
	 * 文本值
	 */
	textContent?: string
	/**
	 * 标记集合
	 */
	marks?: KNodeMarksType
	/**
	 * 样式集合，样式名称请使用驼峰写法，虽然在渲染时兼容处理了中划线格式的样式名称，但是在其他地方可能会出现问题并且编辑器内部在样式相关的判断都是以驼峰写法为主
	 */
	styles?: KNodeStylesType
	/**
	 * 是否锁定节点
	 * 针对块节点，在符合合并条件的情况下不允许编辑器将其与父节点或者子节点进行合并
	 * 针对行内节点，在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并
	 * 针对文本节点，在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并
	 */
	locked: boolean = false
	/**
	 * 是否为固定块节点，值为true时：当光标在节点起始处或者光标在节点内只有占位符时，执行删除操作不会删除此节点，会再次创建一个占位符进行处理；当光标在节点内且节点不是代码块样式，不会进行换行
	 */
	fixed: boolean = false
	/**
	 * 命名空间
	 */
	namespace?: string
	/**
	 * 子节点数组
	 */
	children?: KNode[]
	/**
	 * 父节点
	 */
	parent?: KNode

	/**
	 * 是否块节点
	 */
	isBlock() {
		return this.type == 'block'
	}

	/**
	 * 是否行内节点
	 */
	isInline() {
		return this.type == 'inline'
	}

	/**
	 * 是否闭合节点
	 */
	isClosed() {
		return this.type == 'closed'
	}

	/**
	 * 是否文本节点
	 */
	isText() {
		return this.type == 'text'
	}

	/**
	 * 获取所在块级节点
	 */
	getBlock(): KNode {
		if (this.isBlock()) {
			return this
		}
		return this.parent!.getBlock()
	}

	/**
	 * 获取所在行内节点
	 */
	getInline(): KNode | null {
		if (this.isInline()) {
			return this
		}
		if (!this.parent) {
			return null
		}
		return this.parent.getInline()
	}

	/**
	 * 是否有子节点
	 */
	hasChildren() {
		if (this.isText() || this.isClosed()) {
			return false
		}
		return Array.isArray(this.children) && !!this.children.length
	}

	/**
	 * 是否空节点
	 */
	isEmpty(): boolean {
		if (this.isText()) {
			return !this.textContent
		}
		if (this.isInline() || this.isBlock()) {
			return (
				!this.hasChildren() ||
				this.children!.every(item => {
					return item.isEmpty()
				})
			)
		}
		return false
	}

	/**
	 * 是否零宽度无断空白文本节点
	 */
	isZeroWidthText() {
		return this.isText() && !this.isEmpty() && isZeroWidthText(this.textContent!)
	}

	/**
	 * 是否占位符
	 */
	isPlaceholder() {
		return this.isClosed() && this.tag == 'br'
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
	 * 判断节点是否不可编辑的，如果是返回设置不可编辑的那个节点，否则返回null
	 */
	getUneditable(): KNode | null {
		if (this.hasMarks() && this.marks!['contenteditable'] == 'false') {
			return this
		}
		if (!this.parent) {
			return null
		}
		return this.parent.getUneditable()
	}

	/**
	 * 当前节点是否只包含占位符
	 */
	allIsPlaceholder() {
		if (this.hasChildren()) {
			const nodes = this.children!.filter(item => !item.isEmpty())
			return nodes.length && nodes.every(el => el.isPlaceholder())
		}
		return false
	}

	/**
	 * 设置为空节点
	 */
	toEmpty() {
		if (this.isEmpty()) {
			return
		}
		if (this.isText()) {
			this.textContent = undefined
			return
		}
		if (this.isClosed()) {
			this.type = 'text'
			this.textContent = undefined
			return
		}
		if (this.hasChildren()) {
			this.children!.forEach(item => {
				item.toEmpty()
			})
		}
	}

	/**
	 * 比较当前节点和另一个节点的styles是否一致
	 
	 */
	isEqualStyles(node: KNode) {
		if (!this.hasStyles() && !node.hasStyles()) {
			return true
		}
		if (this.hasStyles() && node.hasStyles() && DapCommon.equal(this.styles, node.styles)) {
			return true
		}
		return false
	}

	/**
	 * 比较当前节点和另一个节点的marks是否一致
	 
	 */
	isEqualMarks(node: KNode) {
		if (!this.hasMarks() && !node.hasMarks()) {
			return true
		}
		if (this.hasMarks() && node.hasMarks() && DapCommon.equal(this.marks, node.marks)) {
			return true
		}
		return false
	}

	/**
	 * 判断当前节点是否在拥有代码块样式的块级节点内（包括自身）
	 */
	isInCodeBlockStyle(): boolean {
		const block = this.getBlock()
		if (block.tag == 'pre') {
			return true
		}
		const whiteSpace = block.hasStyles() ? block.styles!.whiteSpace || '' : ''
		if (['pre', 'pre-wrap'].includes(whiteSpace)) {
			return true
		}
		return block.parent ? block.parent.isInCodeBlockStyle() : false
	}

	/**
	 * 判断当前节点是否与另一个节点相同
	 
	 */
	isEqual(node: KNode) {
		if (!KNode.isKNode(node)) {
			return false
		}
		return this.key == node.key
	}

	/**
	 * 判断当前节点是否包含指定节点
	 */
	isContains(node: KNode): boolean {
		if (this.isEqual(node)) {
			return true
		}
		if (this.isClosed() || this.isText()) {
			return false
		}
		if (!node.parent) {
			return false
		}
		return this.isContains(node.parent)
	}

	/**
	 * 复制节点，deep 为true表示深度复制，即复制子节点，否则只会复制自身
	 */
	clone = (deep: boolean | undefined = true) => {
		const newNode = KNode.create({
			type: this.type!,
			tag: this.tag,
			marks: DapCommon.clone(this.marks),
			styles: DapCommon.clone(this.styles),
			namespace: this.namespace,
			textContent: this.textContent,
			locked: this.locked,
			fixed: this.fixed
		})
		if (deep && this.hasChildren()) {
			this.children!.forEach(child => {
				const newChild = child.clone(deep)
				if (newNode.hasChildren()) {
					newNode.children!.push(newChild)
				} else {
					newNode.children = [newChild]
				}
				newChild.parent = newNode
			})
		}
		return newNode
	}

	/**
	 * 完全复制节点，涵盖每个属性
	 */
	fullClone() {
		const newNode = KNode.create({
			type: this.type!,
			tag: this.tag,
			marks: DapCommon.clone(this.marks),
			styles: DapCommon.clone(this.styles),
			namespace: this.namespace,
			textContent: this.textContent,
			locked: this.locked,
			fixed: this.fixed
		})
		newNode.key = this.key
		if (this.hasChildren()) {
			this.children!.forEach(child => {
				const newChild = child.fullClone()
				if (newNode.hasChildren()) {
					newNode.children!.push(newChild)
				} else {
					newNode.children = [newChild]
				}
				newChild.parent = newNode
			})
		}
		return newNode
	}

	/**
	 * 如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有文本节点和闭合节点中的第一个
	 */
	firstTextClosedInNode = (node: KNode) => {
		//如果不是闭合节点和文本节点则返回false
		if (!this.isText() && !this.isClosed()) {
			return false
		}
		//如果是同一个节点返回false
		if (this.isEqual(node)) {
			return false
		}
		//如果目标节点包含当前节点
		if (node.isContains(this)) {
			const nodes = KNode.flat(node.children!).filter(item => item.isText() || item.isClosed())
			return this.isEqual(nodes[0])
		}
		return false
	}

	/**
	 * 如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有文本节点和闭合节点中的最后一个
	 */
	lastTextClosedInNode(node: KNode) {
		//如果不是闭合节点和文本节点则返回false
		if (!this.isText() && !this.isClosed()) {
			return false
		}
		//如果是同一个节点返回false
		if (this.isEqual(node)) {
			return false
		}
		//如果目标节点包含当前节点
		if (node.isContains(this)) {
			const nodes = KNode.flat(node.children!).filter(item => item.isText() || item.isClosed())
			return this.isEqual(nodes[nodes.length - 1])
		}
		return false
	}

	/**
	 * 获取当前节点在某个节点数组中的前一个非空节点
	 */
	getPrevious(nodes: KNode[]): KNode | null {
		const index = nodes.findIndex(item => item.isEqual(this))
		//排除不存在和第一个的情况
		if (index <= 0) {
			return null
		}
		//获取前一个节点
		const previousNode = nodes[index - 1]
		//前一个节点是空节点
		if (previousNode.isEmpty()) {
			//如果是已经是第一个了则返回null，否则继续查找前一个
			return index - 1 == 0 ? null : previousNode.getPrevious(nodes)
		}
		return previousNode
	}

	/**
	 * 获取当前节点在某个节点数组中的后一个非空节点
	 */
	getNext(nodes: KNode[]): KNode | null {
		const index = nodes.findIndex(item => item.isEqual(this))
		//排除不存在和最后一个的情况
		if (index < 0 || index == nodes.length - 1) {
			return null
		}
		//获取后一个节点
		const nextNode = nodes[index + 1]
		//后一个节点是空节点
		if (nextNode.isEmpty()) {
			//如果是最后一个则返回null，否则继续查找后一个
			return index + 1 == nodes.length - 1 ? null : nextNode.getNext(nodes)
		}
		return nextNode
	}

	/**
	 * 判断当前节点是否符合指定的条件，marks和styles参数中的属性值可以是true表示只判断是否拥有该标记或者样式，而不关心是什么值
	 */
	isMatch(config: KNodeMatchOptionType) {
		//如果存在tag判断并且tag不一样
		if (config.tag && (this.isText() || config.tag != this.tag)) {
			return false
		}
		//如果存在marks判断
		if (config.marks) {
			const hasMarks = Object.keys(config.marks).every(key => {
				if (this.hasMarks()) {
					if (config.marks![key] === true) {
						return this.marks!.hasOwnProperty(key)
					}
					return this.marks![key] == config.marks![key]
				}
				return false
			})
			//如果不是所有的mark都有
			if (!hasMarks) {
				return false
			}
		}
		//如果存在styles判断
		if (config.styles) {
			const hasStyles = Object.keys(config.styles).every(key => {
				if (this.hasStyles()) {
					if (config.styles![key] === true) {
						return this.styles!.hasOwnProperty(key)
					}
					return this.styles![key] == config.styles![key]
				}
				return false
			})
			//如果不是所有的styles都有
			if (!hasStyles) {
				return false
			}
		}
		return true
	}

	/**
	 * 判断当前节点是否在符合条件的节点下，包含自身，如果是返回符合条件的节点，否则返回null
	 */
	getMatchNodeUp = (config: KNodeMatchOptionType): KNode | null => {
		if (this.isMatch(config)) {
			return this
		}
		if (this.parent) {
			return this.parent.getMatchNodeUp(config)
		}
		return null
	}

	/**
	 * 创建节点
	 */
	static create(options: KNodeCreateOptionType) {
		const knode = new KNode()
		knode.type = options.type
		knode.tag = options.tag
		knode.textContent = options.textContent
		knode.fixed = options.fixed || false
		knode.locked = options.locked || false
		knode.marks = DapCommon.clone(options.marks)
		knode.styles = DapCommon.clone(options.styles)
		knode.namespace = options.namespace
		knode.children = options.children?.map(item => {
			const childNode = KNode.create(item)
			childNode.parent = knode
			return childNode
		})
		return knode
	}

	/**
	 * 创建零宽度无断空白文本节点
	 */
	static createZeroWidthText(options?: ZeroWidthTextKNodeCreateOptionType) {
		return KNode.create({
			type: 'text',
			textContent: getZeroWidthText(),
			marks: options?.marks,
			styles: options?.styles,
			namespace: options?.namespace,
			locked: options?.locked
		})
	}

	/**
	 * 创建占位符
	 */
	static createPlaceholder() {
		return KNode.create({
			type: 'closed',
			tag: 'br'
		})
	}

	/**
	 * 判断参数是否节点
	 */
	static isKNode(val: any) {
		return val instanceof KNode
	}

	/**
	 * 将某个节点数组扁平化处理后返回
	 */
	static flat(nodes: KNode[]) {
		const newNodes: KNode[] = []
		const length = nodes.length
		for (let i = 0; i < length; i++) {
			newNodes.push(nodes[i])
			if (nodes[i].hasChildren()) {
				const childResult = KNode.flat(nodes[i].children!)
				newNodes.push(...childResult)
			}
		}
		return newNodes
	}

	/**
	 * 在指定的节点数组中根据key查找节点
	 */
	static searchByKey(key: string | number, nodes: KNode[]): KNode | null {
		let node: KNode | null = null
		const length = nodes.length
		for (let i = 0; i < length; i++) {
			const item = nodes[i]
			if (item && item.key == Number(key)) {
				node = item
				break
			}
			if (item && item.hasChildren()) {
				const n = KNode.searchByKey(key, item.children!)
				if (n) {
					node = n
					break
				}
			}
		}
		return node
	}
}
