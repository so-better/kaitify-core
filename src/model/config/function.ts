//这里放的都是和编辑器相关的方法，但是不想对外暴露的
import { common as DapCommon, file as DapFile } from 'dap-util'
import { Editor } from '../Editor'
import { KNode, KNodeMarksType, KNodeStylesType } from '../KNode'
import { Selection } from '../Selection'
import { RuleFunctionType } from './format-rules'
import { Extension } from '../../extensions'
import { isContains } from '../../tools'

/**
 * 获取选区内的可聚焦节点所在的块节点数组
 */
export const getSelectionBlockNodes = function (this: Editor) {
	const focusNodes = this.getFocusNodesBySelection('all')
	const blockNodes: KNode[] = []
	focusNodes.forEach(item => {
		const blockNode = item.getBlock()
		if (!blockNodes.some(node => node.isEqual(blockNode))) {
			blockNodes.push(blockNode)
		}
	})
	return blockNodes
}

/**
 * 打散指定的节点，将其分裂成多个节点，如果子孙节点还有子节点则继续打散
 */
export const splitNodeToNodes = function (this: Editor, node: KNode) {
	if (node.hasChildren()) {
		node.children!.forEach(item => {
			if (!item.isClosed()) {
				item.marks = { ...(item.marks || {}), ...(node.marks || {}) }
				item.styles = { ...(item.styles || {}), ...(node.styles || {}) }
			}
			this.addNodeBefore(item, node)
			splitNodeToNodes.apply(this, [item])
		})
		node.children = []
	}
}

/**
 * 清空固定块节点的内容
 */
export const emptyFixedBlock = function (this: Editor, node: KNode) {
	if (!node.isBlock()) {
		return
	}
	if (node.hasChildren()) {
		node.children!.forEach(item => {
			//如果是固定的块节点
			if (item.isBlock() && item.fixed) {
				emptyFixedBlock.apply(this, [item])
			}
			//其他情况下
			else {
				item.toEmpty()
				if (item.parent!.isEmpty()) {
					const placeholderNode = KNode.createPlaceholder()
					this.addNode(placeholderNode, item.parent!)
				}
			}
		})
	}
}

/**
 * 该方法目前只为delete方法内部使用：将后一个块节点与前一个块节点合并
 */
export const mergeBlock = function (this: Editor, node: KNode, target: KNode) {
	//不是块节点则不处理
	if (!node.isBlock() || !target.isBlock()) {
		return
	}
	//空节点不处理
	if (node.isEmpty() || target.isEmpty()) {
		return
	}
	const uneditableNode = node.getUneditable()
	//是用户操作的删除行为并且前一个块节点是不可编辑的，则直接删除前一个块节点
	if (this.isUserDelection && uneditableNode) {
		uneditableNode.toEmpty()
	}
	//否则走正常删除逻辑
	else {
		const nodes = target.children!.map(item => {
			item.parent = node
			return item
		})
		node.children!.push(...nodes)
		target.children = []
	}
}

/**
 * 判断编辑器内的指定节点是否可以进行合并操作，parent表示和父节点进行合并，prevSibling表示和前一个兄弟节点进行合并，nextSibling表示和下一个兄弟节点合并，如果可以返回合并的对象节点
 */
export const getAllowMergeNode = function (this: Editor, node: KNode, type: 'parent' | 'prevSibling' | 'nextSibling') {
	//排除空节点
	if (node.isEmpty()) {
		return null
	}
	//排除没有父节点的节点
	if (!node.parent) {
		return null
	}
	//排除锁定的节点
	if (node.locked) {
		return null
	}
	//与前一个兄弟节点合并
	if (type == 'prevSibling') {
		const previousNode = node.getPrevious(node.parent.children!)
		//没有兄弟节点
		if (!previousNode) {
			return null
		}
		//文本节点
		if (node.isText()) {
			//可以和前一个节点合并
			if (previousNode.isText() && previousNode.isEqualMarks(node) && previousNode.isEqualStyles(node)) {
				return previousNode
			}
			return null
		}
		//行内节点
		if (node.isInline()) {
			//可以和前一个节点合并
			if (previousNode.isInline() && previousNode.tag == node.tag && previousNode.isEqualMarks(node) && previousNode.isEqualStyles(node)) {
				return previousNode
			}
			return null
		}
		return null
	}
	//与后一个兄弟节点合并
	if (type == 'nextSibling') {
		const nextNode = node.getNext(node.parent.children!)
		//没有兄弟节点
		if (!nextNode) {
			return null
		}
		//文本节点
		if (node.isText()) {
			//可以和后一个节点合并
			if (nextNode.isText() && nextNode.isEqualMarks(node) && nextNode.isEqualStyles(node)) {
				return nextNode
			}
			return null
		}
		//行内节点
		if (node.isInline()) {
			//可以和后一个节点合并
			if (nextNode.isInline() && nextNode.tag == node.tag && nextNode.isEqualMarks(node) && nextNode.isEqualStyles(node)) {
				return nextNode
			}
			return null
		}
		return null
	}
	//父子节点合并
	if (type == 'parent') {
		//父节点不止一个子节点
		if (node.parent!.children!.length > 1) {
			return null
		}
		//文本节点
		if (node.isText()) {
			//父节点是行内节点，并且渲染标签是文本标签
			if (node.parent!.isInline() && node.parent!.tag == this.textRenderTag) {
				return node.parent!
			}
			return null
		}
		//行内节点和块节点，如果渲染标签一致并且类型一致
		if (node.type == node.parent!.type && node.tag == node.parent!.tag) {
			return node.parent!
		}
		return null
	}
	return null
}

/**
 * 对编辑器内的某个节点执行合并操作，parent表示和父节点进行合并，prevSibling表示和前一个兄弟节点进行合并，nextSibling表示和下一个兄弟节点合并（可能会更新光标）
 */
export const applyMergeNode = function (this: Editor, node: KNode, type: 'parent' | 'prevSibling' | 'nextSibling') {
	//合并的对象节点
	const targetNode = getAllowMergeNode.apply(this, [node, type])
	if (!targetNode) {
		return
	}
	//和前一个兄弟节点合并
	if (type == 'prevSibling') {
		//文本节点
		if (node.isText()) {
			//起点在前一个节点上
			if (this.isSelectionInNode(targetNode, 'start')) {
				this.selection.start!.node = node
			}
			//终点在前一个节点上
			if (this.isSelectionInNode(targetNode, 'end')) {
				this.selection.end!.node = node
			}
			//将前一个节点的文本内容给后一个节点
			node.textContent = targetNode.textContent! + node.textContent!
			//删除被合并的节点
			const index = targetNode.parent!.children!.findIndex(item => {
				return targetNode.isEqual(item)
			})
			targetNode.parent!.children!.splice(index, 1)
		}
		//行内节点
		else if (node.isInline()) {
			//合并前一个节点的子节点数组
			node.children = [...targetNode.children!, ...node.children!].map(item => {
				item.parent = node
				return item
			})
			//删除被合并的节点
			const index = targetNode.parent!.children!.findIndex(item => {
				return targetNode.isEqual(item)
			})
			targetNode.parent!.children!.splice(index, 1)
			//继续对子节点进行合并
			if (node.hasChildren() && node.children!.length > 1) {
				let index = 0
				//因为父子节点的合并操作会导致children没有，此时判断一下hasChildren
				while (node.hasChildren() && index <= node.children!.length - 2) {
					const newTargetNode = getAllowMergeNode.apply(this, [node.children![index], 'nextSibling'])
					if (newTargetNode) {
						applyMergeNode.apply(this, [node.children![index], 'nextSibling'])
						//子节点合并后可能只有一个子节点了，此时进行父子节点合并操作
						if (node.hasChildren() && node.children!.length == 1) {
							applyMergeNode.apply(this, [node.children![0], 'parent'])
						}
						continue
					}
					index++
				}
			}
		}
	}
	//和后一个节点合并
	if (type == 'nextSibling') {
		//文本节点
		if (node.isText()) {
			//起点在后一个节点上
			if (this.isSelectionInNode(targetNode, 'start')) {
				this.selection.start!.node = node
				this.selection.start!.offset = node.textContent!.length + this.selection.start!.offset
			}
			//终点在后一个节点上
			if (this.isSelectionInNode(targetNode, 'end')) {
				this.selection.end!.node = node
				this.selection.end!.offset = node.textContent!.length + this.selection.end!.offset
			}
			//将后一个节点的文本内容给前一个节点
			node.textContent! += targetNode.textContent!
			//删除被合并的节点
			const index = targetNode.parent!.children!.findIndex(item => {
				return targetNode.isEqual(item)
			})
			targetNode.parent!.children!.splice(index, 1)
		}
		//行内节点
		else if (node.isInline()) {
			//合并后一个节点的子节点数组
			node.children = [...node.children!, ...targetNode.children!].map(item => {
				item.parent = node
				return item
			})
			//删除被合并的节点
			const index = targetNode.parent!.children!.findIndex(item => {
				return targetNode.isEqual(item)
			})
			targetNode.parent!.children!.splice(index, 1)
			//继续对子节点进行合并
			if (node.hasChildren() && node.children!.length > 1) {
				let index = 0
				//因为父子节点的合并操作会导致children没有，此时判断一下hasChildren
				while (node.hasChildren() && index <= node.children!.length - 2) {
					const newTargetNode = getAllowMergeNode.apply(this, [node.children![index], 'nextSibling'])
					if (newTargetNode) {
						applyMergeNode.apply(this, [node.children![index], 'nextSibling'])
						//子节点合并后可能只有一个子节点了，此时进行父子节点合并操作
						if (node.hasChildren() && node.children!.length == 1) {
							applyMergeNode.apply(this, [node.children![0], 'parent'])
						}
						continue
					}
					index++
				}
			}
		}
	}
	//父子节点合并
	if (type == 'parent') {
		//文本节点
		if (node.isText()) {
			targetNode.type = 'text'
			targetNode.tag = undefined
			//如果子节点有标记
			if (node.hasMarks()) {
				if (targetNode.hasMarks()) {
					Object.assign(targetNode.marks!, DapCommon.clone(node.marks!))
				} else {
					targetNode.marks = DapCommon.clone(node.marks!)
				}
			}
			//如果子节点有样式
			if (node.hasStyles()) {
				if (targetNode.hasStyles()) {
					Object.assign(targetNode.styles!, DapCommon.clone(node.styles!))
				} else {
					targetNode.styles = DapCommon.clone(node.styles!)
				}
			}
			targetNode.textContent = node.textContent
			targetNode.children = undefined
			//如果起点在子节点上则更新到父节点上
			if (this.isSelectionInNode(node, 'start')) {
				this.selection.start!.node = targetNode
			}
			//如果终点在子节点上则更新到父节点上
			if (this.isSelectionInNode(node, 'end')) {
				this.selection.end!.node = targetNode
			}
		}
		//行内节点或者块节点
		else {
			//如果子节点有标记
			if (node.hasMarks()) {
				if (targetNode.hasMarks()) {
					Object.assign(targetNode.marks!, DapCommon.clone(node.marks))
				} else {
					targetNode.marks = DapCommon.clone(node.marks)
				}
			}
			//如果子节点有样式
			if (node.hasStyles()) {
				if (targetNode.hasStyles()) {
					Object.assign(targetNode.styles!, DapCommon.clone(node.styles))
				} else {
					targetNode.styles = DapCommon.clone(node.styles)
				}
			}
			//如果子节点也有子节点
			if (node.hasChildren()) {
				targetNode.children = [...node.children!]
				targetNode.children.forEach(item => {
					item.parent = targetNode
				})
			}
			//子节点与父节点合并后再对父节点进行处理
			if (targetNode.hasChildren() && targetNode.children!.length == 1) {
				//再次父子节点进行合并
				if (getAllowMergeNode.apply(this, [targetNode.children![0], 'parent'])) {
					applyMergeNode.apply(this, [targetNode.children![0], 'parent'])
					//父子节点合并后，可能父节点需要再和兄弟节点进行合并
					if (getAllowMergeNode.apply(this, [targetNode, 'prevSibling'])) {
						applyMergeNode.apply(this, [targetNode, 'prevSibling'])
					} else if (getAllowMergeNode.apply(this, [targetNode, 'nextSibling'])) {
						applyMergeNode.apply(this, [targetNode, 'nextSibling'])
					}
				}
			}
		}
	}
}

/**
 * 将编辑器内的某个非块级节点转为默认块级节点
 */
export const convertToBlock = function (this: Editor, node: KNode) {
	if (node.isBlock()) {
		return
	}
	const newNode = node.clone(true)
	//该节点是文本节点和闭合节点，处理光标问题
	if (node.isText() || node.isClosed()) {
		if (this.isSelectionInNode(node, 'start')) {
			this.selection.start!.node = newNode
		}
		if (this.isSelectionInNode(node, 'end')) {
			this.selection.end!.node = newNode
		}
	}
	node.type = 'block'
	node.tag = this.blockRenderTag
	node.marks = undefined
	node.styles = undefined
	node.textContent = undefined
	node.children = [newNode]
	newNode.parent = node
}

/**
 * 对节点数组使用指定规则进行格式化
 */
export const formatNodes = function (this: Editor, rule: RuleFunctionType, nodes: KNode[]) {
	let i = 0
	while (i < nodes.length) {
		const node = nodes[i]
		//空节点直接删除并且跳过本次循环
		if (node.isEmpty()) {
			if (this.isSelectionInNode(node, 'start')) {
				this.updateSelectionRecently('start')
			}
			if (this.isSelectionInNode(node, 'end')) {
				this.updateSelectionRecently('end')
			}
			nodes.splice(i, 1)
			continue
		}
		//对节点使用该规则进行格式化
		rule({ editor: this, node })
		//格式化后变成空节点，进行删除，并且跳过本次循环
		if (node.isEmpty()) {
			if (this.isSelectionInNode(node, 'start')) {
				this.updateSelectionRecently('start')
			}
			if (this.isSelectionInNode(node, 'end')) {
				this.updateSelectionRecently('end')
			}
			//因为在格式化过程中可能会改变节点在数组中的序列位置，所以重新获取序列
			const index = nodes.findIndex(item => item.isEqual(node))
			nodes.splice(index, 1)
			continue
		}
		//如果当前节点不是块节点，但是却是在根部，则转为块节点
		if (!node.isBlock() && this.stackNodes === nodes) {
			convertToBlock.apply(this, [node])
		}
		//对子节点进行格式化
		if (node.hasChildren()) {
			formatNodes.apply(this, [rule, node.children!])
		}
		//子节点格式化后变成空节点，需要删除该节点，并且跳过本次循环
		if (node.isEmpty()) {
			if (this.isSelectionInNode(node, 'start')) {
				this.updateSelectionRecently('start')
			}
			if (this.isSelectionInNode(node, 'end')) {
				this.updateSelectionRecently('end')
			}
			//因为在格式化过程中可能会改变节点在数组中的序列位置，所以重新获取序列
			const index = nodes.findIndex(item => item.isEqual(node))
			nodes.splice(index, 1)
			continue
		}
		i++
	}
}

/**
 * 注册插件
 */
export const registerExtension = function (this: Editor, extension: Extension) {
	//是否已注册
	if (extension.registered) return
	//设置已注册
	extension.registered = true

	if (extension.extraKeepTags) {
		this.extraKeepTags = [...extension.extraKeepTags, ...this.extraKeepTags]
	}
	if (extension.domParseNodeCallback) {
		const fn = this.domParseNodeCallback
		this.domParseNodeCallback = (node: KNode) => {
			node = extension.domParseNodeCallback!.apply(this, [node])
			if (fn) node = fn.apply(this, [node])
			return node
		}
	}
	if (extension.formatRule) {
		this.formatRules = [extension.formatRule, ...this.formatRules]
	}
	if (extension.pasteKeepMarks) {
		const fn = this.pasteKeepMarks
		this.pasteKeepMarks = (node: KNode) => {
			const marks = extension.pasteKeepMarks!.apply(this, [node])
			if (fn) Object.assign(marks, fn.apply(this, [node]))
			return marks
		}
	}
	if (extension.pasteKeepStyles) {
		const fn = this.pasteKeepStyles
		this.pasteKeepStyles = (node: KNode) => {
			const styles = extension.pasteKeepStyles!.apply(this, [node])
			if (fn) Object.assign(styles, fn.apply(this, [node]))
			return styles
		}
	}
	if (extension.afterUpdateView) {
		const fn = this.afterUpdateView
		this.afterUpdateView = () => {
			extension.afterUpdateView!.apply(this)
			if (fn) fn.apply(this)
		}
	}
	if (extension.onSelectionUpdate) {
		const fn = this.onSelectionUpdate
		this.onSelectionUpdate = (selection: Selection) => {
			extension.onSelectionUpdate!.apply(this, [selection])
			if (fn) fn.apply(this, [selection])
		}
	}
	if (extension.addCommands) {
		const commands = extension.addCommands.apply(this)
		this.commands = { ...this.commands, ...commands }
	}
}

/**
 * 根据真实光标更新selection，返回布尔值表示是否更新成功
 */
export const updateSelection = function (this: Editor) {
	if (!this.$el) {
		return false
	}
	const realSelection = window.getSelection()
	if (realSelection && realSelection.rangeCount) {
		const range = realSelection.getRangeAt(0)
		//光标在编辑器内
		if (isContains(this.$el!, range.startContainer) && isContains(this.$el!, range.endContainer)) {
			//如果光标起点是文本
			if (range.startContainer.nodeType == 3) {
				this.selection.start = {
					node: this.findNode(range.startContainer.parentNode as HTMLElement),
					offset: range.startOffset
				}
			}
			//如果光标起点是元素
			else if (range.startContainer.nodeType == 1) {
				const childDoms = Array.from(range.startContainer.childNodes)
				//存在子元素
				if (childDoms.length) {
					const dom = childDoms[range.startOffset] ? childDoms[range.startOffset] : childDoms[range.startOffset - 1]
					//元素
					if (dom.nodeType == 1) {
						if (childDoms[range.startOffset]) {
							this.setSelectionBefore(this.findNode(dom as HTMLElement), 'start')
						} else {
							this.setSelectionAfter(this.findNode(dom as HTMLElement), 'start')
						}
					}
					//文本
					else if (dom.nodeType == 3) {
						this.selection.start = {
							node: this.findNode(dom.parentNode as HTMLElement),
							offset: childDoms[range.startOffset] ? 0 : dom.textContent!.length
						}
					}
				}
				//没有子元素，应当是闭合节点
				else {
					this.selection.start = {
						node: this.findNode(range.startContainer as HTMLElement),
						offset: 0
					}
				}
			}
			//如果光标终点是文本
			if (range.endContainer.nodeType == 3) {
				this.selection.end = {
					node: this.findNode(range.endContainer.parentNode as HTMLElement),
					offset: range.endOffset
				}
			}
			//如果光标终点是元素
			else if (range.endContainer.nodeType == 1) {
				const childDoms = Array.from(range.endContainer.childNodes)
				//存在子元素
				if (childDoms.length) {
					const dom = childDoms[range.endOffset] ? childDoms[range.endOffset] : childDoms[range.endOffset - 1]
					//元素
					if (dom.nodeType == 1) {
						if (childDoms[range.endOffset]) {
							this.setSelectionBefore(this.findNode(dom as HTMLElement), 'end')
						} else {
							this.setSelectionAfter(this.findNode(dom as HTMLElement), 'end')
						}
					}
					//文本
					else if (dom.nodeType == 3) {
						this.selection.end = {
							node: this.findNode(dom.parentNode as HTMLElement),
							offset: childDoms[range.endOffset] ? 0 : dom.textContent!.length
						}
					}
				}
				//没有子元素，应当是闭合节点
				else {
					this.selection.end = {
						node: this.findNode(range.endContainer as HTMLElement),
						offset: 1
					}
				}
			}
			return true
		}
	}
	return false
}

/**
 * 纠正光标位置，返回布尔值表示是否存在纠正行为
 */
export const redressSelection = function (this: Editor) {
	if (!this.selection.focused()) {
		return false
	}
	let startNode = this.selection.start!.node
	let endNode = this.selection.end!.node
	let startOffset = this.selection.start!.offset
	let endOffset = this.selection.end!.offset

	//起点和终点是相邻的两个节点并且位置紧邻则纠正光标位置
	const startNextNode = this.getNextSelectionNode(startNode)
	if (startNextNode && startNextNode.isEqual(endNode) && startOffset == (startNode.isText() ? startNode.textContent!.length : 1) && endOffset == 0) {
		endNode = startNode
		endOffset = startOffset
		this.selection.end!.node = endNode
		this.selection.end!.offset = endOffset
		return true
	}
	return false
}

/**
 * 初始化校验编辑器的节点数组，如果编辑器的节点数组为空或者都是空节点，则初始化创建一个只有占位符的段落
 */
export const checkNodes = function (this: Editor) {
	const nodes = this.stackNodes.filter(item => {
		return !item.isEmpty() && !this.voidRenderTags.includes(item.tag!)
	})
	if (nodes.length == 0) {
		const node = KNode.create({
			type: 'block',
			tag: this.blockRenderTag
		})
		const placeholder = KNode.createPlaceholder()
		this.addNode(placeholder, node)
		this.stackNodes = [node]
		if (this.selection.focused()) {
			this.setSelectionBefore(placeholder)
		}
	}
}

/**
 * 粘贴时对非文本节点的标记和样式的保留处理
 */
export const handlerForPasteKeepMarksAndStyles = function (this: Editor, nodes: KNode[]) {
	//不是文本
	nodes.forEach(node => {
		//不是文本节点
		if (!node.isText()) {
			const marks: KNodeMarksType = {}
			const styles: KNodeStylesType = {}
			//处理需要保留的标记
			if (node.hasMarks()) {
				//contenteditable属性保留
				if (node.marks!.hasOwnProperty('contenteditable')) {
					marks['contenteditable'] = node.marks!['contenteditable']
				}
				//name属性保留
				if (node.marks!.hasOwnProperty('name')) {
					marks['name'] = node.marks!['name']
				}
				//disabled属性保留
				if (node.marks!.hasOwnProperty('disabled')) {
					marks['disabled'] = node.marks!['disabled']
				}
				//表格列宽属性保留
				if (node.tag == 'col' && node.marks!.hasOwnProperty('width')) {
					marks['width'] = node.marks!['width']
				}
				//表格单元格colspan属性保留
				if (['td', 'th'].includes(node.tag!) && node.marks!.hasOwnProperty('colspan')) {
					marks['colspan'] = node.marks!['colspan']
				}
				//表格单元格rowspan属性保留
				if (['td', 'th'].includes(node.tag!) && node.marks!.hasOwnProperty('rowspan')) {
					marks['rowspan'] = node.marks!['rowspan']
				}
			}
			//处理需要保留的样式
			// if (node.hasStyles()) {}
			//自定义标记保留
			if (typeof this.pasteKeepMarks == 'function') {
				const extendMarks = this.pasteKeepMarks.apply(this, [node])
				Object.assign(marks, extendMarks)
			}
			//自定义样式保留
			if (typeof this.pasteKeepStyles == 'function') {
				const extendStyles = this.pasteKeepStyles.apply(this, [node])
				Object.assign(styles, extendStyles)
			}
			//将处理后的样式和标记给节点
			node.marks = marks
			node.styles = styles
			//处理子节点
			if (node.hasChildren()) {
				handlerForPasteKeepMarksAndStyles.apply(this, [node.children!])
			}
		}
	})
}

/**
 * 粘贴处理
 */
export const handlerForPasteDrop = async function (this: Editor, dataTransfer: DataTransfer) {
	//html内容
	const html = dataTransfer.getData('text/html')
	//文本内容
	const text = dataTransfer.getData('text/plain')
	//文件数组
	const files = dataTransfer.files
	//有html内容并且允许粘贴html
	if (html && this.allowPasteHtml) {
		//将html转为节点数组
		const nodes = this.htmlParseNode(html).filter(item => {
			return !item.isEmpty()
		})
		//粘贴时对非文本节点的标记和样式的保留处理
		handlerForPasteKeepMarksAndStyles.apply(this, [nodes])
		//是否走默认逻辑
		const useDefault = typeof this.onPasteHtml == 'function' ? await this.onPasteHtml.apply(this, [nodes, html]) : true
		//走默认逻辑
		if (useDefault) {
			this.insertNode(nodes[0])
			for (let i = nodes.length - 1; i >= 1; i--) {
				this.addNodeAfter(nodes[i], nodes[0])
			}
			this.setSelectionAfter(nodes[nodes.length - 1], 'all')
		}
	}
	//有文本内容
	else if (text) {
		//是否走默认逻辑
		const useDefault = typeof this.onPasteText == 'function' ? await this.onPasteText.apply(this, [text]) : true
		//走默认逻辑
		if (useDefault) {
			this.insertText(text)
		}
	}
	//有文件
	else if (files.length) {
		const length = files.length
		for (let i = 0; i < length; i++) {
			//图片粘贴
			if (files[i].type.startsWith('image/')) {
				//是否走默认逻辑
				const useDefault = typeof this.onPasteImage == 'function' ? await this.onPasteImage.apply(this, [files[i]]) : true
				//走默认逻辑
				if (useDefault) {
					const url = await DapFile.dataFileToBase64(files[i])
					const image = KNode.create({
						type: 'closed',
						tag: 'img',
						marks: {
							src: url,
							alt: files[i].name || ''
						}
					})
					this.insertNode(image)
				}
			}
			//视频粘贴
			else if (files[i].type.startsWith('video/')) {
				//是否走默认逻辑
				const useDefault = typeof this.onPasteVideo == 'function' ? await this.onPasteVideo.apply(this, [files[i]]) : true
				//走默认逻辑
				if (useDefault) {
					const url = await DapFile.dataFileToBase64(files[i])
					const video = KNode.create({
						type: 'closed',
						tag: 'video',
						marks: {
							src: url,
							alt: files[i].name || ''
						}
					})
					this.insertNode(video)
				}
			}
			//其他文件粘贴
			else if (typeof this.onPasteFile == 'function') {
				this.onPasteFile.apply(this, [files[i]])
			}
		}
	}
}

/**
 * 光标在只有占位符的非固定块节点内执行换行操作，块节点转为段落，块节点存在父节点的话会从父节点中脱离出去
 */
export const handlerForParagraphInsertOnlyWithPlaceholder = function (this: Editor, node: KNode) {
	//非块节点，或者不是只有占位符，或者是固定块节点
	if (!node.isBlock() || !node.allIsPlaceholder() || node.fixed) {
		return
	}
	//存在父节点并且父节点不是固定块节点
	if (node.parent && !node.parent.fixed) {
		//块节点的父节点
		const parentNode = node.parent
		//获取该块节点在父节点中的位置
		const index = parentNode.children!.findIndex(item => item.isEqual(node))
		//该块节点在父节点第一个
		if (index == 0) {
			//将块节点移到父节点之前
			parentNode.children!.splice(index, 1)
			this.addNodeBefore(node, parentNode)
		}
		//该块节点在父节点的最后一个
		else if (index == parentNode.children!.length - 1) {
			//将块节点移到父节点之后
			parentNode.children!.splice(index, 1)
			this.addNodeAfter(node, parentNode)
		}
		//该块节点在父节点中间
		else {
			//克隆父节点
			const newParentNode = parentNode.clone(false)
			//获取父节点的子节点数组
			const children = parentNode.children!
			//重新设置父节点的子节点
			parentNode.children! = children.slice(0, index)
			//设置克隆的父节点的子节点
			newParentNode.children = children.slice(index + 1)
			//将块节点移动到父节点后
			this.addNodeAfter(node, parentNode)
			//将克隆的父节点添加到块节点后
			this.addNodeAfter(newParentNode, node)
		}
	}
	//转为段落
	this.toParagraph(node)
}

/**
 * 1. 光标在非固定块节点开始处（存在父节点且父节点不包括前一个可设置光标的节点所在的块节点）执行删除操作，块节点转为段落，块节点存在父节点的话会从父节点中脱离出去
 * 2. 光标在编辑器的开始处，块节点转为段落，块节点存在父节点的话会从父节点中脱离出去
 */
export const handlerForDeleteInStart = function (this: Editor, node: KNode) {
	if (!node.isBlock() || node.fixed) {
		return
	}
	//存在父节点且不是固定块节点
	if (node.parent && !node.parent.fixed) {
		const parentNode = node.parent
		//获取该块节点在父节点中的位置
		const index = parentNode.children!.findIndex(item => item.isEqual(node))
		//将块节点移到父节点之前
		parentNode.children!.splice(index, 1)
		this.addNodeBefore(node, parentNode)
	}
	//转为段落
	this.toParagraph(node)
}
