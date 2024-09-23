import { data as DapData, element as DapElement, common as DapCommon } from 'dap-util'
import { KNodeMarksType, KNodeStylesType } from '../model'
import { NODE_MARK } from '../view'
/**
 * 用于KNode生成唯一的key
 */
export const createUniqueKey = (): number => {
	let key = DapData.get(window, 'data-kaitify-knode-key') || 0
	key++
	DapData.set(window, 'data-kaitify-knode-key', key)
	return key
}

/**
 * 用于编辑器生成唯一的guid
 */
export const createGuid = function (): number {
	//获取唯一id
	let key = DapData.get(window, 'data-kaitify-guid') || 0
	key++
	DapData.set(window, 'data-kaitify-guid', key)
	return key
}

/**
 * 判断字符串是否零宽度无断空白字符
 */
export const isZeroWidthText = (val: string) => {
	return /^[\uFEFF]+$/g.test(val)
}

/**
 * 获取一个零宽度无断空白字符
 */
export const getZeroWidthText = () => {
	return '\uFEFF'
}

/**
 * 驼峰转中划线
 */
export const camelToKebab = (val: string) => {
	return val.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 中划线转驼峰
 */
export const kebabToCamel = (val: string) => {
	return val.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 获取dom元素的属性集合
 */
export const getDomAttributes = (dom: HTMLElement) => {
	let o: KNodeMarksType = {}
	const length = dom.attributes.length
	for (let i = 0; i < length; i++) {
		const attribute = dom.attributes[i]
		const regExp = new RegExp(`(^on)|(^style$)|(^face$)|(^${NODE_MARK}$)`, 'g')
		//匹配事件、样式和face外的属性
		if (!regExp.test(attribute.nodeName)) {
			o[attribute.nodeName] = attribute.nodeValue || ''
		}
	}
	return o
}

/**
 * 获取dom元素的样式集合
 */
export const getDomStyles = (dom: HTMLElement) => {
	let o: KNodeStylesType = {}
	const styles = dom.getAttribute('style')
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
			if (i == styles.length - 1 && start < i + 1) {
				splitStyles.push(styles.substring(start, i + 1))
			}
			i++
		}
		splitStyles.forEach(style => {
			const index = style.indexOf(':')
			const property = style.substring(0, index).trim()
			const value = style.substring(index + 1).trim()
			o[kebabToCamel(property)] = value
		})
	}
	return o
}

/**
 * 初始化编辑器dom
 */
export const initEditorDom = (dom: HTMLElement | string) => {
	//判断是否字符串，如果是字符串按照选择器来寻找元素
	if (typeof dom == 'string' && dom) {
		dom = document.body.querySelector(dom) as HTMLElement
	}
	dom = dom as HTMLElement
	//如何node不是元素则抛出异常
	if (!DapElement.isElement(dom)) {
		throw new Error('You must specify a dom container to initialize the editor')
	}
	//如果已经初始化过了则抛出异常
	if (DapData.get(dom, 'data-kaitify-init')) {
		throw new Error('The element node has been initialized to the editor')
	}
	//添加初始化的标记
	DapData.set(dom, 'data-kaitify-init', true)
	return dom
}

/**
 * 判断某个dom是否包含另一个dom
 */
export const isContains = (parent: Node, child: Node) => {
	if (child.nodeType == 3) {
		return DapElement.isContains(parent as HTMLElement, child.parentNode as HTMLElement)
	}
	return DapElement.isContains(parent as HTMLElement, child as HTMLElement)
}

/**
 * 延迟指定时间
 */
export const delay = (num: number | undefined = 0) => {
	return new Promise<void>(resolve => {
		setTimeout(() => {
			resolve()
		}, num)
	})
}

/**
 * 对象平替值方法
 * @param o1
 * @param o2
 * @returns
 */
export const mergeObject = (o1: { [key: string]: any }, o2: { [key: string]: any }) => {
	if (!DapCommon.isObject(o1) && DapCommon.isObject(o2)) {
		return null
	}
	for (let key in o2) {
		//如果o1和o2的相同属性都是对象并且不是数组，则继续merge
		if (DapCommon.isObject(o2[key]) && !Array.isArray(o2[key]) && DapCommon.isObject(o1[key]) && !Array.isArray(o1[key])) {
			o1[key] = mergeObject(o1[key], o2[key])
		}
		//否则直接将o2的值给o1
		else {
			o1[key] = o2[key]
		}
	}
	return o1
}
