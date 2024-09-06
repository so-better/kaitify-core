/**
 * 这里存放和编辑器实例相关的封装函数，供外部使用
 * 这些函数都重新定义了this，指向编辑器实例
 */

import { AlexElement } from '../Element'
import { AlexPoint } from '../Point'
import { element as DapElement, data as DapData, file as DapFile } from 'dap-util'
import { AlexEditor, AlexElementRangeType } from '../Editor'

/**
 * 获取选区内的元素转为html和text塞入剪切板并返回
 * @param this
 * @param data
 * @param result
 * @returns
 */
export const setClipboardData = function (this: AlexEditor, data: DataTransfer, result: AlexElementRangeType[]) {
	let html = ''
	let text = ''
	result.forEach(item => {
		const newEl = item.element.clone()
		//offset存在值则说明该元素不是全部在选区内
		if (item.offset) {
			newEl.textContent = newEl.textContent!.substring(item.offset[0], item.offset[1])
		}
		newEl.__render()
		html += newEl.elm!.outerHTML
		text += newEl.elm!.innerText
	})
	//把text和html塞入剪切板
	data.setData('text/plain', text)
	data.setData('text/html', html)
	//将结果返回
	return { html, text }
}

/**
 * 粘贴具体处理方法
 * @param this
 * @param html
 * @param text
 * @param files
 */
export const doPaste = async function (this: AlexEditor, html: string, text: string, files: FileList) {
	//如果含有html
	if (html) {
		//允许粘贴html
		if (this.allowPasteHtml) {
			const elements = this.parseHtml(html).filter(el => {
				return !el.isEmpty()
			})
			if (typeof this.customHtmlPaste == 'function') {
				await this.customHtmlPaste.apply(this, [elements, html])
			} else {
				//第一个元素会在当前光标所在根级块元素只有一个换行符时进行覆盖
				this.insertElement(elements[0])
				for (let i = elements.length - 1; i >= 1; i--) {
					this.addElementAfter(elements[i], elements[0])
				}
				this.range!.anchor.moveToEnd(elements[elements.length - 1])
				this.range!.focus.moveToEnd(elements[elements.length - 1])
				this.emit('pasteHtml', elements, html)
			}
		}
		//不允许粘贴html，则粘贴纯文本
		else if (text) {
			if (typeof this.customTextPaste == 'function') {
				await this.customTextPaste.apply(this, [text])
			} else {
				this.insertText(text)
				this.emit('pasteText', text)
			}
		}
	}
	//如果没有html
	else {
		//如果有文本则粘贴文本
		if (text) {
			if (typeof this.customTextPaste == 'function') {
				await this.customTextPaste.apply(this, [text])
			} else {
				this.insertText(text)
				this.emit('pasteText', text)
			}
		}
		//粘贴文件
		else {
			let length = files.length
			for (let i = 0; i < length; i++) {
				//图片粘贴
				if (files[i].type.startsWith('image/')) {
					if (typeof this.customImagePaste == 'function') {
						await this.customImagePaste.apply(this, [files[i]])
					} else {
						const url = await DapFile.dataFileToBase64(files[i])
						const image = new AlexElement(
							'closed',
							'img',
							{
								src: url
							},
							null,
							null
						)
						this.insertElement(image)
						this.emit('pasteImage', url)
					}
				}
				//视频粘贴
				else if (files[i].type.startsWith('video/')) {
					if (typeof this.customVideoPaste == 'function') {
						await this.customVideoPaste.apply(this, [files[i]])
					} else {
						const url = await DapFile.dataFileToBase64(files[i])
						const video = new AlexElement(
							'closed',
							'video',
							{
								src: url
							},
							null,
							null
						)
						this.insertElement(video)
						this.emit('pasteVideo', url)
					}
				}
				//其他文件粘贴
				else {
					if (typeof this.customFilePaste == 'function') {
						await this.customFilePaste.apply(this, [files[i]])
					}
				}
			}
		}
	}
}

/**
 * 对非法dom进行删除
 * @param this
 */
export const removeIllegalDoms = function (this: AlexEditor) {
	while (this.__illegalDoms.length > 0) {
		const node = this.__illegalDoms[0]
		//删除dom
		node.parentNode?.removeChild(node)
		//从非法数组中剔除
		this.__illegalDoms.splice(0, 1)
	}
}

/**
 * 对编辑器dom元素进行监听，获取非法dom
 * @param this
 */
export const setEditorDomObserve = function (this: AlexEditor) {
	if (!window.MutationObserver) {
		console.warn('The current browser does not support MutationObserver')
	}
	removeEditorDomObserve.apply(this)
	this.__domObserver = new MutationObserver(mutationList => {
		let length = mutationList.length
		for (let i = 0; i < length; i++) {
			//监听子节点变动
			if (mutationList[i].type == 'childList') {
				//对新插入的节点进行遍历，判断是否非法，非法节点则加入到数组中
				const addNodesLength = mutationList[i].addedNodes.length
				for (let j = 0; j < addNodesLength; j++) {
					const node = mutationList[i].addedNodes[j]
					//如果是文本节点
					if (node.nodeType == 3) {
						//获取父节点
						const parentNode = node.parentNode as HTMLElement
						//获取父节点的key
						const key = parentNode ? DapData.get(parentNode, 'data-alex-editor-key') : null
						//父节点对应的元素
						const element = key ? this.getElementByKey(key) : null
						//元素如果不是文本元素则该文本节点是非法的
						if (element && !element.isText()) {
							this.__illegalDoms.push(node)
						}
					}
					//如果是元素节点并且没有获取到key则是非法的
					else if (DapElement.isElement(node) && !DapData.get(node as HTMLElement, 'data-alex-editor-key')) {
						this.__illegalDoms.push(node)
					}
				}
			}
		}
	})
	this.__domObserver.observe(this.$el, {
		attributes: false,
		childList: true,
		subtree: true
	})
}

/**
 * 移除对编辑器的dom监听
 * @param this
 */
export const removeEditorDomObserve = function (this: AlexEditor) {
	if (this.__domObserver) {
		this.__domObserver.disconnect()
		this.__domObserver = null
	}
}

/**
 * 初始化校验stack
 * @param this
 */
export const checkStack = function (this: AlexEditor) {
	const elements = AlexElement.flatElements(this.stack).filter(el => {
		return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom!)
	})
	if (elements.length == 0) {
		const ele = new AlexElement('block', AlexElement.BLOCK_NODE, null, null, null)
		const breakEle = new AlexElement('closed', 'br', null, null, null)
		this.addElementTo(breakEle, ele)
		this.stack = [ele]
	}
}

/**
 * 更新焦点的元素为最近的可设置光标的元素
 * @param this
 * @param point
 */
export const setRecentlyPoint = function (this: AlexEditor, point: AlexPoint) {
	const previousElement = this.getPreviousElementOfPoint(point)
	const nextElement = this.getNextElementOfPoint(point)
	const block = point.element.getBlock()
	const inblock = point.element.getInblock()
	if (previousElement && inblock && inblock.isContains(previousElement)) {
		point.moveToEnd(previousElement)
	} else if (nextElement && inblock && inblock.isContains(nextElement)) {
		point.moveToStart(nextElement)
	} else if (previousElement && block.isContains(previousElement)) {
		point.moveToEnd(previousElement)
	} else if (nextElement && block.isContains(nextElement)) {
		point.moveToStart(nextElement)
	} else if (previousElement) {
		point.moveToEnd(previousElement)
	} else if (nextElement) {
		point.moveToStart(nextElement)
	}
}

/**
 * 清空默认行为的内部块元素
 * @param this
 * @param element
 * @returns
 */
export const emptyDefaultBehaviorInblock = function (this: AlexEditor, element: AlexElement) {
	if (!element.isInblock()) {
		return
	}
	if (element.behavior != 'default') {
		return
	}
	if (element.hasChildren()) {
		element.children!.forEach(item => {
			if (item.isInblock() && item.behavior == 'default') {
				emptyDefaultBehaviorInblock.apply(this, [item])
			} else {
				item.toEmpty()
				if (item.parent!.isEmpty()) {
					const breakEl = new AlexElement('closed', 'br', null, null, null)
					this.addElementTo(breakEl, item.parent!)
				}
			}
		})
	}
}

/**
 * 判断焦点是否在可视范围内，如果不在则进行设置
 * @param this
 */
export const setRangeInVisible = function (this: AlexEditor) {
	const fn = async (root: HTMLElement) => {
		const scrollHeight = DapElement.getScrollHeight(root)
		const scrollWidth = DapElement.getScrollWidth(root)
		//存在横向或者垂直滚动条
		if (root.clientHeight < scrollHeight || root.clientWidth < scrollWidth) {
			const selection = window.getSelection()!
			if (selection.rangeCount == 0) {
				return
			}
			const range = selection.getRangeAt(0)
			const rects = range.getClientRects()
			let target: Range | HTMLElement = range
			if (rects.length == 0) {
				target = this.range!.focus.element.elm!
			}
			const childRect = target.getBoundingClientRect()
			const parentRect = root.getBoundingClientRect()

			//存在垂直滚动条
			if (root.clientHeight < scrollHeight) {
				//如果光标所在元素不在视图内则滚动到视图内
				if (childRect.top < parentRect.top) {
					await DapElement.setScrollTop({
						el: root,
						number: 0
					})
					const tempChildRect = target.getBoundingClientRect()
					const tempParentRect = root.getBoundingClientRect()
					DapElement.setScrollTop({
						el: root,
						number: tempChildRect.top - tempParentRect.top
					})
				} else if (childRect.bottom > parentRect.bottom) {
					await DapElement.setScrollTop({
						el: root,
						number: 0
					})
					const tempChildRect = target.getBoundingClientRect()
					const tempParentRect = root.getBoundingClientRect()
					DapElement.setScrollTop({
						el: root,
						number: tempChildRect.bottom - tempParentRect.bottom
					})
				}
			}
			//存在横向滚动条
			if (root.clientWidth < scrollWidth) {
				//如果光标所在元素不在视图内则滚动到视图内
				if (childRect.left < parentRect.left) {
					await DapElement.setScrollLeft({
						el: root,
						number: 0
					})
					const tempChildRect = target.getBoundingClientRect()
					const tempParentRect = root.getBoundingClientRect()
					DapElement.setScrollLeft({
						el: root,
						number: tempChildRect.left - tempParentRect.left + 20
					})
				} else if (childRect.right > parentRect.right) {
					await DapElement.setScrollLeft({
						el: root,
						number: 0
					})
					const tempChildRect = target.getBoundingClientRect()
					const tempParentRect = root.getBoundingClientRect()
					DapElement.setScrollLeft({
						el: root,
						number: tempChildRect.right - tempParentRect.right + 20
					})
				}
			}
		}
	}
	if (this.range && this.range.focus.element.elm) {
		let root = this.range.focus.element.elm
		while (DapElement.isElement(root) && root != document.documentElement) {
			fn(root)
			root = root.parentNode as HTMLElement
		}
	}
}

/**
 * 判断stack是否为空，为空则进行初始化
 * @param this
 */
export const handleStackEmpty = function (this: AlexEditor) {
	const elements = AlexElement.flatElements(this.stack).filter(el => {
		return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom!)
	})
	if (elements.length == 0) {
		const ele = new AlexElement('block', AlexElement.BLOCK_NODE, null, null, null)
		const breakEle = new AlexElement('closed', 'br', null, null, null)
		this.addElementTo(breakEle, ele)
		this.stack = [ele]
		if (this.range) {
			this.range.anchor.moveToStart(breakEle)
			this.range.focus.moveToStart(breakEle)
		}
	}
}

/**
 * 对元素数组使用某个方法进行格式化
 * @param this editor实例
 * @param element 格式化对象元素
 * @param fn 格式化函数
 * @param receiver 源数组
 */
export const formatElement = function (this: AlexEditor, element: AlexElement, fn: (el: AlexElement) => void, receiver: AlexElement[]) {
	const index = receiver.findIndex(el => el.isEqual(element))
	//表示该元素已经不在父元素数组内了，已经处理过了
	if (index < 0) {
		return
	}
	//如果是空元素则直接删除
	if (element.isEmpty()) {
		if (this.range && element.isContains(this.range.anchor.element)) {
			setRecentlyPoint.apply(this, [this.range.anchor])
		}
		if (this.range && element.isContains(this.range.focus.element)) {
			setRecentlyPoint.apply(this, [this.range.focus])
		}
		receiver.splice(index, 1)
	}
	//不是空元素则继续格式化
	else {
		//对元素使用该方法进行格式化
		fn.apply(this, [element])
		//如果在经过格式化后是空元素，则需要删除该元素
		if (element.isEmpty()) {
			if (this.range && element.isContains(this.range.anchor.element)) {
				setRecentlyPoint.apply(this, [this.range.anchor])
			}
			if (this.range && element.isContains(this.range.focus.element)) {
				setRecentlyPoint.apply(this, [this.range.focus])
			}
			//因为在格式化过程中可能会改变元素在源数组中的序列位置，所以重新获取序列
			const findIndex = receiver.findIndex(el => el.isEqual(element))
			receiver.splice(findIndex, 1)
		} else {
			//如果当前元素不是根级块元素，但是却是在根部，则转为根级块元素
			if (!element.isBlock() && receiver === this.stack) {
				element.convertToBlock()
			}
			//对自身所有的子元素进行格式化
			if (element.hasChildren()) {
				element.children!.forEach(child => {
					formatElement.apply(this, [child, fn, element.children!])
				})
			}
			//子元素格式化后，当前元素变成空元素，则需要删除该元素
			if (element.isEmpty()) {
				if (this.range && element.isContains(this.range.anchor.element)) {
					setRecentlyPoint.apply(this, [this.range.anchor])
				}
				if (this.range && element.isContains(this.range.focus.element)) {
					setRecentlyPoint.apply(this, [this.range.focus])
				}
				//因为在格式化过程中可能会改变元素在源数组中的序列位置，所以重新获取序列
				const findIndex = receiver.findIndex(el => el.isEqual(element))
				receiver.splice(findIndex, 1)
			}
		}
	}
}
