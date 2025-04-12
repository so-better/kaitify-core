import { data as DapData, element as DapElement } from 'dap-util'
import { KNodeMarksType, KNodeStylesType } from '@/model'
import { NODE_MARK } from '@/view'

/**
 * 用于KNode生成唯一的key
 */
export const createUniqueKey = (): number => {
	let key = DapData.get<number>(window, 'kaitify-node-key') || 0
	key++
	DapData.set(window, 'kaitify-node-key', key)
	return key
}

/**
 * 用于编辑器生成唯一的guid
 */
export const createGuid = function (): number {
	//获取唯一id
	let key = DapData.get<number>(window, 'kaitify-guid') || 0
	key++
	DapData.set(window, 'kaitify-guid', key)
	return key
}

/**
 * 判断字符串是否零宽度空白字符
 */
export const isZeroWidthText = (val: string) => {
	return /^[\u200B]+$/g.test(val)
}

/**
 * 获取一个零宽度空白字符
 */
export const getZeroWidthText = () => {
	return '\u200B'
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
	const attributes = Array.from(dom.attributes)
	const length = attributes.length
	const regExp = new RegExp(`(^on)|(^style$)|(^${NODE_MARK}$)`, 'g')
	const result: KNodeMarksType = {}
	for (let i = 0; i < length; i++) {
		const { nodeName, nodeValue } = attributes[i]
		//匹配事件、样式和face外的属性
		if (!regExp.test(nodeName)) {
			result[nodeName] = nodeValue ?? ''
		}
	}
	return result
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
	if (DapData.get<boolean>(dom, 'kaitify-init')) {
		throw new Error('The element node has been initialized to the editor')
	}
	//添加初始化的标记
	DapData.set(dom, 'kaitify-init', true)
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
 * 删除对象的某个属性
 */
export const deleteProperty = <T>(val: any, propertyName: string) => {
	const newObj: any = {}
	Object.keys(val).forEach(key => {
		if (key != propertyName) {
			newObj[key] = val[key]
		}
	})
	return newObj as T
}

/**
 * 键盘Tab是否按下
 */
export const isOnlyTab = (e: KeyboardEvent) => {
	return e.key.toLocaleLowerCase() == 'tab' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey
}

/**
 * 键盘Tab和shift是否一起按下
 */
export const isTabWithShift = (e: KeyboardEvent) => {
	return e.key.toLocaleLowerCase() == 'tab' && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey
}
