import { Editor, KNode } from '../../model'
import { camelToKebab, isContains } from '../../tools'
import { getNodeRenderOptions, KNodeRenderOptionType } from '../index'
import { getDifferentMarks, getDifferentStyles, patchNodes } from './dom-patch'

/**
 * 封装findDom
 */
const findDom = (editor: Editor, node: KNode) => {
	let dom: HTMLElement | null = null
	try {
		dom = editor.findDom(node)
	} catch (error) {
		console.warn(`error: ${(error as Error).message}`)
	}
	return dom
}

/**
 * 渲染单个节点
 */
const renderNode = (editor: Editor, opts: KNodeRenderOptionType) => {
	const element = opts.namespace ? (document.createElementNS(opts.namespace, opts.tag) as HTMLElement) : document.createElement(opts.tag)
	//渲染文本
	if (opts.textContent) {
		element.textContent = opts.textContent
	}
	//渲染子元素
	if (opts.children && opts.children.length) {
		element.append(...opts.children.map(item => renderNode(editor, item)))
	}
	//设置属性
	Object.keys(opts.attrs).forEach(attr => {
		if (!/(^on)|(^style$)/g.test(attr)) {
			element.setAttribute(attr, `${opts.attrs[attr]}`)
		}
	})
	//设置样式
	Object.keys(opts.styles).forEach(style => {
		element.style.setProperty(camelToKebab(style), `${opts.styles[style]}`)
	})
	return element
}

/**
 * 插入新dom
 */
const insertDom = (editor: Editor, newNode: KNode) => {
	//生成dom
	const options = getNodeRenderOptions(editor, newNode)
	const newDom = renderNode(editor, options)
	//获取父节点
	const parentNode = newNode.parent
	//获取新dom的父元素
	const parentDom = parentNode ? findDom(editor, parentNode)! : editor.$el!
	//获取前一个兄弟节点
	const previousNode = newNode.getPrevious(parentNode ? parentNode.children! : editor.stackNodes)
	//获取前一个dom
	const previousDom = previousNode ? findDom(editor, previousNode) : null
	//获取后一个兄弟节点
	const nextNode = newNode.getNext(parentNode ? parentNode.children! : editor.stackNodes)
	//获取后一个dom
	const nextDom = nextNode ? findDom(editor, nextNode) : null
	//前一个dom存在则插入到前一个dom之后
	if (previousDom && Array.from(parentDom.childNodes).some(item => item === previousDom)) {
		previousDom.nextElementSibling ? parentDom.insertBefore(newDom, previousDom.nextElementSibling) : parentDom.appendChild(newDom)
	}
	//后一个dom存在则插入到后一个dom之前
	else if (nextDom && Array.from(parentDom.childNodes).some(item => item === nextDom)) {
		parentDom.insertBefore(newDom, nextDom)
	}
	//其他情况
	else {
		//获取节点在父节点内的位置
		const idx = (parentNode ? parentNode.children! : editor.stackNodes).findIndex(item => item.isEqual(newNode))
		const currentDom = parentDom.childNodes[idx]
		currentDom ? parentDom.insertBefore(newDom, currentDom) : parentDom.appendChild(newDom)
	}
}

/**
 * 移除旧dom
 */
const removeDom = (editor: Editor, oldNode: KNode) => {
	const oldDom = findDom(editor, oldNode)
	oldDom && oldDom.remove()
}

/**
 * 移动dom
 */
const moveDom = (editor: Editor, node: KNode) => {
	//需要移动的dom
	const dom = findDom(editor, node)!
	//获取父节点
	const parentNode = node.parent
	//获取新dom的父元素
	const parentDom = parentNode ? findDom(editor, parentNode)! : editor.$el!
	//获取前一个兄弟节点
	const previousNode = node.getPrevious(parentNode ? parentNode.children! : editor.stackNodes)
	//获取前一个dom
	const previousDom = previousNode ? findDom(editor, previousNode) : null
	//获取后一个兄弟节点
	const nextNode = node.getNext(parentNode ? parentNode.children! : editor.stackNodes)
	//获取后一个dom
	const nextDom = nextNode ? findDom(editor, nextNode) : null
	//前一个dom存在则插入到前一个dom之后
	if (previousDom && isContains(parentDom, previousDom)) {
		previousDom.nextElementSibling ? parentDom.insertBefore(dom, previousDom.nextElementSibling) : parentDom.appendChild(dom)
	}
	//后一个dom存在则插入到后一个dom之前
	else if (nextDom && isContains(parentDom, nextDom)) {
		parentDom.insertBefore(dom, nextDom)
	}
	//其他情况
	else {
		//获取节点在父节点内的位置
		const idx = (parentNode ? parentNode.children! : editor.stackNodes).findIndex(item => item.isEqual(node))
		const currentDom = parentDom.childNodes[idx]
		currentDom ? parentDom.insertBefore(dom, currentDom) : parentDom.appendChild(dom)
	}
}

/**
 * 替换dom
 */
const replaceDom = (editor: Editor, newNode: KNode, oldNode: KNode) => {
	//旧节点对应的dom
	const oldDom = findDom(editor, oldNode)!
	//插入新节点
	insertDom(editor, newNode)
	//移除旧dom
	oldDom && oldDom.remove()
}

/**
 * 默认的原生js渲染编辑器视图层
 */
export const defaultUpdateView = function (this: Editor, init: boolean) {
	if (!this.$el) {
		return
	}
	//第一次视图渲染
	if (init) {
		//创建fragment
		const fragment = document.createDocumentFragment()
		//生成新的dom
		this.stackNodes.forEach(node => {
			const options = getNodeRenderOptions(this, node)
			const element = renderNode(this, options)
			fragment.appendChild(element)
		})
		//清空内容
		this.$el.innerHTML = ''
		//渲染内容
		this.$el.appendChild(fragment)
	}
	//动态视图更新
	else {
		//进行比对
		patchNodes(this.stackNodes, this.oldStackNodes).forEach(item => {
			//插入dom
			if (item.type == 'insert') {
				insertDom(this, item.newNode!)
			}
			//移除dom
			else if (item.type == 'remove') {
				removeDom(this, item.oldNode!)
			}
			//替换dom
			else if (item.type == 'replace') {
				replaceDom(this, item.newNode!, item.oldNode!)
			}
			//移动dom
			else if (item.type == 'move') {
				moveDom(this, item.newNode!)
			}
			//更新dom
			else if (item.type == 'update') {
				const dom = findDom(this, item.newNode!)!
				//更新文本
				if (item.update == 'textContent') {
					dom.textContent = item.newNode!.textContent || ''
				}
				//更新样式
				else if (item.update == 'styles') {
					const { addStyles, removeStyles } = getDifferentStyles(item.newNode!, item.oldNode!)
					for (let key in removeStyles) {
						dom.style.removeProperty(camelToKebab(key))
					}
					for (let key in addStyles) {
						dom.style.setProperty(camelToKebab(key), `${addStyles[key]}`)
					}
				}
				//更新属性
				else if (item.update == 'marks') {
					const { addMarks, removeMarks } = getDifferentMarks(item.newNode!, item.oldNode!)
					for (let key in removeMarks) {
						dom.removeAttribute(key)
					}
					for (let key in addMarks) {
						if (!/(^on)|(^style$)/g.test(key)) {
							dom.setAttribute(key, `${addMarks[key]}`)
						}
					}
				}
			}
		})
	}
}
