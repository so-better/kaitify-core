import { data as DapData, element as DapElement, common as DapCommon } from 'dap-util'
import { AlexElement } from '../Element'
import { AlexPoint } from '../Point'

/**
 * 定义一个对象集合的类型
 */
export type ObjectType = {
	[key: string]: any | null
}

/**
 * 编辑器参数类型
 */
export type EditorOptionsType = {
	/**
	 * 是否禁用
	 */
	disabled?: boolean
	/**
	 * 自定义渲染规则
	 */
	renderRules?: ((element: AlexElement) => void)[]
	/**
	 * 编辑器的默认html值
	 */
	value?: string
	/**
	 * 是否允许复制
	 */
	allowCopy?: boolean
	/**
	 * 是否允许粘贴
	 */
	allowPaste?: boolean
	/**
	 * 是否允许剪切
	 */
	allowCut?: boolean
	/**
	 * 是否允许粘贴html
	 */
	allowPasteHtml?: boolean
	/**
	 * 自定义纯文本粘贴方法
	 */
	customTextPaste?: ((text: string) => void | Promise<void>) | null
	/**
	 * 自定义html粘贴方法
	 */
	customHtmlPaste?: ((AlexElements: AlexElement[], html: string) => void | Promise<void>) | null
	/**
	 * 自定义图片粘贴方法
	 */
	customImagePaste?: ((file: File) => void | Promise<void>) | null
	/**
	 * 自定义视频粘贴方法
	 */
	customVideoPaste?: ((file: File) => void | Promise<void>) | null
	/**
	 * 自定义文件粘贴方法
	 */
	customFilePaste?: ((file: File) => void | Promise<void>) | null
	/**
	 * 自定义处理不可编辑元素合并的逻辑
	 */
	customMerge?: ((mergeElement: AlexElement, targetElement: AlexElement) => void | Promise<void>) | null
	/**
	 * 自定义dom转为非文本元素的后续处理逻辑
	 */
	customParseNode?: ((el: AlexElement) => AlexElement) | null
	/**
	 * dom转为非文本元素时需要额外保留处理的标签数组
	 */
	extraKeepTags?: string[]
}

/**
 * 获取node元素的属性集合
 * @param node
 * @returns
 */
export const getAttributes = function (node: HTMLElement) {
	let o: ObjectType = {}
	const length = node.attributes.length
	for (let i = 0; i < length; i++) {
		const attribute = node.attributes[i]
		//匹配事件、样式外的属性
		if (!/(^on)|(^style$)|(^face$)/g.test(attribute.nodeName)) {
			o[attribute.nodeName] = attribute.nodeValue
		}
	}

	return o
}

/**
 * 获取node元素的样式集合
 * @param node
 * @returns
 */
export const getStyles = function (node: HTMLElement) {
	let o: ObjectType = {}
	const styles = node.getAttribute('style')
	if (styles) {
		let i = 0
		let start = 0
		let splitStyles = []
		while (i < styles.length) {
			if (styles[i] == ';' && styles.substring(i + 1, i + 8) != 'base64,') {
				splitStyles.push(styles.substring(start, i))
				start = i + 1
			}
			//到最后了，并且最后没有分号
			if (i == styles.length - 1 && start < i) {
				splitStyles.push(styles.substring(start, i))
			}
			i++
		}
		splitStyles.forEach(style => {
			const index = style.indexOf(':')
			const property = style.substring(0, index).trim()
			const value = style.substring(index + 1).trim()
			o[property] = value
		})
	}
	return o
}

/**
 * 生成唯一的key
 * @returns
 */
export const createUniqueKey = function (): number {
	//获取唯一id
	let key = DapData.get(window, 'data-alex-editor-key') || 0
	key++
	DapData.set(window, 'data-alex-editor-key', key)
	return key
}

/**
 * 生成唯一的guid
 * @returns
 */
export const createGuid = function (): number {
	//获取唯一id
	let key = DapData.get(window, 'data-alex-editor-guid') || 0
	key++
	DapData.set(window, 'data-alex-editor-guid', key)
	return key
}

/**
 * 判断字符串是否零宽度无断空白字符
 * @param val
 * @returns
 */
export const isSpaceText = function (val: string) {
	return /^[\uFEFF]+$/g.test(val)
}

/**
 * 深拷贝函数
 * @param data
 * @returns
 */
export const cloneData = function (data: any) {
	if (DapCommon.isObject(data) || Array.isArray(data)) {
		return JSON.parse(JSON.stringify(data))
	}
	return data
}

/**
 * 判断某个node是否包含另一个node
 * @param parentNode
 * @param childNode
 * @returns
 */
export const isContains = function (parentNode: HTMLElement, childNode: HTMLElement) {
	if (childNode.nodeType == 3) {
		return DapElement.isContains(parentNode, childNode.parentNode as HTMLElement)
	}
	return DapElement.isContains(parentNode, childNode)
}

/**
 * 初始化编辑器dom
 * @param node
 * @returns
 */
export const initEditorNode = function (node: HTMLElement | string) {
	//判断是否字符串，如果是字符串按照选择器来寻找元素
	if (typeof node == 'string' && node) {
		node = document.body.querySelector(node) as HTMLElement
	}
	node = node as HTMLElement
	//如何node不是元素则抛出异常
	if (!DapElement.isElement(node)) {
		throw new Error('You must specify a dom container to initialize the editor')
	}
	//如果已经初始化过了则抛出异常
	if (DapData.get(node, 'data-alex-editor-init')) {
		throw new Error('The element node has been initialized to the editor')
	}
	//添加初始化的标记
	DapData.set(node, 'data-alex-editor-init', true)

	return node
}

/**
 * 格式化编辑器的options参数
 * @param options
 * @returns
 */
export const initEditorOptions = function (options: EditorOptionsType) {
	let opts: EditorOptionsType = {
		disabled: false,
		renderRules: [],
		value: '',
		allowCopy: true,
		allowPaste: true,
		allowCut: true,
		allowPasteHtml: false,
		customTextPaste: null,
		customHtmlPaste: null,
		customImagePaste: null,
		customVideoPaste: null,
		customFilePaste: null,
		customMerge: null,
		customParseNode: null,
		extraKeepTags: []
	}
	if (DapCommon.isObject(options)) {
		if (typeof options.disabled == 'boolean') {
			opts.disabled = options.disabled
		}
		if (Array.isArray(options.renderRules)) {
			opts.renderRules = options.renderRules
		}
		if (typeof options.value == 'string' && options.value) {
			opts.value = options.value
		}
		if (typeof options.allowCopy == 'boolean') {
			opts.allowCopy = options.allowCopy
		}
		if (typeof options.allowPaste == 'boolean') {
			opts.allowPaste = options.allowPaste
		}
		if (typeof options.allowCut == 'boolean') {
			opts.allowCut = options.allowCut
		}
		if (typeof options.allowPasteHtml == 'boolean') {
			opts.allowPasteHtml = options.allowPasteHtml
		}
		if (typeof options.customTextPaste == 'function') {
			opts.customTextPaste = options.customTextPaste
		}
		if (typeof options.customHtmlPaste == 'function') {
			opts.customHtmlPaste = options.customHtmlPaste
		}
		if (typeof options.customImagePaste == 'function') {
			opts.customImagePaste = options.customImagePaste
		}
		if (typeof options.customVideoPaste == 'function') {
			opts.customVideoPaste = options.customVideoPaste
		}
		if (typeof options.customFilePaste == 'function') {
			opts.customFilePaste = options.customFilePaste
		}
		if (typeof options.customMerge == 'function') {
			opts.customMerge = options.customMerge
		}
		if (typeof options.customParseNode == 'function') {
			opts.customParseNode = options.customParseNode
		}
		if (Array.isArray(options.extraKeepTags)) {
			opts.extraKeepTags = options.extraKeepTags
		}
	}
	return opts
}

/**
 * 获取以目标元素为子孙元素中文本元素或者自闭合元素排列第一的元素的最高级元素
 * @param point
 * @returns
 */
export const getHighestByFirst = function (point: AlexPoint) {
	//element一定是文本元素或者自闭合元素
	let temp = point.element
	while (temp.parent) {
		const isFirst = point.element.isFirst(temp.parent)
		if (!isFirst) {
			break
		}
		temp = temp.parent
	}
	return temp
}

/**
 * 在指定的stack中根据key值查找元素
 * @param key
 * @param stack
 * @returns
 */
export const getElementByKey = function (key: number, stack: AlexElement[]) {
	if (!key) {
		return null
	}
	const fn = (elements: AlexElement[]): AlexElement | null => {
		let element: AlexElement | null = null
		const length = elements.length
		for (let i = 0; i < length; i++) {
			const item = elements[i]
			if (item && item.key === key) {
				element = item
				break
			}
			if (item && item.hasChildren()) {
				const el = fn(item.children!)
				if (el) {
					element = el
					break
				}
			}
		}
		return element
	}
	return fn(stack)
}
