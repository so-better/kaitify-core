import { Editor } from '../../model/Editor'
import { camelToKebab } from '../../tools'
import { getNodeRenderOptions, KNodeRenderOptionsType } from '../core'
import { getDifferentMarks, getDifferentStyles, patchNodes } from './dom-patch'

/**
 * 渲染单个节点
 */
export const renderNode = (editor: Editor, opts: KNodeRenderOptionsType) => {
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
		if (!/(^on)|(^style$)|(^face$)/g.test(attr)) {
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
 * 默认的原生js渲染编辑器视图层
 */
export const defaultUpdateViewFunction = function (this: Editor, init: boolean) {
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
				//渲染dom
				const options = getNodeRenderOptions(this, item.newNode!)
				const newDom = renderNode(this, options)
				//获取父节点
				const parentNode = item.newNode!.parent
				//获取前一个兄弟节点
				const previousNode = item.newNode!.getPrevious(parentNode ? parentNode.children! : this.stackNodes)
				//获取父节点的真实dom
				const parentDom = parentNode ? this.findDom(parentNode) : this.$el!
				//如果前一个兄弟节点存在
				if (previousNode) {
					//获取前一个兄弟节点的真实dom
					const previousDom = this.findDom(previousNode)
					//插入到前一个兄弟节点的后面
					previousDom.nextElementSibling ? parentDom.insertBefore(newDom, previousDom.nextElementSibling) : parentDom.appendChild(newDom)
				}
				//如果前一个兄弟节点不存在
				else {
					//插到父节点的真实dom的第一个
					parentDom.firstElementChild ? parentDom.insertBefore(newDom, parentDom.firstElementChild) : parentDom.appendChild(newDom)
				}
			}
			//移除dom
			else if (item.type == 'remove') {
				try {
					this.findDom(item.oldNode!).remove()
				} catch (error) {}
			}
			//更新dom
			else if (item.type == 'update') {
				const dom = this.findDom(item.newNode!)
				//更新文本
				if (item.update == 'textContent') {
					dom.textContent = item.newNode!.textContent || ''
				}
				//更新样式
				else if (item.update == 'styles') {
					const { addStyles, removeStyles } = getDifferentStyles(item.newNode!, item.oldNode!)
					for (let key in removeStyles) {
						dom.style.removeProperty(key)
					}
					for (let key in addStyles) {
						dom.style.setProperty(key, `${addStyles[key]}`)
					}
				}
				//更新属性
				else if (item.update == 'marks') {
					const { addMarks, removeMarks } = getDifferentMarks(item.newNode!, item.oldNode!)
					for (let key in removeMarks) {
						dom.removeAttribute(key)
					}
					for (let key in addMarks) {
						if (!/(^on)|(^style$)|(^face$)/g.test(key)) {
							dom.setAttribute(key, `${addMarks[key]}`)
						}
					}
				}
			}
			//替换dom
			else if (item.type == 'replace') {
				//渲染新dom
				const options = getNodeRenderOptions(this, item.newNode!)
				const newDom = renderNode(this, options)
				//旧节点对应的dom
				const oldDom = this.findDom(item.oldNode!)
				//父节点对应的dom
				const parentDom = item.oldNode!.parent ? this.findDom(item.oldNode!.parent!) : this.$el!
				//插入新dom
				parentDom.insertBefore(newDom, oldDom)
				//移除旧dom
				oldDom.remove()
			}
			//移动dom
			else if (item.type == 'move') {
				//新节点对应的dom
				const dom = this.findDom(item.newNode!)
				//新节点的父节点
				const parentNode = item.newNode!.parent
				//获取新节点的前一个兄弟节点
				const previousNode = item.newNode!.getPrevious(parentNode ? parentNode.children! : this.stackNodes)
				//获取父节点的dom
				const parentDom = parentNode ? this.findDom(parentNode) : this.$el!
				//如果前一个兄弟节点存在
				if (previousNode) {
					//获取前一个兄弟节点的dom
					const previousDom = this.findDom(previousNode)
					//插到前一个兄弟节点对应的真实dom之后
					previousDom.nextElementSibling ? parentDom.insertBefore(dom, previousDom.nextElementSibling) : parentDom.appendChild(dom)
				}
				//如果前一个兄弟节点不存在
				else {
					//插到父节点对应的真实dom的第一个子节点
					parentDom.firstElementChild ? parentDom.insertBefore(dom, parentDom.firstElementChild) : parentDom.appendChild(dom)
				}
			}
		})
	}
}
